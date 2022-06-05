import { useState } from "react";
import styles from "/styles/Nav.module.css"

interface Props{
    links: string[]
    lateral?: boolean
}

const Nav: React.FC<Props> = ({ links, lateral }) => {
	const [linksProps, setLinksProps] = useState<string[]>(links);
	
    return (
        <nav className={lateral ? styles.NavLateral : styles.NavTopo}>
            {links.map(link => {
                return <a key={link} className={styles.link}>{link}</a>
            })}
        </nav>
    )
};

export default Nav;
