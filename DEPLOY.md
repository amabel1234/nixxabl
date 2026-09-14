# NIXX VIP — Vercel-ready

Project ini memakai Vercel Functions untuk API dan Upstash Redis untuk database license persisten.

## 1. Deploy

Import folder project ini ke Vercel.

Public pages:
- `/` — storefront
- `/admin.html` — admin key generator

API:
- `GET /api/health`
- `POST /api/licenses/issue`
- `POST /api/license/validate`

## 2. Database

Buat database Redis di Upstash, lalu ambil:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Tambahkan keduanya di Vercel → Project → Settings → Environment Variables.

## 3. Admin token

Buat environment variable:

`ADMIN_TOKEN`

Jangan masukkan token ini ke `admin.js`, `script.js`, HTML, atau file Lua.

## 4. Test

Setelah redeploy, buka:

`https://DOMAIN-KAMU/api/health`

Harus mendapat JSON seperti:

`{"ok":true,"service":"NIXX License API"}`

Kemudian buka:

`https://DOMAIN-KAMU/admin.html`

Masukkan Admin Token, username pembeli, pilih masa aktif, lalu Generate Key.

## 5. Validasi

Storefront memakai:

`POST /api/license/validate`

Body:

`{"key":"NIXX-...."}`

Key `issued` mulai menghitung masa aktif ketika pertama kali divalidasi.
