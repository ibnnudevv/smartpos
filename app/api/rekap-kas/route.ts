import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cabangId = searchParams.get("cabangId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const whereClause: any = {};

    if (cabangId) {
      whereClause.cabangId = cabangId;
    }

    if (startDate && endDate) {
      whereClause.mulaiShift = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      whereClause.mulaiShift = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      whereClause.mulaiShift = {
        lte: new Date(endDate),
      };
    }

    const kasTransaksi = await prisma.kasirShift.findMany({
      where: whereClause,
      include: {
        user: {
          select: { nama: true }, // Mengambil nama kasir
        },
        cabang: {
          select: { nama: true }, // Mengambil nama cabang
        },
        KasTransaksi: {
          where: {
            jenis: { in: ["KAS_MASUK", "KAS_KELUAR"] },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        mulaiShift: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "Transaksi kas berhasil ditemukan",
        data: kasTransaksi,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message:
          error instanceof Error
            ? (error as Error).message
            : "Internal Server Error",
        data: null,
      },
      { status: 500 }
    );
  }
}
