import UsuarioForm from "../components/UsuarioForm";

function Login(){
    return <UsuarioForm route="/api/token/" method="login" />
}

export default Login;