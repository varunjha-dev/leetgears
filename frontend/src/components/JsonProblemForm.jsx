import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { Code, CheckCircle, AlertCircle, FileJson, Info } from 'lucide-react';

const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.enum(["Array", "LinkedList", "Graph", "DP"]),
  visibleTestCases: z.array(z.object({
    input: z.string().min(1, "Input is required"),
    output: z.string().min(1, "Output is required"),
    explanation: z.string().min(1, "Explanation is required"),
  })).min(1, "At least one visible test case is required"),
  hiddenTestCases: z.array(z.object({
    input: z.string().min(1, "Input is required"),
    output: z.string().min(1, "Output is required"),
  })).min(1, "At least one hidden test case is required"),
  startCode: z.array(z.object({
    language: z.enum(["cpp", "C++", "java", "Java", "javascript", "JavaScript"]),
    initialCode: z.string().min(1, "Initial code is required"),
  })).length(3, "All three languages required"),
  referenceSolution: z.array(z.object({
    language: z.enum(["cpp", "C++", "java", "Java", "javascript", "JavaScript"]),
    completeCode: z.string().min(1, "Complete code is required"),
  })).length(3, "All three languages required"),
});

function JsonProblemForm({ problemData, onSubmitSuccess, isUpdateMode, problemId }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode === 'dark';
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [jsonError, setJsonError] = useState(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      jsonInput: problemData ? JSON.stringify(problemData, null, 2) : '',
    },
  });

  const jsonInput = watch('jsonInput');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Validate JSON in real-time
  const validateJSON = (jsonString) => {
    try {
      if (jsonString.trim()) {
        JSON.parse(jsonString);
        setJsonError(null);
        return true;
      }
    } catch (error) {
      setJsonError('Invalid JSON syntax');
      return false;
    }
  };

  // Format JSON
  const formatJSON = () => {
    try {
      if (jsonInput) {
        const parsed = JSON.parse(jsonInput);
        const formatted = JSON.stringify(parsed, null, 2);
        document.querySelector('textarea[name="jsonInput"]').value = formatted;
      }
    } catch (error) {
      showToast('Cannot format invalid JSON', 'error');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setJsonError(null);
    
    try {
      const parsedData = JSON.parse(data.jsonInput);
      problemSchema.parse(parsedData); // Validate against Zod schema

      if (isUpdateMode) {
        await axiosClient.put(`/problem/update/${problemId}`, parsedData);
        showToast('Problem updated successfully via JSON!', 'success');
      } else {
        await axiosClient.post('/problem/create', parsedData);
        showToast('Problem created successfully via JSON!', 'success');
      }
      
      setTimeout(() => {
        onSubmitSuccess();
      }, 1500);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join('\n');
        setJsonError(errorMessages);
        showToast('Validation failed. Check the errors below.', 'error');
      } else if (error instanceof SyntaxError) {
        setJsonError('Invalid JSON format. Please check your syntax.');
        showToast('Invalid JSON format', 'error');
      } else {
        console.error('Submission error:', error);
        const errorMsg = error.response?.data?.message || 'Failed to submit problem';
        setJsonError(errorMsg);
        showToast(errorMsg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const exampleJSON = {
    title: "Example Problem",
    description: "Problem description here",
    difficulty: "easy",
    tags: "Array",
    visibleTestCases: [
      {
        input: "[1,2,3]",
        output: "6",
        explanation: "Sum of array elements"
      }
    ],
    hiddenTestCases: [
      {
        input: "[4,5,6]",
        output: "15"
      }
    ],
    startCode: [
      { language: "javascript", initialCode: "function solve() {}" },
      { language: "java", initialCode: "public class Solution {}" },
      { language: "cpp", initialCode: "class Solution {};" }
    ],
    referenceSolution: [
      { language: "javascript", completeCode: "function solve() { return 0; }" },
      { language: "java", completeCode: "public class Solution { return 0; }" },
      { language: "cpp", completeCode: "class Solution { return 0; };" }
    ]
  };

  const copyExample = () => {
    const formatted = JSON.stringify(exampleJSON, null, 2);
    navigator.clipboard.writeText(formatted);
    showToast('Example JSON copied to clipboard!', 'success');
  };

  return (
    <>
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

      <div className={`card shadow-xl rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="card-body p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileJson className="w-6 h-6 text-blue-500" />
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {isUpdateMode ? 'Update Problem via JSON' : 'Create Problem via JSON'}
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={formatJSON}
                className={`btn btn-sm gap-2 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                }`}
              >
                <Code size={16} />
                Format JSON
              </button>
              <button
                type="button"
                onClick={copyExample}
                className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white border-none gap-2"
              >
                <FileJson size={16} />
                Copy Example
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className={`rounded-lg p-4 mb-4 border ${
            isDarkMode 
              ? 'bg-blue-900/20 border-blue-800' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                  JSON Editor Tips:
                </p>
                <ul className={`text-xs space-y-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                  <li>• Use "Format JSON" to beautify your code</li>
                  <li>• "Copy Example" provides a template to start with</li>
                  <li>• All three languages (JavaScript, Java, C++) are required</li>
                  <li>• Validation errors will appear below the editor</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className={`rounded-lg p-12 text-center ${
              isDarkMode ? 'bg-gray-750' : 'bg-gray-50'
            }`}>
              <div className="w-16 h-16 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {isUpdateMode ? 'Updating problem...' : 'Creating problem...'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* JSON Editor */}
              <div className="form-control">
                <label className="label">
                  <span className={`label-text font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    JSON Problem Data
                  </span>
                  <span className={`label-text-alt text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {jsonInput?.length || 0} characters
                  </span>
                </label>
                <textarea
                  {...register('jsonInput', { 
                    required: 'JSON input is required',
                    onChange: (e) => validateJSON(e.target.value)
                  })}
                  className={`textarea textarea-bordered h-96 font-mono text-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white border-gray-300'
                  } ${errors.jsonInput || jsonError ? 'border-red-500' : ''}`}
                  placeholder={`Paste your JSON here or click "Copy Example" to start...\n\nExample structure:\n${JSON.stringify(exampleJSON, null, 2)}`}
                />
                
                {/* Error Messages */}
                {errors.jsonInput && (
                  <span className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.jsonInput.message}
                  </span>
                )}
                
                {jsonError && (
                  <div className="mt-2 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                          Validation Error:
                        </p>
                        <pre className="text-xs text-red-700 dark:text-red-400 whitespace-pre-wrap font-mono">
                          {jsonError}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Discard changes and go back?')) {
                      onSubmitSuccess();
                    }
                  }}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !!jsonError}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      {isUpdateMode ? 'Update Problem' : 'Create Problem'}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Schema Reference */}
          <div className={`mt-6 p-4 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-750 border-gray-700' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <details className="cursor-pointer">
              <summary className={`font-semibold text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                📋 View Schema Requirements
              </summary>
              <div className={`mt-3 text-xs space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <p><strong>Required Fields:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>title (string)</li>
                  <li>description (string)</li>
                  <li>difficulty (enum: "easy", "medium", "hard")</li>
                  <li>tags (enum: "Array", "LinkedList", "Graph", "DP")</li>
                  <li>visibleTestCases (array, min 1)</li>
                  <li>hiddenTestCases (array, min 1)</li>
                  <li>startCode (array, exactly 3 - one per language)</li>
                  <li>referenceSolution (array, exactly 3 - one per language)</li>
                </ul>
              </div>
            </details>
          </div>
        </div>
      </div>
    </>
  );
}

export default JsonProblemForm;
