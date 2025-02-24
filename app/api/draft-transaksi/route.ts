import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";
import {
  DraftTransaksiSchema,
  DetailDraftTransaksiSchema,
} from "@/schemas/draft-transaksi";

// CREATE
export async function POST(req: Request) {
  await auth.protect();
  const user = await currentUser();

  try {
    const body = await req.json();
    await DraftTransaksiSchema.validate(body, { abortEarly: false });

    if (!user?.id) {
      return NextResponse.json(
        { success: false, statusCode: 400, message: "User ID is required" },
        { status: 400 }
      );
    }

    const draftTransaksi = await prisma.draftTransaksi.create({
      data: {
        userId: user.id,
        cabangId: body.cabangId,
        DetailDraftTransaksi: {
          create: body.DetailDraftTransaksi,
        },
      },
      include: {
        DetailDraftTransaksi: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: "Draft transaksi berhasil dibuat",
        data: draftTransaksi,
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

// UPDATE
export async function PUT(req: Request) {
  await auth.protect();

  try {
    const body = await req.json();
    await DetailDraftTransaksiSchema.validate(body, { abortEarly: false });

    const detailDraftTransaksi = await prisma.detailDraftTransaksi.update({
      where: { id: body.id },
      data: {
        barangId: body.barangId,
        jumlah: body.jumlah,
        harga: body.harga,
        diskon: body.diskon,
      },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "Detail draft transaksi berhasil diupdate",
        data: detailDraftTransaksi,
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

// DELETE
export async function DELETE(req: NextRequest) {
  await auth.protect();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await prisma.detailDraftTransaksi.delete({ where: { id: String(id) } });

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "Detail draft transaksi berhasil dihapus",
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

// PROCEED (Konversi Draft ke Transaksi)
export async function PATCH(req: Request) {
  await auth.protect();

  try {
    const body = await req.json();
    const draftTransaksi = await prisma.draftTransaksi.findUnique({
      where: { id: body.draftId },
      include: { DetailDraftTransaksi: true },
    });

    if (!draftTransaksi) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 404,
          message: "Draft transaksi tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const transaksi = await prisma.transaksi.create({
      data: {
        userId: draftTransaksi.userId,
        kode: `TRX-${Date.now()}`, // generate kode transaksi
        DetailTransaksi: {
          create: draftTransaksi.DetailDraftTransaksi.map((detail) => ({
            barangId: detail.barangId,
            jumlah: detail.jumlah,
            harga: detail.harga,
            diskon: detail.diskon,
            cabangId: draftTransaksi.cabangId,
            createdUserId: draftTransaksi.userId,
          })),
        },
      },
    });

    await prisma.draftTransaksi.delete({ where: { id: body.draftId } });

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "Transaksi berhasil diproses",
        data: transaksi,
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

// CANCEL (Hapus Draft)
export async function DELETE_draft(req: NextRequest) {
  await auth.protect();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await prisma.draftTransaksi.delete({ where: { id: String(id) } });

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "Draft transaksi berhasil dibatalkan",
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
