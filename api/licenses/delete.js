import { allowCors, body, json } from "../_lib/http.js";

async function redis(command) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) throw new Error("Database belum dikonfigurasi.");

  const response = await fetch(
    `${url}/${command.map(encodeURIComponent).join("/")}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const data = await response.json().catch(() => null);
  if (!response.ok || !data || data.error) {
    throw new Error(data?.error || `Redis HTTP ${response.status}`);
  }
  return data.result;
}

export default async function handler(req, res) {
  allowCors(res);

  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "DELETE" && req.method !== "POST") {
    return json(res, 405, { message: "Method not allowed." });
  }

  const adminToken = process.env.ADMIN_TOKEN;
  const supplied = req.headers.authorization || "";

  if (!adminToken || supplied !== `Bearer ${adminToken}`) {
    return json(res, 401, { message: "Admin authorization required." });
  }

  try {
    const data = await body(req);
    const key = String(data.key || "").trim().toUpperCase();

    if (!key) {
      return json(res, 400, { message: "License key wajib diisi." });
    }

    const result = await redis(["del", `license:${key}`]);

    if (Number(result) <= 0) {
      return json(res, 404, { message: "Key tidak ditemukan." });
    }

    return json(res, 200, {
      ok: true,
      message: "Key berhasil dihapus.",
      key
    });
  } catch (error) {
    console.error("delete license:", error);
    return json(res, 500, {
      message: error.message || "Gagal menghapus key."
    });
  }
}
