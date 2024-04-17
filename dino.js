

//tablero variables

let tablero;
let tableroWidth = 750;
let tableroHeight = 250;
let context;


//dino variables

let dinoWidth =  88;
let dinoHeight =  94;
let dinoY;

//variables agachado
let dinoduckWidth = 88;
let dinoduckHeight = 60;
let dinoduckY;

//variables currentes
let currentDinoY = dinoY; // Posición Y actual del dinosaurio
let currentDinoHeight = dinoHeight; // Altura actual del dinosaurio
let currentDinoWidth = dinoWidth;

//imagenes
let dinoImg;
let dinoImgduck;
let currentDinoImg;


let dino = { // objeto literal para definir pares (clave : valor)

    x : 50,
    y : null,
    width : null,
    height : null,

}


//ave

let aveWidth = 97;
let aveHeight = 68;
let aveX = 700;
let aveY = (tableroHeight - dinoHeight)-50;

let aveImg;


//cactus

let obstaculosArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = tableroHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;


//fisicas del juego

let velocityX = -8; //velocidad del cactus a la derecha
let velocityY = 0; // salto del dino
let gravedad = .4;

let enElAire = false; // Variable para verificar si el dinosaurio está en el aire

let gameOver = false;
let gameOverImg; // imagen game over
let score = 0;


let downKeyPressed = false; // verifica si hay tecla presionada




window.onload = function() {  // window.onload espera que todos los valores de la pagina esten cargados para funcionar

    tablero = document.getElementById('tablero');   // pone el id de tablero con la variable
    tablero.width = tableroWidth;                   // inicia el ancho del tablero
    tablero.height = tableroHeight;                 // inicia el alto del tablero

    context = tablero.getContext("2d"); // para dibujar en el tablero

    // Crear el boton reiniciar
    let botonReiniciar = document.getElementById("botonReiniciar");
    botonReiniciar.addEventListener("click", reiniciarJuego);
    botonReiniciar.blur(); // Quitar el foco del botón después de hacer clic en él

    dinoduckY = tableroHeight - dinoduckHeight;
    dinoY = tableroHeight - dinoHeight;
    currentDinoY = dinoY;

    //imagen dino
    dinoImg = new Image(); // creo el objeto como imagen vacia
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = function() {

        context.drawImage(dinoImg,dino.x, dino.y, dino.width, dino.height);

    };


    //imagen dino agachado
    dinoImgduck = new Image(); // creo el objeto como imagen vacia
    dinoImgduck.src = "./img/dino-duck1.png";


    currentDinoImg = dinoImg;


    //imagen gameOver

    gameOverImg = new Image();
    gameOverImg.src = "./img/gameOver.png";


    //imagen cactus

    cactus1Img = new Image(); 
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image(); 
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image(); 
    cactus3Img.src = "./img/cactus3.png";

    //imagen ave

    aveImg = new Image();
    aveImg.src = "./img/bird1.png";
    

    requestAnimationFrame(update); // solicita al navegador que ejecute la función update antes de la próxima renderización de la página,
    setInterval(ponerObs, 1000); // 1000 milisegundos(1sec) llamo la funcion poner cactus
    document.addEventListener("keydown", moverDino); // cada vez que presionamos una tecla, llamamos la funcion donde revise la tecla
    document.addEventListener("keyup", soltarTecla); // cuando soltamos una tecla, llama a la funcion soltar tecla

}


function update() {
    if (gameOver) {
        context.drawImage(gameOverImg, 250, 0, 250, 250);
        return;
    }

    requestAnimationFrame(update);

    // Limpiar la pantalla
    context.clearRect(0, 0, tablero.width, tablero.height);

    
    velocityY += gravedad; // Siempre aplicar la gravedad
    currentDinoY = Math.min(currentDinoY + velocityY, dinoY); // Aplicar gravedad al dinosaurio, asegurando que no pase para abajo
    context.drawImage(currentDinoImg, dino.x, currentDinoY, currentDinoWidth , currentDinoHeight);


    // Restablecer en el aire cuando el dinosaurio toca el suelo
    if (currentDinoY >= dinoY) { 
        enElAire = false;
        velocityY = 0; // Restablecer la velocidad vertical cuando toca el suelo
    }

    dino.y = currentDinoY;
    dino.width = currentDinoWidth;
    dino.height = currentDinoHeight;

    // Obstáculo
    for (let i = 0; i < obstaculosArray.length; i++) {
        let obstaculo = obstaculosArray[i];
        obstaculo.x += velocityX; // Agregar la velocidad
        context.drawImage(obstaculo.img, obstaculo.x, obstaculo.y, obstaculo.width, obstaculo.height);

        if (detectarColision(dino, obstaculo)) { // Verificar la colisión
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            dinoImg.onload = function() {
                context.drawImage(dinoImg, dino.x, currentDinoY, dino.width, dino.height);
            };
        }
    }

    // Puntaje
    context.fillStyle = "blue";
    context.font = "25px bold ";
    score++;
    context.fillText(score, 5, 20);
}


 


