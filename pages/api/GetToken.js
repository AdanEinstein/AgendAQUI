export default async function GetToken(request, response) {
    const login = request.query.login;
    const password = request.query.password;
    const api = await fetch("https://agendaqui-api.herokuapp.com/login");
    api.body = JSON.stringify({ login, password });
    response(api.status(200).json());
}
