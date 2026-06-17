(function() {
    if (!window.elements) return;
    elements.cuerda_anclaje = {
        color: "#8B5A2B",
        behavior: behaviors.WALL,
        category: "Cuerdas",
        desc: "Soporte de madera para la cuerda.",
        state: "solid"
    };
    elements.cuerda_eslabon = {
        color: "#CD853F",
        category: "Cuerdas",
        desc: "Cuerda con física conectada.",
        state: "solid",
        density: 1200,
        tick: function(pixel) {
            let x = pixel.x, y = pixel.y;
            let conectadoArriba = false, soporteX = x;
            let chequeos = [{dx:0,dy:-1},{dx:-1,dy:-1},{dx:1,dy:-1}];
            for (let c of chequeos) {
                let tx = x + c.dx, ty = y + c.dy;
                if (!isEmpty(tx, ty, true)) {
                    let p = pixelMap[tx][ty];
                    if (p.element === "cuerda_anclaje" || p.element === "cuerda_eslabon") {
                        conectadoArriba = true; soporteX = tx; break;
                    }
                }
            }
            if (!conectadoArriba) {
                if (isEmpty(x, y + 1)) movePixel(pixel, x, y + 1);
                else if (isEmpty(x - 1, y + 1)) movePixel(pixel, x - 1, y + 1);
                else if (isEmpty(x + 1, y + 1)) movePixel(pixel, x + 1, y + 1);
                return;
            }
            if (isEmpty(x, y + 1)) {
                if (soporteX < x && isEmpty(x - 1, y + 1)) movePixel(pixel, x - 1, y + 1);
                else if (soporteX > x && isEmpty(x + 1, y + 1)) movePixel(pixel, x + 1, y + 1);
                else if (soporteX === x) movePixel(pixel, x, y + 1);
            } else {
                if (soporteX < x && isEmpty(x - 1, y)) movePixel(pixel, x - 1, y);
                else if (soporteX > x && isEmpty(x + 1, y)) movePixel(pixel, x + 1, y);
            }
        }
    };
    alert("¡Mod de Cuerda cargado con éxito! Busca la pestaña Cuerdas.");
})();
