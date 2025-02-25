
export interface ProductImage {
  id: number;
  url: string;
  storage_path: string;
  is_primary: boolean;
  file_name: string;
  alt_text?: string;
}