function moverDino(e) {
    if(gameOver) {
        return;
    }

    // Salto
    if ((e.code == "Space" || e.code == "ArrowUp") && !enElAire) { 
        velocityY = -10;
        enElAire = true; 
    }

    // Agacharse
    if (e.code == "ArrowDown" && !enElAire && currentDinoY == dinoY) { 

        currentDinoImg = dinoImgduck;
        downKeyPressed = true;

    

    }  
}







function soltarTecla(e) {

    // Si se suelta la tecla hacia abajo
    if (e.code == "ArrowDown" && !enElAire) {


        currentDinoImg = dinoImg;
        currentDinoY = dinoY;
        currentDinoHeight = dinoHeight;
        currentDinoWidth = dinoWidth;


        // Indicar que la tecla hacia abajo ya no está presionada
        downKeyPressed = false;
    }
}



function ponerObs() {

    if(gameOver) { 
        return;
    }


    //crea cactus

    let obstaculo = {

        img : null,
        x : tableroWidth,
        y : null,
        width : null,
        height : null

    }

    let ponerObsProb = Math.random(); // 0 hasta 0.9999...

    if (ponerObsProb > .90) { // 10% de poner cactus 3

        obstaculo.img = cactus3Img;
        obstaculo.y = cactusY;
        obstaculo.width = cactus3Width;
        obstaculo.height = cactusHeight;
        obstaculosArray.push(obstaculo);

    }
    else if (ponerObsProb > .70) { // 30% de poner cactus 2

        obstaculo.img = cactus2Img;
        obstaculo.y = cactusY;
        obstaculo.width = cactus2Width;
        obstaculo.height = cactusHeight;
        obstaculosArray.push(obstaculo);

    }
    else if (ponerObsProb > .50) { // 50% de poner ave

        obstaculo.img = aveImg;
        obstaculo.y = aveY;
        obstaculo.width = aveWidth;
        obstaculo.height = aveHeight;
        obstaculosArray.push(obstaculo);

    }
    else if (ponerObsProb > .30) { // 70% de poner cactus 1 o en general

        obstaculo.img = cactus2Img;
        obstaculo.y = cactusY;
        obstaculo.width = cactus2Width;
        obstaculo.height = cactusHeight;
        obstaculosArray.push(obstaculo);

    }

    if (obstaculosArray.length > 5) {
        obstaculosArray.shift(); // borra el primer cactus del arreglo para que no se vayan acumlando infinito
    }

}


function detectarColision(a, b) {

    // Si el dinosaurio está agachado y el objeto es un ave, no detectar colisión
    if (downKeyPressed && b.img === aveImg) {
        return false;
    }

    return  a.x < b.x + b.width &&  // revisa que 'a' esquina arriba izquierda no llegue con 'b' esquina arriba derecha 
            a.x + a.width > b.x &&  // revisa que 'a' esquina arriba derecha no pase a 'b' esquina arriba izquierda
            a.y < b.y + b.height && // revisa que 'a' esquina arriba izquierda no llegue con 'b' esquina abajo derecha
            a.y + a.height > b.y;   // revisa que 'a' esquina abajo izquierda no pase a 'b' esquina arriba izquierda
}


function reiniciarJuego() {
    
    dino.x = 50;
    dino.y = dinoY;


    // Limpiar el array de cactus
    obstaculosArray = [];

    // Reiniciar el marcador (score) a cero
    score = 0;

    // Reiniciar cualquier otra variable que controle el estado del juego
    gameOver = false;

    // Volver a dibujar el estado inicial del juego en el lienzo
    context.clearRect(0, 0, tablero.width, tablero.height); // Limpiar el lienzo
    dinoImg.src = "./img/dino.png";
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height); // Dibujar el dinosaurio
    requestAnimationFrame(update); // Volver a iniciar la animación del juego

}

