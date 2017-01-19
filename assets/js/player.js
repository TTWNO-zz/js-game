var laserWidth = 7;
var laserHeight = 50;

var Direction = {
	UP: 1,
	DOWN: 2,
	LEFT: 3,
	RIGHT: 4,
	HORIZONTAL: [3, 4],
	VERTICAL: [1, 2],
	properties: {
		1: {
			name: "up",
			value: 1,
			code: "U"
		},
		2: {
			name: "down",
			value: 2,
			code: "D"
		},
		3: {
			name: "left",
			value: 3,
			code: "L"
		},
		4: {
			name: "right",
			value: 4,
			code: "R"
		},
	}
};

function speedAndDirectionToVector(speed, direction) {
	/*
		take a speed, and a direction; return a vector representing speed in that direction.
		return [-1, -1] if invalid direction.
		@param speed; pixels / frame
		@param direction; Direction.UP/DOWN/LEFT/RIGHT
	 */
	switch (direction) {
	case Direction.UP:
		return createVector(0, -speed);
		break;
	case Direction.DOWN:
		return createVector(0, speed);
		break;
	case Direction.LEFT:
		return createVector(-speed, 0);
		break;
	case Direction.RIGHT:
		return createVector(speed, 0);
		break;
	default:
		return createVector(-1, -1);
	}
}

function isUpOrDown(direction) {
	return isUp(direction) || isDown(direction);
}

function isLeftOrRight(direction) {
	return isLeft(direction) || isRight(direction);
}

function isUp(direction) {
	return direction === Direction.UP;
}

function isDown(direction) {
	return direction === Direction.DOWN;
}

function isLeft(direction) {
	return direction === Direction.LEFT;
}

function isRight(direction) {
	return direction === Direction.RIGHT;
}

class Entity {
	constructor(pos, size, velocity, health) {
		this.pos = pos;
		this.size = size;
		this.velocity = velocity;
		this.health = health;
	}

	draw() {
		rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
	}

	setX(newX) {
		this.pos.x = newX;
	}

	setY(newY) {
		this.pos.y = newY;
	}

	damage(damage) {
		this.health -= damage;
	}

	addHealth(health) {
		this.health += health;
	}

	update() {
		this.setX(this.pos.x + this.velocity.x);
		this.setY(this.pos.y + this.velocity.y);
	}

	getNextPos() {
		var newX = this.pos.x + this.velocity.x;
		var newY = this.pos.y + this.velocity.y;
		return createVector(newX, newY);
	}

	distanceTo(that) {
		var xDiff;
		var yDiff;
		var intersectsY = false;
		var intersectsX = false;

		// If y and height intersect
		if (this.pos.y + this.size.y > that.pos.y && that.pos.y + that.height > this.pos.y) {
			intersectsY = true;
			yDiff = 0;
		}
		// if this is above that
		else if (this.pos.y + this.size.y < that.pos.y) {
			yDiff = that.pos.y - (this.pos.y + this.size.y);
		}
		// if this is below that
		else {
			yDiff = Math.abs((that.pos.y + that.height) - this.pos.y);
		}

		// If x and width intersects
		if (this.pos.x + this.size.x > that.pos.x && that.pos.x + that.width > this.pos.x) {
			xDiff = 0;
			intersectsX = true;
		}
		// If this is to the left of that
		else if (this.pos.x + this.size.x < that.pos.x) {
			xDiff = that.pos.x - (this.pos.x + this.size.x);
		}
		// If this is to the right of that
		else {
			xDiff = Math.abs(this.pos.x - (that.pos.x + that.width));
		}

		return createVector(xDiff, yDiff);
	}

	isColliding(that) {
		var diff = this.distanceTo(that);
		return diff.x === 0 && diff.y === 0;
	}

	willCollideMultiple(thatList) {
		for (entity of thatList) {
			if (this.willCollide(entity, entity.pos.x, entity.pos.y)) {
				return true;
			}
		}
		return false;
	}

	isOutOfFrame() {
		if (this.pos.x + this.size.x < 0 ||
			this.pos.x > windowWidth ||
			this.pos.y > windowHeight ||
			this.pos.y + this.size.y < 0) {
			return true;
		}
		return false;
	}

	willCollide(that, thatNextX, thatNextY) {
		var rect1 = {
			x: thatNextX,
			y: thatNextY,
			height: that.size.y,
			width: that.size.x
		};
		var rect2 = {
			x: this.getNextPos().x,
			y: this.getNextPos().y,
			height: this.size.y,
			width: this.size.x
		};
		if (rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.height + rect1.y > rect2.y) {
			return true;
		}
		return false;
	}

	getMiddleOfSidePos(side) {
		switch (side) {
		case Direction.UP:
			return createVector(this.pos.x + (this.size.x / 2), this.pos.y);
			break;
		case Direction.DOWN:
			return createVector(this.pos.x + (this.size.x / 2), this.pos.y + this.size.y);
			break;
		case Direction.LEFT:
			return createVector(this.pos.x, this.pos.y + (this.size.y / 2));
			break;
		case Direction.RIGHT:
			return createVector(this.pos.x + this.size.x, this.pos.y + (this.size.y / 2));
			break;
		default:
			return createVector(-1, -1);
		}
	}
}

class Player extends Entity {
	constructor(pos) {
		var size = createVector(50, 50);
		var velocity = createVector(0, 0);
		super(pos, size, velocity, 10);
	}
}

class Rectangle extends Entity {
	constructor(pos, size) {
		var velocity = createVector(0, 0);
		super(pos, size, velocity, -1);
	}
}

class Laser extends Entity {
	constructor(pos, size, velocity) {
		super(pos, size, velocity, -1);
	}
}

class PlayerLaser extends Laser {
	constructor(player, speed, direction) {
		var midOfDir = player.getMiddleOfSidePos(direction);
		if (isUp(direction)) {
			var pos = createVector(midOfDir.x - (laserWidth / 2), midOfDir.y - laserHeight);
		} else if (isDown(direction)) {
			var pos = createVector(midOfDir.x - (laserWidth / 2), midOfDir.y);
		} else if (isLeft(direction)) {
			var pos = createVector(midOfDir.x - laserHeight, midOfDir.y - (laserWidth / 2));
		} else if (isRight(direction)) {
			var pos = createVector(midOfDir.x, midOfDir.y - (laserWidth / 2));
		}
		if (isUpOrDown(direction)) {
			var size = createVector(laserWidth, laserHeight);
		} else if (isLeftOrRight(direction)) {
			var size = createVector(laserHeight, laserWidth);
		}
		var velocity = speedAndDirectionToVector(speed, direction);
		super(pos, size, velocity);
	}
}
