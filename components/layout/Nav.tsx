import { useState } from "react";
import { Button, Collapse } from "react-bootstrap";
import styles from "/styles/Nav.module.css";

interface Props {
	links: string[];
}

const Nav: React.FC<Props> = ({ links }) => {
	const [linksProps, setLinksProps] = useState<string[]>(links);
	const [menuOpen, setMenuOpen] = useState<boolean>(false);

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
							<a key={link} className={styles.link}>
								{link}
							</a>
						);
					})}
				</nav>
			</Collapse>
			<Button
				className={menuOpen ? styles.menuOpen : styles.menuClosed}
				variant="warning"
                onClick={() => setMenuOpen(!menuOpen)}
			>
				{!menuOpen && "Menu"}<i className="bi bi-list"></i>
			</Button>
		</>
	);
};

export default Nav;
