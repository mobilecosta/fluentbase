import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { receberViewComponent } from './receber-view.component';

describe('receberViewComponent', () => {
  let component: receberViewComponent;
  let fixture: ComponentFixture<receberViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ receberViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(receberViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
