import prisma from "@/lib/prisma";
import { KasirShiftSchema } from "@/schemas/kasir-shift";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";

export async function POST(req: NextRequest) {
  await auth.protect();
  try {
    const body = await req.json();
    await KasirShiftSchema.validate(body, { abortEarly: false });

    const kasirShift = await prisma.kasirShift.create({
      data: body,
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        data: kasirShift,
        message: "Data berhasil ditambahkan",
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
