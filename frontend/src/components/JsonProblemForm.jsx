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

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileJson className="w-6 h-6 text-fuchsia-500" />
              <h2 className="text-xl font-bold">
                {isUpdateMode ? 'Update Problem via JSON' : 'Create Problem via JSON'}
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={formatJSON}
                className="btn btn-sm btn-outline gap-2"
              >
                <Code size={16} />
                Format JSON
              </button>
              <button
                type="button"
                onClick={copyExample}
                className="btn btn-sm btn-outline gap-2"
              >
                <FileJson size={16} />
                Copy Example
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="alert mb-4">
            <Info className="w-5 h-5" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">JSON Editor Tips:</p>
              <ul className="text-xs space-y-1">
                <li>• Use "Format JSON" to beautify your code</li>
                <li>• "Copy Example" provides a template to start with</li>
                <li>• All three languages (JavaScript, Java, C++) are required</li>
                <li>• Validation errors will appear below the editor</li>
              </ul>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="rounded-lg p-12 text-center bg-base-200">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-medium">
                {isUpdateMode ? 'Updating problem...' : 'Creating problem...'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* JSON Editor */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">JSON Problem Data</span>
                  <span className="label-text-alt text-xs opacity-70">
                    {jsonInput?.length || 0} characters
                  </span>
                </label>
                <textarea
                  {...register('jsonInput', { 
                    required: 'JSON input is required',
                    onChange: (e) => validateJSON(e.target.value)
                  })}
                  className={`textarea textarea-bordered h-96 font-mono text-sm ${
                    errors.jsonInput || jsonError ? 'textarea-error' : ''
                  }`}
                  placeholder={`Paste your JSON here or click "Copy Example" to start...\n\nExample structure:\n${JSON.stringify(exampleJSON, null, 2)}`}
                />
                
                {/* Error Messages */}
                {errors.jsonInput && (
                  <span className="text-error text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.jsonInput.message}
                  </span>
                )}
                
                {jsonError && (
                  <div className="alert alert-error mt-2">
                    <AlertCircle className="w-4 h-4" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-1">Validation Error:</p>
                      <pre className="text-xs whitespace-pre-wrap font-mono">{jsonError}</pre>
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
                  className="flex-1 btn btn-ghost"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !!jsonError}
                  className="flex-1 btn btn-success gap-2"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
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
          <div className="collapse collapse-arrow bg-base-200 mt-6">
            <input type="checkbox" /> 
            <div className="collapse-title font-semibold text-sm">
              📋 View Schema Requirements
            </div>
            <div className="collapse-content text-xs opacity-70">
              <p className="font-semibold mb-2">Required Fields:</p>
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
          </div>
        </div>
      </div>
    </>
  );
}

export default JsonProblemForm;
