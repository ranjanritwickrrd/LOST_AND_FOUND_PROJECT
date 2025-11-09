import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function FoundPage() {
  const items = await prisma.item.findMany({ where: { type: "FOUND" }, orderBy: { createdAt: "desc" } });
  return (
    <section>
      <div className="row" style={{justifyContent:"space-between"}}>
        <h1>Found Items</h1>
        <Link className="btn" href="/items/new">Report</Link>
      </div>
      <div className="grid" style={{marginTop:16}}>
        {items.map(i => (
          <div className="card" key={i.id}>
            <div className="row" style={{justifyContent:"space-between"}}>
              <strong>{i.title}</strong>
              <span className="muted">{i.type}</span>
            </div>
            <p className="muted">{i.description}</p>
            <Link href={`/items/${i.id}`}>View</Link>
          </div>
        ))}
      </div>
    </section>
  );
}
