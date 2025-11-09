const { tryFetch, json, serverUp } = require("./http");
let available=false, cookie="", itemId="";
beforeAll(async()=>{
  available=await serverUp(); if(!available) return;
  const rnd=Math.random().toString(36).slice(2,8);
  await tryFetch("/api/auth/register",{method:"POST",body:JSON.stringify({username:"itm_"+rnd,password:"p_"+rnd,name:"Item User"})});
  const r=await tryFetch("/api/auth/login",{method:"POST",body:JSON.stringify({username:"itm_"+rnd,password:"p_"+rnd})});
  cookie=r.headers.get("set-cookie")?.split(";")[0]||"";
},15000);
(available?describe:describe.skip)("Items API",()=>{
  test("list 200", async()=>{ const res=await tryFetch("/api/items"); expect(res.status).toBe(200); });
  test("create 201", async()=>{
    const res=await tryFetch("/api/items",{method:"POST",headers:{Cookie:cookie},body:JSON.stringify({type:"LOST",title:"Test Wallet",description:"Black",category:"ACCESSORIES",locationFound:"Library",dateFound:"2025-01-01",imageUrl:""})});
    expect(res.status).toBe(201); const data=await json(res); itemId=data.id;
  });
  test("get by id 200", async()=>{ const res=await tryFetch(`/api/items/${itemId}`); expect(res.status).toBe(200); });
  test("update 200", async()=>{
    const res=await tryFetch(`/api/items/${itemId}`,{method:"PUT",headers:{Cookie:cookie},body:JSON.stringify({status:"PENDING"})});
    expect(res.status).toBe(200); const data=await json(res); expect(data.status).toBe("PENDING");
  });
  test("delete 200", async()=>{ const res=await tryFetch(`/api/items/${itemId}`,{method:"DELETE",headers:{Cookie:cookie}}); expect(res.status).toBe(200); });
});
