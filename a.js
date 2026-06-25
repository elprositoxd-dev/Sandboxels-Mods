elements.pscn = {
    color: "#4B0082",
    behavior: behaviors.WALL,
    category: "machines",
    state: "solid",
    density: 2330,
    conduct: 1
};

elements.nscn = {
    color: "#FFA500",
    behavior: behaviors.WALL,
    category: "machines",
    state: "solid",
    density: 2330,
    conduct: 1
};

runPerPixel(function(pixel) {
    if (pixel.element === "pscn" && pixel.charge > 0) {
        var offsets = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];
        for (var i = 0; i < offsets.length; i++) {
            var nx = pixel.x + offsets[i].x;
            var ny = pixel.y + offsets[i].y;
            if (grid[nx] && grid[nx][ny]) {
                var neighbor = grid[nx][ny];
                if (neighbor.charge !== undefined) {
                    neighbor.charge = 0;
                }
            }
        }
    }

    if (pixel.element === "nscn" && pixel.charge > 0) {
        pixel.charge = 10;
        var offsets = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];
        for (var i = 0; i < offsets.length; i++) {
            var nx = pixel.x + offsets[i].x;
            var ny = pixel.y + offsets[i].y;
            if (grid[nx] && grid[nx][ny]) {
                var neighbor = grid[nx][ny];
                if (neighbor.charge !== undefined) {
                    neighbor.charge = 4;
                }
            }
        }
    }
});
