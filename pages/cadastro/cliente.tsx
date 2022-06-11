import Card from "../../components/layout/Card"
import Layout from "../../components/layout/Layout"
import FormCadastroCliente from "../../components/new-cliente/FormCadastroCliente"

const Cliente: React.FC = () => {
    return (
        <Layout>
            <Card>
                <FormCadastroCliente />
            </Card>
        </Layout>
    )
}

export default Cliente