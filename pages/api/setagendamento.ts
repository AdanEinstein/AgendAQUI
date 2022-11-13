import { IProduto } from "./../../@types/Models.d";
import axios, { AxiosError } from "axios";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { profileEnv } from "../../auth/baseUrl";
import Cors from "cors";
import { ITargetAgendamento } from "../../components/schedule/todo/LayoutSchedule";

const cors = Cors({
	methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH"],
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

export default async function SetAgendamento(
	request: NextApiRequest,
	response: NextApiResponse
) {
	await runMiddleware(request, response, cors);
	try {
		const data: ITargetAgendamento = request.body.data;
		if (data.estado == "novo") {
			const dataAgenda = await axios.post(
				`${profileEnv.baseUrlJava}/api/agendamento/salvar`,
				{
					clienteid: data.agendamento.cliente.id,
					prestadorid: data.agendamento.prestador.id,
					dataehora: `${data.agendamento.dataEHora}`,
					produtosagendados: data.agendamento.produtos,
				},
				{
					headers: {
						Authorization: request.headers.authorization,
						"Content-Type": "application/json",
					},
				}
			);
			response.status(201).json(dataAgenda.data);
		} else if (data.estado == "editar") {
			const dataAgenda = await axios({
				method: "patch",
				url: `${profileEnv.baseUrlJava}/api/agendamento/alterar/${data.agendamento.id}`,
				data: {
					clienteid: data.agendamento.cliente.id,
					prestadorid: data.agendamento.prestador.id,
					dataehora: `${data.agendamento.dataEHora}`,
					produtosagendados: data.agendamento.produtos,
					status: data.agendamento.status || 0
				},
				headers: {
					Authorization: request.headers.authorization,
					"Content-Type": "application/json",
				},
			});
			response.status(201).json(dataAgenda.data);
		} else if (data.estado == "deletar") {
			const dataAgenda = await axios({
				method: "delete",
				url: `${profileEnv.baseUrlJava}/api/agendamento/deletar?id=${data.agendamento.id}`,
				headers: {
					Authorization: request.headers.authorization,
					"Content-Type": "application/json",
				},
			});
			response.status(201).json(dataAgenda.data);
		} else {
			response.status(400).send("Nada foi feito");
		}
	} catch (err) {
		if (err instanceof AxiosError) {
			if (err.response.status < 500) {
				response.status(404).send(err.response.data);
			} else {
				response
					.status(500)
					.send("Estamos com um problema, tente mais tarde!");
			}
		} else {
			response.status(500).send("Tivemos um problema!");
		}
	}
}
