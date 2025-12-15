export default async function handler(req, res) {
  const q = req.query || {};
  const pathRaw = q.path ?? [];
  const parts = Array.isArray(pathRaw) ? pathRaw : [pathRaw];

  const target = new URL("https://ciudata-backend-f9a11d7c90a1.herokuapp.com/" + parts.join("/"));
  for (const [k, v] of Object.entries(q)) {
    if (k === "path") continue;
    if (Array.isArray(v)) v.forEach(val => target.searchParams.append(k, val));
    else if (v != null) target.searchParams.set(k, String(v));
  }

  const headers = { ...req.headers };
  delete headers.host;

  const init = { method: req.method, headers };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {});
    if (!init.headers["content-type"]) init.headers["content-type"] = "application/json";
  }

  const r = await fetch(target, init);
  res.statusCode = r.status;

  const ct = r.headers.get("content-type");
  if (ct) res.setHeader("content-type", ct);

  const buf = Buffer.from(await r.arrayBuffer());
  res.end(buf);
}