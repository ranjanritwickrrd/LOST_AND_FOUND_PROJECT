"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({ username:"", password:"", name:"", registerNumber:"", faculty:"", phone:"", gender:"male" });
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (res.ok) router.push("/login");
    else setError((await res.json()).error || "Registration failed");
  }

  function set<K extends keyof typeof form>(k: K, v: any) { setForm(prev => ({ ...prev, [k]: v })); }

  return (
    <section className="card" style={{ maxWidth: 520, margin: "24px auto" }}>
      <h1>Sign Up</h1>
      <form onSubmit={onSubmit} className="row" style={{flexDirection:"column", gap:12, marginTop:12}}>
        <div className="row" style={{gap:12}}>
          <div className="field" style={{flex:1}}>
            <label>Name</label>
            <input className="input" value={form.name} onChange={e=>set("name", e.target.value)} />
          </div>
          <div className="field" style={{flex:1}}>
            <label>Username</label>
            <input className="input" value={form.username} onChange={e=>set("username", e.target.value)} />
          </div>
        </div>
        <div className="row" style={{gap:12}}>
          <div className="field" style={{flex:1}}>
            <label>Register No.</label>
            <input className="input" value={form.registerNumber} onChange={e=>set("registerNumber", e.target.value)} />
          </div>
          <div className="field" style={{flex:1}}>
            <label>Faculty/Dept</label>
            <input className="input" value={form.faculty} onChange={e=>set("faculty", e.target.value)} />
          </div>
        </div>
        <div className="row" style={{gap:12}}>
          <div className="field" style={{flex:1}}>
            <label>Phone</label>
            <input className="input" value={form.phone} onChange={e=>set("phone", e.target.value)} />
          </div>
          <div className="field" style={{flex:1}}>
            <label>Gender</label>
            <select className="select" value={form.gender} onChange={e=>set("gender", e.target.value)}>
              <option value="male">male</option>
              <option value="female">female</option>
              <option value="other">other</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label>Password</label>
          <input className="input" type="password" value={form.password} onChange={e=>set("password", e.target.value)} />
        </div>
        {error && <div className="muted" style={{color:"crimson"}}>{error}</div>}
        <button className="btn" type="submit">Create account</button>
      </form>
      <div style={{marginTop:12}}>
        <a href="/login">Already have an account? Sign In</a>
      </div>
    </section>
  );
}
