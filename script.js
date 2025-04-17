// ========================
// HOME PAGE LOGIC (index.html)
// ========================

if (window.location.pathname.endsWith("index.html")) {
  const btnOffer = document.getElementById("btnOffer");
  const btnJourney = document.getElementById("btnJourney");

  if (btnOffer) {
    btnOffer.addEventListener("click", () => {
      window.location.href = "offer.html";
    });
  }

  if (btnJourney) {
    btnJourney.addEventListener("click", () => {
      alert("You clicked JOURNEY!");
    });
  }
}

// ========================
// OFFER GATEWAY PAGE LOGIC (offer.html)
// ========================

if (window.location.pathname.endsWith("offer.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const importBtn = document.getElementById("btnImportFile");
    const templateBtn = document.getElementById("btnUseTemplate");
    const returnBtn = document.getElementById("returnHome");
    const manageBtn = document.getElementById("manageOffersBtn");
    const modal = document.getElementById("offerModal");
    const closeModal = document.getElementById("closeOfferModal");
    const addOfferBtn = document.getElementById("addOfferBtn");
    const offerList = document.getElementById("offerList");
    const offerSelector = document.getElementById("offerSelector");
    const newOfferName = document.getElementById("newOfferName");

    if (importBtn) {
      importBtn.addEventListener("click", () => {
        window.location.href = "offerImport.html";
      });
    }

    if (templateBtn) {
      templateBtn.addEventListener("click", () => {
        alert("Template feature coming soon!");
      });
    }

    if (returnBtn) {
      returnBtn.addEventListener("click", () => {
        window.location.href = "index.html";
      });
    }

    function loadOffers() {
      const offers = JSON.parse(localStorage.getItem("offerRepository") || "[]");
      offerSelector.innerHTML = `<option disabled selected>Select an Offer</option>`;
      offers.forEach(offer => {
        const option = document.createElement("option");
        option.textContent = offer;
        offerSelector.appendChild(option);
      });

      offerList.innerHTML = "";
      offers.forEach(offer => {
        const li = document.createElement("li");
        li.textContent = offer;
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("csv-btn", "danger");
        removeBtn.style.marginLeft = "10px";
        removeBtn.onclick = () => {
          const filtered = offers.filter(o => o !== offer);
          localStorage.setItem("offerRepository", JSON.stringify(filtered));
          loadOffers();
        };
        li.appendChild(removeBtn);
        offerList.appendChild(li);
      });
    }

    if (manageBtn) {
      manageBtn.addEventListener("click", () => {
        modal.style.display = "flex";
        loadOffers();
      });
    }

    if (closeModal) {
      closeModal.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    if (addOfferBtn) {
      addOfferBtn.addEventListener("click", () => {
        const name = newOfferName.value.trim();
        if (!name) return alert("Please enter an offer name.");
        let offers = JSON.parse(localStorage.getItem("offerRepository") || "[]");
        if (offers.includes(name)) return alert("Offer already exists.");
        offers.push(name);
        localStorage.setItem("offerRepository", JSON.stringify(offers));
        newOfferName.value = "";
        loadOffers();
      });
    }

    loadOffers();
  });
}

// ========================
// IMPORT PAGE LOGIC (offerImport.html)
// ========================

