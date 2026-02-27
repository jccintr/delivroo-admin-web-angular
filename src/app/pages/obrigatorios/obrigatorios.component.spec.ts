import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObrigatoriosComponent } from './obrigatorios.component';

describe('ObrigatoriosComponent', () => {
  let component: ObrigatoriosComponent;
  let fixture: ComponentFixture<ObrigatoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObrigatoriosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObrigatoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
