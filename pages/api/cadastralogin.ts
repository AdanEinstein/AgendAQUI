import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import axios, { AxiosError } from "axios";
import { profileEnv } from "../../auth/baseUrl";

export default function CadastrarLogin(
	request: NextApiRequest,
	response: NextApiResponse
) {
	const loginAuth = process.env.LOGIN_AUTH;
	const passwordAuth = process.env.PASSWORD_AUTH;
	axios
		.post(`${profileEnv.baseUrl}/gettoken`, {
			login: loginAuth,
			password: passwordAuth,
		})
		.then((token) => token.data)
		.then((tokenData) => {
			axios.post(
				`${profileEnv.baseUrlJava}/api/login/salvar`,
				{
					login: request.body.login,
					password: request.body.password,
				},
				{
					headers: {
						Authorization: `Bearer ${tokenData}`,
						"Content-Type": "application/json",
					},
				}
			).then(newLogin => newLogin.data)
			 .then(newLoginData => response.status(201).json(newLoginData))
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
		})
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
