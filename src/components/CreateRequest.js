import React, { useState } from "react";
import api from "../api";

export default function CreateRequest() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/requests/", {
        ticket_id: "TKT-2025-001",
        title,
        description,
        status: "open",
        priority,
        client_id: 1
      });
      setMsg("Request created! ID: " + res.data.ticket_id);
    } catch (err) {
      setMsg("Error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <select value={priority} onChange={e => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit">Submit</button>
      {msg && <div>{msg}</div>}
    </form>
  );
}