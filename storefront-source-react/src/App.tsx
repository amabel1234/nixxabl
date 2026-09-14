import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Code2,
  Copy,
  Gamepad2,
  Image as ImageIcon,
  Menu,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  X,
  Zap,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const ownerNumber = '6283182791150';
const ownerDisplay = '+62 831-8279-1150';

const openWhatsApp = (product: string, price?: string) => {
  const message = price
    ? `Halo Nixx, saya mau order ${product} (${price}). Mohon info langkah selanjutnya.`
    : `Halo Nixx, saya mau tanya tentang Open Roblox Lua Script.`;
  window.open(`https://wa.me/${ownerNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
};

const products = [
  { id: '01', title: 'VVIP Key / 1 Hari', price: 'Rp10.000', detail: 'Akses singkat untuk test fitur Nixx dengan cepat.', icon: Zap },
  { id: '02', title: 'VVIP Key / 7 Hari', price: 'Rp15.000', detail: 'Pilihan ringan untuk sesi Roblox mingguan.', icon: Gamepad2 },
  { id: '03', title: 'VVIP Key / 30 Hari', price: 'Rp25.000', detail: 'Akses sebulan penuh. Paling pas untuk pemain aktif.', icon: ShieldCheck, featured: true },
  { id: '04', title: 'VVIP Key / Lifetime', price: 'Rp50.000', detail: 'Sekali beli, akses lebih panjang tanpa perpanjangan.', icon: PackageCheck },
];

const faqs = [
  { question: 'Cara order key-nya bagaimana?', answer: 'Pilih paket, tekan tombol order, lalu WhatsApp owner akan terbuka dengan pesan yang sudah disiapkan. Owner akan bantu proses sampai key siap dipakai.' },
  { question: 'Bisa minta bantuan setelah beli?', answer: 'Bisa. Kirim detail order melalui WhatsApp yang sama. Nixx membantu instalasi dan pertanyaan akses selama jam respons owner.' },
  { question: 'Apa isi paket reseller?', answer: 'Dengan Rp120.000, kamu mendapat akses reseller group dan Open Source NixxVvip script untuk mulai membangun circle dan penawaranmu sendiri.' },
  { question: 'Open Roblox Lua Script itu apa?', answer: 'Ini adalah produk script yang detail dan harganya dibahas langsung lewat DM owner, supaya kebutuhan dan scope script bisa disamakan dulu.' },
];

function Brand() {
  return (
    <a className="brand" href="#top" data-testid="link-brand">
      <span className="brand-mark">N</span>
      <span className="brand-name">nixx<span>/</span>vvip</span>
    </a>
  );
}

function WhatsAppButton({ product, price, label = 'Order via WhatsApp', className = '' }: { product: string; price?: string; label?: string; className?: string }) {
  return (
    <button className={`button button-primary ${className}`} onClick={() => openWhatsApp(product, price)} data-testid={`button-order-${product.toLowerCase().replaceAll(' ', '-')}`}>
      <MessageCircle size={16} strokeWidth={2.5} />
      {label}
      <ArrowUpRight size={15} />
    </button>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [copied, setCopied] = useState(false);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(ownerDisplay);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main id="top" className="store-shell">
      <header className="site-header">
        <div className="nav-wrap">
          <Brand />
          <nav className="nav-links" aria-label="Main navigation">
            <a href="#products" data-testid="link-nav-products">Products</a>
            <a href="#showcase" data-testid="link-nav-showcase">Showcase</a>
            <a href="#reseller" data-testid="link-nav-reseller">Reseller</a>
            <a href="#faq" data-testid="link-nav-faq">FAQ</a>
          </nav>
          <div className="nav-actions">
            <WhatsAppButton product="Nixx VVIP" label="Chat owner" className="button-small" />
            <button className="mobile-menu" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)} data-testid="button-mobile-menu">
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <a href="#products" onClick={() => setMenuOpen(false)} data-testid="link-mobile-products">Products</a>
            <a href="#showcase" onClick={() => setMenuOpen(false)} data-testid="link-mobile-showcase">Showcase</a>
            <a href="#reseller" onClick={() => setMenuOpen(false)} data-testid="link-mobile-reseller">Reseller</a>
            <a href="#faq" onClick={() => setMenuOpen(false)} data-testid="link-mobile-faq">FAQ</a>
          </nav>
        )}
      </header>

      <section className="hero">
        <div className="section-wrap hero-grid">
          <div>
            <span className="eyebrow">Digital access / Roblox oriented</span>
            <h1>Buy Akses Key <em>VVIP Nix</em></h1>
            <p className="hero-copy">Akses cepat, harga jelas, dan visual yang bisa kamu lihat dulu. Pilih key Nixx VVIP yang cocok, lalu langsung ngobrol dengan owner.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#products" data-testid="link-hero-products">Lihat pilihan key <ArrowDownRight size={16} /></a>
              <a className="button button-ghost" href="#showcase" data-testid="link-hero-showcase"><ImageIcon size={16} /> Preview visual</a>
            </div>
            <div className="hero-footnote">
              <span><strong>01</strong> — pilih paket</span>
              <span><strong>02</strong> — chat owner</span>
            </div>
          </div>
          <div className="hero-art" aria-label="Nixx VVIP product preview">
            <div className="hero-sticker">READY<br />TO PLAY</div>
            <div className="hero-card">
              <img className="hero-card-image" src="/assets/products/nixx-vip-03.png" alt="Nixx VVIP interface preview in Roblox" />
              <div className="hero-card-label">
                <small>nixx vvip / visual 03</small>
                <strong>Clean access.<br />More control.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="marquee" aria-label="Store highlights">
        <div className="marquee-track">
          <span>VVIP ACCESS</span><i className="marquee-dot" /><span>ROBLOX READY</span><i className="marquee-dot" /><span>OWNER DIRECT</span><i className="marquee-dot" /><span>VVIP ACCESS</span><i className="marquee-dot" /><span>ROBLOX READY</span><i className="marquee-dot" /><span>OWNER DIRECT</span>
        </div>
      </div>

      <section id="products" className="section products-section">
        <div className="section-wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">01 / pick your access</span>
              <h2 className="section-title">Start small.<br />Play bigger.</h2>
            </div>
            <p className="section-description">Empat pilihan key Nixx VVIP yang straight to the point. Tidak ada tabel rumit, tidak ada biaya tersembunyi.</p>
          </div>
          <div className="product-grid">
            {products.map(({ id, title, price, detail, icon: Icon, featured }) => (
              <article key={id} className={`product-card ${featured ? 'featured' : ''}`} data-testid={`card-product-${id}`}>
                <span className="product-index">KEY / {id}</span>
                <div className="product-icon"><Icon size={22} /></div>
                <h3>{title}</h3>
                <p className="product-detail">{detail}</p>
                <div className="product-bottom">
                  <div className="product-price"><small>one click away</small>{price}</div>
                  <button className="product-buy" aria-label={`Order ${title}`} onClick={() => openWhatsApp(title, price)} data-testid={`button-buy-key-${id}`}><ArrowUpRight size={19} /></button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="showcase" className="section story-section">
        <div className="section-wrap story-grid">
          <div>
            <span className="eyebrow">02 / see it in motion</span>
            <h2>Tools that look as sharp as they run.</h2>
            <p className="story-copy">Preview the Nixx VVIP feel before you order. Interface gelap, control yang rapih, dan tampilan yang langsung terbaca saat game sedang ramai.</p>
            <div className="stats">
              <div className="stat"><strong>04</strong><span>visual previews</span></div>
              <div className="stat"><strong>DM</strong><span>owner support</span></div>
            </div>
          </div>
          <div className="showcase">
            <figure className="showcase-figure">
              <img src="/assets/products/nixx-vip-01.png" alt="Nixx VVIP overlay and Roblox gameplay preview" data-testid="img-showcase-01" />
              <figcaption>01 / full interface</figcaption>
            </figure>
            <figure className="showcase-figure">
              <img src="/assets/products/nixx-vip-02.jpg" alt="Nixx VVIP gameplay preview near a dock" data-testid="img-showcase-02" />
              <figcaption>02 / in game</figcaption>
            </figure>
            <figure className="showcase-figure">
              <img src="/assets/products/nixx-vip-04.jpg" alt="Nixx VVIP troll tools preview" data-testid="img-showcase-04" />
              <figcaption>04 / control set</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section id="reseller" className="section reseller-section">
        <div className="section-wrap">
          <div className="reseller-panel">
            <div>
              <span className="eyebrow">03 / build your circle</span>
              <h2>Turn access into your own lane.</h2>
              <p>Masuk ke reseller circle Nixx dengan satu paket lengkap. Cocok untuk kamu yang ingin menjual kembali akses atau mengembangkan setup sendiri.</p>
              <div className="hero-actions">
                <WhatsAppButton product="Reseller Nixx VVIP" price="Rp120.000" label="Join reseller" className="button-dark" />
              </div>
            </div>
            <div className="reseller-list">
              <ul>
                <li><Check size={17} /> Reseller group access</li>
                <li><Check size={17} /> Open Source NixxVvip script</li>
                <li><Check size={17} /> Direct owner onboarding</li>
              </ul>
              <div className="reseller-price"><small>complete circle pass</small>Rp120.000</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section script-section">
        <div className="section-wrap script-layout">
          <div>
            <span className="eyebrow">04 / for builders</span>
            <h2>Open Roblox Lua Script.</h2>
            <p>Butuh script yang lebih spesifik? Detail fitur dan harga dibahas via DM owner. Ceritakan kebutuhanmu, lalu kita susun scope yang masuk akal.</p>
            <div className="hero-actions">
              <WhatsAppButton product="Open Roblox Lua Script" label="DM owner for details" />
            </div>
          </div>
          <div className="code-window" aria-label="Code preview">
            <div className="window-bar"><span>nixx-open.lua</span><span className="window-dots"><i /><i /><i /></span></div>
            <div className="code-content">
              <span className="code-line"><span className="code-num">01</span><span className="code-comment">-- make your own rules</span></span>
              <span className="code-line"><span className="code-num">02</span><span className="code-key">local</span> <span className="code-fn">Nixx</span> = <span className="code-fn">require</span>(<span className="code-string">"nixx-vvip"</span>)</span>
              <span className="code-line"><span className="code-num">03</span></span>
              <span className="code-line"><span className="code-num">04</span>Nixx.<span className="code-fn">configure</span>({'{'}</span>
              <span className="code-line"><span className="code-num">05</span>  access = <span className="code-string">"your-way"</span>,</span>
              <span className="code-line"><span className="code-num">06</span>  mode = <span className="code-string">"open"</span>,</span>
              <span className="code-line"><span className="code-num">07</span>  support = <span className="code-string">"direct"</span></span>
              <span className="code-line"><span className="code-num">08</span>{'}'})</span>
              <span className="code-line"><span className="code-num">09</span></span>
              <span className="code-line"><span className="code-num">10</span><span className="code-fn">Nixx</span>.<span className="code-fn">launch</span>()</span>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="section faq-section">
        <div className="section-wrap faq-layout">
          <div>
            <span className="eyebrow">05 / no guesswork</span>
            <h2 className="section-title">Questions,<br />answered.</h2>
          </div>
          <div className="faq-list">
            {faqs.map(({ question, answer }, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={question} className="faq-item">
                  <button className="faq-question" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? -1 : index)} data-testid={`button-faq-${index}`}>
                    <span>{question}</span><ChevronDown size={17} />
                  </button>
                  {isOpen && <div className="faq-answer" data-testid={`text-faq-answer-${index}`}>{answer}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="section-wrap contact-inner">
          <div>
            <span className="eyebrow">06 / talk to Nixx</span>
            <h2>Ready when<br />you are.</h2>
            <p className="contact-number">Owner: {ownerDisplay} <button onClick={copyNumber} aria-label="Copy owner WhatsApp number" data-testid="button-copy-number"><Copy size={12} /> {copied ? 'Copied' : 'Copy number'}</button></p>
          </div>
          <WhatsAppButton product="Nixx VVIP" label="Open WhatsApp" className="contact-action" />
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-wrap">
          <span>© 2024 Nixx VVIP Store. Digital access, direct support.</span>
          <a href="#top" data-testid="link-back-top">Back to top <ArrowUpRight size={12} /></a>
        </div>
      </footer>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;