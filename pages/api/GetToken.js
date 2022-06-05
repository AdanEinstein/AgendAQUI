import axios from "axios";
export default async function GetToken(request, response) {
    const login = request.query.login;
    const password = request.query.password;
    const body = JSON.stringify({ login, password });
    const api = await axios.get("");
    response(api.status(200).json());
}
