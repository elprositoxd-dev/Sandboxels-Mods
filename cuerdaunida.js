// Inicializamos un contador global para identificar cada trazo único de cuerda
let currentRopeStrokeId = 0;

// Detectamos cuándo inicias un trazo para asignarle un ID único
window.addEventListener('mousedown', function() {
    currentRopeStrokeId = Math.floor(Math.random() * 1000000) + 1;
});
window.addEventListener('touchstart', function() {
    currentRopeStrokeId = Math.floor(Math.random() * 1000000) + 1;
});

// Creamos el elemento llamado "cuerda"
elements.cuerda = {
    color: "#a18262",
    category: "special", // Aparecerá en la pestaña "Special"
    state: "liquid",     // Estado fluido para que el motor permita que se mueva y doble
    density: 1200,
    viscosity: 1000000,  // Viscosidad máxima para que los píxeles se queden pegados entre sí
    
    // Al dibujar la cuerda en la pantalla, guarda el ID de su trazo
    onDraw: function(pixel) {
        pixel.strokeId = currentRopeStrokeId;
    },

    // Lógica avanzada de físicas de cuerda (Arrastre y Gravedad estructural)
    tick: function(pixel) {
        let x = pixel.x;
        let y = pixel.y;
        let myId = pixel.strokeId;

        // 1. COMPORTAMIENTO DE GRAVEDAD CONECTADA
        if (y + 1 < height && !pixelMap[x][y + 1]) {
            let sostenido = false;

            // Revisamos si los píxeles de arriba la están sosteniendo
            let vecinosArriba = [
                {x: x, y: y - 1},
                {x: x - 1, y: y - 1},
                {x: x + 1, y: y - 1}
            ];

            for (let i = 0; i < vecinosArriba.length; i++) {
                let v = vecinosArriba[i];
                if (v.x >= 0 && v.x < width && v.y >= 0 && v.y < height) {
                    let pixelVecino = pixelMap[v.x][v.y];
                    if (pixelVecino) {
                        // Si está unida a una "wall" (pared) o a su propia cuerda con el mismo ID arriba
                        if (pixelVecino.element === "wall" || pixelVecino.strokeId === myId) {
                            sostenido = true;
                            break;
                        }
                    }
                }
            }

            // Si ningún píxel de arriba la sostiene, la gravedad la hace caer de golpe
            if (!sostenido) {
                tryMove(pixel, x, y + 1);
                return; 
            }
        }

        // 2. FÍSICAS DE TRACCIÓN (Si jalas un extremo, la parte de abajo se mueve)
        let direcciones = [
            {dx: -1, dy: -1}, {dx: 0, dy: -1}, {dx: 1, dy: -1},
            {dx: -1, dy: 0},                   {dx: 1, dy: 0},
            {dx: -1, dy: 1},  {dx: 0, dy: 1},  {dx: 1, dy: 1}
        ];

        for (let i = 0; i < direcciones.length; i++) {
            let dir = direcciones[i];
            let nx = x + dir.dx;
            let ny = y + dir.dy;

            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                let vecino = pixelMap[nx][ny];

                // Si el píxel vecino es de nuestra misma cuerda y del mismo trazo
                if (vecino && vecino.element === "cuerda" && vecino.strokeId === myId) {
                    let distSq = (nx - x) * (nx - x) + (ny - y) * (ny - y);
                    
                    // Si la cuerda se estira por el movimiento (distancia > 2)
                    if (distSq > 2) {
                        let targetX = nx + (x - nx);
                        let targetY = ny + (y - ny);
                        
                        if (targetX >= 0 && targetX < width && targetY >= 0 && targetY < height) {
                            if (!pixelMap[targetX][targetY]) {
                                tryMove(vecino, targetX, targetY); // El eslabón arrastra al resto de la cuerda
                            }
                        }
                    }
                }
            }
        }
    }
};
