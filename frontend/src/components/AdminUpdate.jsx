import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router';
import axiosClient from '../utils/axiosClient';
import AdminNavbar from './AdminNavbar';
import { Plus, Minus } from 'lucide-react';
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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode === 'dark';
  });
  const [problemData, setProblemData] = useState(null);
  const [showJsonForm, setShowJsonForm] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

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
        window.alert("Failed to fetch problem data.");
        setLoading(false);
      }
    };
    fetchProblemData();
  }, [problemId, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axiosClient.put(`/problem/update/${problemId}`, data);
      window.alert("Problem updated successfully!");
      navigate('/admin');
    } catch (error) {
      console.error("Error updating problem:", error);
      window.alert("Failed to update problem.");
    }
    setLoading(false);
  };

  const onFormSubmitSuccess = () => {
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
    <AdminNavbar />
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#282828] text-white' : 'bg-base-200'}`}>
      <div className="container mx-auto p-4">
        <h1 className={`text-3xl font-bold text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Update Problem</h1>
        
        <div className="flex justify-end mb-4">
          <button onClick={() => setShowJsonForm(!showJsonForm)} className="btn btn-secondary">
            {showJsonForm ? 'Use Form Builder' : 'Use JSON Editor'}
          </button>
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
            {/* Basic Details */}
            <div className={`card shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-base-100'}`}>
              <div className="card-body">
                <h2 className="card-title">Basic Details</h2>
                <div className="form-control">
                  <label className="label"><span className={`label-text ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Title</span></label>
                  <input type="text" placeholder="Problem Title" {...register('title')} className={`input input-bordered ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`} />
                  {errors.title && <span className="text-error text-sm mt-1">{errors.title.message}</span>}
                </div>
                <div className="form-control">
                  <label className="label"><span className={`label-text ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Description</span></label>
                  <textarea placeholder="Problem Description" {...register('description')} className={`textarea textarea-bordered h-24 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}></textarea>
                  {errors.description && <span className="text-error text-sm mt-1">{errors.description.message}</span>}
                </div>
                <div className="form-control">
                  <label className="label"><span className={`label-text ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Difficulty</span></label>
                  <select {...register('difficulty')} className={`select select-bordered ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  {errors.difficulty && <span className="text-error text-sm mt-1">{errors.difficulty.message}</span>}
                </div>
                <div className="form-control">
                  <label className="label"><span className={`label-text ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Tags</span></label>
                  <select {...register('tags')} className={`select select-bordered ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}>
                    <option value="Array">Array</option>
                    <option value="LinkedList">Linked List</option>
                    <option value="Graph">Graph</option>
                    <option value="DP">DP</option>
                  </select>
                  {errors.tags && <span className="text-error text-sm mt-1">{errors.tags.message}</span>}
                </div>
              </div>
            </div>

            {/* Visible Test Cases */}
            <div className={`card shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-base-100'}`}>
              <div className="card-body">
                <h2 className="card-title">Visible Test Cases</h2>
                {visibleFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 border p-4 rounded-lg">
                    <div className="form-control">
                      <label className="label"><span className={`label-text ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Input {index + 1}</span></label>
                      <textarea placeholder="Input" {...register(`visibleTestCases.${index}.input`)} className={`textarea textarea-bordered ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}></textarea>
                      {errors.visibleTestCases?.[index]?.input && <span className="text-error text-sm mt-1">{errors.visibleTestCases[index].input.message}</span>}
                    </div>
                    <div className="form-control">
                      <label className="label"><span className={`label-text ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Output {index + 1}</span></label>
                      <textarea placeholder="Output" {...register(`visibleTestCases.${index}.output`)} className={`textarea textarea-bordered ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}></textarea>
                      {errors.visibleTestCases?.[index]?.output && <span className="text-error text-sm mt-1">{errors.visibleTestCases[index].output.message}</span>}
                    </div>
                    <div className="form-control">
                      <label className="label"><span className={`label-text ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Explanation {index + 1}</span></label>
                      <textarea placeholder="Explanation" {...register(`visibleTestCases.${index}.explanation`)} className={`textarea textarea-bordered ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}></textarea>
                      {errors.visibleTestCases?.[index]?.explanation && <span className="text-error text-sm mt-1">{errors.visibleTestCases[index].explanation.message}</span>}
                    </div>
                    <button type="button" onClick={() => removeVisible(index)} className="btn btn-error btn-sm"><Minus size={16} /> Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="btn btn-info btn-sm mt-4"><Plus size={16} /> Add Visible Test Case</button>
              </div>
            </div>

              {/* Hidden Test Cases */}
              <div className={`card shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-base-100'}`}>
                <div className="card-body">
                  <h2 className="card-title">Hidden Test Cases</h2>
                  {hiddenFields.map((field, index) => (
                    <div key={field.id} className="space-y-4 border p-4 rounded-lg">
                      <div className="form-control">
                        <label className="label"><span className={`label-text ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Input {index + 1}</span></label>
                        <textarea placeholder="Input" {...register(`hiddenTestCases.${index}.input`)} className={`textarea textarea-bordered ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}></textarea>
                        {errors.hiddenTestCases?.[index]?.input && <span className="text-error text-sm mt-1">{errors.hiddenTestCases[index].input.message}</span>}
                      </div>
                      <div className="form-control">
                        <label className="label"><span className={`label-text ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Output {index + 1}</span></label>
                        <textarea placeholder="Output" {...register(`hiddenTestCases.${index}.output`)} className={`textarea textarea-bordered ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}></textarea>
                        {errors.hiddenTestCases?.[index]?.output && <span className="text-error text-sm mt-1">{errors.hiddenTestCases[index].output.message}</span>}
                      </div>
                      <button type="button" onClick={() => removeHidden(index)} className="btn btn-error btn-sm"><Minus size={16} /> Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="btn btn-info btn-sm mt-4"><Plus size={16} /> Add Hidden Test Case</button>
                </div>
              </div>

              {/* Start Code Templates */}
              <div className={`card shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-base-100'}`}>
                <div className="card-body">
                  <h2 className="card-title">Start Code Templates</h2>
                  {startCodeFields.map((field, index) => (
                    <div key={field.id} className="space-y-4 border p-4 rounded-lg">
                      <div className="form-control">
                        <label className="label"><span className={`label-text ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Language {index + 1}</span></label>
                        <select {...register(`startCode.${index}.language`)} className={`select select-bordered ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}>
                          <option value="javascript">JavaScript</option>
                          <option value="java">Java</option>
                          <option value="cpp">C++</option>
                        </select>
                        {errors.startCode?.[index]?.language && <span className="text-error text-sm mt-1">{errors.startCode[index].language.message}</span>}
                      </div>
                      <div className="form-control">
                        <label className="label"><span className={`label-text ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Initial Code {index + 1}</span></label>
                        <textarea placeholder="Initial Code" {...register(`startCode.${index}.initialCode`)} className={`textarea textarea-bordered h-32 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}></textarea>
                        {errors.startCode?.[index]?.initialCode && <span className="text-error text-sm mt-1">{errors.startCode[index].initialCode.message}</span>}
                      </div>
                      <button type="button" onClick={() => removeStartCode(index)} className="btn btn-error btn-sm"><Minus size={16} /> Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => appendStartCode({ language: 'javascript', initialCode: '' })} className="btn btn-info btn-sm mt-4"><Plus size={16} /> Add Start Code</button>
                </div>
              </div>

              {/* Reference Solutions */}
              <div className={`card shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-base-100'}`}>
                <div className="card-body">
                  <h2 className="card-title">Reference Solutions</h2>
                  {referenceSolutionFields.map((field, index) => (
                    <div key={field.id} className="space-y-4 border p-4 rounded-lg">
                      <div className="form-control">
                        <label className="label"><span className={`label-text ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Language {index + 1}</span></label>
                        <select {...register(`referenceSolution.${index}.language`)} className={`select select-bordered ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}>
                          <option value="javascript">JavaScript</option>
                          <option value="java">Java</option>
                          <option value="cpp">C++</option>
                        </select>
                        {errors.referenceSolution?.[index]?.language && <span className="text-error text-sm mt-1">{errors.referenceSolution[index].language.message}</span>}
                      </div>
                      <div className="form-control">
                        <label className="label"><span className={`label-text ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Complete Code {index + 1}</span></label>
                        <textarea placeholder="Complete Code" {...register(`referenceSolution.${index}.completeCode`)} className={`textarea textarea-bordered h-32 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}></textarea>
                        {errors.referenceSolution?.[index]?.completeCode && <span className="text-error text-sm mt-1">{errors.referenceSolution[index].completeCode.message}</span>}
                      </div>
                      <button type="button" onClick={() => removeReferenceSolution(index)} className="btn btn-error btn-sm"><Minus size={16} /> Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => appendReferenceSolution({ language: 'javascript', completeCode: '' })} className="btn btn-info btn-sm mt-4"><Plus size={16} /> Add Reference Solution</button>
                </div>
              </div>

              <button type="submit" className={`btn btn-primary btn-wide mt-8 ${loading ? 'loading btn-disabled' : ''} ${isDarkMode ? 'bg-[#00A68A] hover:bg-[#008F77] border-none text-white' : ''}`} disabled={loading}>
                {loading ? 'Updating...' : 'Update Problem'}
              </button>
            </form>
          
        )}
      </div>
    </div>
    </>
  );
}

export default AdminUpdate;
