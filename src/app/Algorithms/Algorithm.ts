import { Visualize } from './../Models/Visualize';
import { MatrixNode } from './../Models/MatrixNode';

enum state{
    empty = 0,
    wall = 1,
    start = 2,
    end = 3,
    visited = 4,
    shortestpath = 5
  }

export class Algorithm{
    public matrix: MatrixNode[][]; 
    public reachedend: boolean; //is start reached the end
    public visualize: Visualize; //click only once on the button

    constructor(matrix: MatrixNode[][], visualize: Visualize){
        this.matrix = matrix;
        this.reachedend = false;
        this.visualize = visualize;
    }

    // get the start node from the grid
    public findStartNode(){
        for(let i: number = 0; i < this.matrix.length; i++) {
        for(let j: number = 0; j< this.matrix[0].length; j++) {
            if(this.matrix[i][j].state == state.start)
            return this.matrix[i][j];
        }
        }
    }

    // get the end node from the grid
    public findEndNode(){
        for(let i: number = 0; i < this.matrix.length; i++) {
        for(let j: number = 0; j< this.matrix[0].length; j++) {
            if(this.matrix[i][j].state == state.end)
            return this.matrix[i][j];
        }
        }
    }

    // enable the visualize button
    async switchButton(numberofms: number){
        return setTimeout(()=>{this.visualize.canvisualize = true;}, numberofms);
    }

    // draw the visited nodes
    async drawVisited(node_list: Array<MatrixNode>, numberofms: number) {
        node_list.forEach(element => {
        setTimeout(()=>{
            this.matrix[element.row][element.col].state = state.visited;
        }, numberofms)
        });
    }

    //draw the shortest path
    async drawShortestPath(node_list: Array<MatrixNode>, numberofms: number) {
        if(this.reachedend)
        node_list.forEach(element => {
            setTimeout(()=>{
            this.matrix[element.row][element.col].state = state.shortestpath;
            }, numberofms)
        });
    }

    // draw the visited nodes
    drawVisitedForMove(node_list: Array<MatrixNode>) {
        node_list.forEach(element => {
            this.matrix[element.row][element.col].state = state.visited;
        });
    }

    //draw the shortest path
    drawShortestPathForMove(node_list: Array<MatrixNode>) {
        if(this.reachedend)
        node_list.forEach(element => {
            this.matrix[element.row][element.col].state = state.shortestpath;
        });
    }
}