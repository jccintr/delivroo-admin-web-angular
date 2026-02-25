import { ProdutosCategory } from "./produtos-category.interface";

export interface CategoryResponse {
  id: number;
  user_id: number;
  nome: string;
  position: number;
  produtos: ProdutosCategory[];
}