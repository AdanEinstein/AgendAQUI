import axios, { AxiosError } from "axios";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { profileEnv } from "../../auth/baseUrl";
import Cors from 'cors'

const cors = Cors({
  methods: ['GET', 'HEAD'],
})

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function ValidToken(
	request: NextApiRequest,
	response: NextApiResponse
) {
	await runMiddleware(request, response, cors)

	axios
		.head(`${profileEnv.baseUrlJava}/api/login/token`, {
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
