import React, {
	createContext,
	memo,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { ISchedule } from "../components/schedule/todo/ISchedule";

const ScheduleContext = createContext<any>("");

interface IScheduleContext {
	schedules: ISchedule[];
	setSchedules(arg: ISchedule[]): void;
	ano: string;
	setAno(arg: string): void;
	mes: string;
	setMes(arg: string): void;
	dia: string;
	setDia(arg: string): void;
}

const ScheduleProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
	const [schedules, setSchedules] = useState<ISchedule[]>();
	const [ano, setAno] = useState<string>(`${new Date().getFullYear()}`);
	const [mes, setMes] = useState<string>(
		`${new Date().getMonth() + 1 < 10 ? "0" : ''}${new Date().getMonth() + 1}`
	);
	const [dia, setDia] = useState<string>(
		`${new Date().getDate() < 10 ? "0" : ''}${new Date().getDate()}`
	);

	useEffect(() => {
		if(ano && mes && dia){
			// window.Main.sendMessage("schedule", { ano, mes, dia });
			// window.Main.on(
			// 	"schedule",
			// 	(_: any, resp: IResultStatus<ISchedule[]>) => {
			// 		setSchedules(resp.data);
			// 	}
			// );
		}
	}, [ano, mes, dia]);

	return (
		<ScheduleContext.Provider
			value={{ schedules, setSchedules, ano, setAno, mes, setMes, dia, setDia }}
		>
			{children}
		</ScheduleContext.Provider>
	);
};

export const useSchedule = () => useContext<IScheduleContext>(ScheduleContext);

export default memo(ScheduleProvider);
