import { StatusPedido } from "./stsatus-pedido.interface";

export interface StatusPedidoLog {
    id: number;
    pedido_id: number;
    status_pedido_id: number;
    motivo: string | null;
    data: string;
    status_pedido: StatusPedido;
}