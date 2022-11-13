import React, { useRef, useState } from "react";
import {
	Overlay,
	Popover,
	PopoverBody,
	PopoverHeader,
	Table,
} from "react-bootstrap";
import { IPrestador } from "../../../@types/Models";

interface IProdutosPrestadorTableProps {
	prestador: IPrestador;
}

const DescricaoTable: React.FC<IProdutosPrestadorTableProps> = ({ prestador }) => {
	const tdRef = useRef<HTMLTableDataCellElement>(null);
	const [show, setShow] = useState<boolean>(false);

	return (
		<>
			<td
				className="d-md-table-cell d-none table-light"
				style={{width: "10%"}}
				ref={tdRef}
				onMouseEnter={() => {
					setShow(true);
				}}
				onMouseLeave={() => {
					setShow(false);
				}}
			>
				<span className="btn btn-secondary">Descrição</span>
			</td>
			<Overlay
				target={tdRef.current}
				show={show}
				placement={"left-start"}
			>
				{(props) => {
					return (
						<Popover {...props}>
							<PopoverHeader as="h3">Descrição</PopoverHeader>
							<PopoverBody>
								{prestador.descricao || "Nenhum descrição foi cadastrada"}
							</PopoverBody>
						</Popover>
					);
				}}
			</Overlay>
		</>
	);
};

export default DescricaoTable;
