export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      carts: {
        Row: {
          id: number;
          user_id: number;
          product_id: number;
          quantity: number;
        };
        Insert: {
          id?: never;
          user_id: number;
          product_id: number;
          quantity: number;
        };
        Update: {
          id?: never;
          user_id?: number;
          product_id?: number;
          quantity?: number;
        };
      };
    };
  };
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface Cart {
  id: number;
  quantity: number;
  products: Product;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}
