const Problem = require ("../models/problem")
const Submission = require ("../models/submission")
const {getLanguageById, submitBatch, submitToken} = require("../utils/problemUtility")
const submitCode = async (req, res)=>{
try {
    const userId = req.result._id;
    const problemId = req.params.id;

    const {code, language} = req.body;

    if (!userId || !code || !problemId || !language)
        return res.status(400).send("Some Field Missing")
    if(language==='cpp')
        language='c++'
    // Fetch problem from DB
    const problem = await Problem.findById(problemId);

    // Store submission in DB
    const submittedResult = await Submission.create({
        userId,
        problemId,
        code,
        language,
        status:'pending',
        testCasesTotal: problem.hiddenTestCases.length
    })

    // Judge0 code submisson 
     const languageId = getLanguageById(language); 
     const submissions = problem.hiddenTestCases.map((testcase)=>({
            // source_code:
            source_code:code,
            // language_id:
            language_id: languageId,
            // stdin: 
            stdin: testcase.input,
            // expectedOutput:
            expected_output: testcase.output
        }));
    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value)=>value.token);
    const testResult = await submitToken(resultToken);
        // Update submittedResult
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let errorMessage = null;
    let status = 'accepted';
    for(const test of testResult){
        if(test.status_id == 3){
            testCasesPassed++;
            runtime = runtime + parseFloat(test.time);
            memory = Math.max(memory, test.memory);
        } else {
            if (test.status_id == 4){
                status = 'error'
                errorMessage = test.stderr;
            } else {
                status = 'wrong'
                errorMessage = test.stderr;
            }
        }
    }
    // Store the result in DB in Submission
    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;

    await submittedResult.save();
// will insert ProblemID in UserSchema of problemSolved 
if (!req.result.problemSolved.includes(problemId)){
    req.result.problemSolved.push(problemId);
    await req.result.save();
}

    const accepted = (status == 'accepted')
    res.status(201).json({
      accepted,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory
    });

} catch (err) {
    res.status(500).send("Internal Server Error" +err);
}
}
const runCode = async (req,res) => {
   try {
    const userId = req.result._id;
    const problemId = req.params.id;

    const {code, language} = req.body;

    if (!userId || !code || !problemId || !language)
        return res.status(400).send("Some Field Missing")

    // Fetch problem from DB
    const problem = await Problem.findById(problemId);
    if(language==='cpp')
        language='c++'
    // Judge0 code submisson 
     const languageId = getLanguageById(language); 
     const submissions = problem.visibleTestCases.map((testcase)=>({
            // source_code:
            source_code:code,
            // language_id:
            language_id: languageId,
            // stdin: 
            stdin: testcase.input,
            // expectedOutput:
            expected_output: testcase.output
        }));
    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value)=>value.token);
    const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;
    let errorMessage = null;

    for(const test of testResult){
        if(test.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time)
           memory = Math.max(memory,test.memory);
        }else{
          if(test.status_id==4){
            status = false
            errorMessage = test.stderr
          }
          else{
            status = false
            errorMessage = test.stderr
          }
        }
    }
    res.status(201).json({
    success:status,
    testCases: testResult,
    runtime,
    memory
   });

} catch (err) {
    res.status(500).send("Internal Server Error" +err);
} 
}
module.exports = {submitCode, runCode};