

const admin = (req,res) => {
    res.render('propiedades/admin',{
        pagina: "Mis propiedades",
        barra: true,
    })
}

export {
    admin,
}