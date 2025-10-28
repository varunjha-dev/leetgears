import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams, useNavigate } from 'react-router';
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';
import { BrainCircuit, Sun, Moon, Play, Send, Code2, FileText, Sparkles, History as HistoryIcon, BookOpen, MessageSquare } from 'lucide-react';
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
  const [selectedLanguage, setSelectedLanguage] = useState('java');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  let { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { handleSubmit } = useForm();

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
        })?.initialCode || '';

        setProblem(response.data);
        setCode(initialCode);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

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
        code: code,
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

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'badge-success';
      case 'medium': return 'badge-warning';
      case 'hard': return 'badge-error';
      default: return 'badge-neutral';
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
      <div className="flex justify-center items-center min-h-screen bg-base-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mx-auto"></div>
          <p className="font-medium">Loading problem...</p>
        </div>
      </div>
    );
  }

  const leftTabs = [
    { id: 'description', label: 'Description', icon: <FileText size={16} /> },
    { id: 'editorial', label: 'Editorial', icon: <BookOpen size={16} /> },
    { id: 'solutions', label: 'Solutions', icon: <Code2 size={16} /> },
    { id: 'submissions', label: 'Submissions', icon: <HistoryIcon size={16} /> },
    { id: 'chatAI', label: 'AI Helper', icon: <MessageSquare size={16} /> },
  ];

  return (
    <div className="h-screen flex flex-col bg-base-100">
      {/* Top Navbar */}
      <div className="navbar bg-base-100 border-b border-base-300 px-4 h-14 min-h-14">
        <div className="flex-1">
          <button onClick={handleLogoClick} className="btn btn-ghost text-xl normal-case gap-2">
            <BrainCircuit size={24} className="text-green-500" />
            <span className="font-bold">LeetGears</span>
          </button>
        </div>
        <div className="flex-none">
          <button onClick={toggleDarkMode} className="btn btn-ghost btn-circle btn-sm">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 flex flex-col border-r border-base-300">
          {/* Left Tabs */}
          <div className="flex border-b border-base-300 bg-base-200">
            {leftTabs.map(tab => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeLeftTab === tab.id
                    ? 'border-green-500 text-green-500 bg-base-100'
                    : 'border-transparent hover:bg-base-100'
                }`}
                onClick={() => setActiveLeftTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Left Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-base-100">
            {problem && (
              <>
                {activeLeftTab === 'description' && (
                  <div className="space-y-6">
                    {/* Title & Meta */}
                    <div>
                      <h1 className="text-2xl font-bold mb-3">{problem.title}</h1>
                      <div className="flex items-center gap-2">
                        <span className={`badge badge-sm ${getDifficultyStyle(problem.difficulty)}`}>
                          {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1)}
                        </span>
                        <span className="badge badge-sm badge-info badge-outline">{problem.tags}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="prose max-w-none">
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {problem.description}
                      </div>
                    </div>

                    {/* Examples */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Examples</h3>
                      <div className="space-y-4">
                        {problem.visibleTestCases.map((example, index) => (
                          <div key={index} className="card bg-base-200 shadow-sm">
                            <div className="card-body p-4">
                              <h4 className="font-semibold text-sm mb-3">Example {index + 1}</h4>
                              <div className="space-y-2 text-sm">
                                <div className="font-mono">
                                  <span className="font-semibold">Input:</span>
                                  <div className="mt-1 p-2 bg-base-300 rounded">{example.input}</div>
                                </div>
                                <div className="font-mono">
                                  <span className="font-semibold">Output:</span>
                                  <div className="mt-1 p-2 bg-base-300 rounded">{example.output}</div>
                                </div>
                                <div>
                                  <span className="font-semibold">Explanation:</span>
                                  <div className="mt-1">{example.explanation}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeLeftTab === 'editorial' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Editorial</h2>
                    <Editorial
                      secureUrl={problem.secureUrl}
                      thumbnailUrl={problem.thumbnailUrl}
                      duration={problem.duration}
                      problemTitle={problem.title}
                      problemDescription={problem.description}
                    />
                  </div>
                )}

                {activeLeftTab === 'solutions' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Solutions</h2>
                    <div className="space-y-4">
                      {problem.referenceSolution?.map((solution, index) => (
                        <div key={index} className="card bg-base-200 shadow-sm">
                          <div className="card-body p-0">
                            <div className="px-4 py-3 border-b border-base-300 flex items-center justify-between">
                              <h3 className="font-semibold">{solution?.language}</h3>
                              <span className="badge badge-sm badge-outline">{problem?.title}</span>
                            </div>
                            <pre className="p-4 overflow-x-auto text-sm">
                              <code className="font-mono">{solution?.completeCode}</code>
                            </pre>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-12 text-base-content/50">
                          Solutions will be available after you solve the problem
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeLeftTab === 'submissions' && (
                  <div>
                    <SubmissionHistory problemId={id} />
                  </div>
                )}

                {activeLeftTab === 'chatAI' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">AI Assistant</h2>
                    <ChatAi problem={problem} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex flex-col bg-base-100">
          {/* Code Editor Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-base-300 bg-base-200">
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="select select-sm select-bordered max-w-xs"
            >
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
            </select>

            <div className="flex items-center gap-2">
              <button
                className={`btn btn-sm gap-2 ${loading ? 'loading' : ''}`}
                onClick={handleRun}
                disabled={loading}
              >
                {!loading && <Play size={16} />}
                Run
              </button>
              <button
                className={`btn btn-sm btn-success gap-2 ${loading ? 'loading' : ''}`}
                onClick={handleSubmitCode}
                disabled={loading}
              >
                {!loading && <Send size={16} />}
                Submit
              </button>
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
              }}
            />
          </div>

          {/* Bottom Panel - Test Results */}
          <div className="h-64 border-t border-base-300 flex flex-col bg-base-100">
            {/* Result Tabs */}
            <div className="flex border-b border-base-300 bg-base-200">
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeRightTab === 'testcase'
                    ? 'border-green-500 text-green-500'
                    : 'border-transparent'
                }`}
                onClick={() => setActiveRightTab('testcase')}
              >
                Testcase
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeRightTab === 'result'
                    ? 'border-green-500 text-green-500'
                    : 'border-transparent'
                }`}
                onClick={() => setActiveRightTab('result')}
              >
                Result
              </button>
            </div>

            {/* Result Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeRightTab === 'testcase' && (
                <div>
                  {runResult ? (
                    <div className="space-y-4">
                      {runResult.success ? (
                        <>
                          <div className="alert alert-success">
                            <span className="font-semibold">✅ All test cases passed!</span>
                          </div>
                          <div className="stats shadow">
                            <div className="stat">
                              <div className="stat-title">Runtime</div>
                              <div className="stat-value text-sm">{runResult.runtime} sec</div>
                            </div>
                            <div className="stat">
                              <div className="stat-title">Memory</div>
                              <div className="stat-value text-sm">{runResult.memory} KB</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {runResult.testCases.map((tc, i) => (
                              <div key={i} className="card bg-base-200 card-compact">
                                <div className="card-body font-mono text-xs">
                                  <div><strong>Input:</strong> {tc.stdin}</div>
                                  <div><strong>Expected:</strong> {tc.expected_output}</div>
                                  <div><strong>Output:</strong> {tc.stdout}</div>
                                  <div className="text-success">✓ Passed</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="alert alert-error">
                            <span className="font-semibold">❌ Test Failed</span>
                          </div>
                          <div className="space-y-2">
                            {runResult.testCases.map((tc, i) => (
                              <div key={i} className="card bg-base-200 card-compact">
                                <div className="card-body font-mono text-xs">
                                  <div><strong>Input:</strong> {tc.stdin}</div>
                                  <div><strong>Expected:</strong> {tc.expected_output}</div>
                                  <div><strong>Output:</strong> {tc.stdout}</div>
                                  <div className={tc.status_id == 3 ? 'text-success' : 'text-error'}>
                                    {tc.status_id == 3 ? '✓ Passed' : '✗ Failed'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-base-content/50">
                      Click "Run" to test your code
                    </div>
                  )}
                </div>
              )}

              {activeRightTab === 'result' && (
                <div>
                  {submitResult ? (
                    <div className="space-y-4">
                      <div className={`alert ${submitResult.accepted ? 'alert-success' : 'alert-error'}`}>
                        <div>
                          <h4 className="font-bold text-lg">
                            {submitResult.accepted ? '🎉 Accepted' : '❌ ' + submitResult.error}
                          </h4>
                        </div>
                      </div>
                      <div className="stats shadow w-full">
                        <div className="stat">
                          <div className="stat-title">Test Cases</div>
                          <div className="stat-value text-2xl">
                            {submitResult.passedTestCases}/{submitResult.totalTestCases}
                          </div>
                        </div>
                        <div className="stat">
                          <div className="stat-title">Runtime</div>
                          <div className="stat-value text-2xl">{submitResult.runtime} sec</div>
                        </div>
                        <div className="stat">
                          <div className="stat-title">Memory</div>
                          <div className="stat-value text-2xl">{submitResult.memory} KB</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-base-content/50">
                      Click "Submit" to evaluate your solution
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;