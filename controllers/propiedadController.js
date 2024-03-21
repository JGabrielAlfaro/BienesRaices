

import {Precio,Categoria,Propiedad} from '../models/index.js'
import {validationResult}  from 'express-validator' // Va ha leer el resultado de las validaciones.

const admin = async (req,res)  => {

    const {id} = req.usuario;
    const propiedades = await Propiedad.findAll({
        where: {
            usuarioId:id
        },
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' },
        ],
        

    })

    res.render('propiedades/admin',{
        pagina: "Mis propiedades",
        propiedades,
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
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body,
        })
    }

    //Crear un registro
     console.log(req.body)
    const {titulo,descripcion,habitaciones,estacionamiento,wc,calle,lat,lng,precio:precioId,categoria} =req.body;


    // console.log(req.usuario.id)
    const {id:usuarioId} = req.usuario;

    try {
        const propieadadGuardada = await Propiedad.create({
            titulo: titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId:categoria,
            usuarioId,
            imagen: ""
        })
        const {id} = propieadadGuardada;
        res.redirect(`/propiedades/agregar-imagen/${id}`);
        
    } catch (error) {
        console.log(error)
    }

}

const agregarImagen = async(req,res) => {

    //Esta variable viene del router (propiedadesRoutes.js)
    const {id} = req.params;


    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
   
    if (!propiedad) {
        //sino existe la propiedad me lleva a esa ruta.
        return res.redirect("/mis-propiedades")
    }
    
    // Validar que la propiedad no este publicada
    if(propiedad.publicado){
        return res.redirect("/mis-propiedades")
    }
    //Validar que la propiedada pertence a quien visite esta pagina

    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()){
        return res.redirect("/mis-propiedades")
    }


    //Renderizamos la pagina agregar-imagen.pug
    res.render("propiedades/agregar-imagen",{
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad,
        // errores: resultado.array(),
        datos: req.body,
    })
   
}

const almacenarImagen = async (req,res,next)=>{
    
        //Esta variable viene del router (propiedadesRoutes.js)
        const {id} = req.params;


        //Validar que la propiedad exista
        const propiedad = await Propiedad.findByPk(id)
       
        if (!propiedad) {
            //sino existe la propiedad me lleva a esa ruta.
            return res.redirect("/mis-propiedades")
        }
        
        // Validar que la propiedad no este publicada
        if(propiedad.publicado){
            return res.redirect("/mis-propiedades")
        }
        //Validar que la propiedada pertence a quien visite esta pagina
    
        if (req.usuario.id.toString() !== propiedad.usuarioId.toString()){
            return res.redirect("/mis-propiedades")
        }


        try {

            console.log(req.file)
            //almacenar la imagen y publicar la propiedad.

            propiedad.imagen = req.file.filename
            propiedad.publicado = 1;
            await propiedad.save()

           next()

        } catch (error) {
            console.log(error)
        }
}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen
} 