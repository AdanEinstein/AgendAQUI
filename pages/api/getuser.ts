import axios, { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { profileEnv } from "../../auth/baseUrl";

export default function GetUser(
	request: NextApiRequest,
	response: NextApiResponse
) {
	const login: string = request.body.login;
	const senha: string = request.body.senha;
	axios
		.get(`${profileEnv.baseUrlJava}/api/login/loginID`, {
			params: { login, senha },
			headers: {
				Authorization: request.headers.authorization,
			},
		})
		.then((user) => user.data)
		.then((data) => response.status(200).json(data))
		.catch((err: AxiosError) => {
			if (err.response.status < 500) {
				response.status(404).send("Usuário inexistente");
			} else {
				response
					.status(500)
					.send("Estamos com um problema, tente mais tarde!");
			}
		});
}
