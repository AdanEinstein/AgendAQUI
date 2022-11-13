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

export default async function SearchPrestadores(
	request: NextApiRequest,
	response: NextApiResponse
) {
	await runMiddleware(request, response, cors);
	try {
        const nome = request.body.nome
        const page = `${request.body.page}`
        if (nome == "" || nome && page) {
            const data = await axios.get(`${profileEnv.baseUrlJava}/api/prestador/buscarPorNome?nome=${nome}&page=${page}`, {
                headers: {
                    Authorization: request.headers.authorization,
                }
            })
            response.status(200).json(data.data)
        } else {
            response.status(400).send('Requisição inválida')
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
