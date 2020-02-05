import { AStart } from './../Algorithms/AStar';
import { Dijkstra } from './../Algorithms/Dijkstra';
import { Visualize } from './../Models/Visualize';
import { BFSAlgorithm } from './../Algorithms/BFS';
import { DFSAlgorithm } from './../Algorithms/DFS';
import { MatrixNode } from './../Models/MatrixNode';
import { Component, OnInit } from '@angular/core';

enum state{
  empty = 0,
  wall = 1,
  weight = 6,
  start = 2,
  end = 3,
  visited = 4,
  shortestpath = 5
}

enum algo{
  DFS = 0,
  BFS = 1,
  Dijkstra = 2,
  AStar = 3
}

@Component({
  selector: 'matrixgrid',
  templateUrl: './matrixgrid.component.html',
  styleUrls: ['./matrixgrid.component.css']
})
export class MatrixgridComponent implements OnInit {


  matrix: MatrixNode[][];
  isclicked: boolean; //for the walls
  isstartclick: boolean; //to move the start node
  isendclick: boolean; //to move the end node
  reachedend: boolean; //is start reached the end
  chosealgo: boolean; //for the drag algo run
  addweight: boolean; //for the add weight button
  algorithm: number;
  algorithmsnames: string[];
  visualize: Visualize; //click only once on the button


  constructor() {
    this.matrix = new Array<Array<MatrixNode>>();
    this.isclicked = false;
    this.reachedend = false;
    this.isstartclick = false;
    this.isendclick = false;
    this.chosealgo = false;
    this.addweight = false;
    this.algorithmsnames = ["DFS", "BFS", "Dijkstra", "AStar"];
    this.algorithm = algo.DFS;
    this.visualize = new Visualize();
    this.visualize.canvisualize = true;

    for(let i: number = 0; i < 30; i++) {
      let row = new Array<MatrixNode>();
      for(let j: number = 0; j< 63; j++) {
        row.push(new MatrixNode());
      }
      this.matrix.push(row);
    }
  }

  // function that initiate the matrix
  public addNode(i: number, j: number){   
    if(this.matrix[i][j].value == undefined){      
      this.matrix[i][j].row = i;
      this.matrix[i][j].col = j;
      this.matrix[i][j].value = 1;
      if(i == 14 && j == 17)//default start
        this.matrix[i][j].state = state.start;
      else if(i == 14 && j == 50)// default end 
        this.matrix[i][j].state = state.end;
      else
        this.matrix[i][j].state = state.empty;
    }
  }

  // function to create the grid and initiate the matrix
  public countAndCreate(num: number, i: number){
    for(let indx = 0; indx < num; indx++){
      this.addNode(i, indx);
    }

    return new Array(num);
  }

  // function to create the grid
  public count(num: number){
    return new Array(num);
  }

  // function that add wall when clicked of a cell
  public addWall(i: number, j: number){
    if(this.visualize.canvisualize==true){
      if(this.isclicked == true)
        if(this.matrix[i][j].state != state.start && this.matrix[i][j].state != state.end){
          if(this.addweight == false){
            if(this.matrix[i][j].state == state.weight){
              this.matrix[i][j].state = state.wall;
              this.matrix[i][j].value = 1;
            }
            else
              this.matrix[i][j].state = this.matrix[i][j].state == state.wall ? state.empty : state.wall;
          }
          else if(this.algorithm == algo.Dijkstra || this.algorithm == algo.AStar){
            this.matrix[i][j].state = this.matrix[i][j].state == state.weight ? state.empty : state.weight;
            this.matrix[i][j].value = this.matrix[i][j].value == 10 ? 1 : 10;
          }
        }
    }

            
  }

  // function that check if mouse down and if so add a wall
  public checkMouseDown(i: number, j: number){
    this.isclicked = true;
    let start = this.findStartNode();
    let end = this.findEndNode();

    if(i == start.row && j == start.col)
      this.isstartclick = true;
    
    if(i == end.row && j == end.col)
      this.isendclick = true;

    if(!this.isstartclick)
      this.addWall(i, j);
  }

  // when mouse is up change the state
  public checkMouseUp(){
    this.isclicked = false;
    this.isstartclick = false;
    this.isendclick = false;
  }

  // function that decide if we want to add a wall or move a node
  public addWallOrMoveNode(i: number, j: number){
    if(this.isstartclick == false && this.isendclick == false)
      this.addWall(i, j);
    else if(this.isstartclick == true)
      this.moveStartNode(i, j);
    else
      this.moveEndNode(i, j);
  }

  // function to move the start node
  public moveStartNode(i: number, j: number){
    if(this.visualize.canvisualize == true){
      let oldstart = this.findStartNode();
      oldstart.state = state.empty;
  
      if(this.matrix[i][j].state != state.wall && this.matrix[i][j].state != state.end  && this.matrix[i][j].state != state.weight && this.matrix[i][j].value != 10)
        this.matrix[i][j].state = state.start;
      else
        oldstart.state = state.start;
    }
    if(this.chosealgo == true){    
      this.startVisualize(this.visualize.canvisualize, true);
    }
  }

