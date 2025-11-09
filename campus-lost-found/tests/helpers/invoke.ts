// tests/helpers/invoke.ts
export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type CallOptions = {
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
};

function toModuleFileUrl(path: string): string {
  if (!path || typeof path !== "string") {
    throw new Error(`callRoute: invalid path "${String(path)}"`);
  }
  if (!path.startsWith("/api/")) {
    throw new Error(`callRoute expects path under /api, got "${path}"`);
  }
  const rel = path.replace(/^\/+/, "").replace(/^api\//, "");
  const segs = rel.split("/").filter(Boolean).map((s) => {
    if (/^\[.+\]$/.test(s)) return s;
    if (/^\d+$/.test(s)) return "[id]";
    return s;
  });
  const spec = `../../src/app/api/${segs.join("/")}/route.ts`;
  return new URL(spec, import.meta.url).toString();
}

export function bearer(token: string) {
  return { Authorization: `Bearer ${token}` };
}

type SigA = (
  path: string,
  opts?: CallOptions
) => Promise<{ status: number; data: any; headers: Headers }>;
type SigB = (
  path: string,
  method: Method,
  opts?: CallOptions
) => Promise<{ status: number; data: any; headers: Headers }>;

export const callRoute: SigA & SigB = (async function callRoute(
  path: string,
  methodOrOpts?: Method | CallOptions,
  maybeOpts?: CallOptions
) {
  const method: Method =
    typeof methodOrOpts === "string" ? (methodOrOpts.toUpperCase() as Method) : "GET";
  const opts: CallOptions =
    (typeof methodOrOpts === "string" ? maybeOpts : (methodOrOpts as CallOptions)) || {};

  if (typeof path !== "string") throw new Error("callRoute: path must be a string");

  const reqUrl = new URL(`http://test.local${path}`);
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v !== undefined) reqUrl.searchParams.set(k, String(v));
    }
  }

  const headers = new Headers(opts.headers || {});
  let body: BodyInit | undefined;
  if (opts.body !== undefined) {
    if (typeof opts.body === "string" || opts.body instanceof Uint8Array) {
      body = opts.body as any;
    } else {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(opts.body);
    }
  }

  const modUrl = toModuleFileUrl(path);
  const mod = await import(modUrl);

  const handler = (mod as any)[method];
  if (typeof handler !== "function") {
    throw new Error(`Handler ${method} not found in module ${modUrl}`);
  }

  const req = new Request(reqUrl.toString(), { method, headers, body });
  const res: Response = await (handler.length >= 2
    ? handler(req, { params: opts.params || {} })
    : handler(req as any));

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : await res.text();
  return { status: res.status, data, headers: res.headers };
}) as any;

