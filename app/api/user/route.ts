import prisma from "@/lib/prisma";
import { updateUserSchema, userSchema } from "@/schemas/user";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";

// update
export async function PUT(req: Request) {
  await auth.protect();

  try {
    const body = await req.json();

    await updateUserSchema.validate(body, { abortEarly: false });

    const user = await prisma.user.update({
      where: {
        id: body.id,
      },
      data: {
        nama: body.nama,
        username: body.username,
        email: body.email,
        cabangId: body.cabangId,
        role: body.role,
      },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "User berhasil diupdate",
        data: user,
      },
      { status: 200 }
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
    where: {
      isActive: true,
    },
  });

  return NextResponse.json({ success: true, data: users });
}

// get by id
export async function GET_id(req: NextRequest) {
  await auth.protect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const user = await prisma.user.findUnique({
    where: {
      id: String(id),
    },
    include: {
      cabang: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 404,
        message: "User tidak ditemukan",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: user });
}

// delete: DELETE /api/user?id=1
export async function DELETE(req: NextRequest) {
  await auth.protect();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await prisma.user.update({
      where: {
        id: String(id),
      },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "User berhasil dihapus",
      },
      { status: 200 }
    );
  } catch (error) {
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
