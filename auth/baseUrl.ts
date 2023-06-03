const baseUrl = {
    dev_api: "http://localhost:3000/api",
    prod_api: "https://sistema-agendaqui.vercel.app/api",
};

const baseUrlJava = {
    dev_api: "http://localhost:8080",
    prod_api: "https://agendaqui-api.herokuapp.com",
};

export const profileEnv = {
    baseUrl: baseUrl.dev_api,
    baseUrlJava: baseUrlJava.prod_api,
};
