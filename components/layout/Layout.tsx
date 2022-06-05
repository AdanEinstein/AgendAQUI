import styles from "/styles/Layout.module.css";
import Footer from "./Footer";
import Header from "./Header";
import Nav from "./Nav";

interface INav {
	lateral: boolean;
}

interface Props {
	menu?: INav;
	children: any;
}

const Layout: React.FC<Props> = ({ menu, children }) => {
	return (
		<div className={styles.Layout}>
			<Header />
			<div
				className={styles.container}
				style={{ flexDirection: menu?.lateral ? "row" : "column" }}
			>
				{menu && (
					<Nav
						links={["Home", "Menu 1", "Menu 2", "Menu 3"]}
						lateral={menu.lateral}
					/>
				)}
				{children}
			</div>
			<Footer />
		</div>
	);
};

export default Layout;
