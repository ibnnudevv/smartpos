import { Button } from "@/components/ui/button";
import { FileText, Hash, HelpCircle, Save, X } from "lucide-react";
import React from "react";

const ButtonWidgetComponent = () => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button variant="outline" size="sm">
        <FileText className="w-4 h-4 mr-2" /> BARU (F11)
      </Button>
      <Button variant="outline" size="sm">
        <FileText className="w-4 h-4 mr-2" /> BUKA (CTRL+F11)
      </Button>
      <Button variant="outline" size="sm">
        <Hash className="w-4 h-4 mr-2" /> QTY (F4)
      </Button>
      <Button variant="outline" size="sm">
        <X className="w-4 h-4 mr-2" /> VOID (CTRL+SHIFT+F11)
      </Button>
      <Button variant="outline" size="sm">
        <Save className="w-4 h-4 mr-2" /> DRAFT (F7)
      </Button>
      <Button variant="outline" size="sm">
        <FileText className="w-4 h-4 mr-2" /> BUKA DRAFT (CTRL+F7)
      </Button>
      <Button variant="outline" size="sm">
        <HelpCircle className="w-4 h-4 mr-2" /> BANTUAN (CTRL+H)
      </Button>
    </div>
  );
};

export default ButtonWidgetComponent;
