import {exit} from 'node:process';

import categorias from "./categorias.js";
import precios from './precios.js'
import usuarios from './usuarios.js';

import db from "../config/db.js";
import {Categoria,Precio,Usuario} from '../models/index.js'

const importarDatos = async () => {
    try {
        //Autenticar en la base datos
        await db.authenticate();

        // Generar las columnas.
        await db.sync();

        // Insertamos los datos.
        // Forma1:
        // await Categoria.bulkCreate(categorias);
        // await Precio.bulkCreate(precios);

        // Forma2:
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ])

        console.log("Datos importados correctamente")
        exit(0);

    } catch (error) {
        console.log(error);
        exit(1);
    }
}

const eliminarDatos = async ()=> {
    try {

        // await Promise.all([
        //     Categoria.destroy({where:{},truncate:true}),
        //     Precio.destroy({where:{},truncate:true})
        // ])
        await db.sync({force:true}); //elimina todo los modelos importados.
        
        console.log("Datos eliminado correctamente.")
        exit(0)
    } catch (error) {
      console.log(error)  ;
      exit(1);
    }
}
// process.argv viene por consola desde el package.json ("db:importar": "node ./seed/seeder.js -i")
if (process.argv[2] === "-i"){
    importarDatos()
}

if (process.argv[2] === "-e"){
    eliminarDatos()
}