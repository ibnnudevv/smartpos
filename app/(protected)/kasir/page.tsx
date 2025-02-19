import React from "react";

// Datatabel component
import { DataTable } from "./_datatable/data-table";
import { columns, Payment } from "./_datatable/columns";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
  ];
}

const Page = async () => {
  const data = await getData();
  return (
    <>
      <DataTable columns={columns} data={data} />
    </>
  );
};

export default Page;
