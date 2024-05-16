window.onload = ListadoEjerciciosFisicos();

function ListadoEjerciciosFisicos() {

    $.ajax({
        // la URL para la petición
        url: '../../EjercicioFisico/ListadoEjerciciosFisicos',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {},
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (mostrarEjerciciosFisicos) {

            $("#ModalEjercicioFisico").modal("hide");
            LimpiarModal();
            let contenidoTabla = ``;

            $.each(mostrarEjerciciosFisicos, function (index, ejercicioFisico) {

                contenidoTabla += `
                <tr>
                    <td>${ejercicioFisico.tipoEjercicioDescripcion}</td>
                    <td>${ejercicioFisico.fechaInicioString}</td>
                    <td>${ejercicioFisico.fechaFinString}</td>
                    <td>${ejercicioFisico.estadoEmocionalInicio}</td>
                    <td>${ejercicioFisico.estadoEmocionalFin}</td>
                    <td>${ejercicioFisico.observaciones}</td>
                    <td class="text-center">
                    <button type="button" class="btn btn-success" onclick="AbrirModalEditar(${ejercicioFisico.ejercicioFisicoID})">
                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger" onclick="EliminarRegistro(${ejercicioFisico.ejercicioFisicoID})">
                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                    </button>
                    </td>
                </tr>
             `;
            });

            document.getElementById("tbody-ejerciciosfisicos").innerHTML = contenidoTabla;

        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

function LimpiarModal() {
    document.getElementById("EjercicioFisicoID").value = 0;
    document.getElementById("TipoEjercicioID").value = 0;
    document.getElementById("Inicio").value = "";
    document.getElementById("Fin").value = "";
    document.getElementById("EstadoEmocionalInicio").value = 0;
    document.getElementById("EstadoEmocionalFin").value = 0;
    document.getElementById("Observaciones").value = "";
}

function NuevoRegistro() {
    $("#ModalTitulo").text("Nuevo Estado de Ejercicio");
}

function RefrescarTabla() {
    let timerInterval;
    Swal.fire({
        title: "¡Tabla Actualizada!",
        html: "Esta ventana se cerrará en <b></b> milisegundos.",
        timer: 500,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
        }
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log("Estaba cerrada por el temporizador");
        }
    });
}


function AbrirModalEditar(ejercicioFisicoID) {

    $.ajax({
        // la URL para la petición
        url: '../../EjercicioFisico/TraerListaEjercicios',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { ejercicioFisicoID: ejercicioFisicoID },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (ejercicioFisico) {
            let ejerciciosFisicos = ejercicioFisico[0];

            document.getElementById("EjercicioFisicoID").value = ejercicioFisicoID;
            $("#ModalTitulo").text("Editar Ejercicio Fisico");
            document.getElementById("TipoEjercicioID").value = ejerciciosFisicos.tipoEjercicioID;
            document.getElementById("Inicio").value = ejerciciosFisicos.inicio;
            document.getElementById("Fin").value = ejerciciosFisicos.fin;
            document.getElementById("EstadoEmocionalInicio").value = ejerciciosFisicos.estadoEmocionalInicio;
            document.getElementById("EstadoEmocionalFin").value = ejerciciosFisicos.estadoEmocionalFin;
            document.getElementById("Observaciones").value = ejerciciosFisicos.observaciones;
            $("#ModalEjercicioFisico").modal("show");
        },
        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}



function GuardarRegistro() {
    // Obtenemos los valores de los campos
    let ejercicioFisicoID = document.getElementById("EjercicioFisicoID").value;
    let tipoEjercicioID = document.getElementById("TipoEjercicioID").value;
    let inicio = document.getElementById("Inicio").value;
    let fin = document.getElementById("Fin").value;
    let estadoEmocionalInicio = document.getElementById("EstadoEmocionalInicio").value;
    let estadoEmocionalFin = document.getElementById("EstadoEmocionalFin").value;
    let observaciones = document.getElementById("Observaciones").value;


    if (!ejercicioFisicoID || !tipoEjercicioID || !inicio || !fin || !estadoEmocionalInicio || !estadoEmocionalFin) {
        Swal.fire({ //Recorre todos los campos para ver si estan nulos
            title: 'Error',
            text: 'Por favor, complete todos los campos.',
            icon: 'error'
        });
        return; // Para salir de la funcion si falta algun campo
    }

    if (!observaciones) {
        observaciones = "Ninguna Observación";  //Si el usuario no coloca nada en observaciones, se colocara este texto predeterminado
    }

    if (inicio >= fin){
        Swal.fire({ 
            title: 'Error',
            text: 'El horario de inicio no puede ser mayor o igual al horario de finalización.',
            icon: 'error'
        });
        LimpiarModal();
        ListadoEjerciciosFisicos();
        return;
         // Para salir de la funcion 
    }

    // if (inicio >= fin || ejercicioFisicoID){
    //     Swal.fire({ 
    //         title: 'Error',
    //         text: 'El horario de inicio no puede ser mayor o igual al horario de finalización.',
    //         icon: 'error'
    //     });
    //     LimpiarModal();
    //     ListadoEjerciciosFisicos();
    //     return;
    //      // Para salir de la funcion 
    // }

    $.ajax({
        url: '../../EjercicioFisico/GuardarRegistro',
        data: {
            ejercicioFisicoID: ejercicioFisicoID,
            tipoEjercicioID: tipoEjercicioID,
            inicio: inicio,
            fin: fin,
            estadoEmocionalInicio: estadoEmocionalInicio,
            estadoEmocionalFin: estadoEmocionalFin,
            observaciones: observaciones
        },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            if (resultado != "") {
                Swal.fire({
                    title: 'Error',
                    text: 'Tienes que poner una descripción.',
                    icon: 'error'
                });
            } else {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Registro guardado.',
                    icon: 'success',
                    timer: 1000,
                    timerProgressBar: true
                });
                LimpiarModal();
                ListadoEjerciciosFisicos();
            }
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al guardar el registro');
        }
    });
}




function EliminarRegistro(ejercicioFisicoID) {
    Swal.fire({
        title: "¿Estás seguro de eliminar este registro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#228B22",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                // la URL para la petición
                url: '../../EjercicioFisico/EliminarEjercicioFisico',
                // la información a enviar
                data: { ejercicioFisicoID: ejercicioFisicoID },
                // especifica si será una petición POST o GET
                type: 'POST',
                // el tipo de información que se espera de respuesta
                dataType: 'json',
                success: function (resultado) {
                    Swal.fire({
                        title: "Eliminado",
                        text: "Tu registro ha sido eliminado exitosamente",
                        icon: "success",
                        timer: 1500,
                        timerProgressBar: true,
                    });
                    ListadoEjerciciosFisicos();
                },
                // código a ejecutar si la petición falla;
                error: function (xhr, status) {
                    console.log('Disculpe, existió un problema al eliminar el registro.');
                }
            });
        }
    });
}
