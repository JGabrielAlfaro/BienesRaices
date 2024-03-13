import express from "express";
import { body } from "express-validator";
import {admin,crear,guardar} from '../controllers/propiedadController.js';

const router = express.Router();

router.get("/mis-propiedades",admin);
router.get("/propiedades/crear",crear);
router.post("/propiedades/crear",
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


export default router;