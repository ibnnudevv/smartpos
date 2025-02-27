"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import { DataTable } from "./_datatable/data-table";
import { columns } from "./_datatable/columns";
import { useRefetch } from "@/context/refetch";

class RekapKasService {
  async fetchDraftSales(
    startDate: string,
    endDate: string,
    cabangId: string
  ): Promise<any[]> {
    let url = "/api/draft-transaksi?";
    const params = new URLSearchParams();

    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (cabangId) params.append("cabangId", cabangId);

    url += params.toString();

    try {
      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching Rekap Kas:", error);
      return [];
    }
  }
}

interface TableFilterState {
  startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  endDate: string;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  cabangId: string;
  setCabangId: React.Dispatch<React.SetStateAction<string>>;
}

const Page = () => {
  const { refetchMap } = useRefetch();
  const [res, setRes] = useState<any[]>([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cabangId, setCabangId] = useState("");

  const tableState: TableFilterState = {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    cabangId,
    setCabangId,
  };

  const rekapKasService = new RekapKasService();

  const fetchData = async () => {
    const data = await rekapKasService.fetchDraftSales(
      startDate,
      endDate,
      cabangId
    );
    setRes(data);
  };

  useEffect(() => {
    fetchData();
  }, [refetchMap["fetch-draft-penjualan"], startDate, endDate, cabangId]);

  return (
    <>
      <h1 className="font-medium text-lg">Daftar Rekap Kas</h1>
      <DataTable tableState={tableState} columns={columns} data={res} />
    </>
  );
};

export default Page;
