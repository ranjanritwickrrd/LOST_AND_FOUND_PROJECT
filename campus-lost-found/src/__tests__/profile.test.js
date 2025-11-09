const { tryFetch, json, serverUp } = require("./http");
let available=false, cookie="";
beforeAll(async()=>{
  available=await serverUp(); if(!available) return;
  const rnd=Math.random().toString(36).slice(2,8);
  await tryFetch("/api/auth/register",{method:"POST",body:JSON.stringify({username:"prof_"+rnd,password:"p_"+rnd,name:"Profile User"})});
  const r=await tryFetch("/api/auth/login",{method:"POST",body:JSON.stringify({username:"prof_"+rnd,password:"p_"+rnd})});
  cookie=r.headers.get("set-cookie")?.split(";")[0]||"";
},10000);
(available?describe:describe.skip)("Profile API",()=>{
  test("get 200", async()=>{ const res=await tryFetch("/api/profile",{headers:{Cookie:cookie}}); expect(res.status).toBe(200); });
  test("update 200", async()=>{
    const res=await tryFetch("/api/profile",{method:"PUT",headers:{Cookie:cookie},body:JSON.stringify({name:"Updated",phone:"9999999999"})});
    expect(res.status).toBe(200); const data=await json(res); expect(data.name).toBe("Updated");
  });
});
