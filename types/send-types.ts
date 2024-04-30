export interface PayloadTypes {
  type: 'PlayerTap';
  i: number;
  j: number;
}

export interface PlayerDimensions {
  type: 'PlayerDimensions';
  player1: number[][];
  player2: number[][];
}

export type SendTypes = PayloadTypes | PlayerDimensions;
