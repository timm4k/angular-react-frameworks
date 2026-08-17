import type { Contact } from "./contactsSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Phone, User } from "lucide-react";

interface ContactCardProps {
  contact: Contact;
  selected: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
}

export function ContactCard({
  contact,
  selected,
  onToggleSelect,
  onEdit,
}: ContactCardProps) {
  return (
    <Card className="relative">
      <div className="absolute top-4 left-4">
        <Checkbox checked={selected} onCheckedChange={onToggleSelect} />
      </div>
      <CardHeader className="pl-10">
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="h-4 w-4 text-muted-foreground" />
          {contact.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-10 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-3.5 w-3.5" />
          {contact.phone}
        </span>
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
