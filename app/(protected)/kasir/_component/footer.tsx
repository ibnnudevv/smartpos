import { Input } from "@/components/ui/input";
import React from "react";

const FooterComponent = ({
  diskon,
  subTotal,
  pajak,
  total,
}: {
  diskon: number;
  subTotal: number;
  pajak: number;
  total: number;
}) => {
  return (
    <div className="flex justify-end gap-8 mt-4">
      <div>
        <div className="text-sm text-muted-foreground">DISKON (F6)</div>
        <Input value="5%" className="w-24" onChange={() => {}} />
      </div>
      <div>
        <div className="text-sm text-muted-foreground">SUBTOTAL:</div>
        <div className="font-bold">
          {subTotal.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          })}
        </div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">PAJAK:</div>
        <div className="font-bold">
          {pajak.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          })}
        </div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">TOTAL:</div>
        <div className="font-bold text-[#C41E3A]">
          {total.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          })}
        </div>
      </div>
    </div>
  );
};

export default FooterComponent;
