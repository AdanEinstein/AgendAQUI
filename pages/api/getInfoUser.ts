import axios, { AxiosError } from "axios";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { profileEnv } from "../../auth/baseUrl";
export default function GetInfoUser(
	request: NextApiRequest,
	response: NextApiResponse
) {
	const login = request.query.login;
	const senha = request.query.senha;
	const token = request.headers.authorization;
	axios.get(
		`${profileEnv.baseUrlJava}/loginID?login=${login}&senha=${senha}`,
		{ headers: { Authorization: token } }
	).then(data => response.status(200).json(data))
    .catch((err: AxiosError) => {
        if (err.response.status === 403) {
            response.status(404).send("Login inválido!")
        } else {
            response.status(500).send("Estamos com um problema, tente mais tarde!")
        }
    });
}
