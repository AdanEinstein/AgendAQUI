import React, { useState } from "react";
import { IPrestador } from "../@types/Models";
import LayoutCalendar from "../components/schedule/LayoutCalendar";
import LayoutSchedule from "../components/schedule/todo/LayoutSchedule";
import LayoutSearch from "../components/schedule/todo/LayoutSearch";
import ScheduleProvider from "../contexts/ScheduleContext";
import UserProvider from "../contexts/UserContext";

type Telas = 'calendario' | 'todo' | 'search'

export interface ILayoutTelaSchedule{
	setShowTela(arg: Telas): void;
	setAgendado(arg: IPrestador): void;
	agendado: IPrestador;
}

const ScheduleIn: React.FC = () => {
	const [showTela, setShowTela] = useState<Telas>('todo')
	const [agendado, setAgendado] = useState<IPrestador>(null);
	return (
		<ScheduleProvider>
			{showTela === 'calendario' && <LayoutCalendar setShowTela={setShowTela} agendado={agendado} setAgendado={setAgendado}/>}
			{showTela === 'todo' && <LayoutSchedule setShowTela={setShowTela} agendado={agendado} setAgendado={setAgendado}/>}
			{showTela === 'search' && <LayoutSearch setShowTela={setShowTela} setAgendado={setAgendado}/>}
		</ScheduleProvider>
	);
};

const Schedule: React.FC = () => {
	return (
		<UserProvider>
			<ScheduleIn/>
		</UserProvider>
	)
}

export default Schedule;
