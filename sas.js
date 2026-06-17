// Variable global para recordar el último elemento configurado
let ultimoElementoBuscado = "water";

// 1. CREAMOS LA HERRAMIENTA PARA CONFIGURAR (Igual que el cuchillo o batidor de tu ejemplo)
elements.configurador_sensor = {
    color: "#00d2ff",
    tool: function(pixel) {
        // Solo funciona si se usa sobre el sensor configurable
        if (pixel.element === "sensor_configurable") {
            let seleccion = prompt("¿Qué elemento quieres que detecte este sensor?\n(Ejemplos: water, sand, fire, cuerda_eslabon)", ultimoElementoBuscado);
            
            if (seleccion !== null && seleccion !== "") {
                pixel.targetElement = seleccion.toLowerCase().trim();
                ultimoElementoBuscado = pixel.targetElement;
            }
        }
    },
    category: "tools", // Sale en la pestaña de Herramientas
    canPlace: false,
    desc: "Úsalo sobre un 'sensor_configurable' para elegir qué elemento debe detectar."
};

// 2. CREAMOS EL SENSOR QUE ADMITE LA CONFIGURACIÓN
elements.sensor_configurable = {
    color: "#1a1a1a",
    category: "machines", // Sale en la pestaña de Máquinas
    state: "solid",
    behavior: behaviors.WALL, // Actúa como bloque sólido estático
    
    // Al colocarlo por primera vez, por defecto busca agua
    onDraw: function(pixel) {
        pixel.targetElement = "water";
    },

    // Lógica nativa de escaneo utilizando el pixelMap global de Sandboxels
    tick: function(pixel) {
        let x = pixel.x;
        let y = pixel.y;
        let buscando = pixel.targetElement || "water";

        // Direcciones vecinas en cruz (Arriba, Abajo, Izquierda, Derecha)
        let vecinos = [
            {x: x, y: y - 1},
            {x: x, y: y + 1},
            {x: x - 1, y: y},
            {x: x + 1, y: y}
        ];

        for (let i = 0; i < vecinos.length; i++) {
            let v = vecinos[i];

            // Verificación estándar de límites de mapa
            if (v.x >= 0 && v.x < width && v.y >= 0 && v.y < height) {
                let pixelVecino = pixelMap[v.x][v.y];

                // Si encuentra el elemento que configuraste con la herramienta, se activa
                if (pixelVecino && pixelVecino.element === buscando) {
                    // Usamos la función nativa changePixel igual que en tu mod de referencia
                    changePixel(pixel, "flash"); 
                    break;
                }
            }
        }
    }
};
