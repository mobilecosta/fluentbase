import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceberFormComponent } from './receber-form.component';

describe('ReceberFormComponent', () => {
  let component: ReceberFormComponent;
  let fixture: ComponentFixture<ReceberFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceberFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
