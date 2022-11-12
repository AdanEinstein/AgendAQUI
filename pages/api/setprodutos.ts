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
		const deletados: number[] = request.body.deletados;
		let dataProd = [];
		if (produtos && produtos instanceof Array) {
			if (deletados.length > 0) {
				for await (const d of deletados) {
					await axios({
						method: "delete",
						url: `${profileEnv.baseUrlJava}/api/produtos/deletar?produtoid=${d}`,
						data: { produtos: deletados },
						headers: {
							Authorization: request.headers.authorization,
							"Content-Type": "application/json",
						},
					});
				}
			}
			if (produtos.length > 0) {
				for await (const prod of produtos) {
					const value =
						typeof prod.id == "string"
							? {
									descricao: prod.descricao,
									preco: parseFloat(
										(prod.preco as string)
											.replace(".", "")
											.replace(",", ".")
									),
									prestadorid: request.body.prestadorId,
							  }
							: {
									...prod,
									preco: parseFloat(
										(prod.preco as string)
											.replace(".", "")
											.replace(",", ".")
									),
									prestadorid: request.body.prestadorId,
							  };
					const data = await axios({
						method: typeof prod.id == "string" ? "post" : "put",
						url:
							typeof prod.id == "string"
								? `${profileEnv.baseUrlJava}/api/produtos/salvar`
								: `${profileEnv.baseUrlJava}/api/produtos/alterar`,
						data: value,
						headers: {
							Authorization: request.headers.authorization,
							"Content-Type": "application/json",
						},
					});
					if (dataProd.length == 0) {
						dataProd = [{ ...data.data }];
					} else {
						dataProd.push(data.data);
					}
					if (dataProd.length == produtos.length) {
						response.status(200).json(dataProd);
					}
				}
			}
			if (produtos.length == 0) {
				response.status(200).json([]);
			}
		} else {
			response.status(404).send("Requisição inválida!");
		}
	} catch (err) {
		if (err instanceof AxiosError) {
			if (err.response.status < 500) {
				response.status(404).send(err.response.data);
			} else {
				response
					.status(500)
					.send("Estamos com um problema, tente mais tarde!");
			}
		} else {
			response
				.status(500)
				.send((err as Error).message);
		}
	}
}
