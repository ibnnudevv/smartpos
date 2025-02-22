import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";
import { barangSchema } from "@/schemas/barang";

// Update barang
export async function PUT(req: Request) {
  await auth.protect();

  try {
    const body = await req.json();
    await barangSchema.validate(body, { abortEarly: false });

    const barang = await prisma.barang.update({
      where: { id: body.id },
      data: {
        kode: body.kode,
        nama: body.nama,
        kategoriBarangId: body.kategoriBarangId,
        harga: body.harga,
        diskon: body.diskon,
      },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "Barang berhasil diupdate",
        data: barang,
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

// Tambah barang
export async function POST(req: Request) {
  await auth.protect();

  try {
    const body = await req.json();
    await barangSchema.validate(body, { abortEarly: false });

    const barang = await prisma.barang.create({
      data: {
        kode: body.kode,
        nama: body.nama,
        kategoriBarangId: body.kategoriBarangId,
        harga: body.harga,
        diskon: body.diskon,
      },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: "Barang berhasil ditambahkan",
        data: barang,
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

// Ambil semua barang
export async function GET(req: NextRequest) {
  // await auth.protect();

  const { searchParams } = new URL(req.url);
  const kode_barang = searchParams.get("kode_barang");
  const withParam = searchParams.get("with");
  let include: { [key: string]: boolean } = {};
  if (withParam) {
    const withArray = withParam.split(",");
    withArray.forEach((item) => {
      include[item] = true;
    });
  }

  if (kode_barang) {
    const barang = await prisma.barang.findMany({
      where: { kode: kode_barang, isActive: true },
      orderBy: { createdAt: "desc" },
      include: { KategoriBarang: true },
    });

    return NextResponse.json({ success: true, data: barang });
  }

  const barang = await prisma.barang.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: include,
  });

  return NextResponse.json({ success: true, data: barang });
}

// Ambil barang berdasarkan ID
export async function GET_id(req: NextRequest) {
  await auth.protect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const barang = await prisma.barang.findUnique({ where: { id: String(id) } });

  if (!barang) {
    return NextResponse.json(
      { success: false, statusCode: 404, message: "Barang tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: barang });
}

// Hapus barang (soft delete)
export async function DELETE(req: NextRequest) {
  await auth.protect();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await prisma.barang.update({
      where: { id: String(id) },
      data: { isActive: false },
    });

    return NextResponse.json(
      { success: true, statusCode: 200, message: "Barang berhasil dihapus" },
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
