'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async (file: File, filename: string): Promise<string | null> => {
    setIsUploading(true);
    setProgress(0);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('filename', filename);
      const { data } = await api.post('/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
      return data.data?.url ?? null;
    } catch (err) {
      console.error('Upload error:', err);
      return null;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return { upload, isUploading, progress };
}
