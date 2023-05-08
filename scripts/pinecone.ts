import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from "@/config/pinecone";
import { pinecone } from "@/utils/pinecone-client";

// CREATING INDEX FOR THE FIRST TIME

// const resp = await pinecone.createIndex({
//   createRequest: {
//     name: PINECONE_INDEX_NAME,
//     dimension: 1536,
//     metadataConfig: {
//       "indexed": ["dbId"],
//     }
//   }
// })

// console.log(resp);


// DELETING EXAMPLE

// const resp = await pinecone.Index(PINECONE_INDEX_NAME)._delete({
//   deleteRequest: {
//     namespace: PINECONE_NAME_SPACE,
//     // deleteAll: true,
//     filter: {
//       'dbId': {
//         '$eq': '74af1de0-f37b-49a7-8f52-cfc25b0663e1',
//       },
//     }
//   }
// })
// console.log(resp);


// QUERYING EXAMPLE

// Array(1536).fill(0);

// const resp = await pinecone.Index(PINECONE_INDEX_NAME).query({
//   queryRequest: {
//     vector: Array(1536).fill(0),
//     namespace: "book",
//     topK: 5,
//     // filter: {
//     //   'dbId': {
//     //     '$eq': "d3f7f8f7-56b5-48dd-a96c-6cefc1f0a723"
//     //   }
//     // },
//     includeMetadata: true,
//   },
// })

// console.log(resp.matches);
