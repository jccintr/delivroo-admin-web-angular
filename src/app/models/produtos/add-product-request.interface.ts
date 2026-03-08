export interface AddProductRequest {
    nome: string;
    descricao: string;
    preco: number;
    categoria_id: number;
    imagem: File | null;
}