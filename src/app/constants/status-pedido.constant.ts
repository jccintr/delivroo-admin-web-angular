// src/app/constants/status-pedido.constant.ts
export interface StatusPedido {
  id: number;
  descricao: string;
  descricao_curta: string;
  cor: string;
}

export const STATUS_PEDIDO: StatusPedido[] = [
  { id: 1, descricao: "Pedido Recebido",    descricao_curta: "Novo",           cor: "gold"    },
  { id: 2, descricao: "Pedido Entregue",    descricao_curta: "Entregue",       cor: "green"   },
  { id: 3, descricao: "Pedido Retirado",    descricao_curta: "Retirado",       cor: "green"   },
  { id: 4, descricao: "Pedido em Preparação", descricao_curta: "Em Preparação", cor: "orange"  },
  { id: 5, descricao: "Pedido saiu para entrega", descricao_curta: "A caminho",  cor: "orange"  },
  { id: 6, descricao: "Pedido Pronto",      descricao_curta: "Pronto",         cor: "orange"  },
  { id: 7, descricao: "Pedido Rejeitado",   descricao_curta: "Rejeitado",      cor: "red"     },
  { id: 8, descricao: "Pedido Cancelado",   descricao_curta: "Cancelado",      cor: "red"     },
  { id: 9, descricao: "Pedido Devolvido",   descricao_curta: "Devolvido",      cor: "red"     },
] as const;