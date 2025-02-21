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
    axios.get("/api/user").then((response) => {
      setRes(response.data.data);
    });
  }, [refetchMap["fetch-karyawan"]]);

  console.log(res);

  return (
    <>
      <h1 className="font-medium text-lg">Daftar Karyawan</h1>
      <DataTable columns={columns} data={res} />
    </>
  );
};

export default Page;
