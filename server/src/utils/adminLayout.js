function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export { escapeHtml };

export function layout({ title, content, adminName }) {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${escapeHtml(title)}</title>
      <style>
        :root {
          --card: #ffffff;
          --ink: #142126;
          --muted: #5d6d70;
          --line: #d9e0da;
          --brand: #1d6b61;
          --brand-soft: #e1f2ed;
          --accent: #f0a94b;
          --danger: #b94b4b;
        }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: "Segoe UI", sans-serif; background: linear-gradient(180deg, #eef3ed, #f8f8f4); color: var(--ink); }
        .shell { width: min(1200px, calc(100% - 32px)); margin: 0 auto; padding: 24px 0 48px; }
        .topbar { display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 20px; flex-wrap: wrap; }
        .topbar h1, .topbar p { margin: 0; }
        .nav { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
        .nav a, .logout-btn { text-decoration: none; color: var(--brand); font-weight: 600; padding: 10px 14px; border-radius: 999px; background: var(--brand-soft); border: 0; cursor: pointer; }
        .grid { display: grid; gap: 20px; }
        .card { background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 20px; box-shadow: 0 8px 30px rgba(20, 33, 38, 0.05); overflow: hidden; }
        .split { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px; }
        .stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        .stat { padding: 16px; border-radius: 16px; background: #f8faf7; border: 1px solid var(--line); }
        .table-wrap { width: 100%; overflow-x: auto; }
        table { width: 100%; min-width: 640px; border-collapse: collapse; font-size: 14px; }
        th, td { padding: 12px; border-bottom: 1px solid var(--line); vertical-align: top; text-align: left; }
        th { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
        form.inline, .stack { display: grid; gap: 10px; }
        input, textarea, select { width: 100%; padding: 10px 12px; border: 1px solid var(--line); border-radius: 10px; font: inherit; }
        input[type="file"] { padding: 10px; background: #f8faf7; }
        textarea { min-height: 100px; resize: vertical; }
        .actions { display: flex; gap: 8px; flex-wrap: wrap; }
        button { border: 0; border-radius: 10px; padding: 10px 14px; font-weight: 600; cursor: pointer; color: white; background: var(--brand); }
        button.alt { background: var(--accent); color: #2e220d; }
        button.danger { background: var(--danger); }
        .muted { color: var(--muted); }
        @media (max-width: 900px) {
          .shell { width: min(100% - 20px, 1200px); padding-top: 16px; }
          .split, .stats { grid-template-columns: 1fr; }
          .card { padding: 16px; }
          .nav { width: 100%; }
          .nav a, .logout-btn { width: 100%; display: inline-flex; justify-content: center; text-align: center; }
        }
      </style>
    </head>
    <body>
      <div class="shell">
        <div class="topbar">
          <div>
            <h1>Sri Ram Charitable Trust, Jammu Admin</h1>
            <p class="muted">Signed in as ${escapeHtml(adminName || "Admin")}</p>
          </div>
          <div class="nav">
            <a href="/admin">Dashboard</a>
            <a href="/admin/ngo">NGO Content</a>
            <a href="/admin/volunteers">Volunteers</a>
            <a href="/admin/donations">Donations</a>
            <a href="/api/ngo">API JSON</a>
            <form method="post" action="/admin/logout">
              <button class="logout-btn" type="submit">Logout</button>
            </form>
          </div>
        </div>
        ${content}
      </div>
    </body>
  </html>`;
}

export function loginLayout({ title, content }) {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${escapeHtml(title)}</title>
      <style>
        body { margin: 0; font-family: "Segoe UI", sans-serif; background: linear-gradient(160deg, #0f1720, #214740); }
        .login-shell { min-height: 100vh; display: grid; place-items: center; padding: 16px; }
        .login-card { width: min(460px, 100%); background: white; border-radius: 24px; padding: 32px; box-shadow: 0 16px 50px rgba(0, 0, 0, 0.22); }
        .stack { display: grid; gap: 12px; }
        input { width: 100%; padding: 12px; border: 1px solid #d9e0da; border-radius: 12px; font: inherit; }
        button { border: 0; border-radius: 12px; padding: 12px 16px; background: #1d6b61; color: white; font-weight: 700; cursor: pointer; }
        .muted { color: #5d6d70; }
        .error { color: #b94b4b; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="login-shell">
        <div class="login-card">${content}</div>
      </div>
    </body>
  </html>`;
}
