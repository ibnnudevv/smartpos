"use client";

import React, { useEffect, useState } from "react";

import { DataTable } from "./_datatable/data-table";
import { columns } from "./_datatable/columns";
import axios from "axios";
import { useRefetch } from "@/context/refetch";

const Page = () => {
  const { refetchMap } = useRefetch();
  const [res, setRes] = useState([]);
  useEffect(() => {
    axios.get("/api/stok?isActive=true").then((response) => {
      setRes(response.data.data);
    });
  }, [refetchMap["fetch-stok"]]);

  return (
    <>
      <h1 className="font-medium text-lg">Daftar Stok</h1>
      <DataTable columns={columns} data={res || []} />
    </>
  );
};

export default Page;
