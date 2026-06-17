// Variable global para recordar el último elemento que configuraste al dibujar
let ultimoElementoBuscado = "water";

elements.sensor_configurable = {
    color: "#00d2ff",
    category: "machines", // Aparecerá en la pestaña de Máquinas
    state: "solid",
    behavior: behaviors.WALL, // No se mueve, actúa como un bloque sólido
    desc: "Haz clic en él para configurar qué elemento detecta.",

    // Esta función se ejecuta JUSTO cuando seleccionas el elemento para dibujarlo o cuando tocas el lienzo
    onDraw: function(pixel) {
        // Le pide al usuario el nombre del elemento mediante una alerta interactiva
        let seleccion = prompt("¿Qué elemento quieres que detecte este sensor?\n(Ejemplos: water, sand, fire, cuerda_eslabon)", ultimoElementoBuscado);
        
        if (seleccion !== null && seleccion !== "") {
            // Guardamos la configuración en este píxel específico y actualizamos la variable global
            pixel.targetElement = seleccion.toLowerCase().trim();
            ultimoElementoBuscado = pixel.targetElement;
        } else {
            // Si el usuario cancela, por defecto buscará agua
            pixel.targetElement = "water";
        }
    },

    // Lógica de escaneo en cada ciclo de juego (tick)
    tick: function(pixel) {
        let x = pixel.x;
        let y = pixel.y;
        let buscando = pixel.targetElement || "water"; // Si no tiene nada, busca agua por defecto

        // Definimos los 4 lados vecinos para escanear (Arriba, Abajo, Izquierda, Derecha)
        let vecinos = [
            {x: x, y: y - 1},
            {x: x, y: y + 1},
            {x: x - 1, y: y},
            {x: x + 1, y: y}
        ];

        // Recorremos los lados vecinos buscando el objetivo configurado
        for (let i = 0; i < vecinos.length; i++) {
            let v = vecinos[i];

            // Validamos que no revise fuera de la pantalla del juego
            if (v.x >= 0 && v.x < width && v.y >= 0 && v.y < height) {
                let pixelVecino = pixelMap[v.x][v.y];

                // Si hay un píxel al lado y es exactamente el que escribiste en la alerta...
                if (pixelVecino && pixelVecino.element === buscando) {
                    
                    // ¡ACTIVACIÓN! El sensor genera un destello eléctrico (flash) para encender tus circuitos
                    pixel.element = "flash"; 
                    break; // Detiene el bucle porque ya encontró uno
                }
            }
        }
    }
};
