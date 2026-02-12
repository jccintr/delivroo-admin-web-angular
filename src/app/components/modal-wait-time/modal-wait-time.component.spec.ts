import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWaitTimeComponent } from './modal-wait-time.component';

describe('ModalWaitTimeComponent', () => {
  let component: ModalWaitTimeComponent;
  let fixture: ComponentFixture<ModalWaitTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalWaitTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalWaitTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
