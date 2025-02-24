import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET_TRANSAKSI_KAS(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cabangId = searchParams.get("cabangId");

    const kasTransaksi = await prisma.kasirShift.findMany({
      where: cabangId ? { cabangId } : {},
      include: {
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
