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
			`${profileEnv.baseUrlJava}/api/cliente/salvar`,
			{
				nome: request.body.nome,
                cpf: request.body.cpf,
                telefone: request.body.telefone,
                dataNascimento: request.body.dataNascimento,
                loginid: request.body.loginid,
			},
			{
				headers: {
					Authorization: `Bearer ${request.headers.authorization}`,
					"Content-Type": "application/json",
				},
			}
		)
		.then((newCliente) => newCliente.data)
		.then((newClienteData) => response.status(201).json(newClienteData))
		.catch((err: AxiosError) => {
			if (err.response.status < 500) {
				response.status(404).send("Token Expirado!");
			} else {
				response
					.status(500)
					.send("Estamos com um problema, tente mais tarde!");
			}
		});
}
