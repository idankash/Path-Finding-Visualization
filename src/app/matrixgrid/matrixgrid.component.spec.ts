import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixgridComponent } from './matrixgrid.component';

describe('MatrixgridComponent', () => {
  let component: MatrixgridComponent;
  let fixture: ComponentFixture<MatrixgridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrixgridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
