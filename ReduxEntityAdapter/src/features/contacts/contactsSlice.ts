import { createSlice, createEntityAdapter, nanoid } from "@reduxjs/toolkit";

export interface Contact {
  id: string;
  name: string;
  phone: string;
}

const contactsAdapter = createEntityAdapter<Contact>();

function loadContacts() {
  try {
    const raw = localStorage.getItem("contacts");
    if (raw)
      return JSON.parse(raw) as ReturnType<
        typeof contactsAdapter.getInitialState
      >;
  } catch {}
  const SEED_CONTACTS: Contact[] = [
    { id: nanoid(), name: "Fiona Gallagher", phone: "+1 312 555 0193" },
    { id: nanoid(), name: "Lip Gallagher", phone: "+1 312 555 0274" },
    { id: nanoid(), name: "Ian Gallagher", phone: "+1 312 555 0318" },
    { id: nanoid(), name: "Debbie Gallagher", phone: "+1 312 555 0461" },
    { id: nanoid(), name: "Carl Gallagher", phone: "+1 312 555 0582" },
  ];
  return contactsAdapter.setAll(
    contactsAdapter.getInitialState(),
    SEED_CONTACTS,
  );
}

export const contactsSlice = createSlice({
  name: "contacts",
  initialState: loadContacts(),
  reducers: {
    addContact: {
      reducer: contactsAdapter.addOne,
      prepare: (name: string, phone: string) => ({
        payload: { id: nanoid(), name, phone },
      }),
    },
    updateContact: contactsAdapter.updateOne,
    removeContacts: contactsAdapter.removeMany,
  },
});

export const { addContact, updateContact, removeContacts } =
  contactsSlice.actions;
export const contactsReducer = contactsSlice.reducer;

export const { selectAll: selectAllContacts, selectById: selectContactById } =
  contactsAdapter.getSelectors(
    (state: { contacts: ReturnType<typeof contactsReducer> }) => state.contacts,
  );
