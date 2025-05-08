import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/utils/auth';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password = '', name } = await req.json();
  console.log({ email, password, name });
  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: 'Email đã tồn tại' }, { status: 400 });
  }

  const hashedPassword = await hashPassword(String(password));

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ message: 'Đăng ký thành công', user });
}
