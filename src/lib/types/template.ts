export interface MediaItem {
  src: string;
  alt: string;
}

export interface TemplateType {
  _id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  count?: number;
  date?: Date;
  tags?: string[];
  categories?: string[];
  attributes?: string[];
  gallery?: {
    primary?: MediaItem;
    secondary?: MediaItem;
    detail?: MediaItem;
    extra?: MediaItem;
  };
  metadata?: Record<string, any>;
  isActive?: boolean;
}
