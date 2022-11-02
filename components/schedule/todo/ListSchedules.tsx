import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { useSchedule } from "../../../contexts/ScheduleContext";
import { ISchedule } from "./ISchedule";
import styles from "./ListSchedule.module.css";
import { IAcoes } from "./LayoutSchedule";
import shortid from "shortid";
import StatusTable from "./StatusTable";
import ProdutosTable from "./ProdutosTable";

const ListSchedules: React.FC<IAcoes> = ({ setTelas, setTarget }) => {
	const { dia, mes, ano, schedules, setSchedules } = useSchedule();
	const [restore, setRestore] = useState<boolean>(false);

	useEffect(() => {
		// window.Main.sendMessage("schedule", { ano, mes, dia });
		// window.Main.on(
		// 	"schedule",
		// 	(_: any, resp: IResultStatus<ISchedule[]>) => {
		// 		resp.data && setSchedules(resp.data);
		// 	}
		// );
	}, [dia, mes, ano, restore]);

	const orderByHour = (schedA: ISchedule, schedB: ISchedule) => {
		const [horaA, minutoA] = schedA.horario.split(':')
		const [horaB, minutoB] = schedB.horario.split(':')
		const horaNumA = parseInt(horaA)
		const minutoNumA = parseInt(minutoA)
		const horaNumB = parseInt(horaB)
		const minutoNumB = parseInt(minutoB)
		if(horaNumA > horaNumB) return -1
		else if(horaNumA < horaNumB) return 1
		else {
			if(minutoNumA > minutoNumB) return -1
			else if(minutoNumA < minutoNumB) return 1
			else return 0
		}
	}

	const handleListDelete = useCallback(
		(schedule: ISchedule) => {
			if (setTarget && setTelas) {
				setTarget({ schedule, estado: "deletar" });
				setTelas("form");
			}
		},
		[setTarget, setTelas]
	);

	const handleListEdit = useCallback(
		(schedule: ISchedule) => {
			if (setTarget && setTelas) {
				setTarget({ schedule, estado: "editar" });
				setTelas("form");
			}
		},
		[setTarget, setTelas]
	);

	return (
		<Container className={styles.Lista}>
			<Table className="table-light">
				<thead className="table-dark">
					<tr>
						<th>Horário</th>
						<th>Cliente</th>
						<th className='d-md-table-cell d-none'>Produtos</th>
						<th className='d-md-table-cell d-none'>Status</th>
						<th>Ações</th>
					</tr>
				</thead>
				<tbody>
					{schedules?.sort(orderByHour).map((sch) => {
						return (
							<tr key={sch.id}>
								<td>{sch.horario}</td>
								<td>{sch.cliente}</td>
								<ProdutosTable schedule={sch}/>
								<StatusTable schedule={sch} setRestore={setRestore} restore={restore}/>
								<td className="d-flex justify-content-around">
									<Button
										size="sm"
										variant="warning"
										disabled={sch.status === 'concluido'}
										onClick={() => handleListEdit(sch)}
									>
										<i className="bi bi-pencil-square flex-grow-1 mx-1"></i>
									</Button>
									<Button
										size="sm"
										variant="danger"
										disabled={sch.status === 'concluido'}
										onClick={() => handleListDelete(sch)}
									>
										<i className="bi bi-trash-fill flex-grow-1 mx-1"></i>
									</Button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
			<Button
				className="position-absolute btn-lg"
				style={{ bottom: 30, right: 30 }}
				onClick={() => {
					setTarget &&
						setTarget({
							schedule: {
								id: shortid(),
								data: { ano, mes, dia },
								cliente: "",
								horario: "",
								produto: [],
								status: "agendado",
							},
							estado: "novo",
						});
					setTelas && setTelas("form");
				}}
			>
				Novo agendamento <i className="bi bi-plus-square-fill"></i>
			</Button>
		</Container>
	);
};

export default ListSchedules;
