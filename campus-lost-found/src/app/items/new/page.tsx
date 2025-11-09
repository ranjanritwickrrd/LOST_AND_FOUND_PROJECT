"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = ["ELECTRONICS","ID_CARD","BOOKS","CLOTHING","ACCESSORIES","OTHER"] as const;

export default function NewItem() {
  const [form, setForm] = useState({ type:"LOST", title:"", description:"", category:"ELECTRONICS", locationFound:"", dateFound:"", imageUrl:"" });
  const [error, setError] = useState("");
  const router = useRouter();

  function set<K extends keyof typeof form>(k: K, v: any) { setForm(prev => ({ ...prev, [k]: v })); }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/items", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify(form) });
    if (res.ok) router.push("/items");
    else setError((await res.json()).error || "Failed to create");
  }

  return (
    <section className="card" style={{ maxWidth: 620 }}>
      <h1>Report Item</h1>
      <form onSubmit={onSubmit} className="row" style={{flexDirection:"column", gap:12, marginTop:12}}>
        <div className="row" style={{gap:12}}>
          <div className="field" style={{flex:1}}>
            <label>Type</label>
            <select className="select" value={form.type} onChange={e=>set("type", e.target.value)}>
              <option value="LOST">LOST</option>
              <option value="FOUND">FOUND</option>
            </select>
          </div>
          <div className="field" style={{flex:2}}>
            <label>Title</label>
            <input className="input" value={form.title} onChange={e=>set("title", e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Description</label>
          <textarea className="textarea" value={form.description} onChange={e=>set("description", e.target.value)} />
        </div>
        <div className="row" style={{gap:12}}>
          <div className="field" style={{flex:1}}>
            <label>Category</label>
            <select className="select" value={form.category} onChange={e=>set("category", e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field" style={{flex:1}}>
            <label>Location</label>
            <input className="input" value={form.locationFound} onChange={e=>set("locationFound", e.target.value)} />
          </div>
          <div className="field" style={{flex:1}}>
            <label>Date</label>
            <input className="input" type="date" value={form.dateFound} onChange={e=>set("dateFound", e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Image URL (optional)</label>
          <input className="input" value={form.imageUrl} onChange={e=>set("imageUrl", e.target.value)} />
        </div>
        {error && <div className="muted" style={{color:"crimson"}}>{error}</div>}
        <button className="btn" type="submit">Save</button>
      </form>
    </section>
  );
}
