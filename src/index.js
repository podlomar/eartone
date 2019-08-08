import { Base, Fighter } from './objects.js';
import './index.scss';
import './index.html';

class Scene {
  constructor(canvas, bases) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d'); 
    this.bases = bases;
    this.selectedBase = null;
    this.prevStamp = 0;

    this.onResize();
    window.addEventListener('resize', this.onResize);
    this.canvas.addEventListener('click', this.onClick);
  }

  render = (stamp) => {
    const deltaT = stamp - this.prevStamp;
    this.prevStamp = stamp;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for(const base of this.bases) {
      base.render(this.ctx, deltaT);
    }
    window.requestAnimationFrame(this.render);
  }

  onResize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  baseAt(x, y) {
    for(const base of this.bases) {
      if(base.hitTest(x, y)) {
        return base;
      }
    }

    return null;
  }

  onClick = (event) => {
    const base = this.baseAt(event.clientX, event.clientY);

    if(this.selectedBase) {
      if(base) {
        if(this.selectedBase !== base) {
          this.selectedBase.sendFighterTo(base);
        }
      } else {
        this.selectedBase.unselect();
        this.selectedBase = null;
      }
    } else {
      this.selectedBase = base;
      this.selectedBase.select();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas');
  const scene = new Scene(canvas,
    [
      new Base(100, 100, 1),
      new Base(350, 350, 0)
    ]
  );

  new Fighter(scene.bases[0], 0);
  new Fighter(scene.bases[0], Math.PI);
  window.requestAnimationFrame(scene.render);

  document.addEventListener('keydown', () => {
    console.log('hello');
    const audio1 = new Audio('58-PedalOffMezzoForte1Close.mp3');
    const audio2 = new Audio('55-PedalOffMezzoForte1Close.mp3');

    audio2.play();
    setTimeout(() => {  
      audio1.play();
    }, 400);
    
  });
});



