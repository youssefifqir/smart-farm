// types.ts
export type Category = { id: number; nom: string };
export type Product  = { id: number; nom: string; quantite: number; prix: number; category?: Category };
export type Client   = { id: number; nom: string; adresse: string; telephone: string };
export type Supplier = { id: number; nom: string; adresse: string; telephone: string };

export type Achat = {
  id: number;
  quantite: number;
  prixTotal: number;
  dateAchat: string;          // ISO string
  produit: Product;
  fournisseur: Supplier;
};

export type Vente = {
  id: number;
  quantite: number;
  prixTotal: number;
  dateVente: string;          // ISO string
  produit: Product;
  client: Client;
};

export type Employe = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  poste: string;
  salaire: number;
};
