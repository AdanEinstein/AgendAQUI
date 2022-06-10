import axios, { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { profileEnv } from "../../auth/baseUrl";

export default function GetToken(
	request: NextApiRequest,
	response: NextApiResponse
) {
	const login: string = request.body.login;
	const password: string = request.body.password;
	axios.post(`${profileEnv.baseUrlJava}/login`, {
		login,
		password,
	}).then(token => token.data)
	  .then(data => response.status(200).json(data))
	  .catch((err: AxiosError) => {
		  if (err.response.status === 403) {
			  response.status(404).send("Login Inválido")
		  } else {
			  response.status(500).send("Estamos com um problema, tente mais tarde!")
		  }
	  });
}
