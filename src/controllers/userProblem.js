const {getLanguageById,submitBatch} = require("../utils/problemUtility")

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
        }
    } catch (err){
        res.status(400).send("Error: "+err);
    }
}
module.exports = createProblem;