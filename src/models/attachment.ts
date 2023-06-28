export interface FileUpload {
    id?: number | string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    url?: string;
    file?: File;
    isNew?: boolean
  }