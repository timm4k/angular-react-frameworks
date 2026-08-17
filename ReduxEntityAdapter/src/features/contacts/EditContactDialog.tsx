import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { updateContact, selectContactById } from "./contactsSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface EditContactDialogProps {
  contactId: string | null;
  onClose: () => void;
}

export function EditContactDialog({
  contactId,
  onClose,
}: EditContactDialogProps) {
  const dispatch = useAppDispatch();
  const contact = useAppSelector((state) =>
    contactId ? selectContactById(state, contactId) : undefined,
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setPhone(contact.phone);
      setErrors({});
    }
  }, [contact]);

  const handleSave = () => {
    if (!contactId) return;
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Name is required";
    if (!phone.trim()) next.phone = "Phone is required";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    dispatch(
      updateContact({
        id: contactId,
        changes: { name: name.trim(), phone: phone.trim() },
      }),
    );
    onClose();
  };

  return (
    <Dialog
      open={contactId !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input
              id="edit-phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
