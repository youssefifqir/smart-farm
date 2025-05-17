// types.ts
export type Category = {
  id: number;
  nom: string;
};

export type Product = {
  id: number;
  nom: string;
  quantite: number;
  prix: number;
  category: Category;
};
export type Client = {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
};
export type Supplier = {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
};