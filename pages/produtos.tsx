import React from "react";
import LayoutProdutos from "../components/produtos/LayoutProdutos";
import UserProvider from "../contexts/UserContext";

const Produtos: React.FC = () => {
	return (
		<UserProvider>
            <LayoutProdutos/>
		</UserProvider>
	);
};

export default Produtos;
