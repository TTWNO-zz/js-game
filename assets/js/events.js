function windowResized() {
	createCanvas(windowWidth, windowHeight);
}

function keyPressed() {
	if (keyCode === 32) {
		var laser = new PlayerLaser(player, 10, Direction.UP);
		addEntity(laser);
	}
}
