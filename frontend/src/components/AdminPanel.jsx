import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import AdminNavbar from './AdminNavbar';
import React, { useState } from 'react';
import JsonProblemForm from './JsonProblemForm';
import { Plus, Minus, ArrowLeft, CheckCircle, AlertCircle, FileText, Eye, EyeOff, Code } from 'lucide-react';

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['Array', 'LinkedList', 'Graph', 'DP']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminPanel() {
  const navigate = useNavigate();
  const [showJsonForm, setShowJsonForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode === 'dark';
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      visibleTestCases: [{ input: '', output: '', explanation: '' }],
      hiddenTestCases: [{ input: '', output: '' }],
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await axiosClient.post('/problem/create', data);
      showToast('Problem created successfully!', 'success');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to create problem', 'error');
    }
    setSubmitting(false);
  };

  const onFormSubmitSuccess = () => {
    showToast('Problem created successfully!', 'success');
    setTimeout(() => navigate('/admin'), 1500);
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

      <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-[#282828]' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Header Section */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/admin')}
              className={`flex items-center gap-2 mb-4 text-sm font-medium hover:text-green-500 transition-colors ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <ArrowLeft size={16} />
              Back to Admin Dashboard
            </button>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center shadow-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Create New Problem
                  </h1>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Add a new coding challenge to the platform
                  </p>
                </div>
              </div>

              {/* Toggle JSON/Form Button */}
              <button 
                onClick={() => setShowJsonForm(!showJsonForm)} 
                className={`btn gap-2 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600' 
                    : 'bg-white hover:bg-gray-50 border-gray-300'
                }`}
              >
                <Code size={18} />
                {showJsonForm ? 'Use Form Builder' : 'Use JSON Editor'}
              </button>
            </div>
          </div>

          {showJsonForm ? (
            <JsonProblemForm onSubmitSuccess={onFormSubmitSuccess} isUpdateMode={false} />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Basic Information Card */}
              <div className={`card shadow-xl rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="card-body p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Basic Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className={`label-text font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Problem Title
                        </span>
                      </label>
                      <input
                        {...register('title')}
                        placeholder="Enter problem title"
                        className={`input input-bordered ${
                          isDarkMode 
                            ? 'bg-gray-700 text-white border-gray-600' 
                            : 'bg-white border-gray-300'
                        } ${errors.title ? 'border-red-500' : ''}`}
                      />
                      {errors.title && (
                        <span className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.title.message}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className={`label-text font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Description
                        </span>
                      </label>
                      <textarea
                        {...register('description')}
                        placeholder="Enter problem description"
                        className={`textarea textarea-bordered h-32 ${
                          isDarkMode 
                            ? 'bg-gray-700 text-white border-gray-600' 
                            : 'bg-white border-gray-300'
                        } ${errors.description ? 'border-red-500' : ''}`}
                      />
                      {errors.description && (
                        <span className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.description.message}
                        </span>
                      )}
                    </div>

                    {/* Difficulty */}
                    <div className="form-control">
                      <label className="label">
                        <span className={`label-text font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Difficulty Level
                        </span>
                      </label>
                      <select
                        {...register('difficulty')}
                        className={`select select-bordered ${
                          isDarkMode 
                            ? 'bg-gray-700 text-white border-gray-600' 
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    {/* Tags */}
                    <div className="form-control">
                      <label className="label">
                        <span className={`label-text font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Category Tags
                        </span>
                      </label>
                      <select
                        {...register('tags')}
                        className={`select select-bordered ${
                          isDarkMode 
                            ? 'bg-gray-700 text-white border-gray-600' 
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        <option value="Array">Array</option>
                        <option value="LinkedList">Linked List</option>
                        <option value="Graph">Graph</option>
                        <option value="DP">Dynamic Programming</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visible Test Cases Card */}
              <div className={`card shadow-xl rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="card-body p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-green-500" />
                      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Visible Test Cases
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                      className="btn btn-sm bg-green-500 hover:bg-green-600 text-white border-none gap-2"
                    >
                      <Plus size={16} /> Add Test Case
                    </button>
                  </div>

                  <div className="space-y-4">
                    {visibleFields.map((field, index) => (
                      <div
                        key={field.id}
                        className={`p-4 rounded-lg border ${
                          isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Test Case #{index + 1}
                          </span>
                          {visibleFields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeVisible(index)}
                              className="btn btn-sm btn-error gap-2"
                            >
                              <Minus size={14} /> Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <div className="form-control">
                            <label className="label">
                              <span className={`label-text text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Input
                              </span>
                            </label>
                            <textarea
                              {...register(`visibleTestCases.${index}.input`)}
                              placeholder="Enter input"
                              className={`textarea textarea-bordered textarea-sm ${
                                isDarkMode 
                                  ? 'bg-gray-700 text-white border-gray-600' 
                                  : 'bg-white border-gray-300'
                              }`}
                            />
                            {errors.visibleTestCases?.[index]?.input && (
                              <span className="text-red-500 text-xs mt-1">
                                {errors.visibleTestCases[index].input.message}
                              </span>
                            )}
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className={`label-text text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Output
                              </span>
                            </label>
                            <textarea
                              {...register(`visibleTestCases.${index}.output`)}
                              placeholder="Enter expected output"
                              className={`textarea textarea-bordered textarea-sm ${
                                isDarkMode 
                                  ? 'bg-gray-700 text-white border-gray-600' 
                                  : 'bg-white border-gray-300'
                              }`}
                            />
                            {errors.visibleTestCases?.[index]?.output && (
                              <span className="text-red-500 text-xs mt-1">
                                {errors.visibleTestCases[index].output.message}
                              </span>
                            )}
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className={`label-text text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Explanation
                              </span>
                            </label>
                            <textarea
                              {...register(`visibleTestCases.${index}.explanation`)}
                              placeholder="Explain the test case"
                              className={`textarea textarea-bordered textarea-sm ${
                                isDarkMode 
                                  ? 'bg-gray-700 text-white border-gray-600' 
                                  : 'bg-white border-gray-300'
                              }`}
                            />
                            {errors.visibleTestCases?.[index]?.explanation && (
                              <span className="text-red-500 text-xs mt-1">
                                {errors.visibleTestCases[index].explanation.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hidden Test Cases Card */}
              <div className={`card shadow-xl rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="card-body p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <EyeOff className="w-5 h-5 text-purple-500" />
                      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Hidden Test Cases
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => appendHidden({ input: '', output: '' })}
                      className="btn btn-sm bg-purple-500 hover:bg-purple-600 text-white border-none gap-2"
                    >
                      <Plus size={16} /> Add Test Case
                    </button>
                  </div>

                  <div className="space-y-4">
                    {hiddenFields.map((field, index) => (
                      <div
                        key={field.id}
                        className={`p-4 rounded-lg border ${
                          isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Hidden Test Case #{index + 1}
                          </span>
                          {hiddenFields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeHidden(index)}
                              className="btn btn-sm btn-error gap-2"
                            >
                              <Minus size={14} /> Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="form-control">
                            <label className="label">
                              <span className={`label-text text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Input
                              </span>
                            </label>
                            <textarea
                              {...register(`hiddenTestCases.${index}.input`)}
                              placeholder="Enter input"
                              className={`textarea textarea-bordered textarea-sm ${
                                isDarkMode 
                                  ? 'bg-gray-700 text-white border-gray-600' 
                                  : 'bg-white border-gray-300'
                              }`}
                            />
                            {errors.hiddenTestCases?.[index]?.input && (
                              <span className="text-red-500 text-xs mt-1">
                                {errors.hiddenTestCases[index].input.message}
                              </span>
                            )}
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className={`label-text text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Output
                              </span>
                            </label>
                            <textarea
                              {...register(`hiddenTestCases.${index}.output`)}
                              placeholder="Enter expected output"
                              className={`textarea textarea-bordered textarea-sm ${
                                isDarkMode 
                                  ? 'bg-gray-700 text-white border-gray-600' 
                                  : 'bg-white border-gray-300'
                              }`}
                            />
                            {errors.hiddenTestCases?.[index]?.output && (
                              <span className="text-red-500 text-xs mt-1">
                                {errors.hiddenTestCases[index].output.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code Templates Card */}
              <div className={`card shadow-xl rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="card-body p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="w-5 h-5 text-blue-500" />
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Code Templates & Solutions
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {[0, 1, 2].map((index) => {
                      const language = index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript';
                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {language}
                          </h3>

                          <div className="space-y-4">
                            <div className="form-control">
                              <label className="label">
                                <span className={`label-text text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Initial Code (Starter Template)
                                </span>
                              </label>
                              <textarea
                                {...register(`startCode.${index}.initialCode`)}
                                placeholder={`Enter starter code for ${language}`}
                                className={`textarea textarea-bordered h-32 font-mono text-sm ${
                                  isDarkMode 
                                    ? 'bg-gray-700 text-white border-gray-600' 
                                    : 'bg-white border-gray-300'
                                }`}
                              />
                              {errors.startCode?.[index]?.initialCode && (
                                <span className="text-red-500 text-xs mt-1">
                                  {errors.startCode[index].initialCode.message}
                                </span>
                              )}
                            </div>

                            <div className="form-control">
                              <label className="label">
                                <span className={`label-text text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Reference Solution (Complete Code)
                                </span>
                              </label>
                              <textarea
                                {...register(`referenceSolution.${index}.completeCode`)}
                                placeholder={`Enter complete solution for ${language}`}
                                className={`textarea textarea-bordered h-32 font-mono text-sm ${
                                  isDarkMode 
                                    ? 'bg-gray-700 text-white border-gray-600' 
                                    : 'bg-white border-gray-300'
                                }`}
                              />
                              {errors.referenceSolution?.[index]?.completeCode && (
                                <span className="text-red-500 text-xs mt-1">
                                  {errors.referenceSolution[index].completeCode.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Create Problem
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminPanel;
