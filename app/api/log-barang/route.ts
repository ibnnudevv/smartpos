import prisma from "@/lib/prisma";
import { logBarangSchema } from "@/schemas/log-barang";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";

// Tambah LogBarang (Barang Masuk/Keluar)
export async function POST(req: Request) {
  await auth.protect();

  try {
    const body = await req.json();

    await logBarangSchema.validate(body, { abortEarly: false });

    const log = await prisma.logBarang.create({
      data: {
        barangId: body.barangId,
        cabangId: body.cabangId,
        jumlah: body.jumlah,
        jenis: body.jenis,
        createdUserId: body.createdUserId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: "Log barang berhasil ditambahkan",
        data: log,
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

// Ambil semua LogBarang
export async function GET() {
  await auth.protect();

  const logs = await prisma.logBarang.findMany({
    include: {
      barang: true,
      cabang: true,
      createdUser: true,
    },
    where: {
      isActive: true,
    },
  });

  return NextResponse.json({ success: true, data: logs });
}

// Ambil LogBarang berdasarkan ID
export async function GET_id(req: NextRequest) {
  await auth.protect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const log = await prisma.logBarang.findUnique({
    where: {
      id: String(id),
    },
    include: {
      barang: true,
      cabang: true,
      createdUser: true,
    },
  });

  if (!log) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 404,
        message: "Log barang tidak ditemukan",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: log });
}

// Hapus LogBarang (soft delete)
export async function DELETE(req: NextRequest) {
  await auth.protect();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await prisma.logBarang.update({
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
        message: "Log barang berhasil dihapus",
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
