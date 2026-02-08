
import React, { useRef } from 'react';

interface ImageUploaderProps {
  label: string;
  icon: string;
  image: string | null;
  onImageUpload: (dataUrl: string, name: string) => void;
  onRemove: () => void;
  description: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  label, 
  icon, 
  image, 
  onImageUpload, 
  onRemove,
  description
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{label}</label>
        {image && (
          <button 
            onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Change Image
          </button>
        )}
      </div>
      
      <div 
        onClick={!image ? handleClick : undefined}
        className={`relative flex-1 rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
          image 
            ? 'border-transparent shadow-sm' 
            : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer flex flex-col items-center justify-center p-6 text-center'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {image ? (
          <img src={image} alt={label} className="w-full h-full object-cover" />
        ) : (
          <>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
              <i className={`fas ${icon} text-xl`}></i>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">Click to upload</p>
            <p className="text-xs text-gray-500 max-w-[200px]">{description}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
