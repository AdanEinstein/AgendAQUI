import Card from "../../components/layout/Card"
import Layout from "../../components/layout/Layout"
import FormCadastroPrestador from "../../components/new-prestador/FormCadastroPrestador"
import React from "react";

const Prestador: React.FC = () => {
    return (
        <Layout>
            <Card>
                <FormCadastroPrestador />
            </Card>
        </Layout>
    )
}

export default Prestador