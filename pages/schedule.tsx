import React, { useState } from "react";
import LayoutCalendar from "../components/schedule/LayoutCalendar";
import LayoutSchedule from "../components/schedule/todo/LayoutSchedule";
import ScheduleProvider from "../contexts/ScheduleContext";
import UserProvider from "../contexts/UserContext";

type Telas = 'calendario' | 'todo'

export interface ILayoutTelaSchedule{
	setShowTela(arg: Telas): void
}

const ScheduleIn: React.FC = () => {
	const [showTela, setShowTela] = useState<Telas>('todo')
	return (
		<ScheduleProvider>
			{showTela === 'calendario' && <LayoutCalendar setShowTela={setShowTela} />}
			{showTela === 'todo' && <LayoutSchedule setShowTela={setShowTela}/>}
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
