import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";
import React from "react";
import { DraftModal } from "../_action_form/draft-modal";
import { KasirSift } from "../_action_form/kasir-sift-modal";

const ButtonWidgetComponent = ({
  userId,
  information,
  items,
  setItems,
  handleResetItems,
}: {
  userId: string;
  information: {
    userId: string;
    cabangId: string;
  };
  items: any[];
  setItems: any;
  handleResetItems: () => void;
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* <Button variant="outline" size="sm">
        <FileText className="w-4 h-4 mr-2" /> BARU (F11)
      </Button> */}
      {/* <Button variant="outline" size="sm">
        <FileText className="w-4 h-4 mr-2" /> BUKA KASIR (CTRL+F11)
      </Button> */}
      <KasirSift userId={userId} />
      {/* <Button variant="outline" size="sm">
        <Hash className="w-4 h-4 mr-2" /> QTY (F4)
      </Button> */}
      <Button variant="outline" size="sm" onClick={handleResetItems}>
        <X className="w-4 h-4 mr-2" /> EMPTY (CTRL+SHIFT+F11)
      </Button>
      <DraftModal userId={userId} information={information} items={items} />
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
