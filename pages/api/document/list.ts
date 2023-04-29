import { prisma } from '@/db';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function myApiRoute(req, res) {
  const session = await getSession(req, res);
  if(!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const user = session.user;

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

    const documents = prisma.documents.findMany({
      where: {
        ownerId: dbUser.id
      }
    })

    res.json({
      documents,
    })
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: error || 'Something went wrong' });
  }
});
