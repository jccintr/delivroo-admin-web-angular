import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxasComponent } from './taxas.component';

describe('TaxasComponent', () => {
  let component: TaxasComponent;
  let fixture: ComponentFixture<TaxasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
