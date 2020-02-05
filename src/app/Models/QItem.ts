import { MatrixNode } from './MatrixNode';
export class QItem{ //class for BFS
    row: number;
    col: number;
    dist: number;
    shortestpath: Array<MatrixNode>;
}