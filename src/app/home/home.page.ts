import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent } from '@ionic/angular/standalone';

enum Direction {
  N = 'N',
  E = 'E',
  S = 'S',
  W = 'W',
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, FormsModule],
})
export class HomePage implements OnInit {
  x = 0;
  y = 0;
  position = { x: 0, y: 0 };
  directions = Object.values(Direction);
  possibleDirections: string[] = [];
  direction: Direction = Direction.N;
  rows = Array.from({ length: 8 });
  cols = Array.from({ length: 8 });
  isPlaced = false;
  isMoved2 = false;
  selectColor = 'white';
  logs: string[] = [];

  ngOnInit(): void {
    this.getPossibleDirections();
  }

  onPlacePawn() {
    if (!this.isPlaced) {
      if (!this.possibleDirections.includes(this.direction)) {
        return window.alert('Please select a valid Direction!!');
      }
      this.isPlaced = true;
      this.changePosition();
      this.logs.push(
        `PLACE ${this.x}, ${this.y}, ${
          this.direction
        }, ${this.selectColor.toUpperCase()}`
      );
    } else {
      this.resetGame();
    }
  }

  changePosition() {
    this.position = { x: this.x, y: this.y };
  }

  public get dirClass(): string {
    return `dir-${this.direction.toLowerCase()}`;
  }

  public get isXInValid(): boolean {
    return this.x === null;
  }
  public get isXOutOfRange(): boolean {
    return this.isOutOfRange(this.x);
  }
  public get isYInValid(): boolean {
    return this.y === null;
  }
  public get isYOutOfRange(): boolean {
    return this.isOutOfRange(this.y);
  }
  private isOutOfRange(
    value: number | null,
    min: number = 0,
    max: number = 7
  ): boolean {
    return value == null || value < min || value > max;
  }

  onMove(turn: 'Left' | 'Right') {
    this.isMoved2 = true;
    const index = this.directions.indexOf(this.direction);
    const dir =
      turn === 'Left'
        ? this.directions[(index + 3) % 4]
        : this.directions[(index + 1) % 4];

    if (this.possibleDirections.includes(dir)) {
      this.direction = dir;
      this.logs.push(turn.toUpperCase());
    } else {
      this.edgeAlert(
        `Pawn at edge!! Please use Move or ${
          turn === 'Left' ? 'Right' : 'Left'
        } action instead`
      );
    }
  }

  getPossibleDirections() {
    this.possibleDirections = [];
    if (this.x < 7) {
      this.possibleDirections.push('N');
    }
    if (this.x > 0) {
      this.possibleDirections.push('S');
    }
    if (this.y < 7) {
      this.possibleDirections.push('E');
    }
    if (this.y > 0) {
      this.possibleDirections.push('W');
    }
  }

  edgeAlert(msg: string) {
    window.alert(msg);
  }
  movePawn(steps: number) {
    const newX =
      this.direction === Direction.N
        ? this.x + steps
        : this.direction === Direction.S
        ? this.x - steps
        : this.x;
    const newY =
      this.direction === Direction.E
        ? this.y + steps
        : this.direction === Direction.W
        ? this.y - steps
        : this.y;


    if (this.isValidMove(newX, newY)) {
      this.x = newX;
      this.y = newY;
      this.changePosition();
      this.logs.push(steps === 1 ? 'MOVE' : 'MOVED2');
    } else {
      this.edgeAlert(
        'Pawn will go out!! Please change the direction and try Move action again'
      );
    }
    this.getPossibleDirections();
  }
  isValidMove(x: number, y: number): boolean {
    return x >= 0 && x <= 7 && y >= 0 && y <= 7;
  }
  report() {
    const msg = `${this.position.x},${
      this.position.y
    },${this.direction.toUpperCase()},${this.selectColor.toUpperCase()}`;
    this.edgeAlert(msg);
    this.logs.push(`REPORT ${msg}`);
  }

  resetGame() {
    const result = window.confirm(
      'This action will reset the pawn and logs, Are you sure want to continue?'
    );
    if (result) {
      this.x = 0;
      this.y = 0;
      this.position = { x: 0, y: 0 };
      this.isPlaced = false;
      this.isMoved2 = false;
      this.selectColor = 'white';
      this.getPossibleDirections();
      this.logs = [];
    }
  }
}
