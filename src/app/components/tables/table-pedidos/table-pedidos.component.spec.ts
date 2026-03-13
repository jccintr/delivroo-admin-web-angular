import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePedidosComponent } from './table-pedidos.component';

describe('TablePedidosComponent', () => {
  let component: TablePedidosComponent;
  let fixture: ComponentFixture<TablePedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablePedidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablePedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
