import { Stack } from 'stack-typescript';
import { element } from 'protractor';
import { QItem } from './../Models/QItem';
import { Visualize } from './../Models/Visualize';
import { Algorithm } from './Algorithm';
import { MatrixNode } from '../Models/MatrixNode';

enum state{
    empty = 0,
    wall = 1,
    weight = 6,
    start = 2,
    end = 3,
    visited = 4,
    shortestpath = 5
  }

export class Dijkstra extends Algorithm{

    constructor(matrix: MatrixNode[][], visualize: Visualize){
        super(matrix, visualize);
    }

    //does promise to find the Minimum Cost Path
    //if ismovenode == true it means that we dont need to use the async function
    public DijkstraAlgo(ismovenode?: boolean){

        let node_list_shortest = new Array<MatrixNode>();
        let node_list_visited= new Array<MatrixNode>(); //all the nodes of the shortest path
        let startnode = this.findStartNode();

        let q = new Set<MatrixNode>();

        let dist = new Array<Array<number>>();
        let prev = new Array<Array<MatrixNode>>();

        //init visited
        for(let i: number = 0; i < this.matrix.length; i++) {
            let rowdist = new Array<number>();
            let rowprev = new Array<MatrixNode>();
            for(let j: number = 0; j< this.matrix[0].length; j++) {
                rowdist.push(Number.MAX_SAFE_INTEGER);
                rowprev.push(undefined);
            }
            dist.push(rowdist);
            prev.push(rowprev);
        }        

        q = this.CreateSet();
        q.add(this.matrix[startnode.row][startnode.col])
        

        // initialize distance of the startig node with its grid value 
        dist[startnode.row][startnode.col] = 0;        
        
        while(q.size > 0){

            //first element in the set
            let u = this.mindist(q, dist);
            
            
            q.delete(u);

            // moving up
            if(u.row - 1 >= 0 && this.matrix[u.row-1][u.col].state != state.wall && this.IsInSet(q, this.matrix[u.row-1][u.col])){  
                let alt = dist[u.row][u.col] + this.matrix[u.row-1][u.col].value;
                if(dist[u.row-1][u.col] > alt){
                    dist[u.row-1][u.col] = alt;
                    prev[u.row-1][u.col] = u;
                }
            }

            // moving down
            if(u.row + 1 < this.matrix.length && this.matrix[u.row+1][u.col].state != state.wall && this.IsInSet(q, this.matrix[u.row+1][u.col])){
                let alt = dist[u.row][u.col] + this.matrix[u.row+1][u.col].value;
                if(dist[u.row+1][u.col] > alt){
                    dist[u.row+1][u.col] = alt;
                    prev[u.row+1][u.col] = u;
                }   
            }

            // moving left
            if(u.col - 1 >= 0 && this.matrix[u.row][u.col-1].state != state.wall && this.IsInSet(q, this.matrix[u.row][u.col-1])){
                let alt = dist[u.row][u.col] + this.matrix[u.row][u.col-1].value;
                if(dist[u.row][u.col-1] > alt){
                    dist[u.row][u.col-1] = alt;
                    prev[u.row][u.col-1] = u;
                }
            }

            // moving right
            if(u.col + 1 < this.matrix[0].length && this.matrix[u.row][u.col+1].state != state.wall && this.IsInSet(q, this.matrix[u.row][u.col+1])){
                let alt = dist[u.row][u.col] + this.matrix[u.row][u.col+1].value;
                if(dist[u.row][u.col+1] > alt){
                    dist[u.row][u.col+1] = alt;
                    prev[u.row][u.col+1] = u;
                }
            }  
            
            if(this.matrix[u.row][u.col].state == state.end){ //reached the end
                this.reachedend = true;
                node_list_shortest = this.GetShortestPath(u, prev);
                break;
            }

            if(this.matrix[u.row][u.col].state != state.start){
                node_list_visited.push(this.matrix[u.row][u.col]); //add the current node to the list                
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

    public mindist(q: Set<MatrixNode>, dist: Array<Array<number>>){
        let min = <MatrixNode>q.values().next().value;

        q.forEach(element => {
            if(dist[min.row][min.col] > dist[element.row][element.col])
                min = element;
        });

        return min;
    }

    public IsInSet(q: Set<MatrixNode>, v: MatrixNode){
        let res = false;
        q.forEach(element => {
            if(v.col == element.col && v.row == element.row)
                res = true;
        });
        return res;
    }

    public GetShortestPath(u: MatrixNode, prev: MatrixNode[][]){
        let shortest = new Array<MatrixNode>();
        let parent = prev[u.row][u.col];        

        while(parent != this.findStartNode()){
            shortest.push(parent);
            if(parent != undefined)
                parent = prev[parent.row][parent.col];
        }

        return shortest.reverse();
    }

    public CreateSet(){
        let h = this.matrix.length;
        let l = this.matrix[0].length;
        
        let node_list = new Set<MatrixNode>(); //all the nodes of the shortest path

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
        let start_node = this.findStartNode();
        string_stack.push(start_node.row + "," + start_node.col);

        while(string_stack.size > 0){
            let x = string_stack.pop();
            let row = +x.split(',')[0]; // convert x.split(',')[0] to number using +
            let col = +x.split(',')[1]; // convert x.split(',')[1] to number using +

            if(row<0 || col<0 || row>=h || col>=l || visited[row][col] || this.matrix[row][col].state == state.wall)
                continue;
            
        visited[row][col]=true;
        if(row != start_node.row || col != start_node.col)
            node_list.add(this.matrix[row][col]);

        string_stack.push(row + "," + (col-1)); //go left
        string_stack.push(row + "," + (col+1)); //go right
        string_stack.push((row-1) + "," + col); //go up
        string_stack.push((row+1) + "," + col); //go down
        
        
        }

        return node_list;
    }

}