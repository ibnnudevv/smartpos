"use client";

import React, { useEffect, useState } from "react";

const HeaderComponent = ({ tx }: { tx: string }) => {
  return (
    <header className="bg-[#C41E3A] text-white p-4 rounded-lg">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-2xl font-bold">KASIR PENJUALAN</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-200">PELANGGAN:</div>
              <div className="font-bold">TUNAI</div>
            </div>
            <div>
              <div className="text-gray-200">TANGGAL:</div>
              <div className="font-bold">{new Date().toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-gray-200">NO. PENJUALAN:</div>
              <div className="font-bold">{tx}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
