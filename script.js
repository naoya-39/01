
const menuContainer = document.getElementById('menu-container');
const menus = Array.from({ length: 10 }, (_, i) => `メニュー${i + 1}`);
const counts = {};

menus.forEach(menu => {
  counts[menu] = 0;
  const div = document.createElement('div');
  div.innerHTML = \`
    <strong>\${menu}</strong>
    <button onclick="adjustCount('\${menu}', -1)">−</button>
    <input id="\${menu}" value="0" size="3" />
    <button onclick="adjustCount('\${menu}', 1)">＋</button>
  \`;
  menuContainer.appendChild(div);
});

function adjustCount(menu, delta) {
  const input = document.getElementById(menu);
  counts[menu] = Math.max(0, (counts[menu] || 0) + delta);
  input.value = counts[menu];
}

function downloadCSV() {
  const rows = [["メニュー名", "販売数"]];
  for (const menu in counts) {
    rows.push([menu, counts[menu]]);
  }
  const csvContent = rows.map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "販売数.csv";
  a.click();
}
