
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
    <div className={`flex flex-col h-full ${className}`}>
      {title && (
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          {title}
        </h4>
      )}
      
      <div className="relative flex-grow bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden min-h-[300px] flex flex-col items-center justify-center group">
        {imageUrl ? (
          <>
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {/* Blurred Background for aspect ratio filling */}
                <div 
                    className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 scale-110" 
                    style={{ backgroundImage: `url(${imageUrl})` }}
                ></div>
                <img 
                  src={imageUrl} 
                  alt={altText} 
                  className="relative max-w-full max-h-[500px] w-auto h-auto object-contain z-10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" 
                />
            </div>
            
            {downloadFileName && (
               <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button 
                    onClick={handleDownload}
                    variant="secondary"
                    size="sm"
                    className="shadow-lg backdrop-blur-md bg-gray-900/80 border-gray-600"
                  >
                    <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Save
                  </Button>
               </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
             <div className="w-16 h-16 mb-4 rounded-full bg-gray-800 flex items-center justify-center text-gray-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             </div>
            <p className="text-gray-500 text-sm max-w-[200px] leading-relaxed">{placeholderText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;
