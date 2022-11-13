import React, { useRef, useState } from "react";
import {
	Overlay,
	Popover,
	PopoverBody,
	PopoverHeader,
	Table,
} from "react-bootstrap";
import { IPrestador } from "../../../@types/Models";
import { handlePrice } from "../../utils/utilsPrices";

interface IProdutosPrestadorTableProps {
	prestador: IPrestador;
}

const ProdutosPrestadorTable: React.FC<IProdutosPrestadorTableProps> = ({ prestador }) => {
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
				<span className="btn btn-success">Produtos</span>
			</td>
			<Overlay
				target={tdRef.current}
				show={show}
				placement={"left-start"}
			>
				{(props) => {
					return (
						<Popover {...props}>
							<PopoverHeader as="h3">Produtos</PopoverHeader>
							<PopoverBody>
								<Table>
									<thead>
										<tr>
											<th>Descrição</th>
											<th>Valor R$</th>
										</tr>
									</thead>
									<tbody>
										{prestador.produtos?.map((prod) => {
											return (
												<tr key={prod.id}>
													<td>{prod.descricao}</td>
													<td>{handlePrice(prod.preco)}</td>
												</tr>
											);
										})}
									</tbody>
								</Table>
							</PopoverBody>
						</Popover>
					);
				}}
			</Overlay>
		</>
	);
};

export default ProdutosPrestadorTable;
