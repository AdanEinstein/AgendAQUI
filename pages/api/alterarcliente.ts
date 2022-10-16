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

export default async function AlterarCliente(
	request: NextApiRequest,
	response: NextApiResponse
) {
	await runMiddleware(request, response, cors);
	try {
		if(request.body.login){
			await axios({
				method: "put",
				url: `${profileEnv.baseUrlJava}/api/login/alterar`,
				data: request.body.login,
				headers: {
					Authorization: `Bearer ${request.headers.authorization}`,
				},
			});
		}
		const data = await axios({
			method: "put",
			url: `${profileEnv.baseUrlJava}/api/cliente/alterar`,
			data: request.body.cliente,
			headers: {
				Authorization: `Bearer ${request.headers.authorization}`,
			},
		});
		response.status(200).send(data.data);
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
