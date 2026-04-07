import { TemplateType } from '#@/lib/types/template';

export interface Product extends Partial<TemplateType> {
  id      : string;
  price   : number;
  category: string;
  image?  : string;
  stock   : number;
}

export const products: Product[] = [
  {
    id         : '1',
    title      : 'Manzanilla',
    price      : 15.99,
    category   : 'plants',
    image      : 'https://images.unsplash.com/photo-1594911771122-38372074ba5e?q=80&w=400&h=400&auto=format&fit=crop',
    stock      : 10,
    description: 'Perfect for calming tea.',
  },
  {
    id         : '2',
    title      : 'Aceite de Calendula',
    price      : 24.50,
    category   : 'remedios',
    image      : 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400&h=400&auto=format&fit=crop',
    stock      : 5,
    description: 'Natural healing for skin.',
  },
  {
    id         : '3',
    title      : 'Aloe Vera',
    price      : 12.00,
    category   : 'plants',
    image      : 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=400&h=400&auto=format&fit=crop',
    stock      : 15,
    description: 'Fresh succulent with multiple benefits.',
  },
  {
    id         : '4',
    title      : 'Jarabe de Eucalipto',
    price      : 18.00,
    category   : 'remedios',
    image      : 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=400&h=400&auto=format&fit=crop',
    stock      : 8,
    description: 'Respiratory support formula.',
  },
  {
    id         : '5',
    title      : 'Lavanda',
    price      : 14.50,
    category   : 'plants',
    image      : 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=400&h=400&auto=format&fit=crop',
    stock      : 12,
    description: 'Aromatic and relaxing plant.',
  },
  {
    id         : '6',
    title      : 'Tinte de Valeriana',
    price      : 22.00,
    category   : 'remedios',
    image      : 'https://images.unsplash.com/photo-1628191010210-a59de33e5941?q=80&w=400&h=400&auto=format&fit=crop',
    stock      : 6,
    description: 'Natural sleep aid.',
  },
];
