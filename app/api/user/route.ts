import prisma from "@/lib/prisma";
import userSchema from "@/schemas/user";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";

export async function POST(req: Request) {
  await auth.protect();

  try {
    const body = await req.json();

    await userSchema.validate(body, { abortEarly: false });

    // check if username already exists
    const userExists = await prisma.user.findUnique({
      where: {
        username: body.username,
      },
    });

    if (userExists) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          message: "Username sudah digunakan",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        nama: body.nama,
        username: body.username,
        email: body.email,
        password: body.password,
        cabangId: body.cabangId,
        role: body.role,
      },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: "User berhasil ditambahkan",
        data: user,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          message: error.errors.join(", "),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  await auth.protect();

  const users = await prisma.user.findMany({
    include: {
      cabang: true,
    },
  });

  return NextResponse.json({ success: true, data: users });
}