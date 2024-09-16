import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenrerComponent } from './genrer.component';

describe('GenrerComponent', () => {
  let component: GenrerComponent;
  let fixture: ComponentFixture<GenrerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenrerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenrerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
