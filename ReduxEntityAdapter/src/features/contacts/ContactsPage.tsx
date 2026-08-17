import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addContact, removeContacts, selectAllContacts } from "./contactsSlice";
import { ContactCard } from "./ContactCard";
import { EditContactDialog } from "./EditContactDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRY_CODES } from "@/lib/country-codes";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export function ContactsPage() {
  const dispatch = useAppDispatch();
  const contacts = useAppSelector(selectAllContacts);
  const [parent] = useAutoAnimate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("UA");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const currentDial =
    COUNTRY_CODES.find((c) => c.code === countryCode)?.dial ?? "+380";

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Name is required";
    if (!phone.trim()) next.phone = "Phone is required";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    const fullPhone = phone.startsWith("+")
      ? phone.trim()
      : `${currentDial} ${phone.trim()}`;
    dispatch(addContact(name.trim(), fullPhone));
    setName("");
    setPhone("");
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === contacts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(contacts.map((c) => c.id)));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAdd}
            className="grid grid-cols-[1fr_200px_1fr_auto] gap-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Lip Gallagher"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Country</Label>
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_CODES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.label} ({c.dial})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact-phone">Phone</Label>
              <Input
                id="contact-phone"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                placeholder="67 321 8845"
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone}</p>
              )}
            </div>
            <Button type="submit" className="self-end">
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Contacts ({contacts.length})</h2>
        {contacts.length > 0 && (
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={selectAll}>
              {selectedIds.size === contacts.length
                ? "Deselect All"
                : "Select All"}
            </Button>
            {selectedIds.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  dispatch(removeContacts(Array.from(selectedIds)));
                  setSelectedIds(new Set());
                }}
              >
                Delete Selected ({selectedIds.size})
              </Button>
            )}
          </div>
        )}
      </div>

      <div ref={parent} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            selected={selectedIds.has(contact.id)}
            onToggleSelect={() => toggleSelect(contact.id)}
            onEdit={() => setEditingId(contact.id)}
          />
        ))}
      </div>

      {contacts.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No contacts yet. Add one above.
        </p>
      )}

      <EditContactDialog
        contactId={editingId}
        onClose={() => setEditingId(null)}
      />
    </div>
  );
}
