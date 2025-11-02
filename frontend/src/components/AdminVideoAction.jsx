import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axiosClient from '../utils/axiosClient';
import { 
  Upload, 
  Trash2, 
  Video, 
  ArrowLeft, 
  PlayCircle, 
  FileVideo, 
  CheckCircle,
  AlertCircle,
  Clock,
  Zap
} from 'lucide-react';


const AdminVideoAction = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);


  useEffect(() => {
    fetchProblem();
  }, [problemId]);


  const fetchProblem = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/problem/problemById/${problemId}`);
      setProblem(data);
    } catch (err) {
      showToast('Failed to fetch problem info', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };


  const handleUpload = () => {
    navigate(`/admin/upload/${problemId}`);
  };


  const handleDelete = async () => {
    try {
      await axiosClient.delete(`/video/delete/${problemId}`);
      showToast('Video deleted successfully', 'success');
      setDeleteModalOpen(false);
      fetchProblem();
    } catch (err) {
      showToast('Failed to delete video', 'error');
      console.error(err);
    }
  };


  const getDifficultyBadgeStyle = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'badge-success';
      case 'medium':
        return 'badge-warning';
      case 'hard':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };


  if (loading || !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mx-auto"></div>
          <p className="font-medium text-sm">Loading problem info...</p>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-base-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-16 right-4 z-50 animate-in slide-in-from-top">
          <div className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg py-2`}>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}


      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-lg text-center mb-2">Delete Video?</h3>
            <p className="text-center text-sm opacity-70 mb-4">
              Are you sure you want to permanently delete the video for "{problem.title}"?
            </p>
            <div className="modal-action mt-4">
              <button onClick={() => setDeleteModalOpen(false)} className="btn btn-sm btn-ghost">
                Cancel
              </button>
              <button onClick={handleDelete} className="btn btn-sm btn-error">
                Delete Video
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/video')}
          className="flex items-center gap-1 mb-3 text-xs font-medium hover:text-green-500 transition-colors opacity-70"
        >
          <ArrowLeft size={14} />
          Back to Video Management
        </button>


        {/* Header Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center shadow-lg">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Video Management</h1>
              <p className="text-xs opacity-70">Manage video content for your problem</p>
            </div>
          </div>
        </div>


        {/* Merged Problem Info Card with Stats */}
        <div className="card bg-base-100 shadow-lg mb-4">
          <div className="card-body p-4">
            {/* Top Section: Title, Tags, and Status Badge */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="text-lg font-bold mb-2">{problem.title}</h2>
                <div className="flex flex-wrap gap-1.5">
                  <div className={`badge badge-sm ${getDifficultyBadgeStyle(problem.difficulty)}`}>
                    {problem.difficulty}
                  </div>
                  {problem.tags && (
                    <div className="badge badge-sm badge-info badge-outline">
                      {problem.tags}
                    </div>
                  )}
                </div>
              </div>
              {problem.secureUrl ? (
                <div className="badge badge-success gap-1.5 py-3 px-3">
                  <CheckCircle size={14} />
                  <span className="text-xs">Available</span>
                </div>
              ) : (
                <div className="badge badge-warning gap-1.5 py-3 px-3">
                  <AlertCircle size={14} />
                  <span className="text-xs">No Video</span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="divider my-1"></div>

            {/* Bottom Section: Inline Stats */}
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <FileVideo size={16} className="text-info" />
                <div>
                  <span className="opacity-70">Format:</span>
                  <span className="font-semibold ml-1">MP4/MOV</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-success" />
                <div>
                  <span className="opacity-70">Max:</span>
                  <span className="font-semibold ml-1">100 MB</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Zap size={16} className="text-warning" />
                <div>
                  <span className="opacity-70">Status:</span>
                  <span className="font-semibold ml-1">
                    {problem.secureUrl ? 'Active' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Main Action Section */}
        {problem.secureUrl ? (
          /* Video Exists - Show Delete Option */
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-4">
              <div className="flex flex-col items-center text-center py-4">
                <div className="bg-success/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <PlayCircle size={32} className="text-success" />
                </div>
                <h3 className="text-lg font-bold mb-1">Video Uploaded Successfully!</h3>
                <p className="text-xs opacity-70 mb-4 max-w-md">
                  A tutorial video is available. Students can now watch the solution explanation.
                </p>


                <div className="w-full max-w-md mb-4">
                  <div className="bg-base-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">Video URL:</span>
                      <span className="badge badge-success badge-xs">Active</span>
                    </div>
                    <code className="text-[10px] text-green-600 break-all line-clamp-2">
                      {problem.secureUrl}
                    </code>
                  </div>
                </div>


                <div className="flex gap-2">
                  <a
                    href={problem.secureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-success gap-1.5"
                  >
                    <PlayCircle size={16} />
                    Preview
                  </a>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="btn btn-sm btn-error gap-1.5"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>

              {/* Help Section - Integrated in Card Footer */}
              <div className="divider my-2"></div>
              <div className="bg-info/10 rounded-lg p-2.5">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-info flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs mb-0.5">Need Help?</h4>
                    <p className="text-[10px] opacity-80 leading-tight">
                      Videos are optimized for streaming. Ensure clear audio and visible content. Use 1080p, keep under 100MB.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* No Video - Show Upload Option */
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-4">
              <div className="flex flex-col items-center text-center py-3">
                <div className="bg-warning/20 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                  <Upload size={32} className="text-warning" />
                </div>
                <h3 className="text-lg font-bold mb-1">No Video Uploaded Yet</h3>
                <p className="text-xs opacity-70 mb-4 max-w-md">
                  Upload a tutorial video to help students. Supported: MP4, MOV, AVI (Max 100MB).
                </p>


                {/* Upload Guidelines */}
                <div className="w-full max-w-2xl mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-base-200 rounded-lg p-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-success mt-0.5 flex-shrink-0" />
                        <div className="text-left">
                          <h4 className="font-semibold text-xs mb-0.5">Clear Audio</h4>
                          <p className="text-[10px] opacity-70 leading-tight">Good audio quality</p>
                        </div>
                      </div>
                    </div>


                    <div className="bg-base-200 rounded-lg p-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-success mt-0.5 flex-shrink-0" />
                        <div className="text-left">
                          <h4 className="font-semibold text-xs mb-0.5">Screen Record</h4>
                          <p className="text-[10px] opacity-70 leading-tight">HD recording tools</p>
                        </div>
                      </div>
                    </div>


                    <div className="bg-base-200 rounded-lg p-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-success mt-0.5 flex-shrink-0" />
                        <div className="text-left">
                          <h4 className="font-semibold text-xs mb-0.5">Concise</h4>
                          <p className="text-[10px] opacity-70 leading-tight">Keep it focused</p>
                        </div>
                      </div>
                    </div>


                    <div className="bg-base-200 rounded-lg p-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-success mt-0.5 flex-shrink-0" />
                        <div className="text-left">
                          <h4 className="font-semibold text-xs mb-0.5">Step-by-Step</h4>
                          <p className="text-[10px] opacity-70 leading-tight">Clear approach</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                <button
                  onClick={handleUpload}
                  className="btn btn-success btn-sm gap-2 mb-3"
                >
                  <Upload size={18} />
                  Upload Video Now
                </button>
              </div>

              {/* Help Section - Integrated in Card Footer */}
              <div className="divider my-2"></div>
              <div className="bg-info/10 rounded-lg p-2.5">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-info flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs mb-0.5">Need Help?</h4>
                    <p className="text-[10px] opacity-80 leading-tight">
                      Videos are optimized for streaming. Ensure clear audio and visible content. Use 1080p, keep under 100MB.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default AdminVideoAction;
