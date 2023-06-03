import styles from "/styles/Layout.module.css";
import Footer from "./Footer";
import Header from "./Header";
import Nav, { ILink } from "./Nav";
import { PropsWithChildren } from "react";
import { Button, Collapse } from "react-bootstrap";
import Head from "next/head";

interface ILayoutProps {
	links?: ILink[];
}

const Layout: React.FC<PropsWithChildren<ILayoutProps>> = ({
	children,
	links,
}) => {
	return (
		<>
			<Head>
				<link rel="manifest" href="/manifest.json" />
			</Head>
			<div className={styles.Layout}>
				<Header />
				<div className={styles.container} style={{ flexDirection: "row" }}>
					{links && <Nav links={[...links]} />}
					{children}
				</div>
				<Footer />
			</div>
		</>
	);
};

export default Layout;
