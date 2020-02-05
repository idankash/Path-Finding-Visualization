import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MatrixgridComponent } from './matrixgrid/matrixgrid.component';
import { TutorialComponent } from './tutorial/tutorial.component';


@NgModule({
  declarations: [
    AppComponent,
    MatrixgridComponent,
    TutorialComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
