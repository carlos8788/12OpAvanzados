/**
 * 
 * SOLICITAR TURNOS:
 * Se interactúa con un calendario del mes de opctubre donde el usuario puede elegir un turno a través de un formulario
 * este debe completarlo y una vez que se valide. Si el turno no está ocupado, se guarda como un objeto Persona
 * y también en un array de objetos que permite que persista la información por medio de localStorage
 * Hay varias interacciones con el DOM, se crea un mensaje emergente luego de la creación de un objeto.
 * este usa un método que genera un string, que luego será mostrado por el DOM durante 8 segundos
 * Además de tener los botones de eliminar un turno o todos a la vez
 * Cuando se genera un turno en cada casillero se genera un botón que permite ver lo datos guardados para dicho turno 

 * Para la Segunda Entrega del Proyecto Final se intrujeron los siguientes conceptos:

    objetos con propiedades y métodos
    Modificar el DOM desde JavaScript.
    Usar eventos.
    Usar localStorage.

----------- OPERADORES TERNARIOS Y DESESTRUCTURACIÓN ------------
* Se agrega un selector de tema, que cambia el background del body en el archivo toggle.js
 
* Se aplica en toggle.js operadores ternarios
* en este documento se aplica en la función obtenerTurnosLS(), línea 353 la desestructuración

------------ LIBRERÍAS ---------------
* Se utiliza sweetalert2 para cambiar todos los alert y confirm de la app
lineas: 92, 102, 162, 187, 219, 251, 264, 307, 315
    
*/

// ----------DECLARACION DE VARIABLES-------

//Variable que captura los HTMLcollections "li" para la edición
let nodoLi = document.getElementsByTagName("li")

let form = document.getElementById("recogerDatos")

//Arrays que se usaran para darles propiedades y clases especiales a estos días
let sabados = []
let domingos = []

// Variable que captura la información de la fecha seleccionada
let data;

// Variable contadora que va a notificar al usuario si ya no quedan turnos


// El array que almacena los objetos Persona
let datos = [];


// Array auxiliar que nos servirá para crear objetos de la clase Persona
let datosRecibidos = []


// -----------Clase Persona------------

class Persona {
    constructor(id, nombre, apellido, edad, turno) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.turno = turno;
    }

    mostrarPersona() {
        return `${this.nombre} ${this.apellido} de ${this.edad} de edad, tiene el turno del ${this.turno}`
    }
}

// ----------FUNCIONES--------

// Toma los datos ingresados en el formulario
function tomarDatos() {
    nombre = document.getElementById("nombre");
    apellido = document.getElementById("apellido");
    edad = document.getElementById("edad");
    data = document.getElementById("fecha");
}

// Comprueba si el día elegido está disponible y además si no es fin de semana
function comprobarTurno(diaObtenido) {
    let mostrar = null;

    const found = sabados.includes(diaObtenido);
    const found2 = domingos.includes(diaObtenido);

    if (found) {


        Swal.fire({
            title: '¿Sabado?',
            text: 'Disculpe no hay turnos los días sábados',
            icon: 'warning',
            confirmButtonText: 'Ok'
        })
    }
    else if (found2) {


        Swal.fire({
            title: '¿Domingo?',
            text: 'Disculpe no hay turnos los días domingos',
            icon: 'warning',
            confirmButtonText: 'Ok'
        })
    }
    else {
        mostrar = guardarDatos()
        ocupado(diaObtenido, mostrar, true);
        mostrar.splice(0, 3)
    }
}


// Función que solicita el ingreso de datos al usuario y los retorna en un array
function guardarDatos() {

    datosRecibidos.push(nombre.value);
    datosRecibidos.push(apellido.value);
    datosRecibidos.push(edad.value);

    return datosRecibidos;
}

