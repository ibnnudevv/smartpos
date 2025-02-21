import prisma from "@/lib/prisma";
import { kategoriBarangSchema } from "@/schemas/kategori-barang";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";

// Update kategori barang
export async function PUT(req: NextRequest) {
  await auth.protect();

  try {
    const body = await req.json();
    await kategoriBarangSchema.validate(body, { abortEarly: false });

    if (!body.id) {
      return NextResponse.json(
        { success: false, statusCode: 400, message: "ID tidak valid" },
        { status: 400 }
      );
    }

    const kategoriBarang = await prisma.kategoriBarang.update({
      where: { id: String(body.id) },
      data: { nama: body.nama },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "Kategori barang berhasil diupdate",
        data: kategoriBarang,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, statusCode: 400, message: error.errors.join(", ") },
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

// Tambah kategori barang
export async function POST(req: NextRequest) {
  await auth.protect();

  try {
    const body = await req.json();
    await kategoriBarangSchema.validate(body, { abortEarly: false });

    const kategoriBarangExist = await prisma.kategoriBarang.findFirst({
      where: { nama: body.nama },
    });

    if (kategoriBarangExist) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          message: "Kategori sudah digunakan",
        },
        { status: 400 }
      );
    }

    const kategoriBarang = await prisma.kategoriBarang.create({
      data: { nama: body.nama },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: "Kategori barang berhasil ditambahkan",
        data: kategoriBarang,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, statusCode: 400, message: error.errors.join(", ") },
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

// Ambil semua kategori barang
export async function GET() {
  await auth.protect();

  const listKategoriBarang = await prisma.kategoriBarang.findMany({
    where: { isActive: true },
  });

  return NextResponse.json({ success: true, data: listKategoriBarang });
}

// Ambil kategori barang berdasarkan ID
export async function GETBYID(req: NextRequest) {
  await auth.protect();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, statusCode: 400, message: "ID tidak valid" },
        { status: 400 }
      );
    }

    const kategoriBarang = await prisma.kategoriBarang.findUnique({
      where: { id: String(id) },
    });

    if (!kategoriBarang) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 404,
          message: "Kategori barang tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: kategoriBarang });
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

// Soft delete kategori barang
export async function DELETE(req: NextRequest) {
  await auth.protect();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, statusCode: 400, message: "ID tidak valid" },
        { status: 400 }
      );
    }

    await prisma.kategoriBarang.update({
      where: { id: String(id) },
      data: { isActive: false },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "Kategori barang berhasil dihapus",
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
