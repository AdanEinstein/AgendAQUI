import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import axios, { AxiosError } from "axios";
import { profileEnv } from "../../auth/baseUrl";

export default function CadastrarLogin(
	request: NextApiRequest,
	response: NextApiResponse
) {
	axios
		.post(
			`${profileEnv.baseUrlJava}/api/prestador/salvar`,
			{
				nome: request.body.nome,
                cpfj: request.body.cpfj,
                telefone: request.body.telefone,
                descricao: request.body.descricao,
                email: request.body.email,
                paginaFacebook: request.body.paginaFacebook,
                loginid: request.body.loginid,
			},
			{
				headers: {
					Authorization: `Bearer ${request.headers.authorization}`,
					"Content-Type": "application/json",
				},
			}
		)
		.then((newPrestador) => newPrestador.data)
		.then((newPrestadorData) => response.status(201).json(newPrestadorData))
		.catch((err: AxiosError) => {
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
		});
}
