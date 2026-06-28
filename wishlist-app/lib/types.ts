export type Category = 
  | 'Ubranka'
  | 'Pielęgnacja'
  | 'Karmienie'
  | 'Sen'
  | 'Zabawki'
  | 'Wózek & Nosidło'
  | 'Bezpieczeństwo'
  | 'Inne';

export interface WishItem {
  id: string;
  name: string;
  description?: string;
  link?: string;
  image?: string;
  category?: Category;
  reserved: boolean;
  reservedBy?: string;
  reservedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemInput {
  name: string;
  description?: string;
  link?: string;
  image?: string;
  category?: Category;
}

export interface UpdateItemInput extends CreateItemInput {
  id: string;
}

export type ApiResponse<T> = {
  data?: T;
  error?: string;
};
