import axios, { AxiosError } from "axios";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { profileEnv } from "../../auth/baseUrl";
import Cors from 'cors'

const cors = Cors({
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
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
