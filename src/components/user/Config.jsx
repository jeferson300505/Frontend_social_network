import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/Global";
import avatar from '../../assets/img/user.png';
import { SerializeForm } from "../../helpers/SerializeForm";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

export const Config = () => {

  // Se recibe la información desde el Contexto a través del hook useAuth
  const { auth, setAuth } = useAuth();

  // Estado para mostrar resultado del registro del user
  const [saved, setSaved] = useState("not_saved");

  // Hook para redirigir
  const navigate = useNavigate();

  // Función para actualizar el usuario
  const updateUser = async (e) => {

    // Prevenir que se actualice la pantalla
    e.preventDefault();

    // Variable para almacenar el token para las peticiones a realizar en este componente
    const token = localStorage.getItem("token");

    // Obtener los datos del formulario
    let newDataUser = SerializeForm(e.target);

    // Borrar file0 porque no lo vamos a actualizar por acá
    delete newDataUser.file0;

    try {
      // Actualizar el usuario modificado en la BD con una petición Ajax
      const userUpdateResponse = await fetch(`${Global.url}user/update`, {
        method: "PUT",
        body: JSON.stringify(newDataUser),
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      });

      // Obtener la información retornada por la request
      const userData = await userUpdateResponse.json();

      if (userData.status === "success" && userData.user) {
        
        // Eliminar del objeto recibido la contraseña
        delete userData.user.password;

        // Actualizar en el Contexto los datos del usuario modificado
        setAuth(userData.user);
        setSaved("saved");

        // Seleccionar el elemento que del formulario donde se va a subir el archivo del avatar
        const fileInput = document.querySelector("#file");
        if (fileInput.files[0]) {
          await uploadAvatar(fileInput.files[0], token);
        }

        // Mostrar modal de éxito
        Swal.fire({
          title: '¡Usuario actualizado correctamente!',
          icon: 'success',
          confirmButtonText: 'Continuar',
        }).then(() => {
          // Redirigir después de cerrar el modal
          navigate('/login');
        });

      } else {
        setSaved("error");

        // Mostrar modal de error
        Swal.fire({
          title: '¡El usuario no se ha actualizado!',
          icon: 'error',
          confirmButtonText: 'Intentar nuevamente',
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setSaved("error");

      // Mostrar modal de error
      Swal.fire({
        title: '¡Error al actualizar el usuario!',
        icon: 'error',
        confirmButtonText: 'Intentar nuevamente',
      });
    }
  }

  // Función para actualizar el avatar del usuario
  const uploadAvatar = async (file, token) => {
    try {
      // Obtener el archivo a subir
      const formData = new FormData();
      formData.append('file0', file);

      // Petición para enviar el archivo a la api del Backend y guardarla
      const uploadResponse = await fetch(`${Global.url}user/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": token
        }
      });

      // Obtener la información retornada por la request
      const uploadData = await uploadResponse.json();

      if (uploadData.status === "success" && uploadData.user) {

        // Eliminar del objeto recibido la contraseña
        delete uploadData.user.password;

        // Actualizar en el Contexto los datos del usuario modificado
        setAuth(uploadData.user);
        setSaved("saved");
      } else {
        setSaved("error");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setSaved("error");
    }
  }

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Editar Usuario</h1>
      </header>
      <div className="content__posts">

        <div className="form-style">
          {/* Respuestas de usuario registrado*/}
          {saved === "saved" ? (
            <strong className="alert alert-success">¡Usuario actualizado correctamente!</strong>
          ) : ''}
          {saved === "error" ? (
            <strong className="alert alert-danger">¡El usuario no se ha actualizado!</strong>
          ) : ''}

          <form className="config-form" onSubmit={updateUser}>

            <div className="form-group">
              <label htmlFor="name">Nombres</label>
              <input type="text" name="name" required defaultValue={auth.name} />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Apellidos</label>
              <input type="text" name="last_name" required defaultValue={auth.last_name} />
            </div>

            <div className="form-group">
              <label htmlFor="nick">Nick</label>
              <input type="text" name="nick" required defaultValue={auth.nick} />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea name="bio" defaultValue={auth.bio} />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input type="email" name="email" required defaultValue={auth.email} />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input type="password" name="password" />
            </div>

            <div className="form-group">
              <label htmlFor="file0">Avatar</label>
              <div className="avatar">
                <div className="general-info__container-avatar">
                  {auth.image !== "default.png" ? (
                    <img src={`${Global.url}user/avatar/${auth.image}`} className="container-avatar__img" alt="Foto de perfil" />
                  ) : (
                    <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />
                  )}
                </div>
              </div>
              <br/>
              <input type="file" name="file0" id="file" />
            </div>
            <input type="submit" value="Editar" className="btn btn-success" />

          </form>
        </div>
      </div>
    </>
  )
}