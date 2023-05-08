import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
import { prisma } from '@/db';
import { pinecone } from '@/utils/pinecone-client';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { Prisma } from '@prisma/client';

const constructMetadataFilter = (dbId: string) => ({
  'dbId': {
    '$eq': dbId
  }
})

export default withApiAuthRequired(async function myApiRoute(req, res) {
  // check method is DELETE
  if (req.method !== 'DELETE') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const session = await getSession(req, res);
  if(!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const user = session.user;
  console.log({user})

  try {
    let dbUser = await prisma.user.findUnique({
      where: {
        email: user.email
      },
    });

    let doc = await prisma.documents.findUnique({
      where: {
        id: parseInt(req.query.id as string),
      }
    })


    if(!dbUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if(doc && doc.metadata) {
      const resp = await pinecone.Index(PINECONE_INDEX_NAME)._delete({
        deleteRequest: {
          namespace: PINECONE_NAME_SPACE,
          filter: constructMetadataFilter(JSON.parse(JSON.stringify(doc?.metadata || {})).dbId || ''),
        },
      })
      console.log('resp', resp);

      await prisma.documents.delete({
        where: {
          id: parseInt(req.query.id as string),
        },
      });
    }

    const documentId = req.query.id as string;

    res.status(200).json({
      id: documentId,
    })
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: error || 'Something went wrong' });
  }
});
