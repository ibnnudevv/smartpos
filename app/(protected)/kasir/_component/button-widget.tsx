import { Button } from "@/components/ui/button";
import axios from "axios";
import { FileText, Hash, HelpCircle, Save, X } from "lucide-react";
import React from "react";
import { DraftModal } from "../_action_form/draft-modal";

const ButtonWidgetComponent = ({
  information,
  items,
  setItems,
}: {
  information: {
    userId: string;
    cabangId: string;
  };
  items: any[];
  setItems: any;
}) => {
  const handleResetItems = () => {
    confirm("Apakah anda yakin ingin mengosongkan item?") && setItems([]);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* <Button variant="outline" size="sm">
        <FileText className="w-4 h-4 mr-2" /> BARU (F11)
      </Button> */}
      <Button variant="outline" size="sm">
        <FileText className="w-4 h-4 mr-2" /> BUKA KASIR (CTRL+F11)
      </Button>
      {/* <Button variant="outline" size="sm">
        <Hash className="w-4 h-4 mr-2" /> QTY (F4)
      </Button> */}
      <Button variant="outline" size="sm" onClick={handleResetItems}>
        <X className="w-4 h-4 mr-2" /> EMPTY (CTRL+SHIFT+F11)
      </Button>
      <DraftModal information={information} items={items} />
      <Button variant="outline" size="sm">
        <FileText className="w-4 h-4 mr-2" /> BUKA DRAFT (CTRL+F7)
      </Button>
      {/* <Button variant="outline" size="sm">
        <HelpCircle className="w-4 h-4 mr-2" /> BANTUAN (CTRL+H)
      </Button> */}
    </div>
  );
};

export default ButtonWidgetComponent;
