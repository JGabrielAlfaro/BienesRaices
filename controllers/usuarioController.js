
import {check,validationResult} from "express-validator";
import bcrypt from 'bcrypt';

import Usuario from "../models/Usuario.js";
import {generarId,generarJWT} from '../helpers/tokens.js'
import {emailRegistro,emailOlvidePassword} from '../helpers/email.js'
import { response } from "express";


const formularioLogin = (req,res)=>{
    res.render('auth/login',{
        pagina: "Iniciar Sesion",
        csrfToken: req.csrfToken()
    })
}

const autenticar = async (req,res) => { 
  await check("email").isEmail().withMessage("El email es obligatorio").run(req);
  await check("password").notEmpty().withMessage("Ese password es obligatorio").run(req);

  //Verifica que el resultado este vacio.
  let resultado = validationResult(req);
  if (!resultado.isEmpty(resultado)){
    //Errores, renderiza el pug "registro" y lo devuelve al formulario.
    return res.render('auth/login',{
      pagina: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  //Comprobar si el usuario existe
  const {email,password} = req.body;
  const usuario = await Usuario.findOne({where: {email}});

  if(!usuario){
    //Rederizamos la misma vista
    return res.render('auth/login',{
      pagina: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errores: [{msg:"El Usuario No Existe"}],
    });
  }

  //Comprobar si el usuario esta confirmado
  if(!usuario.confirmado){
    return res.render('auth/login',{
      pagina: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errores: [{msg:"Tu cuenta no ha sido confirmado"}],
    });
  }

  //Revisar el password
  if (!usuario.verificarPassword(password)){
    return res.render('auth/login',{
      pagina: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errores: [{msg:"El passwor es incorrecto"}],
    });
  }

  //Autenticar al usuario.
  const token = generarJWT({id:usuario.id,nombre:usuario.nombre})
  console.log(token)
  //Almacenar en un cookie{}

return res.cookie('_token', token, {
  httpOnly: true,
  // secure: true, // Habilita esta opción si estás utilizando HTTPS
  // sameSite: true, // Descomenta esta línea si es necesario
}).redirect('/mis-propiedades');

}

const formularioRegistro = (req,res)=>{

  // console.log(req.csrfToken())

    res.render('auth/registro',{
      pagina: "Crear cuenta",
      csrfToken: req.csrfToken()
    })
}

const registrar = async (req,res)=>{

    //Validar campos del formulario
    await check("nombre").notEmpty().withMessage("El nombre es obligatorio").run(req);
    await check("email").isEmail().withMessage("El email no es valido").run(req);
    await check("password").isLength({min:6}).withMessage("El password debe ser de al menos 6 caracteres").run(req);
    await check("repetir_password").equals(req.body.password).withMessage("Los passwords no son iguales").run(req);

    let resultado = validationResult(req);

    //Verifica que el resultado este vacio.
    if (!resultado.isEmpty(resultado)){
      //Errores, renderiza el pug "registro" y lo devuelve al formulario.
      return res.render('auth/registro',{
        pagina: "Crear cuenta",
        csrfToken: req.csrfToken(),
        errores: resultado.array(),
        usuario: {
          nombre: req.body.nombre,
          email: req.body.email,
        }
      });
    }

    //Extraer los datos
    const {nombre,email,password} = req.body;

    //Verificar que el usuario no este duplicado
    // const existeUsuario = await Usuario.findOne({where: {email:req.body.email}})
    const existeUsuario = await Usuario.findOne({where: {email}})
    // console.log("Usuario existe",existeUsuario);
    if (existeUsuario){
      return res.render('auth/registro',{
        pagina: "Crear cuenta",
        csrfToken: req.csrfToken(),
        errores: [{msg:"El usuario ya se encuentra registrado"}],
        usuario: {
          nombre: req.body.nombre,
          email: req.body.email,
        }
      });
    }
    //Almacenar un usuario en la base de datos.
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      token: generarId()
    });

    //Envía Email de confirmación.
    emailRegistro({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token
    })


    // Mostrar mensaje de confirmacion
    res.render('templates/mensaje',{
      pagina: "Cuenta creada correctamente",
      mensaje: "Hemos enviado un mensaje de confirmación, preciona en el enlace por favor."
    })

}


// Comprobar una cuenta de EMail por el token
const confirmar = async (req,res )=> {
  
  //Para leer de una URL(nuestro variable es "token").
  const {token}=req.params;
  // console.log(token)

  //Verificar si el token es valido
  const usuario = await Usuario.findOne({where:{token}})
  
  //Si no hay uusario pone "null", entonces le mostramos un msg al usuario.
  if (!usuario){
    return res.render('auth/confirmar-cuenta',{
      pagina: "Error al confirmar tu cuenta",
      mensaje: "Se presento un error al confirmar tu cuenta, puedes intentarlo de nuevo",
      error: true
    })
  }

  //Confirmar la cuenta
  
  usuario.token=null;
  usuario.confirmado= true;
  // console.log(usuario.token)
  await usuario.save(); // Guardamos los cambios en la BD.
  res.render('auth/confirmar-cuenta',{
    pagina: "Cuenta Confirmada",
    mensaje: "La cuenta se confirmo correctamente",
    error: false
  })

}

const formularioOlvidePassword = (req,res)=>{
  res.render('auth/olvide-password',{
    pagina: "Recupera tu acceso a  bienes raices",
    csrfToken: req.csrfToken()
  })
} 

const resetPassword = async (req,res) => {
    //Validar campos del formulario
    await check("email").isEmail().withMessage("El email no es valido").run(req);
    let resultado = validationResult(req);

    //Verifica que el resultado este vacio.
    if (!resultado.isEmpty(resultado)){
      //Errores, renderiza el pug "registro" y lo devuelve al formulario.
      return res.render('auth/olvide-password',{
        pagina: "Recupera tu acceso a  bienes raices",
        csrfToken: req.csrfToken(),
        errores: resultado.array(),
      });
    }

    //Buscar el usuario
    const {email}= req.body;
    const usuario = await Usuario.findOne({where:{email}});
    if (!usuario){
      return res.render('auth/olvide-password',{
        pagina: "Recupera tu acceso a  bienes raices",
        csrfToken: req.csrfToken(),
        errores: [{msg:"El email no pertenece a ningún usuario"}],
      });
    }

    //Generar un token, guardar en base de datos y enviar el email
    usuario.token = generarId();
    await usuario.save();

    emailOlvidePassword({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token
    })

    //Si todo es exitoso, renderizamos el mensaje.
    res.render('templates/mensaje',{
      pagina: "Restablece tu password",
      mensaje: "Hemos enviado un email con las instrucciones."
    })

}

const comprobarToken = async(req,res) => {

  const {token} = req.params;
  const usuario = await Usuario.findOne({where:{token}});
  
  //Si no existe el usuario.
  if (!usuario){
      return res.render('auth/confirmar-cuenta',{
        pagina: "Restablece tu password",
        mensaje: "Hubo un error al validar tu información, intenta de nuevo",
        // csrfToken: req.csrfToken(),
        error: true,
      });
  }

  //Mostrar formulario para modificar el password
  res.render('auth/reset-password',{
    pagina: "Re-establece tu password",
   csrfToken: req.csrfToken(),
    error: false,
  });

}

const nuevoPassword = async (req,res) => {
  //Validar el password.
  await check("password").isLength({min:6}).withMessage("El password debe ser de al menos 6 caracteres").run(req);
  let resultado = validationResult(req);

  //Verifica que el resultado este vacio.
  if (!resultado.isEmpty(resultado)){
    //Errores, renderiza el pug "registro" y lo devuelve al formulario.
    return res.render('auth/reset-password',{
      pagina: "Restablece tu password",
      csrfToken: req.csrfToken(),
      errores: resultado.array()
    });
  }

  const {token} = req.params; //parametro link
  const {password} = req.body; // formulario.

  //Identificar quien hace el cambio
  const usuario = await Usuario.findOne({where:{token}});

  console.log(usuario)

  //Hashear el nuevo password.
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(password,salt)
  usuario.token = null;

  await usuario.save();

  res.render ('auth/confirmar-cuenta'),{
    pagina: "Password Restablecido",
    mensaje: "El password se guardo correctamente"
  }


}




export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    autenticar
}