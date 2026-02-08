
export interface ImageData {
  base64: string;
  mimeType: string;
  name: string;
}

export interface GenerationResult {
  imageUrl: string;
  timestamp: number;
}
