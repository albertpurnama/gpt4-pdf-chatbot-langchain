import { prisma } from '@/db';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function myApiRoute(req, res) {
  // console.log('got here')

  const session = await getSession(req, res);
  // console.log('session', session)
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
      include: {
        documents: true
      }
    });

    res.status(200).json({
      documents: dbUser?.documents,
    })
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: error || 'Something went wrong' });
  }
});
