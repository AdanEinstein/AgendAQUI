import styles from "/styles/Layout.module.css";
import Footer from "./Footer";
import Header from "./Header";
import Nav from "./Nav";
import { PropsWithChildren } from "react";
import { Button, Collapse } from "react-bootstrap";

interface ILayoutProps {
	links?: string[];
}

const Layout: React.FC<PropsWithChildren<ILayoutProps>> = ({
	children,
	links,
}) => {
	return (
		<div className={styles.Layout}>
			<Header />
			<div className={styles.container} style={{ flexDirection: "row" }}>
				{links && <Nav links={[...links]} />}
				{children}
			</div>
			<Footer />
		</div>
	);
};

export default Layout;