// Asigna la clase ocuado al día seleccionado además de un botón que muestra los datos de ese turno
function ocupado(numero, array, boolTurnosLS) {

    string = `Día: ${numero} Nombre: ${array[0]}, Apellido: ${array[1]}, Edad: ${array[2]}`

    if (nodoLi.item(numero + 6).innerText.length === 2) {

        let ocupado;
        let ide;

        if (numero < 10) {
            ocupado = document.getElementById(`0${numero}`)

            ide = agregarBoton(`0${numero}`)
        }

        else {
            ocupado = document.getElementById(numero)

            ide = agregarBoton(numero)
        }

        ocupado.className = "ocupado"
        agregarAlert(ide, string)

        form.reset()
        turnoSolicitado(numero, array, boolTurnosLS)
        if (boolTurnosLS) {
            actualizarTurnosLS()
        }

    }

    else {
        
        Swal.fire({
            title: 'Turno Ocupado',
            text: 'Disculpe este turno ya está ocupado',
            icon: 'warning',
            confirmButtonText: 'Ok'
        })
    }

}

// Crea el botón correspondiente para cada día que tenga un turno asignado
function agregarBoton(id) {
    let botonAgregado = document.getElementById(`${id}`)
    let idBtn = `${id}` + "btn"
    let idDiv = `${id}` + "div"
    botonAgregado.innerHTML = `${id} <div id="${idDiv}"><br> OCUPADO <br> <br> <button type='button' id="${idBtn}" >ver datos</button></div>`
    return idBtn
}


// Crea el evento onclick que muestra por un alert la información introducida en el formulario
function agregarAlert(idButton, datos) {
    let agregarAlert = document.getElementById(idButton)
    agregarAlert.onclick = () => { 
        
        Swal.fire({
            title: 'Datos del turno',
            text: datos,
            icon: 'info',
            confirmButtonText: 'Ok'
        }) }
}

// Función que escucha los eventos del boton eliminar turno y el input correspondiente
function eventoEliminarTurno() {
    let identificador = document.getElementById("idEliminar")
    let btnEliminar = document.getElementById("limpiar")
    identificador.addEventListener("input", () => { parseInt(identificador.value) })

    btnEliminar.onclick = () => {
        if (identificador.value > 0 && identificador.value <= 31) {
            let comprobar;
            let fechaTomada = Number(identificador.value)
            if (fechaTomada < 10) {
                fechaTomada = "0" + fechaTomada

                comprobar = document.getElementById(fechaTomada)

            }
            else {
                comprobar = document.getElementById(fechaTomada)

            }

            let valor = comprobar.classList.contains("ocupado")
            if (valor) {
                let confirmar = "Desea eliminar este turno? " + fechaTomada + "/10/22"
                Swal.fire({
                    title: confirmar,
                    text: "No podrás revertir esto!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, eliminar!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        eliminarTurno(Number(identificador.value))
                        let indiceBorrar = datos.findIndex(
                            (dato) => (dato.id == fechaTomada)
                        );

                        datos.splice(indiceBorrar, 1);
                        actualizarTurnosLS()
                        identificador.value = ""
                        Swal.fire(
                            'Eliminado!',
                            'El turno fue eliminado.',
                            'success'
                        )
                    }
                    else {
                        identificador.value = ""
                    }
                })

            }
            else {
                
                Swal.fire({
                    title: 'No hay turno asignado',
                    text: 'Disculpe no hay un turno en la fecha seleccionada',
                    icon: 'info',
                    confirmButtonText: 'Ok'
                })
                identificador.value = ""
            }


        }
        else {
            
            Swal.fire({
                title: 'Selccione un valor',
                text: 'Por favor selccione un valor entre 1 y 31',
                icon: 'info',
                confirmButtonText: 'Ok'
            })
            identificador.value = ""
        }
    }

}

// Función que elimina las propiedades y nodos del turno asignado
function eliminarTurno(identificador) {


    if (nodoLi.item((Number(identificador)) + 6).innerText.length > 2) {

        if (Number(identificador) < 10) {

            identificador = "0" + identificador
        }

        let eliminarDiv = document.getElementById(`${identificador}div`)
        eliminarDiv.remove()
        let eliminarClase = document.getElementById(`${identificador}`)
        eliminarClase.classList.remove("ocupado")
        identificador.value = ""
        

    }
}

