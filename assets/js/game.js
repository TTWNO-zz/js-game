var floor;
var player;
var border;
var playerSpeed = 5;

var drawable = [];

var objectColors = {};

function preload() {
	console.log("Preload");
}

function setup() {
	console.log("Setup");

	// Options
	objectColors["EnemyLaser"] = color(255, 0, 0);
	objectColors["PlayerLaser"] = color(0, 255, 0);
	objectColors["Player"] = color(255, 255, 255);
	//\Options


	player = new Player(
		createVector(windowWidth / 2, windowHeight / 4 * 3));

	// Borders
	top_wall = new Rectangle(
		createVector(-2, -2), createVector(windowWidth, 1));
	bottom_wall = new Rectangle(
		createVector(0, windowHeight), createVector(windowWidth, 1));
	left_wall = new Rectangle(
		createVector(-2, 0), createVector(1, windowHeight));
	right_wall = new Rectangle(
		createVector(windowWidth + 1, 0), createVector(1, windowHeight));

	addEntity(top_wall);
	addEntity(bottom_wall);
	addEntity(left_wall);
	addEntity(right_wall);
	//\Borders

	createCanvas(windowWidth, windowHeight, P2D);
	colorMode(RGB);
}

function draw() {
	// Drawing options
	noStroke();
	// \Drawing options

	background(0, 0, 0);
	fill(objectColors["Player"]);
	player.draw();
	for (entity of drawable) {
		entityType = entity.constructor.name;
		if (objectColors.hasOwnProperty(entityType)) {
			fill(objectColors[entityType]);
		}
		entity.draw();
	}
	update();
}

function update() {
	// Player moving
	if (keyIsDown(RIGHT_ARROW)) {
		player.velocity.x = playerSpeed;
		// If this change would cause a collision, don't allow it
		if (player.willCollideMultiple(drawable)) {
			player.velocity.x = 0;
		}
	} else if (keyIsDown(LEFT_ARROW)) {
		player.velocity.x = -playerSpeed;
		if (player.willCollideMultiple(drawable)) {
			player.velocity.x = 0;
		}
	} else {
		// If no arrows affecting this axis are being pressed set velocity to 0
		player.velocity.x = 0;
	}

	if (keyIsDown(DOWN_ARROW)) {
		player.velocity.y = playerSpeed;
		if (player.willCollideMultiple(drawable)) {
			player.velocity.y = 0;
		}
	} else if (keyIsDown(UP_ARROW)) {
		player.velocity.y = -playerSpeed;
		if (player.willCollideMultiple(drawable)) {
			player.velocity.y = 0;
		}
	} else {
		player.velocity.y = 0;
	}

	//\Player moving
	// For controls look at events.js#keyPressed()

	for (var i = 0; i < drawable.length; i++) {
		entity = drawable[i];
		// If a laser is out of the frame, remove it.
		if (entity instanceof Laser) {
			if (entity.isOutOfFrame()) {
				drawable.splice(i, 1);
			}
			// If player intersects with laser, inflict damage.
			if (entity.isColliding(player)) {
				player.damage(1);
			}
		}
		// ALWAYS update entity
		entity.update();
	}
	player.update();
}

function addEntity(entity) {
	drawable.push(entity);
}
