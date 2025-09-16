const Problem = require("../models/problem");
const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility")

const createProblem = async (req,res)=>{
    const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body;

    try{
        for(const {language,completeCode} of referenceSolution){
        
        const languageId = getLanguageById(language); 
        // Batch Submission 
        const submissions = visibleTestCases.map((testcase)=>({
            // source_code:
            source_code:completeCode,
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
        
        for (const test of testResult){
            if(test.status_id !=3){
               return res.status(400).send("Error Occured")
            }
        }
     }
    //  saving in the DB
     const userProblem =  await Problem.create({
        ...req.body,
        problemCreator: req.result._id
      });

      res.status(201).send("Problem Saved Successfully");
    } catch (err){
        res.status(400).send("Error: "+err);
    }
}
const updateProblem = async (req,res)=>{
 const {id} = req.params;
 const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body;
    try {
        
    } catch (err) {
        
    }
}
module.exports = {createProblem, updateProblem};