"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const me = await fetch("/api/auth/me");
      if (me.ok) setProfile(await me.json());
      const mine = await fetch("/api/items/mine");
      if (mine.ok) setItems(await mine.json());
    })();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type":"application/json" }, body: JSON.stringify(profile) });
    setMsg(res.ok ? "Saved" : "Failed");
  }

  async function del(id: string) {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
    if (res.ok) setItems(items.filter(i => i.id !== id));
  }

  if (!profile) return <div className="card">Sign in to view profile.</div>;

  return (
    <section className="row" style={{gap:24, alignItems:"flex-start"}}>
      <form onSubmit={save} className="card" style={{flex:1}}>
        <h2>Profile</h2>
        <div className="field"><label>Name</label><input className="input" value={profile.name||""} onChange={e=>setProfile({...profile, name:e.target.value})}/></div>
        <div className="field"><label>ID Number</label><input className="input" value={profile.registerNumber||""} onChange={e=>setProfile({...profile, registerNumber:e.target.value})}/></div>
        <div className="field"><label>Faculty</label><input className="input" value={profile.faculty||""} onChange={e=>setProfile({...profile, faculty:e.target.value})}/></div>
        <div className="field"><label>Contact Number</label><input className="input" value={profile.phone||""} onChange={e=>setProfile({...profile, phone:e.target.value})}/></div>
        <div className="row" style={{justifyContent:"space-between", marginTop:12}}>
          <button className="btn" type="submit">Save</button>
          <span className="muted">{msg}</span>
        </div>
      </form>

      <div style={{flex:1}}>
        <h2>My Items</h2>
        <div className="grid" style={{marginTop:12}}>
          {items.map(i => (
            <div className="card" key={i.id}>
              <div className="row" style={{justifyContent:"space-between"}}>
                <strong>{i.title}</strong>
                <button className="btn btn-outline" onClick={()=>del(i.id)}>Delete</button>
              </div>
              <div className="muted">{i.type} • {i.category}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
