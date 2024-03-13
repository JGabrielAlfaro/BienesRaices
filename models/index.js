import Propiedad from './Propiedad.js'
import Precio from './Precio.js'
import Categoria from './Categoria.js'
import Usuario from './Usuario.js'

// Precio.hasOne(Propiedad) //Propiedad tiene un precio, se lee de Right to Lefth
// Propiedad.belongsTo(Precio)// Propiedad tien un precio, se lee de Left to Right (precioid quedo la llave foranea)

Propiedad.belongsTo(Precio, {
    foreignKey: 'precioId', // Nombre de la clave foránea en el modelo Propiedad (campo precioId)
    as: 'FK_Propiedad_has_Precio' // Nombre llave foránea (FK_Propiedad_has_Precio)
  });


  Propiedad.belongsTo(Categoria, {
    foreignKey: 'categoriaId', 
    as: 'FK_Propiedad_has_Categoria' 
  });

  Propiedad.belongsTo(Usuario, {
    foreignKey: 'usuarioId', 
    as: 'FK_Propiedad_has_Usuario' 
  });

export {
    Propiedad,
    Precio,
    Categoria,
    Usuario
}