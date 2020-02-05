import { element } from 'protractor';
import { AStarNode } from './../Models/AStarNode';
import { MatrixNode } from './../Models/MatrixNode';
import { Algorithm } from './Algorithm';
import { Visualize } from '../Models/Visualize';
import { LOADIPHLPAPI } from 'dns';

enum state{
    empty = 0,
    wall = 1,
    weight = 6,
    start = 2,
    end = 3,
    visited = 4,
    shortestpath = 5
  }

export class AStart extends Algorithm{

    constructor(matrix: MatrixNode[][], visualize: Visualize){
        super(matrix, visualize);
    }

    public AStartAlgo(ismovenode?: boolean){        
        let node_list_shortest = new Array<MatrixNode>();
        let node_list_visited= new Array<MatrixNode>(); //all the nodes of the shortest path

        let start_node = new AStarNode(undefined, this.findStartNode());

        let yet_to_visit_list = new Array<AStarNode>();
        let visited_list = new Array<AStarNode>();

        yet_to_visit_list.push(start_node);

        let move_row = [-1, 0, 1, 0];
        let move_col = [0, -1, 0, 1];

        let no_rows = this.matrix.length;
        let no_cols = this.matrix[0].length;

        while(yet_to_visit_list.length > 0){
            let current_node = yet_to_visit_list[0];
            let current_index = 0;

            for(let i = 0; i < yet_to_visit_list.length; i++){
                if(yet_to_visit_list[i].f < current_node.f){
                    current_node = yet_to_visit_list[i];
                    current_index = i;
                }
            }

            yet_to_visit_list.splice(current_index, 1);
            visited_list.push(current_node);

            //reached the end
            if(current_node.node.state == state.end){
                this.reachedend = true;
                node_list_shortest = this.GetShortestPath(current_node);
                break;
            }

            let children = Array<AStarNode>();

            for(let i = 0; i < 4; i++){
                let node_row = current_node.node.row + move_row[i];
                let node_col = current_node.node.col + move_col[i];

                //checking boundaries
                if(node_row > (no_rows - 1) || node_row < 0 || node_col > (no_cols - 1) || node_col < 0)
                    continue;
                if(this.matrix[node_row][node_col].state == state.wall)
                    continue;
                
                let new_node = new AStarNode(current_node, this.matrix[node_row][node_col]);

                children.push(new_node);
            }

            for(let i = 0; i < children.length; i++){
                if(this.IsInList(visited_list, children[i]))
                    continue;

                children[i].g = current_node.g + children[i].node.value;
                children[i].h = this.ManhattanDistance(children[i].node);
                children[i].f = children[i].g + children[i].h;

                if(this.IsInList(yet_to_visit_list, children[i]))
                    continue;

                    
                yet_to_visit_list.push(children[i]);
            }
        }

        visited_list.forEach(element => {
            if(element.node.state != state.start && element.node.state != state.end)
                node_list_visited.push(element.node);
        });
        
        if(ismovenode == true){
            this.drawVisitedForMove(node_list_visited);
            this.drawShortestPathForMove(node_list_shortest);
            this.visualize.canvisualize = true;
        }     
        else
            Promise.all([this.drawVisited(node_list_visited, 100), this.drawShortestPath(node_list_shortest, 100),this.switchButton(100)]);
    }

    public ManhattanDistance(current_node: MatrixNode){
        let end_node = this.findEndNode();
        return Math.abs(current_node.col - end_node.col) + Math.abs(current_node.row - end_node.row);
    }

    public IsInList(list: Array<AStarNode>, node: AStarNode){
        let res = false;
 
        list.forEach(element => {
            if(element.node.col == node.node.col && element.node.row == node.node.row)
                res = true;
        });
        return res;
    }

    public GetShortestPath(node: AStarNode){
        let shortest = new Array<MatrixNode>();
        let parent = node.parent;        

        while(parent.node != this.findStartNode()){
            shortest.push(parent.node);
            if(parent != undefined)
                parent = parent.parent;
        }

        return shortest.reverse();
    }

}