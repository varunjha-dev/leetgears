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
          <div className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'} shadow-xl`}>
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-screen py-8 bg-base-200">
        <div className="container mx-auto px-4 max-w-3xl">
          
          {/* Header Section */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/admin/video')}
              className="flex items-center gap-2 mb-4 text-sm font-medium hover:text-green-500 transition-colors opacity-70"
            >
              <ArrowLeft size={16} />
              Back to Video Management
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center shadow-lg">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Upload Video</h1>
                <p className="opacity-70">Upload tutorial video for this problem</p>
              </div>
            </div>
          </div>

          {/* Upload Form Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Drag & Drop Area */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
                    dragActive
                      ? 'border-green-500 bg-green-50'
                      : errors.videoFile
                      ? 'border-error'
                      : 'border-base-300 hover:border-base-content/30'
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
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-base-200 flex items-center justify-center">
                      <Video className="w-8 h-8 opacity-70" />
                    </div>
                    
                    <p className="text-lg font-medium mb-2">
                      {dragActive ? 'Drop your video here' : 'Drop video here or click to browse'}
                    </p>
                    
                    <p className="text-sm opacity-70">
                      Supports MP4, MOV, AVI up to 100MB
                    </p>
                  </div>
                </div>

                {errors.videoFile && (
                  <div className="alert alert-error">
                    <AlertCircle size={16} />
                    <span>{errors.videoFile.message}</span>
                  </div>
                )}

                {/* Selected File Info */}
                {selectedFile && !uploading && (
                  <div className="rounded-lg p-4 bg-info/10 border border-info">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-info/20">
                        <FileVideo className="w-6 h-6 text-info" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{selectedFile.name}</p>
                        <p className="text-sm opacity-70">{formatFileSize(selectedFile.size)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploading && (
                  <div className="rounded-lg p-6 bg-base-200">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="font-medium">Uploading...</span>
                      <span className="font-bold text-success">{uploadProgress}%</span>
                    </div>
                    <progress 
                      className="progress progress-success w-full" 
                      value={uploadProgress} 
                      max="100"
                    ></progress>
                    <p className="text-xs mt-2 opacity-70">
                      Please don't close this page while uploading
                    </p>
                  </div>
                )}

                {/* Success Message */}
                {uploadedVideo && (
                  <div className="alert alert-success">
                    <CheckCircle className="w-5 h-5" />
                    <div>
                      <h3 className="font-bold">Upload Successful!</h3>
                      <div className="text-sm space-y-1 mt-1">
                        <p>Duration: {formatDuration(uploadedVideo.duration)}</p>
                        <p>Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/video')}
                    className="flex-1 btn btn-ghost"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="flex-1 btn btn-success gap-2"
                  >
                    {uploading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
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
          <div className="mt-6 rounded-lg p-6 bg-info/10 border border-info/30">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <AlertCircle size={18} className="text-info" />
              Upload Guidelines
            </h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li className="flex items-start gap-2">
                <span className="text-info mt-0.5">•</span>
                <span>Maximum file size: 100MB</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-info mt-0.5">•</span>
                <span>Supported formats: MP4, MOV, AVI</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-info mt-0.5">•</span>
                <span>Ensure good audio quality and clear screen recording</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-info mt-0.5">•</span>
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