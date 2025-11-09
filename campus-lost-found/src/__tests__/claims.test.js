const { tryFetch, json, serverUp } = require("./http");
let available=false, ownerCookie="", claimerCookie="", itemId="", claimId="";
async function signupLogin(prefix){ const rnd=Math.random().toString(36).slice(2,8);
  await tryFetch("/api/auth/register",{method:"POST",body:JSON.stringify({username:`${prefix}_${rnd}`,password:`p_${rnd}`,name:prefix})});
  const r=await tryFetch("/api/auth/login",{method:"POST",body:JSON.stringify({username:`${prefix}_${rnd}`,password:`p_${rnd}`})});
  return r.headers.get("set-cookie")?.split(";")[0]||"";
}
beforeAll(async()=>{
  available=await serverUp(); if(!available) return;
  ownerCookie=await signupLogin("owner"); claimerCookie=await signupLogin("claimer");
  const res=await tryFetch("/api/items",{method:"POST",headers:{Cookie:ownerCookie},body:JSON.stringify({type:"FOUND",title:"USB",description:"32GB",category:"ELECTRONICS",locationFound:"Lab",dateFound:"2025-02-02",imageUrl:""})});
  itemId=(await json(res)).id;
},15000);
(available?describe:describe.skip)("Claims API",()=>{
  test("create claim 201", async()=>{
    const res=await tryFetch("/api/claims",{method:"POST",headers:{Cookie:claimerCookie},body:JSON.stringify({itemId,message:"It's mine"})});
    expect(res.status).toBe(201); claimId=(await json(res)).id;
  });
  test("owner lists claims 200", async()=>{
    const res=await tryFetch(`/api/items/${itemId}/claims`,{headers:{Cookie:ownerCookie}});
    expect(res.status).toBe(200);
  });
  test("owner approves claim 200", async()=>{
    const res=await tryFetch(`/api/claims/${claimId}`,{method:"PATCH",headers:{Cookie:ownerCookie},body:JSON.stringify({status:"APPROVED"})});
    expect(res.status).toBe(200); const data=await json(res); expect(data.status).toBe("APPROVED");
  });
});
