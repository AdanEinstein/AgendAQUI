import styles from "/styles/Layout.module.css";
import Footer from "./Footer";
import Header from "./Header";
import Nav from "./Nav";
import { PropsWithChildren } from "react";
import { Button, Collapse } from "react-bootstrap";

interface ILayoutProps {
	links?: string[];
	menu?: boolean
}

const Layout: React.FC<PropsWithChildren<ILayoutProps>> = ({
	children,
	links,
	menu
}) => {
	return (
		<div className={styles.Layout}>
			<Header />
			<div className={styles.container} style={{ flexDirection: "row" }}>
				{menu && <Nav links={[...links]} />}
				{children}
			</div>
			<Footer />
		</div>
	);
};

export default Layout;