// Esta funcion elimina todos los turnos, tiene un confirm por si el usuario se confunde de botón
function eliminarAllTurnos() {
    let btnEliminar = document.getElementById("limpiarTodo")

    btnEliminar.onclick = () => {
        let confirmar = "Realmente quiere eliminar todos los turnos?"
        let ocupados = document.getElementsByClassName("ocupado")
        let arrayId = []
        if (ocupados.length === 0) {
            
            Swal.fire({
                title: 'No hay turnos asignados',
                text: 'Disculpe no hay turnos ingresados todavía',
                icon: 'info',
                confirmButtonText: 'Ok'
            })
        }
        else{
            Swal.fire({
                title: confirmar,
                text: "No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar!'
            }).then((result) => {
                if (result.isConfirmed) {
                    for (let t = 0; t < ocupados.length; t++) {
                        let id = ocupados.item(t).id
    
                        ocupados.item(t).innerHTML = `${id}`
    
                        arrayId.push(id)
                    }
                    for (let a = 0; a < arrayId.length; a++) {
    
                        let borrarClase = document.getElementById(arrayId[a])
            
                        borrarClase.classList.remove("ocupado")
            
                    }
                    datos = []
                    Swal.fire(
                        'Eliminado!',
                        'El turno fue eliminado.',
                        'success'
                    )
                }
    
            })
        }
        
        actualizarTurnosLS()


    }
}

// Rellena el contenedor con el turno que se guardó
function mostrarH2(datosPersona) {
    let mensaje = document.getElementById("mensaje")
    mensaje.innerHTML = `<h3 id="h3Mensaje">Se guardó el turno ${datosPersona} </h3>`
}

// Agrega la animación en el instante que se guarda la información
function agregarAnimacion() {
    let mensaje = document.getElementById("h3Mensaje")
    mensaje.className = "mostrarMensaje"
}


// Funcion que guarda el objeto Persona en un array de objetos
function turnoSolicitado(turnoGuardado, datosRecibidos, boolMostrarPersona) {
    let turnoDado = `${turnoGuardado}/10/22`
    let persona = new Persona(turnoGuardado, datosRecibidos[0], datosRecibidos[1], datosRecibidos[2], turnoDado)
    datos.push(persona);

    if (boolMostrarPersona) {
        let datosAMostrar = persona.mostrarPersona()
        mostrarH2(datosAMostrar)
        agregarAnimacion()
    }

}


//Funcion que asigna clases a los días sábados y domingos
function finDeSemana() {
    for (let sab = 0; sab <= nodoLi.length; sab += 7) {
        if (sab > 0) {
            let dom = 1
            dom += sab
            let claseDomingo = nodoLi.item(dom)
            let claseSabado = nodoLi.item(sab)
            claseSabado.className = "sabado"
            claseDomingo.className = "domingo"
            domingos.push(parseInt(nodoLi.item(dom).innerText))
            sabados.push(parseInt(nodoLi.item(sab).innerText))
        }
    }
}


// Asginación de ID de manera dinámica para luego trabajar con ellos
function asignarID() {
    for (let i = 7; i <= 37; i++) {
        id = nodoLi.item(i).innerText

        nodoLi.item(i).setAttribute("id", id)
    }

}


// ------------LocalStorage-------------
// Almacena los datos en el localStorage obteniendo el array de objetos datos
function actualizarTurnosLS() {

    let turnosJS = JSON.stringify(datos)

    localStorage.setItem("turnos", turnosJS)
}

// Recarga todos los datos almacenados en el localStorage
function obtenerTurnosLS() {

    let turnosJS = localStorage.getItem("turnos")

    if (turnosJS) {
        let datosGuardados = JSON.parse(turnosJS)
        datosGuardados.forEach((dato) => {
            let identificador = parseInt(dato.turno.substring(0, 2))

            // DESESTRUCTURACIÓN
            const { nombre, apellido, edad } = dato
            let lista = [nombre, apellido, edad]

            ocupado(identificador, lista, false)
        })
    }

}


// Función que ejecuta el evento submit
function ejecutarSubmit() {
    form.addEventListener("submit", e => {
        e.preventDefault()

        tomarDatos()

        let verificarFecha = parseInt(data.value.substring(8, 10))

        comprobarTurno(verificarFecha)
    })

}

// Ejecucion de funciones en la función main

function main() {
    asignarID()
    finDeSemana()
    obtenerTurnosLS()
    ejecutarSubmit()
    eventoEliminarTurno()
    eliminarAllTurnos()
}

main();
