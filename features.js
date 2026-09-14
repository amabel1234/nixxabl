(function () {
  "use strict";

  const OWNER_WHATSAPP = "6283182791150";
  const PRODUCTS = [
    {
      title: "VVIP Key / 1 Hari",
      price: "Rp10.000",
      features: [
        "Masa aktif 24 jam setelah aktivasi",
        "Key lisensi personal",
        "Status key dapat dicek online",
        "Panduan aktivasi",
        "Bantuan order melalui WhatsApp",
      ],
    },
    {
      title: "VVIP Key / 7 Hari",
      price: "Rp15.000",
      features: [
        "Masa aktif 7 × 24 jam setelah aktivasi",
        "Key lisensi personal",
        "Detail tanggal aktivasi dan berakhir",
        "Bantuan prioritas",
        "Pembaruan dari kanal resmi",
      ],
    },
    {
      title: "VVIP Key / 30 Hari",
      price: "Rp25.000",
      features: [
        "Masa aktif 30 × 24 jam setelah aktivasi",
        "Key lisensi personal",
        "Detail status dan tanggal berakhir",
        "VIP support",
        "Akses informasi pembaruan resmi",
      ],
    },
    {
      title: "VVIP Key / Lifetime",
      price: "Rp50.000",
      features: [
        "Akses jangka panjang",
        "Key lisensi personal",
        "Pengecekan status key online",
        "Panduan aktivasi",
        "Support owner melalui WhatsApp",
      ],
    },
  ];

  const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    }[char]));

  const productForCard = (card) => {
    const text = card.textContent.toLowerCase();
    return PRODUCTS.find((product) => text.includes(product.title.toLowerCase().replace("vvip key / ", ""))) ||
      PRODUCTS.find((product) => text.includes(product.title.toLowerCase())) ||
      PRODUCTS[0];
  };

  function addNavLink() {
    document.querySelectorAll(".nav-links, .mobile-links").forEach((nav) => {
      if (nav.querySelector("[data-feature-license-link]")) return;
      const link = document.createElement("a");
      link.href = "#license-check";
      link.textContent = "Cek key";
      link.dataset.featureLicenseLink = "true";
      nav.appendChild(link);
    });
  }

  function openOrder(product) {
    closeModal();
    const backdrop = document.createElement("div");
    backdrop.className = "feature-extension feature-modal-backdrop";
    backdrop.innerHTML = `
      <div class="feature-modal" role="dialog" aria-modal="true" aria-labelledby="feature-order-title">
        <button class="feature-close" type="button" aria-label="Tutup">×</button>
        <span class="feature-eyebrow">DETAIL PRODUK</span>
        <h2 id="feature-order-title">${escapeHtml(product.title)}</h2>
        <p class="feature-price">${escapeHtml(product.price)}</p>
        <ul class="feature-list">${product.features.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <div class="feature-form">
          <label for="feature-buyer-name">Nama / username</label>
          <input id="feature-buyer-name" autocomplete="name" placeholder="Masukkan nama atau username" required>
          <label for="feature-buyer-note">Catatan (opsional)</label>
          <input id="feature-buyer-note" placeholder="Contoh: mau proses sekarang">
          <button class="feature-submit" type="button">Lanjut ke WhatsApp ↗</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const remove = () => backdrop.remove();
    backdrop.querySelector(".feature-close").addEventListener("click", remove);
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) remove();
    });
    const nameInput = backdrop.querySelector("#feature-buyer-name");
    backdrop.querySelector(".feature-submit").addEventListener("click", () => {
      const name = nameInput.value.trim();
      const note = backdrop.querySelector("#feature-buyer-note").value.trim();
      if (!name) {
        nameInput.focus();
        return;
      }
      const message = [
        `Halo Nixx, saya mau order ${product.title} (${product.price}).`,
        `Nama/username: ${name}.`,
        note ? `Catatan: ${note}` : "",
      ].filter(Boolean).join(" ");
      window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
      remove();
    });
    document.addEventListener("keydown", function onEscape(event) {
      if (event.key === "Escape") {
        remove();
        document.removeEventListener("keydown", onEscape);
      }
    });
    nameInput.focus();
  }

  function statusCard(data, input) {
    const status = String(data.status || (data.active ? "active" : data.code || "unknown")).toUpperCase();
    const label = ({ ACTIVE: "AKTIF", ISSUED: "BELUM AKTIF", EXPIRED: "KEDALUWARSA", REVOKED: "DICABUT" })[status] || status;
    const expiry = data.expiresAt ? new Date(data.expiresAt).toLocaleString("id-ID") : "Belum diaktifkan";
    const plan = data.planDays ? `${data.planDays} Hari` : "-";
    return `
      <div class="feature-key-result ${data.active ? "is-active" : "is-inactive"}">
        <div class="feature-key-result-head"><strong>${escapeHtml(data.message || "Status key")}</strong><b>${label}</b></div>
        <div class="feature-key-grid">
          <span>Pembeli<strong>${escapeHtml(data.customer || "-")}</strong></span>
          <span>Paket<strong>${escapeHtml(plan)}</strong></span>
          <span>Berakhir<strong>${escapeHtml(expiry)}</strong></span>
          <span>Key<strong>${escapeHtml(data.key || input)}</strong></span>
        </div>
      </div>
    `;
  }

  function insertLicenseSection() {
    if (document.querySelector("#license-check") || !document.querySelector(".products-section")) return;
    const section = document.createElement("section");
    section.id = "license-check";
    section.className = "feature-extension feature-license-section";
    section.innerHTML = `
      <div class="feature-license-wrap">
        <div>
          <span class="feature-eyebrow">LICENSE STATUS</span>
          <h2>Cek key kamu.</h2>
          <p>Masukkan key untuk melihat status dan masa aktif dari server lisensi.</p>
        </div>
        <form class="feature-license-form">
          <label for="feature-license-key">License key</label>
          <div class="feature-license-input">
            <input id="feature-license-key" placeholder="NIXX-XXXX-XXXX-XXXX" autocomplete="off" required>
            <button class="feature-submit" type="submit">Cek key</button>
          </div>
          <output class="feature-license-output" role="status"></output>
        </form>
      </div>
    `;
    document.querySelector(".products-section").insertAdjacentElement("afterend", section);
    section.querySelector("form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = section.querySelector("#feature-license-key");
      const output = section.querySelector(".feature-license-output");
      const key = input.value.trim();
      if (!key) return;
      output.innerHTML = `<div class="feature-key-loading">Memeriksa key...</div>`;
      try {
        const response = await fetch("/api/license/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key }),
        });
        const data = await response.json();
        output.innerHTML = statusCard(data, key);
      } catch (error) {
        output.innerHTML = `<div class="feature-key-error">${escapeHtml(error.message || "API license belum tersambung.")}</div>`;
      }
    });
  }

  function closeModal() {
    document.querySelectorAll(".feature-modal-backdrop").forEach((modal) => modal.remove());
  }

  function init() {
    addNavLink();
    insertLicenseSection();
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest?.(".product-card button");
    if (button) {
      event.preventDefault();
      event.stopPropagation();
      openOrder(productForCard(button.closest(".product-card")));
    }
  }, true);

  const observer = new MutationObserver(init);
  observer.observe(document.body, { childList: true, subtree: true });
  init();
})();