import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams, useNavigate } from 'react-router';
import axiosClient from "../utils/axiosClient"
import SubmissionHistory from "../components/SubmissionHistory"
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';
import { BrainCircuit, Sun, Moon } from 'lucide-react';
import { useSelector } from 'react-redux';

const ProblemPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode === 'dark';
  });

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

  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('java'); // Default to Java
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  let {id}  = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { handleSubmit } = useForm();

  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        
        const response = await axiosClient.get(`/problem/problemById/${id}`);
        
        const initialCode = response.data.startCode.find((sc) => {
        
        if (sc.language.toLowerCase() == "c++" && selectedLanguage == 'cpp')
        return true;
        else if (sc.language.toLowerCase() == "java" && selectedLanguage == 'java')
        return true;
        else if (sc.language.toLowerCase() == "javascript" && selectedLanguage == 'javascript')
        return true;

        return false;
        })?.initialCode || ''; // Changed default to empty string

        // console.log(initialCode);
        setProblem(response.data);
        // console.log(response.data.startCode);
        

        // console.log(initialCode);
        setCode(initialCode);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === selectedLanguage)?.initialCode || '';
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/run/${id}`, {
        code,
        language: selectedLanguage
      });

      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab('testcase');
      
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    
    try {
        const response = await axiosClient.post(`/submission/submit/${id}`, {
        code:code,
        language: selectedLanguage
      });

       setSubmitResult(response.data);
       setLoading(false);
       setActiveRightTab('result');
      
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className={`h-screen flex ${isDarkMode ? 'bg-[#282828] text-white' : 'bg-base-100'}`}>
      {/* Left Panel */}
      <div className={`w-1/2 flex flex-col ${isDarkMode ? 'border-gray-700' : 'border-base-300'}`}>
        {/* Header for Left Panel */}
        <div className={`navbar ${isDarkMode ? 'bg-[#282828]' : 'bg-base-100'} shadow-lg px-4`}>
          <div className="flex-1">
            <button onClick={handleLogoClick} className="btn btn-ghost text-xl normal-case">
              <BrainCircuit size={24} className="text-green-500 mr-2" /> 
              <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>LeetGears</span>
            </button>
          </div>
          <div className="flex-none">
            <button onClick={toggleDarkMode} className="btn btn-ghost btn-circle">
              {isDarkMode ? <Sun size={24} className="text-white" /> : <Moon size={24} className="text-gray-800" />}
            </button>
          </div>
        </div>
        {/* Left Tabs */}
        <div className={`tabs tabs-bordered ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-base-200'} px-4`}>
          <button 
            className={`tab ${activeLeftTab === 'description' ? (isDarkMode ? 'tab-active text-white' : 'tab-active') : (isDarkMode ? 'text-gray-300' : '')}`}
            onClick={() => setActiveLeftTab('description')}
          >
            Description
          </button>
          <button 
            className={`tab ${activeLeftTab === 'editorial' ? (isDarkMode ? 'tab-active text-white' : 'tab-active') : (isDarkMode ? 'text-gray-300' : '')}`}
            onClick={() => setActiveLeftTab('editorial')}
          >
            Editorial
          </button>
          <button 
            className={`tab ${activeLeftTab === 'solutions' ? (isDarkMode ? 'tab-active text-white' : 'tab-active') : (isDarkMode ? 'text-gray-300' : '')}`}
            onClick={() => setActiveLeftTab('solutions')}
          >
            Solutions
          </button>
          <button 
            className={`tab ${activeLeftTab === 'submissions' ? (isDarkMode ? 'tab-active text-white' : 'tab-active') : (isDarkMode ? 'text-gray-300' : '')}`}
            onClick={() => setActiveLeftTab('submissions')}
          >
            Submissions
          </button>
          <button 
            className={`tab ${activeLeftTab === 'chatAI' ? (isDarkMode ? 'tab-active text-white' : 'tab-active') : (isDarkMode ? 'text-gray-300' : '')}`}
            onClick={() => setActiveLeftTab('chatAI')}
          >
            Chat with AI
          </button>
        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {problem && (
            <>
              {activeLeftTab === 'description' && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold">{problem.title}</h1>
                    <div className={`badge badge-outline ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </div>
                    <div className="badge badge-info">{problem.tags}</div>
                  </div>

                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {problem.description}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Examples:</h3>
                    <div className="space-y-4">
                      {problem.visibleTestCases.map((example, index) => (
                        <div key={index} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-base-200'}`}>
                          <h4 className="font-semibold mb-2">Example {index + 1}:</h4>
                          <div className="space-y-2 text-sm font-mono">
                            <div><strong>Input:</strong> {example.input}</div>
                            <div><strong>Output:</strong> {example.output}</div>
                            <div><strong>Explanation:</strong> {example.explanation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeLeftTab === 'editorial' && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold mb-4">Editorial</h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration}/>
                  </div>
                </div>
              )}

              {activeLeftTab === 'solutions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Solutions</h2>
                  <div className="space-y-6">
                    {problem.referenceSolution?.map((solution, index) => (
                      <div key={index} className={`rounded-lg ${isDarkMode ? 'border border-gray-700' : 'border border-base-300'}`}>
                        <div className={`px-4 py-2 rounded-t-lg ${isDarkMode ? 'bg-gray-800' : 'bg-base-200'}`}>
                          <h3 className="font-semibold">{problem?.title} - {solution?.language}</h3>
                        </div>
                        <div className="p-4">
                          <pre className={`p-4 rounded text-sm overflow-x-auto ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-base-300'}`}>
                            <code>{solution?.completeCode}</code>
                          </pre>
                        </div>
                      </div>
                    )) || <p className={`text-gray-500 ${isDarkMode ? 'text-gray-400' : ''}`}>Solutions will be available after you solve the problem.</p>}
                  </div>
                </div>
              )}

              {activeLeftTab === 'submissions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">My Submissions</h2>
                  <div className={`text-gray-500 ${isDarkMode ? 'text-gray-400' : ''}`}>
                   <SubmissionHistory problemId={id} />
                  </div>
                </div>
              )}
              {activeLeftTab === 'chatAI' && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold mb-4">CHAT with AI</h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    <ChatAi problem={problem}></ChatAi>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col">
        {/* Right Tabs */}
        <div className={`tabs tabs-bordered ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-base-200'} px-4`}>
          <button 
            className={`tab ${activeRightTab === 'code' ? (isDarkMode ? 'tab-active text-white' : 'tab-active') : (isDarkMode ? 'text-gray-300' : '')}`}
            onClick={() => setActiveRightTab('code')}
          >
            Code
          </button>
          <button 
            className={`tab ${activeRightTab === 'testcase' ? (isDarkMode ? 'tab-active text-white' : 'tab-active') : (isDarkMode ? 'text-gray-300' : '')}`}
            onClick={() => setActiveRightTab('testcase')}
          >
            Testcase
          </button>
          <button 
            className={`tab ${activeRightTab === 'result' ? (isDarkMode ? 'tab-active text-white' : 'tab-active') : (isDarkMode ? 'text-gray-300' : '')}`}
            onClick={() => setActiveRightTab('result')}
          >
            Result
          </button>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          {activeRightTab === 'code' && (
            <div className="flex-1 flex flex-col">
              {/* Language Selector */}
              <div className={`flex justify-between items-center p-4 ${isDarkMode ? 'border-b border-gray-700 bg-gray-800' : 'border-b border-base-300'}`}>
                <div className="flex gap-2">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className={`select select-bordered ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                  >
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme={isDarkMode ? "vs-dark" : "vs-light"}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    renderLineHighlight: 'line',
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: 'line',
                    mouseWheelZoom: true,
                  }}/>
              </div>

              {/* Action Buttons */}
              <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-base-300'} flex justify-between`}>
                <div className="flex gap-2">
                  <button 
                    className={`btn btn-ghost btn-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : ''}`}
                    onClick={() => setActiveRightTab('testcase')}
                  >
                    Console
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`btn btn-outline btn-sm ${loading ? 'loading' : ''} ${isDarkMode ? 'text-green-400 border-green-400 hover:bg-green-700 hover:border-green-700' : ''}`}
                    onClick={handleRun}
                    disabled={loading}
                  >
                    Run
                  </button>
                  <button
                    className={`btn btn-primary btn-sm ${loading ? 'loading' : ''} bg-[#00A68A] hover:bg-[#008F77] border-none text-white`}
                    onClick={handleSubmitCode}
                    disabled={loading}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeRightTab === 'testcase' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Test Results</h3>
              {runResult ? (
                <div className={`alert ${runResult.success ? 'alert-success' : 'alert-error'} mb-4 ${isDarkMode ? 'bg-gray-800 text-white' : ''}`}>
                  <div>
                    {runResult.success ? (
                      <div>
                        <h4 className="font-bold">✅ All test cases passed!</h4>
                        <p className="text-sm mt-2">Runtime: {runResult.runtime+" sec"}</p>
                        <p className="text-sm">Memory: {runResult.memory+" KB"}</p>
                        
                        <div className="mt-4 space-y-2">
                          {runResult.testCases.map((tc, i) => (
                            <div key={i} className={`p-3 rounded text-xs ${isDarkMode ? 'bg-gray-900' : 'bg-base-100'}`}>
                              <div className="font-mono">
                                <div><strong>Input:</strong> {tc.stdin}</div>
                                <div><strong>Expected:</strong> {tc.expected_output}</div>
                                <div><strong>Output:</strong> {tc.stdout}</div>
                                <div className={'text-green-500'}>
                                  {'✓ Passed'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold">❌ Error</h4>
                        <div className="mt-4 space-y-2">
                          {runResult.testCases.map((tc, i) => (
                            <div key={i} className={`p-3 rounded text-xs ${isDarkMode ? 'bg-gray-900' : 'bg-base-100'}`}>
                              <div className="font-mono">
                                <div><strong>Input:</strong> {tc.stdin}</div>
                                <div><strong>Expected:</strong> {tc.expected_output}</div>
                                <div><strong>Output:</strong> {tc.stdout}</div>
                                <div className={tc.status_id==3 ? 'text-green-500' : 'text-red-500'}>
                                  {tc.status_id==3 ? '✓ Passed' : '✗ Failed'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`text-gray-500 ${isDarkMode ? 'text-gray-400' : ''}`}>
                  Click "Run" to test your code with the example test cases.
                </div>
              )}
            </div>
          )}

          {activeRightTab === 'result' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Submission Result</h3>
              {submitResult ? (
                <div className={`alert ${submitResult.accepted ? 'alert-success' : 'alert-error'} ${isDarkMode ? 'bg-gray-800 text-white' : ''}`}>
                  <div>
                    {submitResult.accepted ? (
                      <div>
                        <h4 className="font-bold text-lg">🎉 Accepted</h4>
                        <div className="mt-4 space-y-2">
                          <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                          <p>Runtime: {submitResult.runtime + " sec"}</p>
                          <p>Memory: {submitResult.memory + "KB"} </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold text-lg">❌ {submitResult.error}</h4>
                        <div className="mt-4 space-y-2">
                          <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`text-gray-500 ${isDarkMode ? 'text-gray-400' : ''}`}>
                  Click "Submit" to submit your solution for evaluation.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;