import React from 'react';
import Button from './Button'; 

interface ImageDisplayProps {
  imageUrl?: string;
  altText: string;
  title?: string;
  className?: string;
  placeholderText?: string;
  downloadFileName?: string; 
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageUrl,
  altText,
  title,
  className = '',
  placeholderText = "이미지가 여기에 표시됩니다.",
  downloadFileName,
}) => {

  const handleDownload = () => {
    if (!imageUrl || !downloadFileName) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`bg-gray-800 p-4 rounded-lg shadow-xl ${className}`}>
      {title && <h4 className="text-lg font-semibold text-sky-300 mb-3 text-center">{title}</h4>}
      <div className="min-h-[200px] flex flex-col justify-center items-center">
        {imageUrl ? (
          <>
            <img 
              src={imageUrl} 
              alt={altText} 
              className="max-w-full max-h-[400px] h-auto object-contain rounded-md shadow-md" 
            />
            {downloadFileName && (
              <Button 
                onClick={handleDownload}
                variant="secondary"
                size="sm"
                className="mt-4"
              >
                이미지 다운로드
              </Button>
            )}
          </>
        ) : (
          <p className="text-gray-500 italic">{placeholderText}</p>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;