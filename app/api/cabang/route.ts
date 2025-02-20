import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cabang = await prisma.cabang.findMany();
    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: cabang,
      message: "Data berhasil diambil",
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      statusCode: 500,
      data: null,
      message: "Terjadi kesalahan saat mengambil data",
    }, { status: 500 });
  }
}
