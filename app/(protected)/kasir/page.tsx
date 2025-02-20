"use client";

import React, { useEffect, useState } from "react";

import { DataTable } from "./_datatable/data-table";
import { columns } from "./_datatable/columns";
import axios from "axios";

const Page = () => {
  const [res, setRes] = useState([]);
  useEffect(() => {
    axios.get("/api/user").then((response) => {
      setRes(response.data.data);
    });
  }, []);

  return (
    <>
      <DataTable columns={columns} data={res} />
    </>
  );
};

export default Page;
