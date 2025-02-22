import prisma from "@/lib/prisma";
import { stokSchema } from "@/schemas/stok";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "yup";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const isActive = searchParams.get("isActive");
  if (isActive === "true") {
    const response = await prisma.stok.findMany({
      where: {
        jumlah: {
          gt: 0,
        },
        isActive: true,
      },
      include: {
        barang: true,
        cabang: true,
      },
    });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: "Data stok barang berhasil ditemukan",
      data: response,
    });
  }

  const response = await prisma.stok.findMany({
    include: {
      barang: true,
      cabang: true,
    },
  });

  return NextResponse.json({
    success: true,
    statusCode: 200,
    message: "Data stok barang berhasil ditemukan",
    data: response,
  });
}

export async function POST(req: Request) {
  await auth.protect();

  try {
    const body = await req.json();

    await stokSchema.validate(body, { abortEarly: false });

    const { barangId, cabangId, jumlah, createdUserId } = body;

    const result = await prisma.$transaction(async (tx) => {
      const existingStock = await tx.stok.findFirst({
        where: { barangId, cabangId },
      });

      let stok;
      let jenisLog: "MASUK" | "KELUAR";

      if (existingStock) {
        stok = await tx.stok.update({
          where: { id: existingStock.id },
          data: {
            jumlah: existingStock.jumlah + jumlah,
          },
        });
        jenisLog = "MASUK";
      } else {
        stok = await tx.stok.create({
          data: {
            barangId: String(barangId),
            cabangId: String(cabangId),
            jumlah,
          },
        });
        jenisLog = "MASUK";
      }

      // Buat log barang setelah stok berhasil diperbarui
      const logData: any = {
        barangId: String(barangId),
        cabangId: String(cabangId),
        jumlah,
        jenis: jenisLog,
      };

      if (createdUserId !== undefined) {
        logData.createdUserId = createdUserId;
      }

      const logBarang = await tx.logBarang.create({
        data: logData,
      });

      return { stok, logBarang };
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: "Stok barang berhasil diperbarui dan log dibuat",
        data: result,
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

    console.log(error);

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
