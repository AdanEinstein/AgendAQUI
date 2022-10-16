export interface ILogin {
    id: number,
    login: string,
    oldpassword?: string,
    password: string,
}

export interface IProduto {
    id: number,
    descricao: string,
    preco: number
}

export interface ICliente {
    id: number,
    nome: string,
    cpf: string,
    telefone: string,
    dataNascimento: string,
    login: ILogin
}

export interface IPrestador {
    id: number,
    nome: string,
    cpfj: string,
    telefone: string,
    descricao: string,
    email: string,
    paginaFacebook: string,
    login: ILogin,
    produtos: IProduto[]
}