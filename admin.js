const API_BASE = "";

const form = document.querySelector("#issueForm");
const result = document.querySelector("#result");
const generatedKey = document.querySelector("#generatedKey");
const copyKey = document.querySelector("#copyKey");
const sendWhatsapp = document.querySelector("#sendWhatsapp");
const refreshKeys = document.querySelector("#refreshKeys");
const licenseList = document.querySelector("#licenseList");
const roleBadge = document.querySelector("#roleBadge");
const announcementForm = document.querySelector("#announcementForm");
const announcementStatus = document.querySelector("#announcementStatus");

let currentRole = null;

function getToken() {
  return document.querySelector("#adminToken").value.trim();
}

async function readApiResponse(response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `API bukan JSON (HTTP ${response.status}). Pastikan endpoint sudah ter-deploy.`
    );
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[char]);
}

function formatDate(value) {
  if (!value) return "Belum diaktifkan";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function statusLabel(status) {
  return ({
    issued: "ISSUED",
    active: "ACTIVE",
    expired: "EXPIRED",
    revoked: "REVOKED"
  })[status] || String(status || "UNKNOWN").toUpperCase();
}

function renderLicenses(licenses) {
  if (!licenses.length) {
    licenseList.innerHTML =
      '<div class="empty-key">Belum ada key yang dibuat.</div>';
    return;
  }

  licenseList.innerHTML = licenses.map((license) => `
    <article class="key-item">
      <div class="key-top">
        <code class="key-code">${escapeHtml(license.key)}</code>
        <span class="key-status status-${escapeHtml(license.status)}">
          ● ${escapeHtml(statusLabel(license.status))}
        </span>
      </div>

      <div class="key-grid">
        <div>
          <small>Pembeli</small>
          <b>${escapeHtml(license.customer || "-")}</b>
        </div>
        <div>
          <small>Paket</small>
          <b>${escapeHtml(license.planDays)} Hari</b>
        </div>
        <div>
          <small>Dibuat</small>
          <b>${escapeHtml(formatDate(license.createdAt))}</b>
        </div>
        <div>
          <small>Aktif sejak</small>
          <b>${escapeHtml(formatDate(license.activatedAt))}</b>
        </div>
        <div>
          <small>Expired</small>
          <b>${escapeHtml(formatDate(license.expiresAt))}</b>
        </div>
      </div>

      <div class="key-actions">
        ${currentRole === "reseller" ? '<span class="admin-muted">Reseller: read-only</span>' : `<button class="button button-danger delete-license" type="button" data-key="${escapeHtml(license.key)}">Delete Key</button>`}
      </div>
    </article>
  `).join("");

  licenseList.querySelectorAll(".delete-license").forEach((button) => {
    button.addEventListener("click", () =>
      deleteLicense(button.dataset.key, button)
    );
  });
}

async function loadLicenses() {
  const token = getToken();

  if (!token) {
    alert("Masukkan admin token dulu.");
    document.querySelector("#adminToken").focus();
    return;
  }

  refreshKeys.disabled = true;
  refreshKeys.textContent = "Loading...";
  licenseList.innerHTML =
    '<div class="empty-key">Mengambil daftar key...</div>';

  try {
    const response = await fetch(`${API_BASE}/api/licenses/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await readApiResponse(response);

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengambil daftar key.");
    }

    renderLicenses(Array.isArray(data.licenses) ? data.licenses : []);
  } catch (error) {
    licenseList.innerHTML =
      `<div class="empty-key">${escapeHtml(error.message || "Gagal mengambil daftar key.")}</div>`;
  } finally {
    refreshKeys.disabled = false;
    refreshKeys.textContent = "↻ Refresh";
  }
}

async function deleteLicense(key, button) {
  const token = getToken();

  if (!token) {
    alert("Masukkan admin token dulu.");
    return;
  }

  const confirmed = confirm(
    `Hapus key ${key}?\n\nKey akan dihapus permanen dari database dan tidak bisa digunakan lagi.`
  );

  if (!confirmed) return;

  button.disabled = true;
  button.textContent = "Deleting...";

  try {
    const response = await fetch(`${API_BASE}/api/licenses/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ key })
    });

    const data = await readApiResponse(response);

    if (!response.ok) {
      throw new Error(data.message || "Gagal menghapus key.");
    }

    await loadLicenses();
  } catch (error) {
    button.disabled = false;
    button.textContent = "Delete Key";
    alert(error.message || "Gagal menghapus key.");
  }
}


async function detectRole() {
  const token = getToken();
  if (!token || !roleBadge) return;
  try {
    const response = await fetch(`${API_BASE}/api/role`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (response.ok) { currentRole = data.role; roleBadge.textContent = `Role: ${String(currentRole).toUpperCase()}`; }
  } catch (_) {}
}

async function loadAnnouncement() {
  if (!announcementForm) return;
  try {
    const response = await fetch(`${API_BASE}/api/announcement`, { cache: "no-store" });
    const data = await response.json();
    const a = data.announcement || {};
    document.querySelector("#announcementText").value = a.text || "";
    document.querySelector("#announcementType").value = a.type || "info";
    document.querySelector("#announcementEnabled").checked = Boolean(a.enabled);
  } catch (_) {}
}

announcementForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const token = getToken();
  if (!token) return alert("Masukkan token dulu.");
  announcementStatus.textContent = "Menyimpan...";
  try {
    const response = await fetch(`${API_BASE}/api/announcement`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ text: document.querySelector("#announcementText").value, type: document.querySelector("#announcementType").value, enabled: document.querySelector("#announcementEnabled").checked }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Gagal menyimpan.");
    announcementStatus.textContent = "✓ Announcement tersimpan.";
  } catch (error) { announcementStatus.textContent = error.message; }
});

document.querySelector("#adminToken")?.addEventListener("change", () => { detectRole(); loadAnnouncement(); });

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = getToken();
  const customer = document.querySelector("#customer").value.trim();
  const days = Number(document.querySelector("#days").value);
  const button = form.querySelector("button[type=submit]");

  if (!token) {
    alert("Admin token wajib diisi.");
    return;
  }

  button.disabled = true;
  button.textContent = "Generating...";
  result.hidden = true;

  try {
    const response = await fetch(`${API_BASE}/api/licenses/issue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ days, customer })
    });

    const data = await readApiResponse(response);

    if (!response.ok) {
      throw new Error(data.message || "Key gagal dibuat.");
    }

    generatedKey.textContent = data.key;
    currentRole = data.role || currentRole || "admin";
    if (roleBadge) roleBadge.textContent = `Role: ${currentRole.toUpperCase()}`;

    sendWhatsapp.href =
      `https://wa.me/6283182791150?text=${encodeURIComponent(
        `Halo, ini license key NIXX VIP kamu: ${data.key}. Paket: ${data.planDays} hari.`
      )}`;

    result.hidden = false;

    await loadLicenses();
  } catch (error) {
    alert(error.message || "Gagal menghubungi API.");
  } finally {
    button.disabled = false;
    button.textContent = "Generate Key ↗";
  }
});

copyKey.addEventListener("click", async () => {
  const key = generatedKey.textContent.trim();
  if (!key) return;

  try {
    await navigator.clipboard.writeText(key);
    copyKey.textContent = "Copied ✓";
    setTimeout(() => {
      copyKey.textContent = "Copy key";
    }, 1600);
  } catch {
    alert("Clipboard tidak tersedia. Copy key secara manual.");
  }
});

refreshKeys.addEventListener("click", loadLicenses);
