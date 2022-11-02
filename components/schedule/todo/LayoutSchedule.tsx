import React, { useState } from "react";
import { Row } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useSchedule } from "../../../contexts/ScheduleContext";
import { useUser } from "../../../contexts/UserContext";
import { ILayoutTelaSchedule } from "../../../pages/schedule";
import Layout from "../../layout/Layout";
import Nav from "../../layout/Nav";
import FormSchedule from "./FormSchedule";
import { ISchedule } from "./ISchedule";
import ListSchedules from "./ListSchedules";

type Telas = "form" | "lista";

export interface ITargetSchedule {
	schedule: ISchedule;
	estado: "editar" | "deletar" | "novo";
}

export interface IAcoes {
	target?: ITargetSchedule;
	setTarget?(arg: ITargetSchedule): void;
	setTelas?(arg: Telas): void;
}

const LayoutSchedule: React.FC<ILayoutTelaSchedule> = ({ setShowTela }) => {
	const {links} = useUser()
	const [telas, setTelas] = useState<Telas>("lista");
	const { dia, mes, ano } = useSchedule();
	const [target, setTarget] = useState<ITargetSchedule>();
	return (
		<Layout>
			<Nav links={links}/>
			<Container>
				<Row className="h-100">
					<div className="col-lg-2 d-none"></div>
					<div className="w-100 col-lg-8 col-12 d-flex flex-column justify-content-center position-relative">
						<div className="d-flex justify-content-around my-4">
							<h1 className="text-white text-center m-2">
								Data: {`${dia}/${mes}/${ano}`}
							</h1>
							<Button
								variant="success"
								onClick={() => setShowTela("calendario")}
							>
								Calendário <i className="bi bi-calendar3"></i>
							</Button>
						</div>
						<div className="flex-grow-1">
							{telas === "lista" && (
								<ListSchedules
									setTelas={setTelas}
									target={target}
									setTarget={setTarget}
								/>
							)}
							{telas === "form" && (
								<FormSchedule
									target={target}
									setTarget={setTarget}
									setTelas={setTelas}
								/>
							)}
						</div>
					</div>
					<div className="col-lg-2 d-none"></div>
				</Row>
			</Container>
		</Layout>
	);
};

export default LayoutSchedule;
