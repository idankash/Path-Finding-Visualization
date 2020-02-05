import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit {
  current_page: number;
  skip: boolean;
  nextorfinish: string;

  constructor() {
    this.current_page = 1;
    this.skip = false;
    this.nextorfinish = "Next"
  }

  public NextButton(){
    if(this.current_page == 8)
      this.skip = true;
    else{
      this.current_page = this.current_page + 1 > 8? this.current_page : this.current_page + 1;
      if(this.current_page == 8)
        this.nextorfinish = "Finish"
    }
  }

  public PrevButton(){
    this.current_page = this.current_page - 1 < 1? this.current_page : this.current_page - 1;
    if(this.current_page != 8)
      this.nextorfinish = "Next"
  }

  public SkipButton(){
    this.skip = true;
  }

  ngOnInit() {
  }

}
