import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Collapse } from "react-bootstrap";
import { profileEnv } from "../../auth/baseUrl";
import styles from "/styles/Nav.module.css";

export interface ILink {
	label: string;
	link: string;
}

interface Props {
	links: ILink[];
}

const Nav: React.FC<Props> = ({ links }) => {
	const [menuOpen, setMenuOpen] = useState<boolean>(false);
	const route = useRouter();

	useEffect(() => {
		const valid = async () => {
			try {
				const token = await axios.get(`${profileEnv.baseUrl}/validtoken`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});
				return token.status == 200 ? true : false;
			} catch (error) {
				return false
			}
		};
		valid().then(v => {
			if (!v) {
				route.push("/disconnected");
			}
		})
	}, []);

	return (
		<>
			<Collapse
				in={menuOpen}
				dimension={"width"}
				timeout={1}
				className={styles.container}
			>
				<nav className={styles.Nav}>
					{links.map((link) => {
						return (
							<Link key={link.label} href={link.link}>
								<a className={styles.link}>{link.label}</a>
							</Link>
						);
					})}
				</nav>
			</Collapse>
			<Button
				className={menuOpen ? styles.menuOpen : styles.menuClosed}
				variant="warning"
				onClick={() => setMenuOpen(!menuOpen)}
			>
				{!menuOpen && "Menu"}
				<i className="bi bi-list"></i>
			</Button>
		</>
	);
};

export default Nav;
