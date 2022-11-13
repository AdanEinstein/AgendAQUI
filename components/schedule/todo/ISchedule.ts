import { ICliente, IPrestador, IProduto } from '../../../@types/Models';
import { IDataCalendar } from './../../utils/utils';

export type Status = 'agendado' | 'concluido' | 'cancelado'

export interface ISchedule {
    id: string | number,
    data: IDataCalendar | string,
    horario: string,
    cliente: string | ICliente,
    prestador?: string | IPrestador,
    produtos: IProduto[]
    status: Status
}

// export interface IProductSchedule{
//     id: string,
//     descricao: string,
//     valor: string
// }