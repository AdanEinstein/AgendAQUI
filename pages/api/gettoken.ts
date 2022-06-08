import axios from "axios";

export default async function GetToken(request, response) {
	const login = request.body.login;
	const password = request.body.password;
	const token = await axios.post(
		"https://agendaqui-api.herokuapp.com/login",
		{login, password}
	);
    const tokenData = await token.data
	response.json(tokenData)
}