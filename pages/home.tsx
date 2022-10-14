import Card from "../components/layout/Card";
import Layout from "../components/layout/Layout";
import React, { useCallback, useEffect, useState } from "react";
import Nav, { ILink } from "../components/layout/Nav";
import { ICliente, ILogin, IPrestador } from "../@types/Models";
import { cliente, prestador } from "../@types/Utils";
import MyModal from "../components/layout/Modal";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";

const Home: React.FC = () => {
	const route = useRouter();
	const [links, setLinks] = useState<ILink[]>([]);
	const [typeUser, setTypeUser] = useState<
		"cliente" | "prestador" | "login"
	>();

	useEffect(() => {
		const typeUser: ICliente | IPrestador | ILogin = JSON.parse(
			localStorage.getItem("user")
		);
        if (typeUser !== null) {
            if ('cpf' in typeUser) {
                setLinks(cliente);
                setTypeUser("cliente");
            } else if ('cpfj' in typeUser) {
                setLinks(prestador);
                setTypeUser("prestador");
            } else {
                setTypeUser("login");
            }
        }
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
				<Button className="col me-1" variant="success" size="lg" onClick={() => route.push('/cadastro/cliente')}>
					Cliente
				</Button>
				<Button className="col ms-1" variant="warning" size="lg" onClick={() => route.push('/cadastro/prestador')}>
					Prestador de serviço
				</Button>
			</div>
		</MyModal>
	) : (
		<Layout>
			<Nav links={links} />
			<Card></Card>
		</Layout>
	);
};

export default Home;
