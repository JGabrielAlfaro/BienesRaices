import Propiedad from './Propiedad.js'
import Precio from './Precio.js'
import Categoria from './Categoria.js'
import Usuario from './Usuario.js'

// Precio.hasOne(Propiedad) //Propiedad tiene un precio, se lee de Right to Lefth
// Propiedad.belongsTo(Precio)// Propiedad tien un precio, se lee de Left to Right (precioid quedo la llave foranea)

Propiedad.belongsTo(Precio, {foreignKey: 'precioId'});
Propiedad.belongsTo(Categoria, {foreignKey: 'categoriaId' });
Propiedad.belongsTo(Usuario, {foreignKey: 'usuarioId' });


export {
    Propiedad,
    Precio,
    Categoria,
    Usuario
}