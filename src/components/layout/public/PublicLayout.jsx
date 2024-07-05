import { Navigate, Outlet } from "react-router-dom";
import { HeaderPub } from "./HeaderPub";
import useAuth from '../../../hooks/useAuth';

export const PublicLayout = () => {

  const { auth } = useAuth();

  return (
    <>
      {/* Cabecera y Navegación Pública*/}
      <HeaderPub />

      {/* Contenido Principal */}
      <section className='layout__content'>
        {!auth._id ?
            <Outlet />
          :
            <Navigate to="/rsocial" />
        }
      </section>
    </>
  )
}