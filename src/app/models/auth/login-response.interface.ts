export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: number;
  push_token: string | null;
  slug: string;
  telefone: string;
  ativo: boolean;
  aberto: boolean;
  logotipo: string | null;
  logradouro: string;
  bairro: string;
  cidade_id: number;
  estado: string | null;
  chave_pix: string | null;
  favorecido_pix: string | null;
  cor_fundo: string | null;
  cor_texto: string | null;
  tempo_espera: string;
  opened_at: string | null;
  cidade: string;
  token: string;
}
