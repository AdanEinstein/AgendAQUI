import axios from "axios";
export default async function GetToken(request, response) {
    const login = request.param.login;
    const password = request.param.password;
    const api = await axios.post(
        "https://sistema-agendaqui.vercel.app/api/gettoken",
        {
            login,
            password,
        },
        { "Content-Type": "application/json" }
    );
    response(api.json());
}
