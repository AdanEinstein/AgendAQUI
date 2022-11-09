import { IProduto } from "./../../@types/Models.d";
import axios, { AxiosError } from "axios";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { profileEnv } from "../../auth/baseUrl";
import Cors from "cors";

const cors = Cors({
	methods: ["GET", "HEAD", "POST", "PUT", "DELETE"],
});

function runMiddleware(req, res, fn) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result);
			}

			return resolve(result);
		});
	});
}

export default async function SetProdutos(
	request: NextApiRequest,
	response: NextApiResponse
) {
	await runMiddleware(request, response, cors);
	try {
		const produtos = request.body.produtos;
        const deletados = request.body.deletados;
		if (produtos && produtos instanceof Array) {
			(produtos as IProduto[]).forEach(async (p) => {
				const value =
					typeof p.id == "string"
						? {
								descricao: p.descricao,
								preco: parseFloat(
									(p.preco as string)
										.replace(".", "")
										.replace(",", ".")
								),
								prestadorid: request.body.prestadorId,
						  }
						: {
								...p,
								preco: parseFloat(
									(p.preco as string)
										.replace(".", "")
										.replace(",", ".")
								),
								prestadorid: request.body.prestadorId,
						  };
				await axios({
					method: typeof p.id == "string" ? "post" : "put",
					url:
						typeof p.id == "string"
							? `${profileEnv.baseUrlJava}/api/produtos/salvar`
							: `${profileEnv.baseUrlJava}/api/produtos/alterar`,
					data: value,
					headers: {
						Authorization: `Bearer ${request.headers.authorization}`,
						"Content-Type": "application/json",
					},
				});
			});
            if(deletados.length > 0){
                deletados.forEach(async d => {
                    await axios({
                        method: "delete",
                        url:`${profileEnv.baseUrlJava}/api/produtos/deletar?produtoid=${d}`,
                        headers: {
                            Authorization: `Bearer ${request.headers.authorization}`,
                        },
                    });
                });
            }
			response.status(200).send("Dados enviados!");
		} else {
			response.status(404).send("Requisição inválida!");
		}
	} catch (err) {
		if (err.response.status < 500) {
			response.status(404).send(err.response.data);
		} else {
			response
				.status(500)
				.send("Estamos com um problema, tente mais tarde!");
		}
	}
}
