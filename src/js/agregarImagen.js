import {Dropzone} from "dropzone";
import { header } from "express-validator";

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
console.log(token)
Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube tus imagenes aqui',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads:1, 
    autoProcessQueue: false, //no suba automatico.
    addRemoveLinks: true, //Agrega un enlace para eliminar.
    dictRemoveFile: "Borrar archivo",
    dictMaxFilesExceeded: "El limite es 1 archivo",
    //Los header se envían antes de la peticion o cuerpo del req.
    headers: {
        'CSRF-Token' : token,
    },
    paramName: 'imagen',
    init: function(){
        const dropzone = this
        const btnPublicar= document.querySelector("#publicar")

        btnPublicar.addEventListener('click', function(){
            dropzone.processQueue()
        })
        
        dropzone.on('queuecomplete', function(){
            if (dropzone.getActiveFiles().length ==0){
                window.location.href = "/mis-propiedades"
                console.log("Paso")
            }
            console.log("No paso")
        })
    }
}