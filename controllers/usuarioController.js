
import {check,validationResult} from "express-validator";
import Usuario from "../models/Usuario.js";
import {generarId} from '../helpers/tokens.js'
import {emailRegistro} from '../helpers/email.js'

const formularioLogin = (req,res)=>{
    res.render('auth/login',{
        pagina: "Iniciar Sesion"
    })
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

const formularioOlvidePassword = (req,res)=>{
    res.render('auth/olvide-password',{
      pagina: "Recupera tu acceso a  bienes raices"
    })
} 

// Comprobar una cuenta de EMail por el token
const confirmar = async (req,res )=> {
  
  //Para leer de una URL(nuestro variable es "token").
  const {token}=req.params;
  console.log(token)

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


export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar
}