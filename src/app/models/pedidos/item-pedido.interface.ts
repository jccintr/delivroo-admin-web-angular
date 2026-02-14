export interface ItemPedido {
    id: number;
    quantidade: number;
    total: string;
    obrigatorios: string[];
    adicionais: string[];
    observacao: string | null;
    produto: any;
}
