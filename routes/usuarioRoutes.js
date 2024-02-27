import express from 'express';
import {formularioLogin,formularioRegistro,formularioOlvidePassword,registrar,confirmar,resetPassword,comprobarToken,nuevoPassword} from '../controllers/usuarioController.js'

//Configurando Router
const router = express.Router();

//Enlaces a acceso y registro de usuario.
router.get('/login',formularioLogin)
router.get ('/registro',formularioRegistro)
router.post ('/registro',registrar)
router.get ('/olvide-password',formularioOlvidePassword)

//Confirmar Token -> Email
router.get('/confirmar/:token',confirmar)

//Resetear Password
router.post('/resetear-password',resetPassword);

//Almacena el nuevo password
router.get('/olvide-password/:token',comprobarToken);
router.post('/olvide-password/:token',nuevoPassword);

export default router;