if (window.location.pathname.endsWith("offerImport.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#excelTable tbody");
    const returnBtn = document.getElementById("returnHome");
    const excelInput = document.getElementById("excelFile");
    const importLabel = document.getElementById("importLabel");
    const clearTableBtn = document.getElementById("clearTableBtn");
    const createCSVBtn = document.getElementById("createCSV");
    const dropZone = document.getElementById("fileDropZone");
    const languageSelect = document.getElementById("languageSelect");
    const viewSavedCSVsBtn = document.getElementById("viewSavedCSVs");

    let selectedLanguage = "EN";

    if (languageSelect) {
      languageSelect.addEventListener("change", (e) => {
        selectedLanguage = e.target.value;
      });
    }

    if (viewSavedCSVsBtn) {
      viewSavedCSVsBtn.addEventListener("click", () => {
        window.location.href = "savedCSVs.html";
      });
    }

    if (createCSVBtn) {
      createCSVBtn.style.display = "none";
      createCSVBtn.addEventListener("click", () => {
        const rows = [];
        const header = "PKG_CODES#Promo code#Name#Title#Description";
        rows.push(header);

        const tableRows = tableBody.querySelectorAll("tr");
        tableRows.forEach(row => {
          const cells = row.querySelectorAll("td");
          const rowData = [];

          cells.forEach(cell => {
            let text = cell.textContent || "";
            text = text.replace(/\r?\n|\r/g, " ").trim();
            rowData.push(text);
          });

          if (rowData.some(cell => cell !== "")) {
            rows.push(rowData.join("#"));
          }
        });

        const csvContent = rows.join("\n");

        const csvObject = {
          content: csvContent,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem(`csv_${selectedLanguage}`, JSON.stringify(csvObject));

        const previewWindow = window.open("", "CSV Preview", "width=800,height=600");
        previewWindow.document.write(`
          <pre style="font-family:monospace; white-space:pre-wrap;">${csvContent}</pre>
          <button onclick="window.close()" style="margin-top:20px;padding:10px 20px;font-weight:bold;">Close Preview</button>
        `);

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedLanguage}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast("CSV created and downloaded successfully!");
      });
    }

    if (returnBtn) {
      returnBtn.addEventListener("click", () => {
        window.location.href = "offer.html";
      });
    }

    if (clearTableBtn) {
      clearTableBtn.addEventListener("click", () => {
        const confirmClear = confirm("Are you sure you want to clear all data from the table?");
        if (confirmClear) {
          tableBody.innerHTML = `
            <tr>
              <td contenteditable="true"></td>
              <td contenteditable="true"></td>
              <td contenteditable="true"></td>
              <td contenteditable="true"></td>
              <td contenteditable="true"></td>
            </tr>
          `;
          importLabel.style.display = "inline-block";
          clearTableBtn.style.display = "none";
          createCSVBtn.style.display = "none";
          if (dropZone) dropZone.style.display = "block";
          excelInput.value = "";
        }
      });
    }

    if (excelInput) {
      excelInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) handleExcelImport(file);
      });
    }

    if (dropZone) {
      dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
      });

      dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragover");
      });

      dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        const file = e.dataTransfer.files[0];
        if (file) handleExcelImport(file);
      });
    }

    function handleExcelImport(file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const expectedHeaders = ["PKG_CODES", "Promo Code", "Name", "Title", "Description"];
        const headers = jsonData[0] ? jsonData[0].map(h => h?.toString().trim().toLowerCase()) : [];

        const headersMatch = expectedHeaders.every((h, i) => headers[i] === h.toLowerCase());

        if (!headersMatch) {
          alert("Incorrect file format.\nExpected headers:\n" + expectedHeaders.join(", ") +
            "\n\nDetected:\n" + headers.join(", "));
          return;
        }

        tableBody.innerHTML = "";
        for (let i = 1; i < jsonData.length; i++) {
          const rowData = jsonData[i];
          const row = document.createElement("tr");

          for (let j = 0; j < 5; j++) {
            const cell = document.createElement("td");
            cell.contentEditable = "true";
            cell.textContent = rowData[j] || "";
            row.appendChild(cell);
          }

          tableBody.appendChild(row);
        }

        importLabel.style.display = "none";
        clearTableBtn.style.display = "inline-block";
        createCSVBtn.style.display = "inline-block";
        if (dropZone) dropZone.style.display = "none";
      };

      reader.readAsArrayBuffer(file);
    }
  });
}

// ========================
// SAVED CSV PAGE LOGIC (savedCSVs.html)
// ========================
if (window.location.pathname.includes("savedCSVs.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const csvList = document.getElementById("csvList");
    const returnBtn = document.getElementById("returnHome");

    if (returnBtn) {
      returnBtn.addEventListener("click", () => {
        if (document.referrer.includes("offerImport.html")) {
          window.location.href = "offerImport.html";
        } else {
          window.history.back();
        }
      });
    }

    const keys = Object.keys(localStorage).filter(k => k.startsWith("csv_"));

    if (!csvList) return;

    if (keys.length === 0) {
      csvList.innerHTML = "<p>No saved CSVs found.</p>";
    } else {
      keys.forEach(key => {
        const lang = key.replace("csv_", "");
        const raw = localStorage.getItem(key);
        let parsed;

        try {
          parsed = JSON.parse(raw);
        } catch {
          return; // skip corrupted entries
        }

        const date = new Date(parsed.timestamp);
        const formattedDate = date.toLocaleString();

        const entry = document.createElement("div");
        entry.className = "saved-entry";
        entry.innerHTML = `
          <div class="entry-header">
            <span class="entry-name">${lang}.csv</span>
            <span class="entry-date">${formattedDate}</span>
          </div>
          <div class="entry-actions">
            <button class="csv-btn" onclick="viewCSV('${key}')">View</button>
            <button class="csv-btn" onclick="downloadCSV('${key}')">Download</button>
            <button class="csv-btn danger" onclick="deleteCSV('${key}', this)">Delete</button>
          </div>
        `;

        csvList.appendChild(entry);
      });
    }
  });
}

function viewCSV(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { content: raw };
  }

  const modal = document.getElementById("csvModal");
  const modalContent = document.getElementById("csvModalContent");
  if (modal && modalContent) {
    modalContent.textContent = parsed.content || "No content.";
    modal.style.display = "block";
  }
}

function downloadCSV(key) {
  const raw = localStorage.getItem(key);
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { content: raw };
  }

  const blob = new Blob([parsed.content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = key.replace("csv_", "") + ".csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function deleteCSV(key, btn) {
  if (confirm("Delete this saved CSV?")) {
    localStorage.removeItem(key);
    const entry = btn.closest(".saved-entry");
    if (entry) entry.remove();
  }
}

function closeModal() {
  const modal = document.getElementById("csvModal");
  if (modal) modal.style.display = "none";
}
