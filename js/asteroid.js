Asteroid.count = 0;
Asteroid.all = {};
Asteroid.data = [
    { r: 0.025, speed: 0.0005, minAngle: 60, maxAngle: 90, minSmallerAsteroids: 0, maxSmallerAsteroids: 0 },
    { r: 0.08, speed: 0.00025, minAngle: 50, maxAngle: 70, minSmallerAsteroids: 2, maxSmallerAsteroids: 3 },
    { r: 0.2, speed: 0.00006, minAngle: 30, maxAngle: 45, minSmallerAsteroids: 3, maxSmallerAsteroids: 4 },
];
//Asteroid constructor
function Asteroid(size, x, y) {
    Asteroid.count++;
    this.id = Asteroid.count;
    Asteroid.all[this.id] = this;
    //
    this.size = size !== undefined ? size : 2;
    //?WH
    this.x = x !== undefined ? x : (VAR.rand(0, 1) ? VAR.rand(0, 3) / 10 : VAR.rand(7, 10) / 10) * VAR.W;
    this.y = y !== undefined ? y : (VAR.rand(0, 1) ? VAR.rand(0, 3) / 10 : VAR.rand(7, 10) / 10) * VAR.W;
    //
    this.r = Asteroid.data[this.size].r;
    //
    this.modY = Asteroid.data[this.size].speed * VAR.rand(1, 10) * (VAR.rand(0, 1) ? -1 : 1);
    this.modX = Asteroid.data[this.size].speed * VAR.rand(1, 10) * (VAR.rand(0, 1) ? -1 : 1);
    //
    this.points = [];
    var a = VAR.rand(0, 40);
    while (a < 360) {
        a += VAR.rand(Asteroid.data[this.size].minAngle, Asteroid.data[this.size].maxAngle);
        this.points.push({
            x: Math.sin(Math.PI / 180 * a) * this.r,
            y: Math.cos(Math.PI / 180 * a) * this.r
        });
    }
}
Asteroid.prototype.hitTest = function(x, y) {
    if (this.x - this.r * VAR.d < x && this.x + this.r * VAR.d > x && this.y - this.r * VAR.d < y && this.y + this.r * VAR.d > y) {
        Game.ctx.clearRect(this.x - this.r * VAR.d, this.y - this.r * VAR.d, this.r * VAR.d * 2, this.r * VAR.d * 2);
        Game.hit_ctx.beginPath();
        Game.hit_ctx.fillStyle = 'red';
        for (var i = 0; i < this.points.length; i++) {
            Game.hit_ctx[i === 0 ? 'moveTo' : 'lineTo'](this.points[i].x * VAR.d + this.x, this.points[i].y * VAR.d + this.y);
        }
        Game.hit_ctx.closePath();
        Game.hit_ctx.fill();
        if (Game.hit_ctx.getImageData(x, y, 1, 1).data[0] == 255) {
            return true
        }
    }
    return false
}
Asteroid.prototype.draw = function() {
    this.x += this.modX * VAR.d;
    this.y += this.modY * VAR.d;
    //
    if (this.x + this.r * VAR.d < 0) {
        this.x += VAR.W + (this.r * 2 * VAR.d);
    } else if (this.x - this.r * VAR.d > VAR.W) {
        this.x -= VAR.W + (this.r * 2 * VAR.d);
    }
    //
    if (this.y + this.r * VAR.d < 0) {
        this.y += VAR.H + (this.r * 2 * VAR.d);
    } else if (this.y - this.r * VAR.d > VAR.H) {
        this.y -= VAR.H + (this.r * 2 * VAR.d);
    }
    Game.ctx.beginPath();

    for (var i = 0; i < this.points.length; i++) {
        Game.ctx[i === 0 ? 'moveTo' : 'lineTo'](this.points[i].x * VAR.d + this.x, this.points[i].y * VAR.d + this.y);
    }
    Game.ctx.closePath();
    Game.ctx.stroke();
};
Asteroid.prototype.remove = function() {
    Sound.play('bum' + VAR.rand(1, 2));
    if (this.size > 0) {
        for (var i = 0, j = VAR.rand(Asteroid.data[this.size].minSmallerAsteroids, Asteroid.data[this.size].maxSmallerAsteroids); i < j; i++) {
            new Asteroid(this.size - 1, this.x, this.y)
        }
    }
    Dot.add(this.x, this.y);
    delete Asteroid.all[this.id]
}
Asteroid.draw = function() {
    Asteroid.num = 0;
    for (var r in Asteroid.all) {
        Asteroid.num++;
        Asteroid.all[r].draw();
    }
    if (Asteroid.num === 0 && !Game.success) {
        Game.success = true;
        Sound.play('win');
    }
};