import axios, { Axios, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from "axios";
export default async function GetToken(request: AxiosRequestConfig, response: AxiosResponse) {
    const login = request.params.login;
    const password = request.params.password;
    const token = await axios.post<string>(
        "https://agendaqui-api.herokuapp.com/login",
        {
            login,
            password,
        }
    );
    const tokenJson = token.data
    return tokenJson
}
