import { useUser } from "../../contexts/UserContext"
import Card from "../layout/Card"
import Layout from "../layout/Layout"
import Nav from "../layout/Nav"

const LayoutAgendamentos: React.FC = () => {
    const {links, typeUser} = useUser()
    return (
        <Layout>
            <Nav links={links}/>
            <Card className="d-flex justify-content-center align-items-center pt-3">
            </Card>
        </Layout>
    )
}

export default LayoutAgendamentos