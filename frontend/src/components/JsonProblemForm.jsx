import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';

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

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      jsonInput: problemData ? JSON.stringify(problemData, null, 2) : '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const parsedData = JSON.parse(data.jsonInput);
      problemSchema.parse(parsedData); // Validate against Zod schema

      if (isUpdateMode) {
        await axiosClient.put(`/problem/update/${problemId}`, parsedData);
        window.alert('Problem updated successfully via JSON!');
      } else {
        await axiosClient.post('/problem/create', parsedData);
        window.alert('Problem created successfully via JSON!');
      }
      onSubmitSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        window.alert(`Validation Error: ${error.errors.map(err => err.message).join(', ')}`);
      } else if (error instanceof SyntaxError) {
        window.alert('Invalid JSON format.');
      } else {
        console.error('Submission error:', error);
        window.alert(error.response?.data?.message || 'Failed to submit problem.');
      }
    }
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-base-100'} rounded-lg shadow-xl`}>
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        {isUpdateMode ? 'Update Problem via JSON' : 'Create Problem via JSON'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className={`label-text ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>JSON Problem Data</span>
          </label>
          <textarea
            {...register('jsonInput', { required: 'JSON input is required' })}
            className={`textarea textarea-bordered h-64 font-mono ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''} ${errors.jsonInput ? 'textarea-error' : ''}`}
            placeholder="Enter problem JSON here..."
          />
          {errors.jsonInput && <span className="text-error text-sm mt-1">{errors.jsonInput.message}</span>}
        </div>
        <button
          type="submit"
          className={`btn btn-primary ${isDarkMode ? 'bg-[#00A68A] hover:bg-[#008F77] border-none text-white' : ''} w-full`}
        >
          {isUpdateMode ? 'Update Problem' : 'Create Problem'}
        </button>
      </form>
    </div>
  );
}

export default JsonProblemForm;
