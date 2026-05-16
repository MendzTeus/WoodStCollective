import React, { useRef, useState } from 'react';
import { ImagePlus, Loader2, Upload } from 'lucide-react';
import { uploadSiteImage } from '../../lib/storage';

type ImageUploadFieldProps = {
  label: string;
  value?: string;
  folder: string;
  previewAspect?: string;
  onChange: (url: string) => void;
};

export default function ImageUploadField({
  label,
  value,
  folder,
  previewAspect = 'aspect-video',
  onChange,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const url = await uploadSiteImage(file, folder);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className="w-full p-3 mb-4 bg-background-dark border border-divider-subtle rounded-lg hover:border-primary focus:border-primary focus:outline-none transition-colors text-text-primary text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </button>
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
          {error}
        </div>
      )}
      <div className={`relative ${previewAspect} rounded-xl overflow-hidden border border-divider-subtle bg-background-dark`}>
        {value ? (
          <img
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                className="w-full h-full object-cover" alt={label} src={value} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
            <ImagePlus size={32} className="mb-2 opacity-50" />
            <span className="text-xs uppercase tracking-wider">No Image Uploaded</span>
          </div>
        )}
      </div>
    </div>
  );
}
