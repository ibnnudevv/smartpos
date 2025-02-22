import React from "react";

import { Button } from "@/components/ui/button";
import { Hash, User, Search, MoreHorizontal, ShoppingCart } from "lucide-react";

const SidebarWidgetComponent = () => {
  return (
    <div className="space-y-2">
      <Button variant="outline" className="w-full justify-start">
        <Hash className="w-4 h-4 mr-2" /> HARGA (F2)
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <Hash className="w-4 h-4 mr-2" /> DISKON ITEM (F3)
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <User className="w-4 h-4 mr-2" /> MEMBER (CTRL+F5)
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <User className="w-4 h-4 mr-2" /> KASIR (CTRL+0)
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <Search className="w-4 h-4 mr-2" /> CEK HARGA (F8)
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <MoreHorizontal className="w-4 h-4 mr-2" /> LAINNYA (PAGE U/D)
      </Button>
      <Button className="w-full bg-[#C41E3A] hover:bg-[#A01830]">
        <ShoppingCart className="w-4 h-4 mr-2" /> BAYAR (F12)
      </Button>
    </div>
  );
};

export default SidebarWidgetComponent;
