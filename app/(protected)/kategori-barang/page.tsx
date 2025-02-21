"use client";

import React, { useEffect, useState } from "react";

import { DataTable } from "./_datatable/data-table";
import { columns } from "./_datatable/columns";
import axios from "axios";

const Page = () => {
  const [res, setRes] = useState([]);
  useEffect(() => {
    axios.get("/api/kategori-barang").then((response) => {
      setRes(response.data.data);
    });
  }, []);

  return (
    <>
      <h1 className="font-medium">Daftar Kategori Barang</h1>
      <DataTable columns={columns} data={res || []} />
    </>
  );
};

export default Page;
