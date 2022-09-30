let toggle = document.getElementById("container")
let texto = document.getElementById("texto")
let body = document.querySelector('body')

// Función que cambi el texto de un h3 aplicando el concepto de operador ternario
function colocar(valor){
    (valor)?texto.innerHTML = "<h3 class='textoToggle'>Selector de temas: Theme blue</h3>":texto.innerHTML = "<h3 class='textoToggle'>Selector de temas: Theme pink</h3>"
}

toggle.onclick = function(){

    let valor = toggle.classList.toggle('active')
    
    colocar(valor)
    
    body.classList.toggle('active')
    
    
}
