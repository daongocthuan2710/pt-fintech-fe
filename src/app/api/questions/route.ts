import { getServerSession } from 'next-auth';

import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const now = Date.now();
  if (
    !session ||
    !session.accessToken
    // || now > session.expiresAt
  ) {
    return new Response(JSON.stringify({ redirect: '/auth/login' }), { status: 401 });
  }

  if (!session || !session.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      folders: {
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      },
    },
  });

  return Response.json(user?.folders.flatMap((folder) => folder.questions));
}
