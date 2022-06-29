import axios, { AxiosError } from "axios";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { profileEnv } from "../../auth/baseUrl";

export default function ValidToken(
	request: NextApiRequest,
	response: NextApiResponse
) {
	axios
		.get(`${profileEnv.baseUrlJava}/login/token`, {
			headers: { Authorization: request.headers.authorization },
		})
		.then(() => {
			response.status(200).send("Token Ok!");
		})
		.catch((err: AxiosError) => {
			if (err.response.status === 403) {
				response.status(404).send("Token Expirado!");
			} else {
				response
					.status(500)
					.send("Estamos com um problema, tente mais tarde!");
			}
		});
}
