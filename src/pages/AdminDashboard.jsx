import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import petaliaLogo from "../assets/petalia-logo.png";
import "../styles/AdminDashboard.css";
const PAGE_SIZE = 20;
const SECTIONS = ["overview", "shops", "products", "orders"];
const COLUMNS = {
  shops: "id,name,category,location,business_email",
  products: "id,name,category,price,stock,shop_id,is_hidden",
  orders: "id,order_reference,created_at,customer_name,total,payment_status,status,shop_id",
};
const money = (value) => value == null ? "—" : new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD",
}).format(Number(value));
const date = (value) => {
  const parsed = new Date(value);
  return value && !Number.isNaN(parsed.getTime())
    ? parsed.toLocaleString("en-GB", { timeZone: "Asia/Phnom_Penh" }) : "—";
};
const label = (value) => value ? String(value).replaceAll("_", " ") : "—";
function Status({ value }) {
  const tone = ["paid", "completed", "delivered", "visible"].includes(value) ? "good"
    : ["failed", "cancelled", "canceled", "refunded", "hidden"].includes(value) ? "muted" : "waiting";
  return <span className={`pa-status pa-status-${tone}`}>{label(value)}</span>;
}
function DataTable({ section, rows, shopNames, onModerate, moderationBusy }) {
  const shop = (id) => id == null ? "Not assigned" : shopNames[id] || `Shop #${id}`;
  const titles = section === "shops"
    ? ["Shop", "Category", "Location", "Contact"]
    : section === "products"
      ? ["Product", "Shop", "Category", "Price", "Stock", "Visibility", "Action"]
      : ["Order", "Date (Cambodia)", "Customer", "Shop", "Total", "Payment", "Fulfillment"];
  return <div className="pa-table-scroll" tabIndex={0} aria-label={`${section} table, scroll horizontally if needed`}>
    <table className="pa-table">
      <caption className="pa-sr-only">Petalia {section}</caption>
      <thead><tr>{titles.map((title) => <th key={title} scope="col">{title}</th>)}</tr></thead>
      <tbody>{rows.length === 0
        ? <tr><td colSpan={titles.length} className="pa-empty">No {section} found.</td></tr>
        : rows.map((row) => <tr key={row.id}>
          {section === "shops" ? <>
            <td><Link to={`/local-shops/${row.id}`} target="_blank" rel="noreferrer">{row.name || `Shop #${row.id}`}</Link></td>
            <td>{row.category || "—"}</td><td>{row.location || "—"}</td><td>{row.business_email || "—"}</td>
          </> : section === "products" ? <>
            <td><Link to={`/product/${row.id}`} target="_blank" rel="noreferrer">{row.name || `Product #${row.id}`}</Link></td>
            <td>{shop(row.shop_id)}</td><td>{row.category || "—"}</td><td>{money(row.price)}</td><td>{row.stock ?? "—"}</td>
            <td><Status value={row.is_hidden ? "hidden" : "visible"} /></td>
            <td><button type="button" disabled={moderationBusy !== null}
              onClick={() => onModerate(row)}
              aria-label={`${row.is_hidden ? "Restore" : "Hide"} ${row.name || "product"}`}>
              {moderationBusy === row.id ? "Saving…" : row.is_hidden ? "Restore" : "Hide"}
            </button></td>
          </> : <>
            <td>{row.order_reference || `Order #${row.id}`}</td><td>{date(row.created_at)}</td>
            <td>{row.customer_name || "—"}</td><td>{shop(row.shop_id)}</td><td>{money(row.total)}</td>
            <td><Status value={row.payment_status} /></td><td><Status value={row.status} /></td>
          </>}
        </tr>)}</tbody>
    </table>
  </div>;
}
export default function AdminDashboard() {
  const [access, setAccess] = useState({ status: "checking", user: null, error: "" });
  const [authVersion, setAuthVersion] = useState(0);
  const [section, setSection] = useState("overview");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [moderationBusy, setModerationBusy] = useState(null);
  const [moderationMessage, setModerationMessage] = useState("");
  const [moderationError, setModerationError] = useState("");
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [data, setData] = useState({ rows: [], count: 0, counts: {}, shopNames: {} });
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" || event === "SIGNED_IN" || event === "USER_UPDATED") {
        setAccess({ status: "checking", user: null, error: "" });
        setData({ rows: [], count: 0, counts: {}, shopNames: {} });
        setAuthVersion((previous) => previous + 1);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    let active = true;
    async function checkAccess() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (!active) return;
        if (userError || !user) {
          setAccess({ status: "signedout", user: null, error: "" });
          return;
        }
        const { data: admin, error: adminError } = await supabase.rpc("petalia_is_admin");
        if (adminError) throw adminError;
        if (active) setAccess({ status: admin === true ? "allowed" : "denied", user, error: "" });
      } catch (problem) {
        if (active) setAccess({ status: "error", user: null, error: problem.message || "Could not verify access." });
      }
    }
    checkAccess();
    return () => { active = false; };
  }, [authVersion]);
  useEffect(() => {
    const timer = setTimeout(() => { setFilter(search.trim()); setPage(0); }, 300);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    if (access.status !== "allowed") return;
    let active = true;
    async function load() {
      setBusy(true);
      setError("");
      try {
        // Recheck membership on refresh/tab changes, including role revocation.
        const { data: admin, error: roleError } = await supabase.rpc("petalia_is_admin");
        if (roleError) throw roleError;
        if (admin !== true) {
          if (active) {
            setData({ rows: [], count: 0, counts: {}, shopNames: {} });
            setAccess({ status: "denied", user: access.user, error: "" });
          }
          return;
        }
        const shopNames = {};
        // Paginate the lookup too, so shop labels do not depend on an API row cap.
        for (let offset = 0; ; offset += 200) {
          const result = await supabase.from("shops").select("id,name").order("id").range(offset, offset + 199);
          if (result.error) throw result.error;
          for (const shop of result.data || []) shopNames[shop.id] = shop.name;
          if ((result.data || []).length < 200) break;
        }
        if (section === "overview") {
          const results = await Promise.all([
            supabase.from("shops").select("id", { count: "exact", head: true }),
            supabase.from("products").select("id", { count: "exact", head: true }),
            supabase.from("orders").select("id", { count: "exact", head: true }),
            supabase.from("orders").select("id", { count: "exact", head: true }).eq("payment_status", "paid"),
            supabase.from("orders").select(COLUMNS.orders).order("created_at", { ascending: false }).order("id", { ascending: false }).limit(5),
          ]);
          for (const result of results) if (result.error) throw result.error;
          if (active) setData({ shopNames, rows: results[4].data || [], count: results[2].count ?? 0,
            counts: { Shops: results[0].count ?? 0, Products: results[1].count ?? 0, Orders: results[2].count ?? 0, "Paid Orders": results[3].count ?? 0 } });
        } else {
          let query = supabase.from(section).select(COLUMNS[section], { count: "exact" });
          if (filter) query = query.ilike(section === "orders" ? "customer_name" : "name", `%${filter.replace(/[\\%_]/g, "\\$&")}%`);
          query = section === "orders" ? query.order("created_at", { ascending: false }).order("id", { ascending: false }) : query.order("id", { ascending: false });
          const result = await query.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
          if (result.error) throw result.error;
          if (active) setData({ shopNames, rows: result.data || [], count: result.count ?? 0, counts: {} });
        }
      } catch (problem) {
        if (active) {
          setData({ rows: [], count: 0, counts: {}, shopNames: {} });
          setError(problem.message || "Could not load marketplace data.");
        }
      } finally { if (active) setBusy(false); }
    }
    load();
    return () => { active = false; };
  }, [access.status, access.user, section, filter, page, refresh]);
  async function moderateProduct(product) {
    if (moderationBusy !== null) return;
    const hidden = !product.is_hidden;
    const description = hidden
      ? `Hide "${product.name}"? Customers will not see it or place new orders for it. Existing orders remain unchanged.`
      : `Restore "${product.name}" to the public shop?`;
    if (!window.confirm(description)) return;
    setModerationBusy(product.id);
    setModerationMessage(""); setModerationError("");
    try {
      const { error: changeError } = await supabase.rpc("petalia_set_product_hidden", {
        p_product_id: product.id, p_hidden: hidden,
      });
      if (changeError) throw changeError;
      setData((previous) => ({ ...previous, rows: previous.rows.map((row) =>
        row.id === product.id ? { ...row, is_hidden: hidden } : row) }));
      setModerationMessage(`${product.name} ${hidden ? "hidden from customers" : "restored to the shop"}.`);
    } catch (problem) {
      setModerationError(problem.message || "Could not update product visibility.");
    } finally { setModerationBusy(null); }
  }
  function changeSection(next) {
    if (next === section) return;
    setModerationMessage(""); setModerationError("");
    setBusy(true); setSection(next); setSearch(""); setFilter(""); setPage(0);
  }
  async function logout() {
    setLogoutBusy(true);
    try {
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) throw logoutError;
      setAccess({ status: "signedout", user: null, error: "" });
      setData({ rows: [], count: 0, counts: {}, shopNames: {} });
    } catch (problem) { setError(problem.message || "Could not sign out. Please try again."); }
    finally { setLogoutBusy(false); }
  }
  if (access.status === "signedout") return <Navigate to="/sign-in" replace />;
  if (access.status !== "allowed") return <main className="pa-page pa-access">
    <img src={petaliaLogo} alt="Petalia" width="140" />
    <h1>{access.status === "checking" ? "Checking admin access…" : access.status === "denied" ? "Administrator access only" : "Could not verify access"}</h1>
    {access.status === "denied" && <p>This account has no administrator permission.</p>}
    {access.error && <p role="alert">{access.error}</p>}
    {access.status === "error" && <button onClick={() => setAuthVersion((previous) => previous + 1)}>Try again</button>}
    {access.status !== "checking" && <Link to="/">Back to Petalia</Link>}
  </main>;
  return <div className="pa-page">
    <header className="pa-header">
      <Link to="/" aria-label="Petalia homepage"><img src={petaliaLogo} alt="Petalia" /></Link>
      <span className="pa-header-label">Admin Center</span>
      <div className="pa-account"><span>{access.user?.email}</span><button disabled={logoutBusy} onClick={logout}>{logoutBusy ? "Signing out…" : "Log out"}</button></div>
    </header>
    <div className="pa-layout">
      <nav className="pa-nav" aria-label="Admin sections">
        <p>MARKETPLACE</p>
        {SECTIONS.map((item) => <button key={item} className={section === item ? "pa-active" : ""} aria-current={section === item ? "page" : undefined} disabled={moderationBusy !== null} onClick={() => changeSection(item)}>{label(item)}</button>)}
        <Link to="/">View Petalia ↗</Link>
      </nav>
      <main className="pa-main">
        <div className="pa-heading"><div><p className="pa-eyebrow">PETALIA ADMIN</p><h1>{section === "overview" ? "Marketplace overview" : label(section)}</h1><p>View your marketplace’s shops, products, and orders.</p></div><button onClick={() => { setBusy(true); setRefresh((previous) => previous + 1); }} disabled={busy || moderationBusy !== null}>Refresh</button></div>
        {section === "products" && <p>Hide removes a listing from customer browsing and new orders. Restore makes it available again. Existing orders stay intact.</p>}
        {moderationMessage && <p role="status">{moderationMessage}</p>}
        {moderationError && <p className="pa-error" role="alert">{moderationError}</p>}
        {error && <div className="pa-error" role="alert">Could not load data: {error}<button onClick={() => setRefresh((previous) => previous + 1)}>Try again</button></div>}
        {busy ? <p className="pa-loading" role="status">Loading marketplace data…</p> : !error && <>
          {section === "overview" && <div className="pa-stats">{Object.entries(data.counts).map(([name, count]) => <article key={name}><span>{name}</span><strong>{count}</strong></article>)}</div>}
        </>}
        {section !== "overview" && <div className="pa-tools"><label htmlFor="pa-search">{section === "orders" ? "Search customer name" : `Search ${section}`}</label><input id="pa-search" type="search" value={search} placeholder={section === "orders" ? "Customer name…" : "Name…"} onChange={(event) => setSearch(event.target.value)} /></div>}
        {!busy && !error && <section className="pa-panel">
          <div className="pa-panel-heading"><h2>{section === "overview" ? "Recent orders" : label(section)}</h2><span>{section === "overview" ? "Latest 5 orders" : `${data.count} results`}</span></div>
          <DataTable section={section === "overview" ? "orders" : section} rows={data.rows} shopNames={data.shopNames} onModerate={moderateProduct} moderationBusy={moderationBusy} />
          {section !== "overview" && <div className="pa-pagination"><span>Page {page + 1} of {Math.max(1, Math.ceil(data.count / PAGE_SIZE))}</span><div><button disabled={page === 0 || moderationBusy !== null} onClick={() => { setBusy(true); setPage((previous) => previous - 1); }}>Previous</button><button disabled={(page + 1) * PAGE_SIZE >= data.count || moderationBusy !== null} onClick={() => { setBusy(true); setPage((previous) => previous + 1); }}>Next</button></div></div>}
        </section>}
        <footer className="pa-footer">Petalia · Admin Center</footer>
      </main>
    </div>
  </div>;
}
