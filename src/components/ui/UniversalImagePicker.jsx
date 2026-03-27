import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, Cloud, X, Check, RefreshCw, Loader2 } from 'lucide-react';
import { useImagePicker } from '../../hooks/useImagePicker';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * UniversalImagePicker Component
 * A reusable component that provides a button/trigger and a menu for picking images.
 * Supports: Camera, Gallery, and Google Drive.
 */
export function UniversalImagePicker({ 
  onImageSelect, 
  currentImage = null, 
  shape = 'circle', // 'circle' or 'square'
  label = 'Add Photo',
  className = "",
  children
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const { 
    selectedImage, 
    isPickerLoading,
    openGallery, 
    openCamera, 
    openDrive,
    resetImage 
  } = useImagePicker((img) => {
    onImageSelect(img);
    setIsMenuOpen(false);
  });

  const displayImage = selectedImage || currentImage;

  // --- CAMERA LOGIC ---
  const startCamera = async () => {
    const s = await openCamera();
    if (s) {
      setStream(s);
      setIsCameraOpen(true);
      setIsMenuOpen(false);
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsCameraOpen(false);
  };

  useEffect(() => {
    if (isCameraOpen && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOpen, stream]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const base64 = canvasRef.current.toDataURL('image/png');
      onImageSelect(base64);
      closeCamera();
    }
  };

  const handleDrive = () => {
    openDrive();
  };

  const handleGallery = () => {
    openGallery();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      {children ? (
        <div onClick={() => setIsMenuOpen(true)} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <button 
          type="button" 
          onClick={() => setIsMenuOpen(true)}
          className={`group relative overflow-hidden transition-all duration-300 border-2 border-dashed border-slate-300 hover:border-[var(--color-primary)] hover:bg-slate-50 shadow-sm
            ${shape === 'circle' ? 'rounded-full w-24 h-24' : 'rounded-2xl w-full h-40'}
            ${displayImage ? 'border-solid border-[var(--color-primary)]/30' : ''}
          `}
        >
          {displayImage ? (
            <>
              <img src={displayImage} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-[var(--color-primary)]">
              <ImageIcon className="w-8 h-8 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
            </div>
          )}
          
          {isPickerLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-[var(--color-primary)] animate-spin" />
            </div>
          )}
        </button>
      )}

      {/* Selection Menu Backdrop (Centered Modal) */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-md" 
              onClick={() => setIsMenuOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-[110] w-full max-w-sm bg-white/95 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Select Image Source</h3>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="p-4 flex flex-col gap-2">
                <button onClick={startCamera} className="w-full p-4 rounded-2xl hover:bg-blue-50 text-left flex items-center gap-4 transition-all group border border-transparent hover:border-blue-100">
                  <div className="bg-blue-100 p-3 rounded-xl group-hover:scale-110 transition-transform"><Camera className="w-6 h-6 text-blue-600" /></div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">Take Photo</span>
                    <span className="text-xs text-slate-500 font-medium tracking-tight">Use your device camera</span>
                  </div>
                </button>
                
                <button onClick={handleGallery} className="w-full p-4 rounded-2xl hover:bg-purple-50 text-left flex items-center gap-4 transition-all group border border-transparent hover:border-purple-100">
                  <div className="bg-purple-100 p-3 rounded-xl group-hover:scale-110 transition-transform"><ImageIcon className="w-6 h-6 text-purple-600" /></div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">Photo Gallery</span>
                    <span className="text-xs text-slate-500 font-medium tracking-tight">Upload from your device</span>
                  </div>
                </button>
                
                <button onClick={handleDrive} className="w-full p-4 rounded-2xl hover:bg-amber-50 text-left flex items-center gap-4 transition-all group border border-transparent hover:border-amber-100">
                  <div className="bg-amber-100 p-3 rounded-xl group-hover:scale-110 transition-transform"><Cloud className="w-6 h-6 text-amber-600" /></div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">Google Drive</span>
                    <span className="text-xs text-slate-500 font-medium tracking-tight">Select from cloud storage</span>
                  </div>
                </button>
              </div>

              <div className="p-4 bg-slate-50/50 flex justify-center">
                <button onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors py-1">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Camera Modal */}
      <AnimatePresence>
        {isCameraOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={closeCamera} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-black rounded-[2.5rem] overflow-hidden w-full max-w-lg aspect-video shadow-2xl border border-white/10"
            >
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute inset-x-0 bottom-0 p-8 flex items-center justify-center gap-6 bg-gradient-to-t from-black/80 to-transparent">
                <button onClick={closeCamera} className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all">
                  <X className="w-6 h-6 text-white" />
                </button>
                <button onClick={capturePhoto} className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl active:scale-90 transition-all border-4 border-white/30">
                  <div className="w-16 h-16 rounded-full border-2 border-black/10" />
                </button>
                <button className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all opacity-40">
                  <RefreshCw className="w-6 h-6 text-white" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
