
    import {unlink} from 'node:fs/promises'
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
            csrfToken: req.csrfToken(),
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
            // console.log(req.csrfToken())
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
        //  console.log(req.body)
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

    const editar = async (req,res) => {

        //Extraer el ID del url
        const {id} = req.params; 

        //Validar que la propiedad exista
        const propieadad = await Propiedad.findByPk(id)

        if (!propieadad) {
            return res.redirect("/mis-propiedades")
        }

        //Quien visita la URL es quien creo la propiedad
        if (propieadad.usuarioId.toString() !== req.usuario.id.toString()){
            return res.redirect("/mis-propiedades")
        }

        //Consultar modelo de precio y categoria.
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
        // console.log(categorias)
        res.render('propiedades/editar',{
            pagina: `Editar Propieadad: ${propieadad.titulo}`,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            datos:propieadad
        })
    }

    const guardarCambios = async(req,res) => {

        //Verificar la validacion.
        let resultado = validationResult(req);
        if (!resultado.isEmpty()){
    
            //Consultar modelo de precio y categoria.
            const [categorias, precios] = await Promise.all([
                Categoria.findAll(),
                Precio.findAll()
            ])
            return res.render('propiedades/editar',{
                pagina: "Editar Propieadad",
                csrfToken: req.csrfToken(),
                categorias,
                precios,
                errores: resultado.array(),
                datos:req.body
            })
        }

        //Extraer el ID del url
        const {id} = req.params; 

        //Validar que la propiedad exista
        const propiedad = await Propiedad.findByPk(id)

        if (!propiedad) {
            return res.redirect("/mis-propiedades")
        }

        //Quien visita la URL es quien creo la propiedad
        if (propiedad.usuarioId.toString() !== req.usuario.id.toString()){
            return res.redirect("/mis-propiedades")
        }

        //Como re-escribir el objeto y actualizarlo

        try {
            // console.log(propiedad)
            const {titulo,descripcion,habitaciones,estacionamiento,wc,calle,lat,lng,precio:precioId,categoria} =req.body;
            propiedad.set({
                titulo,
                descripcion,
                habitaciones,
                estacionamiento,
                wc,
                calle,
                lat,
                lng,
                precioId,
                categoria
            })
            await propiedad.save();
            res.redirect("/mis-propiedades")
        } catch (error) {
            console.log(error)
        }
    }

    const eliminar = async (req, res) => {
        
          //Extraer el ID del url
          const {id} = req.params; 

          //Validar que la propiedad exista
          const propiedad = await Propiedad.findByPk(id)
  
          if (!propiedad) {
              return res.redirect("/mis-propiedades")
          }
  
          //Quien visita la URL es quien creo la propiedad
          if (propiedad.usuarioId.toString() !== req.usuario.id.toString()){
              return res.redirect("/mis-propiedades")
          }

          try {
             //Eliminar la imagen asociada
             if ( propiedad.imagen ) {
                console.log(`Se elimino la imagen ${propiedad.imagen}`)
                await unlink(`public/uploads/${propiedad.imagen}`)
             }else {
                console.log("No hay registro de la imagen en la base de datos")
             }

            //Eliminar la propiedad
            await propiedad.destroy();
            return res.redirect("/mis-propiedades")

          } catch (error) {
            console.log(error)
          }
         

     
    };

    export {
        admin,
        crear,
        guardar,
        agregarImagen,
        almacenarImagen,
        editar,
        guardarCambios,
        eliminar
    } 