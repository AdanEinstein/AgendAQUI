import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useSchedule } from "../../contexts/ScheduleContext";
import { ILayoutTelaSchedule } from "../../pages/schedule";
import Layout from "../layout/Layout";
import { IDataCalendar, nameMonth } from "../utils/utils";
import Calendar from "./Calendar";
import MonthNavButton from "./MonthNavButton";
import {useUser} from "../../contexts/UserContext";
import Nav from "../layout/Nav";

const dataAtual = new Date();

const LayoutCalendar: React.FC<ILayoutTelaSchedule> = (props) => {
	const {links, typeUser} = useUser()
    const {dia, mes, ano} = useSchedule()
    const [data, setData] = useState<IDataCalendar>({
		dia: `${dataAtual.getDate()}`,
		mes: `${dataAtual.getMonth() + 1}`,
		ano: `${dataAtual.getFullYear()}`,
	});
    
	return (
		<Layout>
			<Nav links={links}/>
			<Container className="d-flex flex-column">
				<Row>
					<div className="d-flex justify-content-center my-3">
						<h1 className="text-white">
							Agenda:{" "}
							{`${nameMonth(parseInt(data.mes))} de ${data.ano}`}
						</h1>
					</div>
				</Row>
				<Row>
					<MonthNavButton data={data} setData={setData} />
				</Row>
				<Row className="flex-grow-1">
					<Calendar data={data} {...props}/>
				</Row>
			</Container>
		</Layout>
	);
};

export default LayoutCalendar;
