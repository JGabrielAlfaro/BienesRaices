
import {DataTypes} from 'sequelize'; 
import db from '../config/db.js';
import bcrypt from 'bcrypt';

const Usuario = db.define('usuarios',{
    nombre: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN,

},{
    //Hashear password con: bcrypt
    hooks: {
        beforeCreate: async function (usuario) {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password,salt)
        }
    },
    //Al hacer un get sobre el modelo usuario no me va a traer los siguientes campos.
    scopes: {
        eliminarPassword: {
            attributes: {
                exclude: ['password', 'token', 'confirmado', 'createdAt', 'updatedAt']
            }
        }
    }
})

//Metodo personalizado para agregar un nuevo prototype a Usuario.
//No se puede utilizar this. con arrow function, es por eso que se utiliza function.
Usuario.prototype.verificarPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

export default Usuario;