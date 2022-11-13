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

export default async function GetAgendamentos(
	request: NextApiRequest,
	response: NextApiResponse
) {
	await runMiddleware(request, response, cors);
	try {
		const id = `${request.body.id}`;
		const page = `${request.body.page}`;
		const data = `${request.body.data}`;
		if (id && page) {
			const dataAgend = await axios({
				method: "get",
				url: `${profileEnv.baseUrlJava}/api/agendamento/listarTodosPorCliente`,
				data: { id, data, page },
				headers: {
					Authorization: request.headers.authorization,
					"Content-Type": "application/json",
				},
			});
			response.status(200).json(dataAgend.data);
		} else {
			response.status(400).send("Requisição inválida");
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
			response.status(500).send((err as Error).message);
		}
	}
}
