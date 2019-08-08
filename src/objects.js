import { Vector } from './geom.js';
import { angleDiff } from './maths.js';


const BASE_RADIUS = 35; // px
const ORBIT_RADIUS = 50; // px
const FIGHTER_SPEED = 200; // px/s

const playerColors = [
  '#FFFFFF',
  '#FFFF00',
  '#0000FF',
];

export class Base {
  constructor(xpos, ypos, player) {
    this.player = player;
    this.fighters = [];
    this.pos = new Vector(xpos, ypos);
    this.selected = false;
  }

  hitTest(x, y) {
    return ((x - this.pos.x) ** 2 + (y - this.pos.y) ** 2) < BASE_RADIUS ** 2;
  }

  select() {
    this.selected = true;
  }

  unselect() {
    this.selected = false;
  }

  addFighter(fighter) {
    this.fighters.push(fighter);
  }

  hasFighters() {
    return this.fighters.length > 0;
  }

  sendFighterTo(base) {
    if(this.hasFighters()) {
      this.fighters[0].flyTo(base);
    }
  }

  render(ctx, deltaT) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, BASE_RADIUS, 0, 2 * Math.PI); 
    if(this.selected) {
      ctx.lineWidth = 3;
    } else {
      ctx.lineWidth = 1;
    }
    
    ctx.fillStyle = playerColors[this.player];
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    for(const fighter of this.fighters) {
      fighter.render(ctx, deltaT);
    }
  }

}

const FIGHTER_STATE = Object.freeze({
  AT_BASE: 0,
  ON_JOURNEY: 1,
});

export class Fighter {
  constructor(base, angle) {
    this.player = base.player;
    this.state = FIGHTER_STATE.AT_BASE;
    this.base = base;
    this.velocity = new AngularVelocity(ORBIT_RADIUS, FIGHTER_SPEED, angle);
    this.pos = this.velocity.computePos(this.base.pos, 0);
    console.log(this.pos);
    this.takeOffAngle = null;
    this.base.addFighter(this);
  }

  flyTo(base) {
    const dir = new Vector(
      this.base.pos.x - base.pos.x, 
      this.base.pos.y - base.pos.y
    );

    this.takeOffAngle = dir.angle();
    console.log(this.takeOffAngle);
  }

  update(deltaT) {
    if(this.state === FIGHTER_STATE.AT_BASE) {
      this.pos = this.velocity.computePos(this.base.pos, deltaT);
    } else {
      this.pos = this.velocity.computePos(this.pos, deltaT);
    }
    
    if(this.takeOffAngle) {
      const diff = angleDiff(this.takeOffAngle, this.velocity.angle);
      
      if(!this.diffWasNegative) {
        this.diffWasNegative = diff < 0;
      }

      if(this.diffWasNegative && diff >= 0) {
        this.velocity = new LinearVelocity(FIGHTER_SPEED, this.takeOffAngle);
        this.takeOffAngle = null;
        this.state = FIGHTER_STATE.ON_JOURNEY;
      }
    }  
  }

  render(ctx, deltaT) {
    this.update(deltaT);
    ctx.save();
    ctx.fillStyle = playerColors[this.player];
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 10, 0, 2 * Math.PI); 
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }
}

class AngularVelocity {
  constructor(radius, speed, startAngle) {
    this.radius = radius;
    this.speed = speed;
    this.angle = startAngle;
    console.log(this.angle);
  }

  computePos(origin, deltaT) {
    this.angle += (this.speed * deltaT / this.radius / 1000) % 360;
    return Vector.fromAngleAndLength(this.angle, this.radius).add(origin);
  }
}

class LinearVelocity {
  constructor(speed, angle) {
    this.speed = speed;
    this.angle = angle;
    this.dir = new Vector.fromAngleAndLength(angle, speed);
  }

  computePos(origin, deltaT) {
    return origin.add(this.dir.scale(deltaT/1000));
  }
}