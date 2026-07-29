import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { Prisma, ChannelRole, ChannelType } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { generateUniqueChannelSlug } from '@/utils/generateUniqueChannelSlug';
// import { generateUniqueChannelSlug } from '@/lib/utils/generateUniqueChannelSlug';

type SignupInput = {
  name: string;
  email: string;
  password: string;
};

export async function loginService(data: { email: string; password: string }) {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (!user.password) {
    throw new Error('This account uses Google Sign-In. Please continue with Google.');
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

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
      role: user.role,
    },
    message: 'Login successful',
  };
}

export async function signupService({ name, email, password }: SignupInput) {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create User + Personal Channel + Owner Membership
    const { user, channel } = await prisma.$transaction(async (tx) => {
      // Create User
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Generate unique slug
      const slug = await generateUniqueChannelSlug(tx, user.name);

      // Create Personal Channel
      const channel = await tx.channel.create({
        data: {
          title: user.name,
          slug,
          type: ChannelType.USER,

          createdById: user.id,
          ownerId: user.id,
        },
      });

      // Add Owner Membership
      await tx.channelTeam.create({
        data: {
          userId: user.id,
          channelId: channel.id,
          role: ChannelRole.OWNER,
        },
      });

      return {
        user,
        channel,
      };
    });

    // Generate JWT AFTER transaction
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

      channel: {
        id: channel.id,
        title: channel.title,
        slug: channel.slug,
        type: channel.type,
      },

      message: 'Account created successfully',
    };
  } catch (error) {
    // Prisma unique constraint
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error('User already exists');
    }

    throw error;
  }
}

export async function getCurrentUserService() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    throw new Error('Unauthorized');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
    id: string;
  };

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  };
}
