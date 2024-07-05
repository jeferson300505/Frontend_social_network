//import { Global } from "../../helpers/Global";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";
import { useState } from "react";

export const Login = () => {

  // Estado para obtener los datos desde el formulario
  const { form, changed } = useForm({});

  // Estado para validar si el usuario se identificó correctamente
  const [ logged, setLogged ] = useState("not_logged");

  // Estado para usar useAuth y setear los valos del usuario autenticado en el Provider automáticamente
  const {setAuth} = useAuth();

  const loginUser = async(e) => {
    // prevenir que se actualice la pantalla
    e.preventDefault();

    // Datos del formulario
    let userToLogin = form;

    // Petición al backend
    const request = await fetch(Global.url + "user/login", {
      method: "POST",
      body: JSON.stringify(userToLogin),
      headers: {
        "Content-Type": "application/json"
      }
    });

    // Obtener la información retornada por la request
    const data = await request.json();

    if(data.status == "success"){
      // Persistir los datos en el navegador guardando en el localstorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setLogged("logged");

      // Setear los datos del usuario en el Auth
      setAuth(data.user);

      // Redirección de 1 segundo
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } else {
      setLogged("error");
    }

  }

  return (
    <>
    <header className="content__header content__header--public">
      <h1 className="content__title">Login</h1>
    </header>

    {/* Formulario de Login*/}
    <div className="content__posts">
      <div className="form-style">

        {/* Respuestas de usuario identificado*/}
        {logged == "logged" ? (
            <strong className="alert alert-success">¡Usuario identificado correctamente!</strong>
          ) : ''}
          {logged == "error" ? (
            <strong className="alert alert-danger">¡El usuario no se ha identificado!</strong>
          ) : ''}

        <form className="form-login" onSubmit={loginUser} >

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" name="email" required onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" name="password" required onChange={changed} />
          </div>

          <input type="submit" value="Identifícate" className="btn btn-success" />

        </form>
      </div>
    </div>
  </>
  )
}