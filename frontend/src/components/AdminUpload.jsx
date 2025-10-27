import { useParams, useNavigate } from 'react-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient';
import AdminNavbar from './AdminNavbar';
import { Upload, CheckCircle, AlertCircle, Video, ArrowLeft, FileVideo } from 'lucide-react';

function AdminUpload() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [toast, setToast] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode === 'dark';
  });
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    setValue
  } = useForm();

  const selectedFile = watch('videoFile')?.[0];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setValue('videoFile', e.dataTransfer.files);
      } else {
        showToast('Please drop a valid video file', 'error');
      }
    }
  };

  // Upload video to Cloudinary
  const onSubmit = async (data) => {
    const file = data.videoFile[0];
    
    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      // Step 1: Get upload signature from backend
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;

      // Step 2: Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);

      // Step 3: Upload directly to Cloudinary
      const uploadResponse = await axios.post(upload_url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      // Step 4: Save video metadata to backend
      const metadataResponse = await axiosClient.post('/video/save', {
        problemId: problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      showToast('Video uploaded successfully!', 'success');
      reset(); // Reset form after successful upload
      
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.message || 'Upload failed. Please try again.';
      setError('root', {
        type: 'manual',
        message: errorMessage
      });
      showToast(errorMessage, 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <AdminNavbar />
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top">
          <div className={`px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 min-w-[320px] ${
            toast.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-[#282828]' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 max-w-3xl">
          
          {/* Header Section */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/admin/video')}
              className={`flex items-center gap-2 mb-4 text-sm font-medium hover:text-green-500 transition-colors ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <ArrowLeft size={16} />
              Back to Video Management
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center shadow-lg">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Upload Video
                </h1>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Upload tutorial video for this problem
                </p>
              </div>
            </div>
          </div>

          {/* Upload Form Card */}
          <div className={`card shadow-xl rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="card-body p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Drag & Drop Area */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
                    dragActive
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : errors.videoFile
                      ? 'border-red-300 dark:border-red-700'
                      : isDarkMode
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="video/*"
                    {...register('videoFile', {
                      required: 'Please select a video file',
                      validate: {
                        isVideo: (files) => {
                          if (!files || !files[0]) return 'Please select a video file';
                          const file = files[0];
                          return file.type.startsWith('video/') || 'Please select a valid video file';
                        },
                        fileSize: (files) => {
                          if (!files || !files[0]) return true;
                          const file = files[0];
                          const maxSize = 100 * 1024 * 1024; // 100MB
                          return file.size <= maxSize || 'File size must be less than 100MB';
                        }
                      }
                    })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <Video className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    
                    <p className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {dragActive ? 'Drop your video here' : 'Drop video here or click to browse'}
                    </p>
                    
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Supports MP4, MOV, AVI up to 100MB
                    </p>
                  </div>
                </div>

                {errors.videoFile && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    <span>{errors.videoFile.message}</span>
                  </div>
                )}

                {/* Selected File Info */}
                {selectedFile && !uploading && (
                  <div className={`rounded-lg p-4 border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${
                        isDarkMode ? 'bg-gray-600' : 'bg-blue-100'
                      }`}>
                        <FileVideo className={`w-6 h-6 ${
                          isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedFile.name}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploading && (
                  <div className={`rounded-lg p-6 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div className="flex justify-between text-sm mb-3">
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Uploading...
                      </span>
                      <span className={`font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {uploadProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Please don't close this page while uploading
                    </p>
                  </div>
                )}

                {/* Success Message */}
                {uploadedVideo && (
                  <div className="rounded-lg p-6 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-500 rounded-full">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-green-800 dark:text-green-300 mb-2">
                          Upload Successful!
                        </h3>
                        <div className="space-y-1 text-sm text-green-700 dark:text-green-400">
                          <p>Duration: {formatDuration(uploadedVideo.duration)}</p>
                          <p>Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/video')}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={20} />
                        Upload Video
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Info Card */}
          <div className={`mt-6 rounded-lg p-6 border ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <h3 className={`font-bold mb-3 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <AlertCircle size={18} className="text-blue-500" />
              Upload Guidelines
            </h3>
            <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Maximum file size: 100MB</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Supported formats: MP4, MOV, AVI</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Ensure good audio quality and clear screen recording</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Videos are automatically optimized for streaming</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminUpload;
