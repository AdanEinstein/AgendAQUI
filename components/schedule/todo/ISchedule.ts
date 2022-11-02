import { IDataCalendar } from './../../utils/utils';

export type Status = 'agendado' | 'concluido' | 'cancelado'

export interface ISchedule {
    id: string,
    data: IDataCalendar,
    horario: string,
    cliente: string,
    produto: IProductSchedule[]
    status: Status
}

export interface IProductSchedule{
    id: string,
    descricao?: string,
    valor: string
}