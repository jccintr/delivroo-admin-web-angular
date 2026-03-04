import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExtraComponent } from './modal-extra.component';

describe('ModalExtraComponent', () => {
  let component: ModalExtraComponent;
  let fixture: ComponentFixture<ModalExtraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalExtraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalExtraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
