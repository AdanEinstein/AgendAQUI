import axios from "axios";
import { useRouter } from "next/router";
import {
	createContext,
	memo,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { ICliente, ILogin, IPrestador } from "../@types/Models";
import { cliente, prestador } from "../@types/Utils";
import { profileEnv } from "../auth/baseUrl";
import { ILink } from "../components/layout/Nav";

const UserContext = createContext<IUserContext>(null);

interface IUserContext {
	links: ILink[];
	setLinks(links: ILink[]): void;
	typeUser: "cliente" | "prestador" | "login";
	setTypeUser(arg: "cliente" | "prestador" | "login"): void;
	user: ILogin | ICliente | IPrestador;
	setUser(user: ILogin | ICliente | IPrestador): void;
	tokenValid: boolean;
	setTokenValid(arg: boolean): void;
	setAtualizar(arg: boolean): void;
}

const UserProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
	const [links, setLinks] = useState<ILink[]>([]);
	const [typeUser, setTypeUser] = useState<
		"cliente" | "prestador" | "login"
	>();
	const [user, setUser] = useState<ICliente | IPrestador | ILogin>();
	const [tokenValid, setTokenValid] = useState<boolean>(false);
    const [atualizar, setAtualizar] = useState<boolean>(false);

	useEffect(() => {
		const valid = async () => {
			try {
				const token = await axios.get(
					`${profileEnv.baseUrl}/validtoken`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								"token"
							)}`,
						},
					}
				);
				return token.status == 200 ? true : false;
			} catch (error) {
				return false;
			}
		};
		valid()
			.then((v) => {
				setTokenValid(v);
			})
			.then(() => {
				const type: ICliente | IPrestador | ILogin = JSON.parse(
					localStorage.getItem("user")
				);
				if (type !== null) {
					if ("cpf" in type) {
						setLinks(cliente);
						setTypeUser("cliente");
					} else if ("cpfj" in type) {
						setLinks(prestador);
						setTypeUser("prestador");
					} else {
						setTypeUser("login");
					}
					setUser(type);
				}
			});
	}, [atualizar]);

	return (
		<UserContext.Provider
			value={{
				links,
				setLinks,
				typeUser,
				setTypeUser,
				user,
				setUser,
				tokenValid,
				setTokenValid,
                setAtualizar
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext<IUserContext>(UserContext);

export default memo(UserProvider);
