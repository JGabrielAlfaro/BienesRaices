import express from 'express';
import {formularioLogin,formularioRegistro,formularioOlvidePassword,registrar,confirmar} from '../controllers/usuarioController.js'

//Configurando Router
const router = express.Router();

//Enlaces a acceso y registro de usuario.
router.get('/login',formularioLogin)
router.get ('/registro',formularioRegistro)
router.post ('/registro',registrar)
router.get ('/olvide-password',formularioOlvidePassword)

//Confirmar Token -> Email
router.get('/confirmar/:token',confirmar)

export default router;