const axios = require("axios");

const getLanguageById = (lang) =>{
    const language = {
        "c":50,
        "java":96,
        "javascript":102,
        "python":109,
        "go":95,
        "c++":105
    }
    return language[lang.toLowerCase()];
}


const submitBatch = async (submissions)=>{
    const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'true'
  },
  headers: {
    'x-rapidapi-key': 'dfc220a61emshd48d96ae0e97723p139693jsn08b54d0f1019',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data
	} catch (error) {
		console.error(error);
	}
}

return await fetchData();

}
module.exports = {getLanguageById,submitBatch};