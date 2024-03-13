// import Precio from '../models/Precio.js'
// import Categoria from '../models/Categoria.js'

import {Precio,Categoria,Propiedad} from '../models/index.js'

import {validationResult}  from 'express-validator' // Va ha leer el resultado de las validaciones.

const admin = (req,res) => {
    res.render('propiedades/admin',{
        pagina: "Mis propiedades",
        barra: true,
    })
}

//Formulario para crear una nueva propiedad
const crear = async(req, res) => {
    //Consultar modelo de precio y categoria.
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])
    // console.log(categorias)
    res.render('propiedades/crear',{
        pagina: "Crer propieadad",
        csrfToken: req.csrfToken(),
        barra: true,
        categorias,
        precios,
        datos:{}
    })
}

const guardar = async(req,res) => {
    //Validacion
    let resultado = validationResult(req);
    if (!resultado.isEmpty()){

        //Consultar modelo de precio y categoria.
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
        console.log(req.csrfToken())
        res.render("propiedades/crear",{
            pagina: "Crear Propiedad",
            barra: true,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body,
        })
    }

    //Crear un registro
    // console.log(req.body)
    const {titulo,descripcion,habitaciones,estacionamiento,wc,calle,lat,lng,precio:precioId,categoria} =req.body;
    try {
        const propieadadGuardada = await Propiedad.create({
            titulo: titulo,
            descripcion,
            habitaciones,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId:categoria
        })
    } catch (error) {
        console.log(error)
    }

}

export {
    admin,
    crear,
    guardar
}