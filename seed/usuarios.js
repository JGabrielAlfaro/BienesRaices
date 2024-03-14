import bcrypt from 'bcrypt';


const usuarios = [
    {
        nombre: 'Gabriel',
        email: "gabriel@gabriel.com",
        confirmado: 1,
        password: bcrypt.hashSync('Jalfaro2012',10)
    }

]

export default usuarios;