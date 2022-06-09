import axios, { AxiosResponse } from "axios";

export default async function CadastrarLogin(request, response) {
	const loginAuth = process.env.LOGIN_AUTH;
	const passwordAuth = process.env.PASSWORD_AUTH;
	const token = await axios.post(
		"https://agendaqui-api.herokuapp.com/login",
		{ loginAuth, passwordAuth }
	);
	if (token.status === 200) {
		const tokenData = await token.data;
		const login = request.body.login;
		const password = request.body.password;
		const loginRequest = await axios.post(
			"https://agendaqui-api.herokuapp.com/api/login/salvar",
			{ login, password },
			{ headers: { Authorization: `Bearer ${tokenData}` } }
		);
        const loginData = await loginRequest.data
        response.json(loginData)
	} else {
		response.json({ erro: "Erro para cadastrar" });
	}
}
