import UsuarioForm from "../components/UsuarioForm";

function Register(){
    return <UsuarioForm route="/api/user/register/" method="register" />
}

export default Register;