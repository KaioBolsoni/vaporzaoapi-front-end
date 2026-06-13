import { useState } from "react";

export function useForm(initialState) {
  const [form, setForm] = useState(initialState);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return [form, onChange];
}