  // function to move the end node
  public moveEndNode(i: number, j: number){    
    if(this.visualize.canvisualize == true){
      let oldstart = this.findEndNode();
      oldstart.state = state.empty;

      if(this.matrix[i][j].state != state.wall && this.matrix[i][j].state != state.start && this.matrix[i][j].state != state.weight && this.matrix[i][j].value != 10)
        this.matrix[i][j].state = state.end;
      else
        oldstart.state = state.end;
    }
    if(this.chosealgo == true){    
      this.startVisualize(this.visualize.canvisualize, true);
    }
  }

  public clearBoard(){
    this.chosealgo = false;
    for(let i = 0; i < this.matrix.length; i++){
      for(let j = 0; j < this.matrix[i].length; j++){
        if(this.matrix[i][j].state != state.start && this.matrix[i][j].state != state.end)
          this.matrix[i][j].state = state.empty;
        if(this.matrix[i][j].value == 10)
          this.matrix[i][j].state = state.weight;
        if(this.matrix[i][j].state != state.weight)
          this.matrix[i][j].value =  1;
      }
    }
  }

  //calling the right algorithm
  public startVisualize(canvisualize: boolean, ismovenode?: boolean){ 
    this.chosealgo = true;
    if(canvisualize){
      this.visualize.canvisualize = false;    
      this.clearBoardForVisualize(true);
      switch(this.algorithm){
        case algo.DFS:
          this.DFSAlgo(ismovenode);
          break;
        case algo.BFS:
          this.BFSAlgo(ismovenode);
          break;
        case algo.Dijkstra:
          this.DijkstraAlgo(ismovenode);
          break;
        case algo.AStar:
          this.AStarAlgo(ismovenode);
          break;
      }
    }
  }

  // clear only the shortest path
  public clearBoardForVisualize(fromstartvis?:boolean){
    if(fromstartvis == true)
      this.chosealgo = true;
    else
      this.chosealgo = false;

    for(let i = 0; i < this.matrix.length; i++){
      for(let j = 0; j < this.matrix[i].length; j++){
        if(this.matrix[i][j].state == state.shortestpath || this.matrix[i][j].state == state.visited)
          this.matrix[i][j].state = state.empty;
        if(this.matrix[i][j].value == 10)
          this.matrix[i][j].state = state.weight;
      }
    }
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

  public addWeight(){
    this.addweight  = !this.addweight;
  }

  // update the selected algorithm
  public selected(selectedAlgo: string){
    switch(selectedAlgo){
      case "BFS":
        this.ClearWeight();
        this.algorithm = algo.BFS;
        break;
      case "DFS":
        this.ClearWeight();
        this.algorithm = algo.DFS;
        break;
      case "Dijkstra":
        this.algorithm = algo.Dijkstra;
        break;
      case "AStar":
        this.algorithm = algo.AStar;
        break;
    }
  }

  public ClearWeight(){
    for(let i: number = 0; i < this.matrix.length; i++) {
      for(let j: number = 0; j< this.matrix[0].length; j++) {
        if(this.matrix[i][j].state == state.weight)
          this.matrix[i][j].state = state.empty;
          this.matrix[i][j].value = 1;
      }
    }
  }

  public algorithmToString(){
    switch(this.algorithm){
      case algo.DFS:
        return "DFS";
      case algo.BFS:
        return "BFS";
      case algo.Dijkstra:
        return "Dijkstra";
      case algo.AStar:
        return "AStar";
    }
  }

  //ALGORITHMS
  //if ismovenode == true it means that we dont need to use the async function
  public DFSAlgo(ismovenode?: boolean){
    let dfsalgo = new DFSAlgorithm(this.matrix, this.visualize);
    dfsalgo.DFSAlgo(ismovenode);
  }

  //if ismovenode == true it means that we dont need to use the async function
  public BFSAlgo(ismovenode?: boolean){
    let bfsalgo = new BFSAlgorithm(this.matrix, this.visualize);
    bfsalgo.BFSAlgo(ismovenode);
  }

  //if ismovenode == true it means that we dont need to use the async function
  public DijkstraAlgo(ismovenode?: boolean){
    let DijkstraAlgo = new Dijkstra(this.matrix, this.visualize);
    DijkstraAlgo.DijkstraAlgo(ismovenode);
  }

  //if ismovenode == true it means that we dont need to use the async function
  public AStarAlgo(ismovenode?: boolean){
    let AStartAlgo = new AStart(this.matrix, this.visualize);
    AStartAlgo.AStartAlgo(ismovenode);
  }


  ngOnInit() {
  }

}
