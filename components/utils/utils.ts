import { number } from "yup";

export function anoBissexto(ano: number) {
	const condicao = (ano % 4 == 0 && ano % 100 != 0) || ano % 400 == 0;
	return condicao ? true : false;
}

export function quantDiasMes(mes: number, bissexto: boolean) {
	switch (mes) {
		case 2:
			return bissexto ? 29 : 28;
			break;
		case 4:
		case 6:
		case 9:
		case 11:
			return 30;
			break;
		default:
			return 31;
	}
}

//0-> Domingo
//1-> Segunda
//2-> Terça
//3-> Quarta
//4-> Quinta
//5-> Sexta
//6-> Sábado

export interface IDataCalendar {
	dia: string;
	mes: string;
	ano: string;
}

export function amountCalendar(ano: number, mes: number): IDataCalendar[] {
	let dia = 0;
	let diasPosteriores = 0;
	const anoFinal = `${ano}`;
	const amount = Array<number>(42).fill(0);
	const isAnoBi = anoBissexto(ano);
	const quantDias = quantDiasMes(mes, isAnoBi);
	const quantDiasAnterior = quantDiasMes(mes === 1 ? 12 : mes - 1, isAnoBi);
	const diaSemana01 = new Date(ano, mes - 1, 1).getDay();
	return amount.map((current, index) => {
		if (index >= diaSemana01) {
			if (dia >= quantDias) {
				//datas do mês que vem
				const mesFinal = mes + 1 < 10 ? `0${mes + 1}` : `${mes + 1}`;
				const diaFinal =
					diasPosteriores + 1 < 10
						? `0${++diasPosteriores}`
						: `${++diasPosteriores}`;
				return { dia: diaFinal, mes: mesFinal, ano: anoFinal };
			} else {
				// datas do mês atual
				const mesFinal = mes < 10 ? `0${mes}` : `${mes}`;
				const diaFinal = dia + 1 < 10 ? `0${++dia}` : `${++dia}`;
				return { dia: diaFinal, mes: mesFinal, ano: anoFinal };
			}
		} else {
			// datas do mês passado
			const mesFinal =
				mes === 1
					? `${12}`
					: mes - 1 < 10
					? `0${mes - 1}`
					: `${mes - 1}`;
			const diaFinal = `${quantDiasAnterior - diaSemana01 + index + 1}`;
			return { dia: diaFinal, mes: mesFinal, ano: anoFinal };
		}
	});
}

export function nameMonth(mes: number){
    switch (mes) {
        case 1:
            return 'janeiro'
            break;
        case 2:
            return 'fevereiro'
            break;
        case 3:
            return 'março'
            break;
        case 4:
            return 'abril'
            break;
        case 5:
            return 'maio'
            break;
        case 6:
            return 'junho'
            break;
        case 7:
            return 'julho'
            break;
        case 8:
            return 'agosto'
            break;
        case 9:
            return 'setembro'
            break;
        case 10:
            return 'outubro'
            break;
        case 11:
            return 'novembro'
            break;
        case 12:
            return 'dezembro'
            break;
            default:
            return 'Mês inválido'
            break;
    }
}