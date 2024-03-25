import express from "express";
import { body } from "express-validator";
import {admin,crear,guardar,agregarImagen,almacenarImagen,editar,guardarCambios,eliminar,mostrarPropiedad} from '../controllers/propiedadController.js';
import protegerRuta from "../middleware/protegerRuta.js";
import upload from '../middleware/subirImagen.js'
 
const router = express.Router();

router.get("/mis-propiedades",protegerRuta, admin);
router.get("/propiedades/crear",protegerRuta,crear);
router.post("/propiedades/crear",protegerRuta,
    body('titulo').notEmpty().withMessage("El titulo del anuncio es obligatorio"),
    body('descripcion')
        .notEmpty().withMessage("La descripción no puede ir vacia")
        .isLength({max:100}).withMessage("La descripción es muy larga"),
    body("categoria").isNumeric().withMessage("Secciona una categoria"),
    body("precio").isNumeric().withMessage("Secciona un rango de precios"),
    body("habitaciones").isNumeric().withMessage("Secciona la cantidad de Habitaciones"),
    body("estacionamiento").isNumeric().withMessage("Secciona la cantidad de estacionamientos"),
    body("wc").isNumeric().withMessage("Secciona la cantidad de habitaciones"),
    body("lat").notEmpty().withMessage("Ubica la propiedad en el mapa"),
    guardar

);


router.get("/propiedades/agregar-imagen/:id",protegerRuta,agregarImagen);

// upload.single => una sola imagen | upload.array => multiples imagenes.
router.post("/propiedades/agregar-imagen/:id",protegerRuta, upload.single('imagen'),almacenarImagen);

router.get('/propiedades/editar/:id',protegerRuta,editar)

router.post("/propiedades/editar/:id",protegerRuta,
    body('titulo').notEmpty().withMessage("El titulo del anuncio es obligatorio"),
    body('descripcion')
        .notEmpty().withMessage("La descripción no puede ir vacia")
        .isLength({max:100}).withMessage("La descripción es muy larga"),
    body("categoria").isNumeric().withMessage("Secciona una categoria"),
    body("precio").isNumeric().withMessage("Secciona un rango de precios"),
    body("habitaciones").isNumeric().withMessage("Secciona la cantidad de Habitaciones"),
    body("estacionamiento").isNumeric().withMessage("Secciona la cantidad de estacionamientos"),
    body("wc").isNumeric().withMessage("Secciona la cantidad de habitaciones"),
    body("lat").notEmpty().withMessage("Ubica la propiedad en el mapa"),
    guardarCambios

);

router.post('/propiedades/eliminar/:id',protegerRuta,eliminar);


//===========AREA PUBLICA==========//

router.get('/propiedad/:id',mostrarPropiedad)


export default router;