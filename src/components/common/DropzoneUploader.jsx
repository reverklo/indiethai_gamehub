/**
 * DropzoneUploader.jsx
 * คอมโพเนนต์อัปโหลดไฟล์แบบลากวาง (Drag-and-Drop Cloud Uploader)
 * - ออกแบบตามหลัก Apple & Unslop: พื้นหลังเรียบ ลายเส้นบาง สปริงแอนิเมชัน
 * - รองรับทั้งไฟล์บิลด์เกม (.zip, .rar, .7z, .exe) และรูปภาพ (.png, .jpg, .webp)
 * - แสดงแถบเปอร์เซ็นต์ความคืบหน้า (Progress Bar) ขณะกำลังอัปโหลดขึ้น Cloud Storage
 * - มีพรีวิวรูปภาพทันที และปุ่มนำไฟล์ออก / เลือกใหม่
 */

import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileArchive, 
  Image as ImageIcon, 
  CheckCircle2, 
  X, 
  Loader2, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { formatBytes } from '../../services/storageService';

export const DropzoneUploader = ({
  label = 'ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์',
  sublabel = 'รองรับไฟล์ .zip, .rar ขนาดสูงสุด 500 MB',
  accept = '.zip,.rar,.7z,.exe',
  type = 'archive', // 'archive' | 'image'
  currentUrl = null,
  onUploadComplete,
  uploadFn,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileProcess = async (file) => {
    if (!file) return;
    setErrorMessage(null);
    setIsUploading(true);
    setUploadPercent(5);

    try {
      const result = await uploadFn(file, (progress) => {
        if (typeof progress === 'function') {
          setUploadPercent((prev) => {
            const next = progress({ percent: prev });
            return next.percent;
          });
        } else if (progress && progress.percent) {
          setUploadPercent(progress.percent);
        }
      });

      setUploadedFile({
        name: file.name,
        size: formatBytes(file.size),
        url: result.url,
        isImage: file.type.startsWith('image/') || type === 'image'
      });
      setUploadPercent(100);
      setIsUploading(false);

      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (err) {
      console.error('File upload failed:', err);
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์');
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleManualSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
    setUploadPercent(0);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onUploadComplete) {
      onUploadComplete({ url: '', fileName: '', fileSize: 0 });
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleManualSelect}
        className="hidden"
      />

      {/* Main Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-indigo-400 bg-indigo-500/10 scale-[1.008]'
            : uploadedFile || currentUrl
            ? 'border-emerald-500/40 bg-[#162032]'
            : 'border-white/[0.12] hover:border-white/30 bg-[#0f172a]/70 hover:bg-[#131d35]'
        }`}
      >
        {isUploading ? (
          <div className="py-4 space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">กำลังอัปโหลดไฟล์ขึ้นระบบ Cloud...</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{uploadPercent}% เรียบร้อย</p>
            </div>
            {/* Progress bar */}
            <div className="w-full max-w-xs mx-auto h-2 bg-gray-800 rounded-full overflow-hidden border border-white/[0.08]">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${uploadPercent}%` }}
              />
            </div>
          </div>
        ) : uploadedFile ? (
          <div className="flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                {uploadedFile.isImage ? (
                  <ImageIcon className="w-5 h-5 text-emerald-400" />
                ) : (
                  <FileCheck className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-white truncate">{uploadedFile.name}</p>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-mono">
                    พร้อมใช้งาน
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                  ขนาดไฟล์: {uploadedFile.size}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0"
              title="ลบและเลือกไฟล์ใหม่"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : currentUrl && type === 'image' ? (
          <div className="flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3 min-w-0">
              <img 
                src={currentUrl} 
                alt="Preview" 
                className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">ไฟล์รูปภาพปัจจุบัน</p>
                <p className="text-[10px] text-gray-400 truncate mt-0.5">คลิกเพื่อเปลี่ยนรูปใหม่</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="py-3 space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-300 group-hover:text-indigo-400 transition">
              {type === 'image' ? (
                <ImageIcon className="w-5 h-5" />
              ) : (
                <UploadCloud className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-200">{label}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{sublabel}</p>
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 text-[11px] text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
