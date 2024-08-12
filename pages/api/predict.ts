import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import pdf from 'pdf-parse';
import { loadEnvConfig } from '@next/env';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
loadEnvConfig(process.cwd());

// Initialize Gemini client
const apiKey = process.env.API_KEY;
if (!apiKey) throw new Error('API_KEY is not defined');
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const form = new IncomingForm({
  multiples: true,
  keepExtensions: true,
  uploadDir: '/tmp',
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Request method:', req.method);

  if (req.method !== 'POST') {
    console.log(`Method ${req.method} not allowed`);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { fields, files } = await parseForm(req);
    const { university, satScore, gpa, userRequest, cvText, others } = await processFiles(fields, files);
    const searchResults = await performSearch(university, userRequest); // Pass userRequest to performSearch
    const detailedPrompt = createDetailedPrompt(userRequest, cvText, satScore, gpa, others, searchResults);
    const detailedResponse = await getGeminiChatCompletion(detailedPrompt);

    let responseContent = '';
    if (detailedResponse.text) {
      responseContent = detailedResponse.text.trim();
      if (!responseContent) {
        return res.status(500).json({ message: 'Detailed response content not found.' });
      }
    } else {
      return res.status(500).json({ message: detailedResponse.error });
    }

    const formattedResponse = formatResponse(responseContent);
    res.status(200).json({ message: formattedResponse });
  } catch (error) {
    console.error('Error during request handling:', error);
    res.status(500).json({ message: 'Prediction failed', error: (error as Error).message });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;

const parseForm = (req: NextApiRequest): Promise<{ fields: any; files: any }> => {
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        reject(err);
      } else {
        console.log('Form parsed successfully:', { fields, files });
        resolve({ fields, files });
      }
    });
  });
};

const processFiles = async (fields: any, files: any) => {
  const university = fields.university?.[0] || '';
  const satScore = fields.satScore || '';
  const gpa = fields.gpa || '';
  const userRequest = fields.message || '';
  const others = fields.others || '';

  console.log('Parsed fields:', { university, satScore, gpa, userRequest, others });
  console.log('Parsed files:', files);

  const cvFile = files?.['cv']?.[0];

  let cvText = '';

  if (cvFile) {
    const cvBuffer = await fs.readFile(cvFile.filepath);
    cvText = await pdf(cvBuffer).then((data) => data.text);
    console.log('CV text extracted:', cvText);
  }

  return { university, satScore, gpa, userRequest, cvText, others };
};

const performSearch = async (university: string, userRequest: string): Promise<string[]> => {
  const searchPrompts = [
    `common data sets ${university} 2025`,
    `first year high school student application requirements ${university} 2025`,
    `first year high school student application deadlines ${university} 2025`,
    `undergraduate admission statistics ${university} 2025`,
    `financial aid options for ${university} 2025`,
    `application essay prompts ${university} 2025`,
    `scholarship opportunities ${university} 2025`,
    `admissions process overview ${university} 2025`,
    `housing and dormitory options ${university} 2025`,
    `campus life and student activities ${university} 2025`,
    `${userRequest} ${university}`
  ];

  console.log('Using predefined search prompts:', searchPrompts);

  const searchResults = await Promise.all(searchPrompts.map((prompt) => searchWithGoogleCustomSearch(prompt)));
  console.log('Google Custom Search results:', searchResults);

  if (searchResults.every((result) => result === '')) {
    console.warn('No relevant search results found.');
    searchResults.push('No relevant search results found.');
  }

  // Join results and limit to 50000 tokens
  const joinedResults = searchResults.join('\n\n');
  return [trimToTokenLimit(joinedResults, 20000)];
};

const searchWithGoogleCustomSearch = async (query: string): Promise<string> => {
  const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.CUSTOM_SEARCH_API_KEY}&cx=${process.env.CUSTOM_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(searchUrl);
    const items = response.data.items || [];
    const results = items.map((item: any) => item.snippet).join('\n');
    return results.trim();
  } catch (error) {
    console.error('Error during Google Custom Search API call:', error);
    return '';
  }
};

const createDetailedPrompt = (userRequest: string, cvText: string, satScore: string, gpa: string, others: string, searchResults: string[]) => {
  const searchResultsTrimmed = searchResults.join('\n\n');

  return [
    {
      role: 'user',
      content: `Using the following details:
      - CV: ${cvText ? cvText : 'No CV provided'}
      - SAT Score: ${satScore ? satScore : 'No SAT score provided'}
      - GPA: ${gpa ? gpa : 'No GPA provided'}
      - International Scores: ${others ? others : 'No international scores provided'}
      - Search Results: ${searchResultsTrimmed}
      - User Request: ${userRequest}

      Answer this using all info you got in this prompt: ${userRequest}. Provide detailed and specific tips to improve the user's chances of getting accepted to their chosen university. Structure the information clearly (like deadlines, requirements, etc.). Use ONLY the following symbols for formatting:
      - **bold text** for important points
      - *italic text* for emphasis
      - ## Section Header for section titles
      - - List item for bullet points
      
      End by asking if the user needs further assistance. Use a conversational tone like you're speaking to a friend. write MAXIMUM 100 words (or if needed 150-200). Make SPECIFIC tips and add examples. and DO NOT write the word count at the end.`,
    }
  ];
};

const getGeminiChatCompletion = async (messages: any[]) => {
  try {
    const result = await model.generateContent(messages[0].content);
    return { text: result.response.text() };
  } catch (error: any) {
    console.error('Error in Gemini API call:', error);
    return { error: error.message };
  }
};

const trimToTokenLimit = (text: string, tokenLimit: number): string => {
  const words = text.split(/\s+/);
  let tokenCount = 0;
  let result = [];

  for (const word of words) {
    tokenCount += word.length + 1; // Assuming 1 token per word + space
    if (tokenCount > tokenLimit) break;
    result.push(word);
  }

  return result.join(' ');
};

const formatResponse = (responseContent: string): string => {
  return responseContent
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.*?)\*/g, '<i>$1</i>')
    .replace(/## (.*?)\n/g, '<h2>$1</h2>')
    .replace(/\n- (.*?)/g, '<ul><li>$1</li></ul>')
    .replace(/\n/g, '<br>');
};