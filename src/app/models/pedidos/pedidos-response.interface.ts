import { ItemPedido } from "./item-pedido.interface";
import { StatusPedidoLog } from "./status-pedido-log.interface";
import { StatusPedido } from "./stsatus-pedido.interface";

export interface PedidosResponse {

    id: number;
    token: string;
    user_id: number;
    delivery: boolean;
    nome: string;
    telefone: string;
    endereco: string | null;
    observacao: string | null;
    bairro: string | null;
    taxa_entrega: string;
    desconto: string;
    forma_pagamento: string;
    data: string;
    total: number;
    status_pedido_log: StatusPedidoLog[];
    status_pedido: StatusPedido;
    itens_pedido: ItemPedido[];

}