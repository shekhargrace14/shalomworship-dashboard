import { prisma } from '@/lib/prisma';
import { AuthProvider, ChannelRole, ChannelType, Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { generateUniqueChannelSlug } from '@/utils/generateUniqueChannelSlug';

type GooglePayload = {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
};

export async function googleLoginService(payload: GooglePayload) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Find Google provider by Google's unique ID
      const existingGoogleProvider = await tx.authProviderAccount.findUnique({
        where: {
          provider_providerAccountId: {
            provider: AuthProvider.GOOGLE,
            providerAccountId: payload.sub,
          },
        },
        include: {
          user: true,
        },
      });

      // 2. Already linked → Login
      if (existingGoogleProvider) {
        return {
          user: existingGoogleProvider.user,
          message: 'Login successful',
        };
      }

      // 3. Not linked yet → Find user by email
      let user = await tx.user.findUnique({
        where: {
          email: payload.email,
        },
      });

      // 4. Existing credentials user → Link Google
      if (user) {
        await tx.authProviderAccount.create({
          data: {
            userId: user.id,
            provider: AuthProvider.GOOGLE,
            providerAccountId: payload.sub,
          },
        });

        return {
          user,
          message: 'Login successful',
        };
      }

      // 5. Brand new user
      user = await tx.user.create({
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

      await tx.authProviderAccount.create({
        data: {
          userId: user.id,
          provider: AuthProvider.GOOGLE,
          providerAccountId: payload.sub,
        },
      });

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

      return {
        user,
        message: 'Account created successfully',
      };
    });

    const token = jwt.sign(
      {
        id: result.user.id,
        role: result.user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1d',
      },
    );

    return {
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        image: result.user.image,
        role: result.user.role,
      },
      message: result.message,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error('User already exists');
    }

    throw error;
  }
}
