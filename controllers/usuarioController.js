
const formularioLogin = (req,res)=>{
    res.render('auth/login',{
        pagina: "Iniciar Sesion"
    })
}

const formularioRegistro = (req,res)=>{
    res.render('auth/registro',{
      pagina: "Crear cuenta"
    })
}

const formularioOlvidePassword = (req,res)=>{
    res.render('auth/olvide-password',{
      pagina: "Recupera tu acceso a  bienes raices"
    })
} 


export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword
}