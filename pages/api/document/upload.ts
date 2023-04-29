import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/db';
import { v4 as uuidv4 } from 'uuid';
import { NextApiRequest } from 'next';
import { run } from '@/scripts/ingest-data';
import { parseForm } from '@/utils/parse-form';
import { DocumentMetadata } from '@/types/document';
import formidable from 'formidable';

const processFile = async (file: formidable.File): Promise<DocumentMetadata> => {
  const metadata = {
    fileName: file.originalFilename,
    dbId: uuidv4(),
  };

  try {
    await run(file, {
      fileName: file.originalFilename,
      dbId: uuidv4(),
    })
  } catch (error) {
    console.log('error', error);
    throw new Error(`Failed to ingest your file: ${file.originalFilename}`);
  }

  return metadata;
}

export default withApiAuthRequired((async function myApiRoute(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const session = await getSession(req, res);
  if(!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const user = session.user;

  const { files } = await parseForm(req);

  try {
    let dbUser = await prisma.user.findFirst({
      where: {
        email: user.email
      }
    });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
        },
      });
    }

    let fileProcesses: Array<Promise<DocumentMetadata | undefined>> = [];

    // if file is an array, iterate through them, parses the files
    // and then store the files in pinecone.
    const allFiles = files.file
    if(Array.isArray(allFiles)) {
      fileProcesses = allFiles.map(async (file) => {
        try{
          const metadata = await processFile(file);
          return metadata
        } catch(error) {
          console.log('error processing file', error);
          return undefined;
        }
      });
    } else {
      fileProcesses = [allFiles].map(async (file) => {
        try{
          const metadata = await processFile(file);
          return metadata
        } catch(error) {
          console.log('error processing file', error);
          return undefined;
        }
      });
    }



    const metadataToInsert = await Promise.all(fileProcesses).then((metadata) => metadata);
      
    const documents = await prisma.documents.createMany({
      data: metadataToInsert.map((metadata) => ({
        // we know the user exist here otherwise we would have created it
        ownerId: dbUser!.id,
        metadata: metadata,
      })),
    });

    res.json({
      documents,
    })
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: error || 'Something went wrong' });
  }
}));
