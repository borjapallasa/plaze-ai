
export interface CommunityImage {
  id: number;
  url: string;
  storage_path: string;
  is_primary: boolean;
  file_name: string;
  alt_text?: string;
  content_type?: string;
  size?: number;
  created_at?: string;
  community_uuid: string;
}
