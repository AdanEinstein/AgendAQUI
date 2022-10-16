import { useRouter } from "next/router"
import { useEffect } from "react"
import { useUser } from "../../contexts/UserContext"
import Card from "../layout/Card"
import Layout from "../layout/Layout"
import Nav from "../layout/Nav"

const LayoutProdutos: React.FC = () => {
    const {links, typeUser} = useUser()
    const route = useRouter()
    useEffect(() => {
        if(typeUser !== "prestador"){
            route.push('/_error')
        }
    },[])
    return (
        <Layout>
            <Nav links={links}/>
            <Card className="d-flex justify-content-center align-items-center pt-3">
            </Card>
        </Layout>
    )
}

export default LayoutProdutos