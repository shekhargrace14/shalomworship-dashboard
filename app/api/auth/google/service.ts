import { prisma } from '@/lib/prisma';
import { ChannelRole, ChannelType, Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { generateUniqueChannelSlug } from '@/utils/generateUniqueChannelSlug';

type GooglePayload = {
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
};

export async function googleLoginService(payload: GooglePayload) {
  let user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  // Existing user
  if (user) {
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1d',
      },
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      },
      message: 'Login successful',
    };
  }

  // New user
  try {
    const { user: newUser } = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: payload.name ?? '',
          email: payload.email,
          password: null,
          image: payload.picture,
          verified: true,
          emailVerified: payload.email_verified ?? true,
        },
      });

      const slug = await generateUniqueChannelSlug(tx, user.name);

      const channel = await tx.channel.create({
        data: {
          title: user.name,
          slug,
          type: ChannelType.USER,
          createdById: user.id,
          ownerId: user.id,
        },
      });

      await tx.channelTeam.create({
        data: {
          userId: user.id,
          channelId: channel.id,
          role: ChannelRole.OWNER,
        },
      });

      return { user, channel };
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        role: newUser.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1d',
      },
    );

    return {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        image: newUser.image,
        role: newUser.role,
      },
      message: 'Account created successfully',
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error('User already exists');
    }

    throw error;
  }
}
