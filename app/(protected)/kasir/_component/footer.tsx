import { Input } from "@/components/ui/input";
import React, { useState } from "react";

interface FooterComponentProps {
  subTotal: number;
  pajak: number;
  total: number;
}

const FooterComponent: React.FC<FooterComponentProps> = ({
  subTotal,
  pajak,
  total,
}) => {
  const [discount, setDiscount] = useState<string>("5%");

  const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDiscount(event.target.value);
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
  };

  return (
    <div className="flex justify-end gap-8 mt-4">
      {/* <div>
        <div className="text-sm text-muted-foreground">DISKON (F6)</div>
        <Input
          value={discount}
          className="w-24"
          onChange={handleDiscountChange}
        />
      </div> */}
      <div>
        <div className="text-sm text-muted-foreground">SUBTOTAL:</div>
        <div className="font-bold">{formatCurrency(subTotal)}</div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">PAJAK:</div>
        <div className="font-bold">{formatCurrency(pajak)}</div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">TOTAL:</div>
        <div className="font-bold text-[#C41E3A]">{formatCurrency(total)}</div>
      </div>
    </div>
  );
};

export default FooterComponent;
