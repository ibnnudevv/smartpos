import prisma from "@/lib/prisma";
import { KasirShiftSchema } from "@/schemas/kasir-shift";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cabangId = searchParams.get("cabangId");
  const userId = searchParams.get("userId");

  if (!cabangId || !userId) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 400,
        message: "CabangId dan userId harus diisi",
      },
      { status: 400 }
    );
  }

  try {
    const response = await prisma.kasirShift.findFirst({
      where: {
        userId,
        cabangId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: "Data kasir shift berhasil ditemukan",
      data: response,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message:
          (error as Error).message ||
          "Terjadi kesalahan saat mengambil data kasir shift",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tipe = searchParams.get("tipe");

  if (tipe !== "buka") {
    return NextResponse.json(
      {
        success: false,
        statusCode: 400,
        message: "Tipe operasi tidak valid. Hanya 'buka' yang diizinkan.",
      },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    await KasirShiftSchema.validate(body, { abortEarly: false });

    const { userId, cabangId, saldoAwal, saldoAkhir } = body;

    const shiftAktif = await prisma.kasirShift.findFirst({
      where: {
        userId,
        cabangId,
        status: "AKTIF",
      },
    });

    if (shiftAktif) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          message: "Kasir masih memiliki shift yang aktif.",
          data: shiftAktif,
        },
        { status: 400 }
      );
    }

    const response = await prisma.kasirShift.create({
      data: {
        userId,
        cabangId,
        saldoAwal,
        saldoAkhir,
      },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data: response,
        message: "Kasir berhasil dibuka.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          message: "Validasi data gagal.",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "Terjadi kesalahan server.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tipe = searchParams.get("tipe");

  if (tipe !== "tutup") {
    return NextResponse.json(
      {
        success: false,
        statusCode: 400,
        message: "Tipe operasi tidak valid. Hanya 'tutup' yang diizinkan.",
      },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { userId, cabangId } = body;

    const shiftAktif = await prisma.kasirShift.findFirst({
      where: {
        userId,
        cabangId,
        status: "AKTIF",
      },
    });

    if (!shiftAktif) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          message: "Tidak ada shift kasir yang aktif untuk ditutup.",
        },
        { status: 400 }
      );
    }

    const kasirShiftId = shiftAktif.id;

    // Ambil data penjualan tunai dan non-tunai
    const penjualanTunai = await prisma.transaksi.aggregate({
      where: {
        userId,
        metodePembayaran: "TUNAI",
        DetailTransaksi: {
          some: {
            cabangId,
          },
        },
      },
      _sum: {
        total: true,
      },
    });

    const totalPenjualanTunai = penjualanTunai._sum.total || 0;

    const penjualanNonTunai = await prisma.transaksi.aggregate({
      where: {
        userId,
        NOT: {
          metodePembayaran: "TUNAI",
        },
        DetailTransaksi: {
          some: {
            cabangId,
          },
        },
      },
      _sum: {
        total: true,
      },
    });

    const totalPenjualanNonTunai = penjualanNonTunai._sum.total || 0;

    // Ambil data kas masuk dan kas keluar
    const kasMasuk = await prisma.kasTransaksi.aggregate({
      where: {
        kasirShiftId: kasirShiftId,
        jenis: "KAS_MASUK",
      },
      _sum: {
        jumlah: true,
      },
    });

    const totalKasMasuk = kasMasuk._sum.jumlah || 0;

    const kasKeluar = await prisma.kasTransaksi.aggregate({
      where: {
        kasirShiftId: kasirShiftId,
        jenis: "KAS_KELUAR",
      },
      _sum: {
        jumlah: true,
      },
    });

    const totalKasKeluar = kasKeluar._sum.jumlah || 0;

    // Hitung total penerimaan
    const tunaiDiterima =
      shiftAktif.saldoAwal +
      totalPenjualanTunai +
      totalKasMasuk -
      totalKasKeluar;
    const totalPenerimaanKasir = tunaiDiterima + totalPenjualanNonTunai;
    const totalPenerimaanSistem =
      shiftAktif.saldoAwal +
      totalPenjualanTunai +
      totalPenjualanNonTunai +
      totalKasMasuk -
      totalKasKeluar;
    const selisih = totalPenerimaanKasir - totalPenerimaanSistem;

    const response = await prisma.kasirShift.update({
      where: {
        id: kasirShiftId,
      },
      data: {
        tutupShift: new Date(),
        saldoAkhir: tunaiDiterima,
        status: "TERTUTUP",
      },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data: {
          ...response,
          totalPenjualanTunai,
          totalPenjualanNonTunai,
          totalKasMasuk,
          totalKasKeluar,
          tunaiDiterima,
          totalPenerimaanKasir,
          totalPenerimaanSistem,
          selisih,
        },
        message: "Kasir berhasil ditutup.",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "Terjadi kesalahan server.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
