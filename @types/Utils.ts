import { ILink } from "../components/layout/Nav";

const cliente: ILink[] = [
    {label: 'Home', link: '/home'},
    {label: 'Agendamentos', link: '/schedule'},
    {label: 'Conta', link: '/conta'},
    {label: 'Sair', link: '/'},
]

const prestador: ILink[] = [
    {label: 'Home', link: '/home'},
    {label: 'Agendamentos', link: '/schedule'},
    {label: 'Produtos', link: '/produtos'},
    {label: 'Conta', link: '/conta'},
    {label: 'Sair', link: '/'},
]

export {prestador, cliente}