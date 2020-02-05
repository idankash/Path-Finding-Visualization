import { Visualize } from './../Models/Visualize';
import { Stack } from 'stack-typescript';
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

export class DFSAlgorithm extends Algorithm{
    
    constructor(matrix: MatrixNode[][], visualize: Visualize){
        super(matrix, visualize);
    }

    //doesn't promise to find the shortest path
    //if ismovenode == true it means that we dont need to use the async function

    public DFSAlgo(ismovenode?: boolean){
        let h = this.matrix.length;
        let l = this.matrix[0].length;
        
        let node_list = new Array<MatrixNode>(); //all the nodes of the shortest path

        let visited = new Array<Array<boolean>>();

        //init visited
        for(let i: number = 0; i < h; i++) {
            let row = new Array<boolean>();
            for(let j: number = 0; j< l; j++) {
                row.push(false);
            }
            visited.push(row);
        }

        let string_stack = new Stack<string>();
        let end_node = this.findEndNode();
        let start_node = this.findStartNode();
        string_stack.push(start_node.row + "," + start_node.col);

        while(string_stack.size > 0){
            let x = string_stack.pop();
            let row = +x.split(',')[0]; // convert x.split(',')[0] to number using +
            let col = +x.split(',')[1]; // convert x.split(',')[1] to number using +

            if(row<0 || col<0 || row>=h || col>=l || visited[row][col] || this.matrix[row][col].state == state.wall)
                continue;

            if(row == end_node.row && col == end_node.col){
                this.reachedend = true;
                break;
        }
            
        visited[row][col]=true;
        if(row == start_node.row && col == start_node.col){
            this.matrix[row][col].state = state.start;
            this.matrix[row][col].value = 1;
        }
        else
            node_list.push(this.matrix[row][col]);

        string_stack.push(row + "," + (col-1)); //go left
        string_stack.push(row + "," + (col+1)); //go right
        string_stack.push((row-1) + "," + col); //go up
        string_stack.push((row+1) + "," + col); //go down
        
        }
                
        if(ismovenode == true){
            this.drawVisitedForMove(node_list);
            this.drawShortestPathForMove(node_list);
            this.visualize.canvisualize = true;
        }
        else
            Promise.all([this.drawVisited(node_list, 100), this.drawShortestPath(node_list, 100),this.switchButton(100)]);
       
    }

}

