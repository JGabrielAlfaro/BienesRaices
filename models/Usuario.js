
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
    }
})

export default Usuario;