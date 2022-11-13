import { useState } from "react";
import {
	Button,
	Container,
	FormControl,
	InputGroup,
	Row,
} from "react-bootstrap";
import { IPrestador } from "../../../@types/Models";
import { useUser } from "../../../contexts/UserContext";
import { ILayoutTelaSchedule } from "../../../pages/schedule";
import Layout from "../../layout/Layout";
import Nav from "../../layout/Nav";
import ListPrestadores from "./ListPrestadores";
import styles from "./LayoutSearch.module.css";

type Telas = 'calendario' | 'todo' | 'search'

export interface ILayoutTelaSearch{
	setShowTela(arg: Telas): void
	setAgendado(arg: IPrestador): void;
}

const LayoutSearch: React.FC<ILayoutTelaSearch> = ({ setAgendado, setShowTela }) => {
	const { links } = useUser();
	const [key, setKey] = useState<string>("");
	const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(0);
	return (
		<Layout>
			<Nav links={links} />
			<Container className="d-flex flex-column">
				<Row>
					<div className="d-flex justify-content-around mb-3 mt-5">
						<h1 className="text-white d-sm-block d-none">
							Pesquise um profissional aqui!
						</h1>
						<h1 className="text-white d-block d-sm-none">
							Pesquise aqui!
						</h1>
						<Button
							variant="danger"
							onClick={() => setShowTela("todo")}
						>
							Voltar <i className="bi bi-arrow-right-circle"></i>
						</Button>
					</div>
				</Row>
				<Row className="d-flex justify-content-center">
					<InputGroup className="mb-3" size="lg">
						<FormControl
							placeholder="Digite o nome do prestador"
							type="text"
							value={key}
							onChange={(e) =>
								setKey((e.target as HTMLInputElement).value)
							}
						/>
						<Button
							variant="primary"
							onClick={() => {
								setSearch(key);
							}}
						>
							Buscar <i className="bi bi-search"></i>
						</Button>
					</InputGroup>
				</Row>
				<Row className={styles.Lista}>
					<ListPrestadores
						search={search}
						page={page}
                        setPage={setPage}
						setAgendado={setAgendado}
						setShowTela={setShowTela}
					/>
				</Row>
				
			</Container>
		</Layout>
	);
};

export default LayoutSearch;
