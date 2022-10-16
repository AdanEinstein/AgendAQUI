import { useUser } from "../../contexts/UserContext"
import Card from "../layout/Card"
import Layout from "../layout/Layout"
import Nav from "../layout/Nav"
import FormCliente from "./FormCliente"
import FormPrestador from "./FormPrestador"

const LayoutConta: React.FC = () => {
    const {links, typeUser} = useUser()
    return (
        <Layout>
            <Nav links={links}/>
            <Card className="d-flex justify-content-center align-items-center pt-3">
                {typeUser == "cliente" && (
                    <FormCliente/>
                )}
                {typeUser == "prestador" && (
                    <FormPrestador/>
                )}
            </Card>
        </Layout>
    )
}

export default LayoutConta