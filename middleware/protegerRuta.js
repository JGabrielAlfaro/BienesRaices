
import jwt from 'jsonwebtoken'
import {Usuario} from '../models/index.js'

const protegerRuta = async (req,res,next) =>{
    // console.log("Desde el middleware")

    //VERIFICAR SI HAY UN TOKEN
    const {_token} = req.cookies;
    if (!_token){
        return res.redirect('/auth/login')
    }

    //COMPRAR EL TOKEN
    try {
        const decoded = jwt.verify(_token,process.env.JWT_SECRET);
        // console.log(decoded);
        //Al realizar la consulta sobre el modelo Usuario le decimos que queremos utilizar el scope eliminarPassword
        //para que no nos traiga información privada(toke,password,createUp, y updateUp,etc)
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)
        // console.log(usuario)

        //ALMACENAR EL USUARIO AL REQ.
        if (usuario){
            req.usuario = usuario;
        }else {
   
            return res.clearCookie('_token').redirect('/auth/login')
        }
        next();
    } catch (error) {
        // console.log("ERROR")
        return res.clearCookie('_token').redirect('/auth/login')
       
    }

   
}

export default protegerRuta;