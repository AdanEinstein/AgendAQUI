import axios from "axios";
import React, { useCallback, useRef, useState } from "react";
import { Overlay, Popover, PopoverBody, PopoverHeader } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { generate } from "shortid";
import { ICliente, IPrestador } from "../../../@types/Models";
import { profileEnv } from "../../../auth/baseUrl";
import { useSchedule } from "../../../contexts/ScheduleContext";
import { useUser } from "../../../contexts/UserContext";
import { ISchedule, Status } from "./ISchedule";
import { ITargetAgendamento } from "./LayoutSchedule";

interface IStatusTableProps {
	schedule: ISchedule;
	restore: boolean;
	setRestore(arg: boolean | ((arg: boolean) => boolean)): void;
}

const StatusTable: React.FC<IStatusTableProps> = ({
	schedule,
	setRestore,
	restore,
}) => {
	const tdRef = useRef<HTMLTableDataCellElement>(null);
	const [show, setShow] = useState<boolean>(false);
	const [fix, setFix] = useState<boolean>(false);
	const {typeUser} = useUser()

	const handleEditStatus = useCallback(
		async (status: Status, sched: ISchedule) => {
			const newAgendamento: ITargetAgendamento = {
				agendamento : {
					id: sched.id as number,
					dataEHora: `${sched.data} ${sched.horario}`,
					cliente: (sched.cliente as ICliente),
					prestador: (sched.prestador as IPrestador),
					produtos: sched.produtos,
					status:
						status === "agendado"
							? 0
							: status ===
							  "cancelado"
							? -1
							: 1,
				},
				estado: "editar"
			};
			await axios.post(
				`${profileEnv.baseUrl}/setagendamento`,
				{ data: newAgendamento },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			);
			setRestore(old => {
				return old == true ? false : true
			})
		},
		[restore]
	);

	return (
		<>
			<td
				className={`d-table-cell ${
					(schedule.status === "agendado" && "table-secondary") ||
					(schedule.status === "concluido" && "table-success") ||
					(schedule.status === "cancelado" && "table-danger")
				}`}
				ref={tdRef}
				onClick={() => {
					setFix(!fix);
					setShow(false);
				}}
				onMouseEnter={() => {
					if (!fix) {
						setShow(true);
					}
				}}
				onMouseLeave={() => {
					if (!fix) {
						setShow(false);
					}
				}}
			>
				{(schedule.status === "agendado" && (
					<span>
						Agendado <i className="bi bi-hourglass-split"></i>
					</span>
				)) ||
					(schedule.status === "concluido" && (
						<span>
							Concluído <i className="bi bi-check2-circle"></i>
						</span>
					)) ||
					(schedule.status === "cancelado" && (
						<span>
							Cancelado <i className="bi bi-x-circle"></i>
						</span>
					))}
			</td>
			{typeUser == "prestador" && (
				<>
					<Overlay
						target={tdRef.current}
						show={show}
						placement={"left-start"}
					>
						{(props) => {
							return (
								<Popover {...props}>
									<PopoverHeader as="h3">
										Status
									</PopoverHeader>
									<PopoverBody>
										Clique para mudar o status!
									</PopoverBody>
								</Popover>
							);
						}}
					</Overlay>
					<Overlay
						target={tdRef.current}
						show={fix}
						placement={"left-start"}
					>
						{(props) => {
							return (
								<Popover {...props}>
									<PopoverHeader as="h3">
										Status
									</PopoverHeader>
									<PopoverBody>
										<div
											className="d-flex flex-column"
											onMouseLeave={() => setFix(false)}
										>
											<Button
												className="flex-grow-1 m-3"
												variant={"secondary"}
												size="lg"
												disabled={
													schedule.status ===
													"agendado"
												}
												onClick={() =>
													handleEditStatus(
														"agendado",
														schedule
													)
												}
											>
												Agendado{" "}
												<i className="bi bi-hourglass-split"></i>
											</Button>
											<Button
												className="flex-grow-1 m-3"
												variant={"danger"}
												size="lg"
												disabled={
													schedule.status ===
													"cancelado"
												}
												onClick={() =>
													handleEditStatus(
														"cancelado",
														schedule
													)
												}
											>
												Cancelado{" "}
												<i className="bi bi-x-circle"></i>
											</Button>
											<Button
												className="flex-grow-1 m-3"
												variant={"success"}
												size="lg"
												disabled={
													schedule.status ===
													"concluido"
												}
												onClick={() =>
													handleEditStatus(
														"concluido",
														schedule
													)
												}
											>
												Concluído{" "}
												<i className="bi bi-check2-circle"></i>
											</Button>
										</div>
									</PopoverBody>
								</Popover>
							);
						}}
					</Overlay>
				</>
			)}
		</>
	);
};

export default StatusTable;
