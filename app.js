
const unitOptions = ["皿", "kg", "人前", "個", "1"];
const itemCount = 100;

function init() {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("date").value = localStorage.getItem("date") || today;
    document.getElementById("reservation").value = localStorage.getItem("reservation") || "";
    document.getElementById("people").value = localStorage.getItem("people") || "";
    document.getElementById("tables").value = localStorage.getItem("tables") || "";

    document.getElementById("date").addEventListener("change", e => localStorage.setItem("date", e.target.value));
    document.getElementById("reservation").addEventListener("input", e => localStorage.setItem("reservation", e.target.value));
    document.getElementById("people").addEventListener("input", e => localStorage.setItem("people", e.target.value));
    document.getElementById("tables").addEventListener("input", e => localStorage.setItem("tables", e.target.value));

    const tbody = document.getElementById("menuBody");

    for (let i = 0; i < itemCount; i++) {
        const row = document.createElement("tr");

        const menuInput = document.createElement("input");
        menuInput.type = "text";
        menuInput.value = localStorage.getItem(`menu_${i}`) || "";
        menuInput.addEventListener("input", () => {
            localStorage.setItem(`menu_${i}`, menuInput.value);
        });
        const menuCell = document.createElement("td");
        menuCell.appendChild(menuInput);
        row.appendChild(menuCell);

        const unitSelect = document.createElement("select");
        unitOptions.forEach(u => {
            const opt = document.createElement("option");
            opt.value = u;
            opt.textContent = u;
            unitSelect.appendChild(opt);
        });
        unitSelect.value = localStorage.getItem(`unit_${i}`) || "皿";
        unitSelect.addEventListener("change", () => localStorage.setItem(`unit_${i}`, unitSelect.value));
        const unitCell = document.createElement("td");
        unitCell.appendChild(unitSelect);
        row.appendChild(unitCell);

        const prepInput = document.createElement("input");
        prepInput.type = "number";
        prepInput.value = localStorage.getItem(`prep_${i}`) || "";
        prepInput.addEventListener("input", () => {
            localStorage.setItem(`prep_${i}`, prepInput.value);
            updateOutput();
        });
        const prepCell = document.createElement("td");
        prepCell.appendChild(prepInput);
        row.appendChild(prepCell);

        const remainInput = document.createElement("input");
        remainInput.type = "number";
        remainInput.value = localStorage.getItem(`remain_${i}`) || "";
        remainInput.addEventListener("input", () => {
            localStorage.setItem(`remain_${i}`, remainInput.value);
            updateOutput();
        });
        const remainCell = document.createElement("td");
        remainCell.appendChild(remainInput);
        row.appendChild(remainCell);

        const outputInput = document.createElement("input");
        outputInput.type = "number";
        outputInput.value = localStorage.getItem(`output_${i}`) || "";
        outputInput.addEventListener("input", () => {
            localStorage.setItem(`output_${i}`, outputInput.value);
            updateOutput();
        });
        const outputCell = document.createElement("td");
        outputCell.appendChild(outputInput);
        row.appendChild(outputCell);

        const priceInput = document.createElement("input");
        priceInput.type = "number";
        priceInput.value = localStorage.getItem(`price_${i}`) || "";
        priceInput.addEventListener("input", () => {
            localStorage.setItem(`price_${i}`, priceInput.value);
            updateOutput();
        });
        const priceCell = document.createElement("td");
        priceCell.appendChild(priceInput);
        row.appendChild(priceCell);

        const totalCostCell = document.createElement("td");
        totalCostCell.textContent = "0";
        row.appendChild(totalCostCell);

        tbody.appendChild(row);

        function updateOutput() {
            const prep = parseFloat(prepInput.value) || 0;
            const remain = parseFloat(remainInput.value) || 0;
            const output = parseFloat(outputInput.value || (prep - remain));
            outputInput.value = output;
            localStorage.setItem(`output_${i}`, output);
            const price = parseFloat(priceInput.value) || 0;
            const cost = output * price;
            totalCostCell.textContent = cost.toFixed(0);
            localStorage.setItem(`cost_${i}`, cost.toFixed(0));
            updateTotalCost();
        }

        updateOutput();
    }
}

function updateTotalCost() {
    let total = 0;
    for (let i = 0; i < itemCount; i++) {
        const cost = parseFloat(localStorage.getItem(`cost_${i}`)) || 0;
        total += cost;
    }
    document.getElementById("totalCostDisplay").textContent = "原価合計: ¥" + total.toLocaleString();
}

function downloadCSV() {
    const date = document.getElementById("date").value;
    const reservation = document.getElementById("reservation").value;
    const people = document.getElementById("people").value;
    const tables = document.getElementById("tables").value;

    let csv = `日付,予約名,人数,卓数\n${date},${reservation},${people},${tables}\n\n`;
    csv += "メニュー名,単位,仕込数,残数,出数,単価,合計原価\n";

    let total = 0;
    for (let i = 0; i < itemCount; i++) {
        const menu = localStorage.getItem(`menu_${i}`) || "";
        if (!menu.trim()) continue;
        const unit = localStorage.getItem(`unit_${i}`) || "";
        const prep = localStorage.getItem(`prep_${i}`) || "";
        const remain = localStorage.getItem(`remain_${i}`) || "";
        const output = localStorage.getItem(`output_${i}`) || "";
        const price = localStorage.getItem(`price_${i}`) || "";
        const cost = localStorage.getItem(`cost_${i}`) || "0";
        total += parseFloat(cost);
        csv += `${menu},${unit},${prep},${remain},${output},${price},${cost}\n`;
    }

    csv += `\n原価合計,, , , , ,${total.toFixed(0)}\n`;

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `仕込み販売_${date}.csv`;
    link.click();
}

window.onload = init;
