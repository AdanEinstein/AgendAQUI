import Layout from "../components/layout/Layout"
import Card from "../components/layout/Card"
import FormCadastroLogin from "../components/new-login/FormCadastroLogin"

const Cadastro: React.FC = () => {
    return (
        <Layout>
            <Card>
                <FormCadastroLogin />
            </Card>
        </Layout>
    )
}

export default Cadastro