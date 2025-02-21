import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isActive = searchParams.get("isActive");

    let cabang;

    if (isActive) {
      cabang = await prisma.cabang.findMany({
        where: {
          isActive: Boolean(isActive),
        },
      });
    } else {
      cabang = await prisma.cabang.findMany();
    }

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data: cabang,
        message: "Data berhasil diambil",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        data: null,
        message: "Terjadi kesalahan saat mengambil data",
      },
      { status: 500 }
    );
  }
}

export async function GET_BY_ID(req: NextRequest) {
  await auth.protect();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const cabang = await prisma.cabang.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!cabang) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 404,
          data: null,
          message: "Data tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data: cabang,
        message: "Data berhasil diambil",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        data: null,
        message: "Terjadi kesalahan saat mengambil data",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await auth.protect();
  try {
    const body = await req.json();
    const cabang = await prisma.cabang.create({
      data: {
        nama: body.nama,
      },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        data: cabang,
        message: "Data berhasil ditambahkan",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        data: null,
        message: "Terjadi kesalahan saat menambahkan data",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  await auth.protect();
  try {
    const body = await req.json();
    const cabang = await prisma.cabang.update({
      where: {
        id: body.id,
      },
      data: {
        nama: body.nama,
      },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data: cabang,
        message: "Data berhasil diubah",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        data: null,
        message: "Terjadi kesalahan saat mengubah data",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  await auth.protect();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await prisma.cabang.update({
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
        data: null,
        message: "Data berhasil dihapus",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        data: null,
        message: "Terjadi kesalahan saat menghapus data",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  await auth.protect();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status");

    const cabang = await prisma.cabang.update({
      where: {
        id: String(id),
      },
      data: {
        isActive: Boolean(status),
      },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data: cabang,
        message: "Data berhasil diubah",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        data: null,
        message: "Terjadi kesalahan saat mengubah data",
      },
      { status: 500 }
    );
  }
}
