window.onload = ListadoTipoEjercicios();

function ListadoTipoEjercicios() {

    $.ajax({
        // la URL para la petición
        url: '../../TipoEjercicios/ListadoTipoEjercicios',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {},
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (tipoDeEjercicios) {

            $("#ModalTipoEjercicio").modal("hide");
            LimpiarModal();
            //$("#tbody-tipoejercicios").empty();
            let contenidoTabla = ``;

            $.each(tipoDeEjercicios, function (index, tipoDeEjercicio) {

                contenidoTabla += `
                <tr>
                    <td>${tipoDeEjercicio.descripcion}</td>
                    <td class="text-center">
                    <button type="button" class="btn btn-success" onclick="AbrirModalEditar(${tipoDeEjercicio.tipoEjercicioID})">
                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger" onclick="EliminarRegistro(${tipoDeEjercicio.tipoEjercicioID})">
                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                    </button>
                    </td>
                </tr>
             `;

            });

            document.getElementById("tbody-tipoejercicios").innerHTML = contenidoTabla;

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
    document.getElementById("TipoEjercicioID").value = 0;
    document.getElementById("descripcion").value = "";
}

function NuevoRegistro() {
    $("#ModalTitulo").text("Nuevo Tipo de Ejercicio");
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
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log("Estaba cerrada por el temporizador");
        }
    });
}


function AbrirModalEditar(tipoEjercicioID) {

    $.ajax({
        // la URL para la petición
        url: '../../TipoEjercicios/ListadoTipoEjercicios',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { id: tipoEjercicioID },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (tipoDeEjercicios) {
            let tipoDeEjercicio = tipoDeEjercicios[0];

            document.getElementById("TipoEjercicioID").value = tipoEjercicioID;
            $("#ModalTitulo").text("Editar Tipo de Ejercicio");
            document.getElementById("descripcion").value = tipoDeEjercicio.descripcion;
            $("#ModalTipoEjercicio").modal("show");
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
    //GUARDAMOS EN UNA VARIABLE LO ESCRITO EN EL INPUT DESCRIPCION
    let tipoEjercicioID = document.getElementById("TipoEjercicioID").value;
    let descripcion = document.getElementById("descripcion").value;
    console.log(descripcion);
    $.ajax({
        // la URL para la petición
        url: '../../TipoEjercicios/GuardarTipoEjercicio',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { tipoEjercicioID: tipoEjercicioID, descripcion: descripcion },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (resultado) {

            if (resultado != "") {
                (Swal.fire("Tienes que poner una descripcion"));
            }

            else if (resultado = ListadoTipoEjercicios) {
                Swal.fire({
                    timer: 1000,
                    timerProgressBar: true,
                    icon: "success"
                });
            }
            ListadoTipoEjercicios();
        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al guardar el registro');
        }
    });
}

// function DescripcionVacia() {
//     $("#ModalDescripcionVacia").modal("show");
//             console.log('Disculpe, existió un problema');
// }

// function MismaDescripcion() {
//     $("#ModalMismaDescripcion").modal("show");
//             console.log('Disculpe, existió un problema');
// }


// function ValidacionEliminarRegistro(tipoEjercicioID) {
//     $("#ModalValidacionEliminarRegistro").modal("show");
//             console.log('Disculpe, existió un problema');
// }

function EliminarRegistro(tipoEjercicioID) {
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
                url: '../../TipoEjercicios/EliminarTipoEjercicio',
                // la información a enviar
                data: { tipoEjercicioID: tipoEjercicioID },
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
                    ListadoTipoEjercicios();
                },
                // código a ejecutar si la petición falla;
                error: function (xhr, status) {
                    console.log('Disculpe, existió un problema al eliminar el registro.');
                }
            });
        }
    });

}

function EliminarRegistro(tipoEjercicioID) {
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
                url: '../../TipoEjercicios/EliminarTipoEjercicio',
                // la información a enviar
                data: { tipoEjercicioID: tipoEjercicioID },
                // especifica si será una petición POST o GET
                type: 'POST',
                // el tipo de información que se espera de respuesta
                dataType: 'json',
                success: function (resultado) {
                    if (typeof resultado === 'string') {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: "No se puede eliminar este tipo de ejercicio ya que contiene uno o más ejercicios físicos."
                        });
                    }
                    else {
                        Swal.fire({
                            title: "Eliminado",
                            text: "Tu registro ha sido eliminado exitosamente",
                            icon: "success",
                            timer: 1500,
                            timerProgressBar: true,
                        });
                        ListadoTipoEjercicios();
                    }
                },
                // código a ejecutar si la petición falla;
                error: function (xhr, status) {
                    console.log('Disculpe, existió un problema al eliminar el registro.');
                }
            });
        }
    });
}

