import { Visualize } from './../Models/Visualize';
import { Queue } from 'queue-typescript';
import { QItem } from './../Models/QItem';
import { MatrixNode } from './../Models/MatrixNode';
import { Algorithm } from './Algorithm';

enum state{
    empty = 0,
    wall = 1,
    start = 2,
    end = 3,
    visited = 4,
    shortestpath = 5
  }

export class BFSAlgorithm extends Algorithm{

    constructor(matrix: MatrixNode[][], visualize: Visualize){
        super(matrix, visualize);
    }

    //does promise to find the shortest path
    //if ismovenode == true it means that we dont need to use the async function
  public BFSAlgo(ismovenode?: boolean){

    this.matrix[1][1].value;

    let node_list_shortest = new Array<MatrixNode>();
    let node_list_visited= new Array<MatrixNode>(); //all the nodes of the shortest path
    let source = new QItem();
    source.row = this.findStartNode().row;
    source.col = this.findStartNode().col;
    source.dist = 0;
    source.shortestpath = new Array<MatrixNode>();

    let visited = new Array<Array<boolean>>();

    //init visited
    for(let i: number = 0; i < this.matrix.length; i++) {
      let row = new Array<boolean>();
      for(let j: number = 0; j< this.matrix[0].length; j++) {
        if(this.matrix[i][j].state == state.wall)
          row.push(true);
        else
          row.push(false);
      }
      visited.push(row);
    }

    let q = new Queue<QItem>();
    q.enqueue(source);
    visited[source.row][source.col] = true;

    while(q.length > 0){
      let p = q.dequeue();

      if(this.matrix[p.row][p.col].state == state.end){ //reached the end
        this.reachedend = true;
        node_list_shortest = p.shortestpath.slice(0, p.shortestpath.length - 1);
        break;
      }

      if(this.matrix[p.row][p.col].state != state.start && this.matrix[p.row][p.col].state != state.end)
        node_list_visited.push(this.matrix[p.row][p.col]); //add the current node to the list

      // moving up
      if(p.row - 1 >= 0 && visited[p.row - 1][p.col] == false){
        let current = new QItem();
        current.row = p.row - 1;
        current.col = p.col;
        current.dist = p.dist + 1;
        current.shortestpath = new Array<MatrixNode>();
        current.shortestpath = current.shortestpath.concat(p.shortestpath,[this.matrix[p.row - 1][p.col]])
        q.enqueue(current);
        visited[p.row - 1][p.col] = true;
      }

      // moving down
      if(p.row + 1 < visited.length && visited[p.row + 1][p.col] == false){
        let current = new QItem();
        current.row = p.row + 1;
        current.col = p.col;
        current.dist = p.dist + 1;
        current.shortestpath = new Array<MatrixNode>();
        current.shortestpath = current.shortestpath.concat(p.shortestpath,[this.matrix[p.row + 1][p.col]])
        q.enqueue(current);
        visited[p.row + 1][p.col] = true;
      }

      // moving left
      if(p.col - 1 >= 0 && visited[p.row][p.col - 1] == false){
        let current = new QItem();
        current.row = p.row;
        current.col = p.col - 1;
        current.dist = p.dist + 1;
        current.shortestpath = new Array<MatrixNode>();
        current.shortestpath = current.shortestpath.concat(p.shortestpath,[this.matrix[p.row][p.col - 1]])
        q.enqueue(current);
        visited[p.row][p.col - 1] = true;
      }

      // moving right
      if(p.col + 1 < visited[0].length && visited[p.row][p.col + 1] == false){
        let current = new QItem();
        current.row = p.row;
        current.col = p.col + 1;
        current.dist = p.dist + 1;
        current.shortestpath = new Array<MatrixNode>();
        current.shortestpath = current.shortestpath.concat(p.shortestpath,[this.matrix[p.row][p.col + 1]])
        q.enqueue(current);
        visited[p.row][p.col + 1] = true;
      }
    }

    if(ismovenode == true){
        this.drawVisitedForMove(node_list_visited);
        this.drawShortestPathForMove(node_list_shortest);
        this.visualize.canvisualize = true;
      }    
      else
        Promise.all([this.drawVisited(node_list_visited, 100), this.drawShortestPath(node_list_shortest, 100),this.switchButton(100)]);
  }

}