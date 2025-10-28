import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { 
  History, 
  Code, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Database,
  X,
  Calendar,
  FileCode
} from 'lucide-react';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        if (Array.isArray(response.data)) {
          setSubmissions(response.data);
        } else {
          setSubmissions([]);
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch submission history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted': 
        return 'badge-success';
      case 'wrong': 
        return 'badge-error';
      case 'error': 
        return 'badge-warning';
      case 'pending': 
        return 'badge-info';
      default: 
        return 'badge-neutral';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted': 
        return <CheckCircle size={16} className="text-green-500" />;
      case 'wrong': 
        return <XCircle size={16} className="text-red-500" />;
      case 'error': 
        return <AlertCircle size={16} className="text-yellow-500" />;
      default: 
        return <Clock size={16} className="text-blue-500" />;
    }
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-12 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mx-auto"></div>
            <p className="font-medium">Loading submission history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle size={24} />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center shadow-lg">
          <History className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Submission History</h2>
          <p className="text-sm opacity-70">View your previous submission attempts</p>
        </div>
      </div>

      {/* Content */}
      {submissions.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-12">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-base-200 flex items-center justify-center">
                <FileCode className="w-10 h-10 opacity-50" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
                <p className="text-sm opacity-70">Submit your code to see your submission history here</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="card bg-base-100 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Status</th>
                    <th>Language</th>
                    <th>Runtime</th>
                    <th>Memory</th>
                    <th>Test Cases</th>
                    <th>Submitted</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, index) => (
                    <tr key={sub._id}>
                      <td className="font-medium opacity-70">{submissions.length - index}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(sub.status)}
                          <span className={`badge badge-sm ${getStatusBadge(sub.status)}`}>
                            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="font-mono text-sm badge badge-outline">
                          {sub.language}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="opacity-50" />
                          <span className="font-mono text-sm">{sub.runtime}s</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Database size={14} className="opacity-50" />
                          <span className="font-mono text-sm">{formatMemory(sub.memory)}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`font-mono text-sm ${
                          sub.testCasesPassed === sub.testCasesTotal 
                            ? 'text-green-500' 
                            : 'text-red-500'
                        }`}>
                          {sub.testCasesPassed}/{sub.testCasesTotal}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="opacity-50" />
                          <span className="text-xs opacity-70">{formatDate(sub.createdAt)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center">
                          <button 
                            onClick={() => setSelectedSubmission(sub)}
                            className="btn btn-sm btn-outline gap-2"
                          >
                            <Code size={16} />
                            View Code
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="text-sm opacity-70">
            Showing <span className="font-semibold text-green-500">{submissions.length}</span> total submission(s)
          </div>
        </>
      )}

      {/* Code View Modal */}
      {selectedSubmission && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Submission Details</h3>
                  <p className="text-sm opacity-70">{selectedSubmission.language}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <X size={18} />
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(selectedSubmission.status)}
                <span className={`badge ${getStatusBadge(selectedSubmission.status)}`}>
                  {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                </span>
              </div>
              <span className="badge badge-outline gap-1">
                <Clock size={12} />
                Runtime: {selectedSubmission.runtime}s
              </span>
              <span className="badge badge-outline gap-1">
                <Database size={12} />
                Memory: {formatMemory(selectedSubmission.memory)}
              </span>
              <span className={`badge badge-outline gap-1 ${
                selectedSubmission.testCasesPassed === selectedSubmission.testCasesTotal
                  ? 'border-green-500 text-green-500'
                  : 'border-red-500 text-red-500'
              }`}>
                <CheckCircle size={12} />
                Passed: {selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal}
              </span>
            </div>

            {/* Error Message */}
            {selectedSubmission.errorMessage && (
              <div className="alert alert-error mb-4">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Error:</p>
                  <p className="text-sm font-mono">{selectedSubmission.errorMessage}</p>
                </div>
              </div>
            )}

            {/* Code Block */}
            <div className="mockup-code">
              <div className="flex items-center justify-between px-4 py-2 bg-base-300">
                <span className="text-sm font-mono">{selectedSubmission.language}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedSubmission.code);
                  }}
                  className="btn btn-xs btn-ghost"
                >
                  Copy
                </button>
              </div>
              <pre data-prefix="" className="overflow-x-auto">
                <code>{selectedSubmission.code}</code>
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="modal-action">
              <button onClick={() => setSelectedSubmission(null)} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;
