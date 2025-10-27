import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router';
import axiosClient from '../utils/axiosClient';
import AdminNavbar from './AdminNavbar';
import { Plus, Minus, Edit, ArrowLeft, CheckCircle, AlertCircle, Code, FileText, Eye, EyeOff } from 'lucide-react';
import JsonProblemForm from './JsonProblemForm';

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
    language: z.enum(["javascript", "java", "cpp"]),
    initialCode: z.string().min(1, "Initial code is required"),
  })).min(1, "At least one starting code template is required"),
  referenceSolution: z.array(z.object({
    language: z.enum(["javascript", "java", "cpp"]),
    completeCode: z.string().min(1, "Complete code is required"),
  })).min(1, "At least one reference solution is required"),
});

function AdminUpdate() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode === 'dark';
  });
  const [problemData, setProblemData] = useState(null);
  const [showJsonForm, setShowJsonForm] = useState(false);
  const [toast, setToast] = useState(null);

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'easy',
      tags: 'Array',
      visibleTestCases: [{ input: '', output: '', explanation: '' }],
      hiddenTestCases: [{ input: '', output: '' }],
      startCode: [{ language: 'javascript', initialCode: '' }],
      referenceSolution: [{ language: 'javascript', completeCode: '' }],
    }
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({
    control,
    name: 'visibleTestCases',
  });

  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({
    control,
    name: 'hiddenTestCases',
  });

  const { fields: startCodeFields, append: appendStartCode, remove: removeStartCode } = useFieldArray({
    control,
    name: 'startCode',
  });

  const { fields: referenceSolutionFields, append: appendReferenceSolution, remove: removeReferenceSolution } = useFieldArray({
    control,
    name: 'referenceSolution',
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchProblemData = async () => {
      if (!problemId) return;
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const fetchedData = response.data;
        setProblemData(fetchedData);
        Object.keys(fetchedData).forEach(key => {
          if (key in problemSchema.shape) {
            setValue(key, fetchedData[key]);
          }
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching problem data:", error);
        showToast("Failed to fetch problem data", 'error');
        setLoading(false);
      }
    };
    fetchProblemData();
  }, [problemId, setValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await axiosClient.put(`/problem/update/${problemId}`, data);
      showToast("Problem updated successfully!", 'success');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (error) {
      console.error("Error updating problem:", error);
      showToast("Failed to update problem", 'error');
    }
    setSubmitting(false);
  };

  const onFormSubmitSuccess = () => {
    showToast("Problem updated successfully!", 'success');
    setTimeout(() => navigate('/admin'), 1500);
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? 'bg-[#282828]' : 'bg-gray-100'
        }`}>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mx-auto"></div>
            <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Loading problem data...
            </p>
          </div>
        </div>
      </>
    );
  }

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
                <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg">
                  <Edit className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Update Problem
                  </h1>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Modify problem details and test cases
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

          {showJsonForm && problemData ? (
            <JsonProblemForm 
              problemData={problemData}
              onSubmitSuccess={onFormSubmitSuccess}
              isUpdateMode={true}
              problemId={problemId}
            />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Basic Details Card */}
              <div className={`card shadow-xl rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="card-body p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Basic Details
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
                        type="text" 
                        placeholder="Enter problem title" 
                        {...register('title')} 
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
                        placeholder="Enter problem description" 
                        {...register('description')} 
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
                              placeholder="Enter input" 
                              {...register(`visibleTestCases.${index}.input`)} 
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
                              placeholder="Enter expected output" 
                              {...register(`visibleTestCases.${index}.output`)} 
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
                              placeholder="Explain the test case" 
                              {...register(`visibleTestCases.${index}.explanation`)} 
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
                              placeholder="Enter input" 
                              {...register(`hiddenTestCases.${index}.input`)} 
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
                              placeholder="Enter expected output" 
                              {...register(`hiddenTestCases.${index}.output`)} 
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

              {/* Start Code Templates Card */}
              <div className={`card shadow-xl rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="card-body p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-blue-500" />
                      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Start Code Templates
                      </h2>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => appendStartCode({ language: 'javascript', initialCode: '' })} 
                      className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white border-none gap-2"
                    >
                      <Plus size={16} /> Add Template
                    </button>
                  </div>

                  <div className="space-y-4">
                    {startCodeFields.map((field, index) => (
                      <div 
                        key={field.id} 
                        className={`p-4 rounded-lg border ${
                          isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Template #{index + 1}
                          </span>
                          {startCodeFields.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => removeStartCode(index)} 
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
                                Language
                              </span>
                            </label>
                            <select 
                              {...register(`startCode.${index}.language`)} 
                              className={`select select-bordered select-sm ${
                                isDarkMode 
                                  ? 'bg-gray-700 text-white border-gray-600' 
                                  : 'bg-white border-gray-300'
                              }`}
                            >
                              <option value="javascript">JavaScript</option>
                              <option value="java">Java</option>
                              <option value="cpp">C++</option>
                            </select>
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className={`label-text text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Initial Code
                              </span>
                            </label>
                            <textarea 
                              placeholder="Enter starter code" 
                              {...register(`startCode.${index}.initialCode`)} 
                              className={`textarea textarea-bordered h-40 font-mono text-sm ${
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reference Solutions Card */}
              <div className={`card shadow-xl rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="card-body p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Reference Solutions
                      </h2>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => appendReferenceSolution({ language: 'javascript', completeCode: '' })} 
                      className="btn btn-sm bg-green-500 hover:bg-green-600 text-white border-none gap-2"
                    >
                      <Plus size={16} /> Add Solution
                    </button>
                  </div>

                  <div className="space-y-4">
                    {referenceSolutionFields.map((field, index) => (
                      <div 
                        key={field.id} 
                        className={`p-4 rounded-lg border ${
                          isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Solution #{index + 1}
                          </span>
                          {referenceSolutionFields.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => removeReferenceSolution(index)} 
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
                                Language
                              </span>
                            </label>
                            <select 
                              {...register(`referenceSolution.${index}.language`)} 
                              className={`select select-bordered select-sm ${
                                isDarkMode 
                                  ? 'bg-gray-700 text-white border-gray-600' 
                                  : 'bg-white border-gray-300'
                              }`}
                            >
                              <option value="javascript">JavaScript</option>
                              <option value="java">Java</option>
                              <option value="cpp">C++</option>
                            </select>
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className={`label-text text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Complete Solution Code
                              </span>
                            </label>
                            <textarea 
                              placeholder="Enter complete solution" 
                              {...register(`referenceSolution.${index}.completeCode`)} 
                              className={`textarea textarea-bordered h-40 font-mono text-sm ${
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
                    ))}
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Update Problem
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

export default AdminUpdate;
