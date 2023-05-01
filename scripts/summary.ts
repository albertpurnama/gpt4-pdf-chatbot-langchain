// this script is to simulate summary

import { CustomPDFLoader } from "@/utils/customPDFLoader";
import { makeSummaryChain } from "@/utils/makeSummaryChain";
import { ChainValues } from "langchain/schema";
import { Document } from "langchain/document";
import { DirectoryLoader } from "langchain/document_loaders";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";


const filePath = 'docs';

const file = 'docs/the-power-of-math.pdf';

let rawDocs: Document<Record<string,any>>[] = [];

if(file) {
  const loader = new CustomPDFLoader(file);
  rawDocs = await loader.load();
} else {
  /*load raw docs from the all files in the directory */
  const directoryLoader = new DirectoryLoader(filePath, {
    '.pdf': (path) => new CustomPDFLoader(path)
  });

  // const loader = new PDFLoader(filePath);
  rawDocs = await directoryLoader.load();
}


/* Split text into chunks */
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 0,
});


const docs = await textSplitter.splitDocuments(rawDocs);

console.log('split docs length:', docs.length);
console.log(docs[0])

const chain = makeSummaryChain();
// const chain = makeRefineSummaryChain();

const MAX_DOCS_LENGTH = 49; // max length of docs at one time

function convertResultToDocs(result: ChainValues): Document {
  return {
    pageContent: result.text,
    metadata: {}
  }
}

// divide and conquer the docs summarization to avoid hitting token
// limit.
async function dnq(ds: typeof docs): Promise<ChainValues> {
  if(ds.length > MAX_DOCS_LENGTH) {
    // compute first half of the docs 
    const firstHalf = ds.slice(0, Math.floor(ds.length / 2));
    const secondHalf = ds.slice(Math.floor(ds.length / 2), ds.length);

    const firstHalfResp = await dnq(firstHalf);
    const secondHalfResp = await dnq(secondHalf);

    // combine both responses
    const combinedResp = await chain.call({
      input_documents: [convertResultToDocs(firstHalfResp), convertResultToDocs(secondHalfResp)]
    });
    return combinedResp;
  }

  const resp = await chain.call({
    input_documents: ds,
  });
  return resp;
}

const resp = await dnq(docs)
console.log({resp});