import { useRouter } from "next/router";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { ICliente, IPrestador } from "../../@types/Models";
import { useUser } from "../../contexts/UserContext";
import Card from "../layout/Card";
import Layout from "../layout/Layout";
import MyModal from "../layout/Modal";
import Nav from "../layout/Nav";

const LayoutHome: React.FC = () => {
    const route = useRouter()
	const { links, typeUser, user, setAtualizar } = useUser();
    useEffect(() => {
		setAtualizar(true);
	}, []);
	return typeUser == "login" ? (
		<MyModal
			title="Você precisa escolher..."
			show={true}
			onHide={() => {
				route.push("/");
			}}
		>
			<h4>Tipo de usuário</h4>
			<p>Selecione o tipo de usuário você deseja ser</p>
			<div className="container row">
				<Button
					className="col me-1"
					variant="success"
					size="lg"
					onClick={() => route.push("/cadastro/cliente")}
				>
					Cliente
				</Button>
				<Button
					className="col ms-1"
					variant="warning"
					size="lg"
					onClick={() => route.push("/cadastro/prestador")}
				>
					Prestador de serviço
				</Button>
			</div>
		</MyModal>
	) : (
		(typeUser == "cliente" || typeUser == "prestador" || typeUser == undefined) && (
			<Layout>
				<Nav links={links} />
				<Card className="d-flex flex-column justify-content-center align-items-center">
					<h1 className="display-4 mb-4 d-md-block d-none">
						Seja bem vindo de volta!
					</h1>
					<h1 className="display-4 mb-4 d-md-none d-block">
						Seja bem vindo!
					</h1>
					<p className="fs-3 d-md-block d-none">
						Olá {typeUser}, {(user as ICliente | IPrestador).nome}{" "}
					</p>
					<p className="fs-3 d-md-none d-block">
						{(user as ICliente | IPrestador).nome}
					</p>
					<p className="fs-3 d-md-block d-none">
						Selecione o{" "}
						<span className="text-warning fw-bold">MENU</span> para
						navegar{" "}
					</p>
					<p className="fs-3 d-md-none d-block">
						Clique em{" "}
						<span className="text-warning fw-bold">MENU</span> para
						navegar{" "}
					</p>
				</Card>
			</Layout>
		)
	);
};

export default LayoutHome;
