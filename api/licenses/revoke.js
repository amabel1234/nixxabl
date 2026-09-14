import { getLicense, setLicense } from "../_lib/db.js";
import { allowCors, body, json } from "../_lib/http.js";

export default async function handler(req, res) {
  allowCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return json(res, 405, { message: "Method not allowed." });

  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken || req.headers.authorization !== `Bearer ${adminToken}`) {
    return json(res, 401, { message: "Admin authorization required." });
  }

  try {
    const data = await body(req);
    const key = String(data.key || "").trim().toUpperCase();
    if (!key) return json(res, 400, { message: "License key wajib diisi." });

    const license = await getLicense(key);
    if (!license) return json(res, 404, { message: "Key tidak ditemukan." });

    license.status = "revoked";
    license.revokedAt = new Date().toISOString();
    license.revokedReason = String(data.reason || "Dinonaktifkan admin").slice(0, 200);
    await setLicense(key, license);

    return json(res, 200, { ok: true, message: "Key berhasil direvoke.", key, status: license.status });
  } catch (error) {
    console.error("revoke license:", error);
    return json(res, 500, { message: error.message || "Gagal revoke key." });
  }
}
