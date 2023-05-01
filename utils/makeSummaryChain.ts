import { OpenAI } from 'langchain/llms/openai';
import { loadSummarizationChain } from 'langchain/chains';

export const makeSummaryChain = () => {
  const model = new OpenAI({
    temperature: 0, // increase temepreature to get more creative answers
    modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access
  });

  const chain = loadSummarizationChain(model);
  return chain;
};
