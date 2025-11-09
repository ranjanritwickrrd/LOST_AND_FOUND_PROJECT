const { tryFetch, json, serverUp } = require("./http");
let available=false; const rnd=Math.random().toString(36).slice(2,8);
const username="u_"+rnd, password="p_"+rnd; let cookie="";
beforeAll(async()=>{ available=await serverUp(); },10000);
(available?describe:describe.skip)("Auth API",()=>{
  test("register 201/409", async()=>{
    const res=await tryFetch("/api/auth/register",{method:"POST",body:JSON.stringify({username,password,name:"Test User"})});
    expect([201,409]).toContain(res.status);
  });
  test("login 200 + cookie", async()=>{
    const res=await tryFetch("/api/auth/login",{method:"POST",body:JSON.stringify({username,password})});
    expect(res.status).toBe(200);
    cookie=res.headers.get("set-cookie")?.split(";")[0]||"";
    expect(cookie).toBeTruthy();
  });
  test("me 200", async()=>{
    const res=await tryFetch("/api/auth/me",{headers:{Cookie:cookie}});
    expect(res.status).toBe(200);
  });
});
