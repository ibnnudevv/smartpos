import { Input } from "@/components/ui/input";
import React from "react";

const FooterComponent = () => {
  return (
    <div className="flex justify-end gap-8 mt-4">
      <div>
        <div className="text-sm text-muted-foreground">DISKON (F6)</div>
        <Input value="5%" className="w-24" onChange={() => {}} />
      </div>
      <div>
        <div className="text-sm text-muted-foreground">SUBTOTAL:</div>
        <div className="font-bold">133,100</div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">PAJAK:</div>
        <div className="font-bold">0</div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">TOTAL:</div>
        <div className="font-bold text-[#C41E3A]">126,445,999</div>
      </div>
    </div>
  );
};

export default FooterComponent;
