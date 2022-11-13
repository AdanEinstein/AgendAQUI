import { DateSchema } from "yup";
import { IDataCalendar } from "../components/utils/utils";

export interface ILogin {
	id: number;
	login: string;
	oldpassword?: string;
	password: string;
}

export interface IProduto {
	id: number | string;
	descricao: string;
	preco: string | number;
}

export interface ICliente {
	id: number;
	nome: string;
	cpf: string;
	telefone: string;
	dataNascimento: string;
	login: ILogin;
}

export interface IPrestador {
	id: number;
	nome: string;
	cpfj: string;
	telefone: string;
	descricao: string;
	categoria: string;
	email: string;
	paginaFacebook: string;
	login: ILogin;
	produtos: IProduto[];
}

export interface IAgendamento {
	id: number;
	cliente: ICliente;
	prestador: IPrestador;
	dataEHora: string;
	produtos: IProduto[];
	status: 1 | 0 | -1;
}