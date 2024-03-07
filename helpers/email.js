import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (emailData) => {
    try {
        await transporter.sendMail(emailData);
        console.log('Correo electrónico enviado correctamente.');
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        throw new Error('No se pudo enviar el correo electrónico.');
    }
};

const emailRegistro = async (datos) => {
    const { email, nombre, token } = datos;

    const emailData = {
        from: `"Bienes Raices" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Confirma tu cuenta en BienesRaices.com",
        text: "Confirma tu cuenta en BienesRaices.com",
        html: `
            <p> Hola ${nombre}, comprueba tu cuenta en BienesRaices.com</p>
            <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace:
              <a href="${process.env.BACKEND_URL}:${process.env.SERVER_PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a>
            </p>
            <p> Si tu no creaste esta cuenta puedes ignorar el mensaje</p>
        `
    };

    await sendEmail(emailData);
};

const emailOlvidePassword = async (datos) => {
    const { email, nombre, token } = datos;

    const emailData = {
        from: `"Bienes Raices" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Restablece tu contraseña en BienesRaices.com",
        text: "Restablece tu contraseña en BienesRaices.com",
        html: `
            <p> Sigue el siguiente enlace para generar una nueva contraseña:</p>
            <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace:
              <a href="${process.env.BACKEND_URL}:${process.env.SERVER_PORT ?? 3000}/auth/olvide-password/${token}">Restablecer Contraseña</a>
            </p>
            <p> Si tu no solicitaste el cambio de contraseña, puedes ignorar el mensaje</p>
        `
    };

    await sendEmail(emailData);
};

export {
    emailRegistro,
    emailOlvidePassword
};
