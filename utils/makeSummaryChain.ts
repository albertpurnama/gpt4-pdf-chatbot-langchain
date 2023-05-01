import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { BaseChain, ConversationalRetrievalQAChain, LLMChain, RefineDocumentsChain, SerializedMapReduceDocumentsChain, loadSummarizationChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain';
import { ChainValues } from 'langchain/dist/schema';
import { StuffDocumentsChainInput } from 'langchain/dist/chains/combine_docs_chain';

export const makeSummaryChain = () => {
  const model = new OpenAI({
    temperature: 0, // increase temepreature to get more creative answers
    modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access
  });

  const chain = loadSummarizationChain(model);
  return chain;
};

const refinePromptTemplate = `Your job is to produce a final summary
We have provided an existing summary up to a certain point: "{existing_answer}"
We have the opportunity to refine the existing summary
(only if needed) with some more context below.
------------
"{text}"
------------

Given the new context, refine the original summary
If the context isn't useful, return the original summary.

REFINED SUMMARY:`

const REFINE_PROMPT = new PromptTemplate({
  template: refinePromptTemplate,
  inputVariables: ['existing_answer', 'text'],
})

const defaultSummaryPrompt = `Write a concise summary of the following:


"{text}"


CONCISE SUMMARY:`;

export const DEFAULT_PROMPT =  new PromptTemplate({
  template: defaultSummaryPrompt,
  inputVariables: ["text"],
});

export const makeRefineSummaryChain = () => {
  const model = new OpenAI({
    temperature: 0, // increase temepreature to get more creative answers
    modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access
  });

  const llmChain = new LLMChain({prompt: DEFAULT_PROMPT, llm: model});
  const refineChain = new LLMChain({prompt: REFINE_PROMPT, llm: model});


  const chain = new RefineDocumentsChain({
    llmChain: llmChain,
    refineLLMChain: refineChain,
    documentVariableName: 'text',
  })

  return chain;
}
