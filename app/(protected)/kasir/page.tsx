import React from "react";

// Datatabel component
import { DataTable } from "./_datatable/data-table";
import { columns } from "./_datatable/columns";
import prisma from "@/lib/prisma";

const Page = async () => {
  const res = await prisma.user.findMany({
    include: {
      cabang: true,
    },
  });

  return (
    <>
      <DataTable columns={columns} data={res} />
    </>
  );
};

export default Page;
