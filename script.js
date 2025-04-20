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

if (window.location.pathname.includes("offer.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const importBtn = document.getElementById("btnImportFile");
    const templateBtn = document.getElementById("btnUseTemplate");
    const returnBtn = document.getElementById("returnHome");
    const manageBtn = document.getElementById("manageOffersBtn");
    const openAddOfferModal = document.getElementById("openAddOfferModal");

if (openAddOfferModal) {
  openAddOfferModal.addEventListener("click", () => {
    document.getElementById("addOfferModal").style.display = "flex";
    goToStep(1);
  });
}

    const modal = document.getElementById("offerModal");
    const closeModal = document.getElementById("closeOfferModal");
    const offerList = document.getElementById("offerList");
    const offerSelector = document.getElementById("offerSelector");
    const selectedOfferName = document.getElementById("selectedOfferName");
    const editableCells = document.querySelectorAll("#templateEditorTable td");
    editableCells.forEach(cell => {
      cell.addEventListener("click", () => {
        cell.classList.toggle("editable-cell");
      });
    });
    
    // Insert placeholder at cursor position in textarea
function insertPlaceholder(placeholder) {
  const textarea = document.getElementById("promoDescription");
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;

  textarea.value = text.substring(0, start) + placeholder + text.substring(end);
  textarea.focus();
  textarea.selectionStart = textarea.selectionEnd = start + placeholder.length;
}


    const templateCells = document.querySelectorAll("#templateTable td");
    templateCells.forEach(cell => {
      cell.addEventListener("click", () => {
        cell.classList.toggle("editable-cell");
      });
    });

    const promoInput = document.getElementById("promoInput");
    const addPromoBtn = document.getElementById("addPromoBtn");
    const promoCodeList = document.getElementById("promoCodeList");
    let promoCodes = [];

    if (addPromoBtn) {
      addPromoBtn.addEventListener("click", () => {
        const code = promoInput.value.trim();
        if (!code || promoCodes.includes(code)) return;
        promoCodes.push(code);
        promoInput.value = "";
        renderPromoCodes();
      });
    }

    function renderPromoCodes() {
      promoCodeList.innerHTML = "";
      promoCodes.forEach(code => {
        const li = document.createElement("li");
        li.innerHTML = `${code} <button onclick="removePromoCode('${code}')">✕</button>`;
        promoCodeList.appendChild(li);
      });
    }

    window.removePromoCode = (code) => {
      promoCodes = promoCodes.filter(c => c !== code);
      renderPromoCodes();
    };

    function getSelectedOffer() {
      const selectedOption = offerSelector.options[offerSelector.selectedIndex];
      return selectedOption && !selectedOption.disabled ? selectedOption.value : null;
    }

    if (importBtn) {
      importBtn.addEventListener("click", () => {
        const offer = getSelectedOffer();
        if (!offer) {
          showToast("Please select an offer from the dropdown before importing.");
          return;
        }
        localStorage.setItem("currentOffer", offer);
        window.location.href = "offerImport.html";
      });
    }

    if (templateBtn) {
      templateBtn.addEventListener("click", () => {
        const offer = getSelectedOffer();
        if (!offer) {
          showToast("Please select an offer from the dropdown before using a template.");
          return;
        }
        localStorage.setItem("currentOffer", offer);
        showToast(`Template feature coming soon for offer: ${offer}`);
      });
    }

    if (returnBtn) {
      returnBtn.addEventListener("click", () => {
        window.location.href = "index.html";
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

        const templateTable = document.querySelector("#templateTable tbody tr");
        const cells = templateTable.querySelectorAll("td");
        const baseTemplate = [];
        cells.forEach(cell => {
          baseTemplate.push({
            text: cell.textContent.trim(),
            editable: cell.classList.contains("editable-cell")
          });
        });

        const offerData = {
          name,
          promoCodes,
          baseTemplate
        };

        localStorage.setItem(`offerData_${name}`, JSON.stringify(offerData));

        let offers = JSON.parse(localStorage.getItem("offerRepository") || "[]");
        if (offers.includes(name)) return alert("Offer already exists.");
        offers.push(name);
        localStorage.setItem("offerRepository", JSON.stringify(offers));
        newOfferName.value = "";
        loadOffers();
      });
    }

    function loadOffers() {
      const offers = JSON.parse(localStorage.getItem("offerRepository") || "[]");

      offerSelector.innerHTML = `<option disabled selected>SELECT EXISTING OFFER</option>`;
      offers.forEach(offer => {
        const option = document.createElement("option");
        option.textContent = offer;
        offerSelector.appendChild(option);
      });

      offerList.innerHTML = "";
      offers.forEach((offer, index) => {
        const li = document.createElement("li");

        const offerText = document.createElement("span");
        offerText.textContent = offer;
        offerText.classList.add("offer-name");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("csv-btn", "edit");
        editBtn.onclick = () => {
          // Set current offer name
          localStorage.setItem("currentOffer", offer);
        
          // Show the template modal
          const templateModal = document.getElementById("templateModal");
          if (templateModal) {
            templateModal.style.display = "flex";
          }
        
          // Optionally update selected name display
          const selectedOfferName = document.getElementById("selectedOfferName");
          if (selectedOfferName) {
            selectedOfferName.textContent = offer;
          }
        };
        

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("csv-btn", "danger");
        removeBtn.onclick = () => {
          const filtered = offers.filter(o => o !== offer);
          localStorage.setItem("offerRepository", JSON.stringify(filtered));
          loadOffers();
        };

        const buttonGroup = document.createElement("div");
        buttonGroup.classList.add("button-group-inline");
        buttonGroup.appendChild(editBtn);
        buttonGroup.appendChild(removeBtn);

        li.appendChild(offerText);
        li.appendChild(buttonGroup);
        offerList.appendChild(li);
      });
    }

    loadOffers();
  });
}

// ======================
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
    const selectedOfferName = document.getElementById("selectedOfferName");
    const currentOffer = localStorage.getItem("currentOffer") || "No offer selected";
    if (selectedOfferName) {
      selectedOfferName.textContent = currentOffer;
    }
       


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
          timestamp: new Date().toISOString(),
          offer: currentOffer
        };
        
        const key = `csv_${currentOffer}_${selectedLanguage}`;
        localStorage.setItem(key, JSON.stringify(csvObject));
              

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
    const csvSearch = document.getElementById("csvSearch");
    const monthFilter = document.getElementById("monthFilter");
    const applyFilterBtn = document.getElementById("applyFilterBtn");

    let searchTerm = "";
    let selectedMonth = "";

    if (applyFilterBtn) {
      applyFilterBtn.addEventListener("click", () => {
        searchTerm = csvSearch?.value?.toLowerCase() || "";
        renderGroupedCSVs();
      });
    }

    if (monthFilter) {
      monthFilter.addEventListener("change", () => {
        selectedMonth = monthFilter?.value || "";
        renderGroupedCSVs();
      });
    }

    if (returnBtn) {
      returnBtn.addEventListener("click", () => {
        if (document.referrer.includes("offerImport.html")) {
          window.location.href = "offerImport.html";
        } else {
          window.history.back();
        }
      });
    }

    function renderGroupedCSVs() {
      csvList.innerHTML = ""; // clear old

      const keys = Object.keys(localStorage).filter(k => k.startsWith("csv_"));
      const offerMap = {};

      keys.forEach(key => {
        const raw = localStorage.getItem(key);
        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch {
          return;
        }

        const match = key.match(/^csv_(.+?)_(\w{2})$/);
        if (!match) return;

        const offer = match[1];
        const lang = match[2];
        const timestamp = parsed.timestamp || "Unknown";
        const fileDate = new Date(timestamp);
        const fileMonth = fileDate.toISOString().slice(0, 7);

        const matchesText = offer.toLowerCase().includes(searchTerm) || lang.toLowerCase().includes(searchTerm);
        const matchesMonth = !selectedMonth || fileMonth === selectedMonth;

        if (!matchesText && !matchesMonth) return;

        if (!offerMap[offer]) offerMap[offer] = [];
        offerMap[offer].push({
          key,
          lang,
          timestamp,
          content: parsed.content || ""
        });
      });

      const sortedOffers = Object.entries(offerMap).sort((a, b) => {
        const aLatest = Math.max(...a[1].map(x => new Date(x.timestamp).getTime()));
        const bLatest = Math.max(...b[1].map(x => new Date(x.timestamp).getTime()));
        return bLatest - aLatest;
      });

      if (sortedOffers.length === 0) {
        csvList.innerHTML = "<p>No matching CSVs found.</p>";
        return;
      }

      sortedOffers.forEach(([offerName, files]) => {
        const section = document.createElement("div");
        section.className = "offer-section collapsed";

        const header = document.createElement("div");
        header.className = "offer-header";
        header.innerHTML = `
        <span class="chevron">&#8250;</span>
        <span class="offer-title">${offerName}</span>
        <span class="csv-count">${files.length}</span>
      `;
      
        header.onclick = () => {
          section.classList.toggle("collapsed");
          const chevron = header.querySelector(".chevron");
          chevron.classList.toggle("rotated");
        };

        const innerList = document.createElement("div");
        innerList.className = "csv-sublist";

        files
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .forEach(file => {
            const fileDate = new Date(file.timestamp);
            const fileMonth = fileDate.toISOString().slice(0, 7);
            const showFile =
              (!selectedMonth || fileMonth === selectedMonth) &&
              (offerName.toLowerCase().includes(searchTerm) || file.lang.toLowerCase().includes(searchTerm));

            if (showFile) {
              const entry = document.createElement("div");
              entry.className = "saved-entry";
              entry.innerHTML = `
                <div class="entry-header">
                  <span class="entry-name">${file.lang}.csv</span>
                  <span class="entry-date">${new Date(file.timestamp).toLocaleString()}</span>
                </div>
                <div class="entry-actions">
                  <button class="csv-btn" onclick="viewCSV('${file.key}')">View</button>
                  <button class="csv-btn" onclick="downloadCSV('${file.key}')">Download</button>
                  <button class="csv-btn danger" onclick="deleteCSV('${file.key}', this)">Delete</button>
                </div>
              `;
              innerList.appendChild(entry);
            }
          });

        if (innerList.children.length > 0) {
          section.appendChild(header);
          section.appendChild(innerList);
          csvList.appendChild(section);
        }
      });
    }

    renderGroupedCSVs();
  });
}

function viewCSV(key) {
  // Prevent accidental modal trigger
  if (!key || typeof key !== "string" || !key.startsWith("csv_")) return;

  const raw = localStorage.getItem(key);
  if (!raw) return;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { content: raw };
  }

  if (!parsed.content) return; // Don't open modal with empty content

  const modal = document.getElementById("csvModal");
  const modalContent = document.getElementById("csvModalContent");
  const copyBtn = document.getElementById("copyCSVBtn");

  if (modal && modalContent && copyBtn) {
    modalContent.textContent = parsed.content;
    modal.style.display = "flex";

    copyBtn.onclick = () => {
      navigator.clipboard.writeText(parsed.content).then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy to Clipboard"), 2000);
      });
    };
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

    const offerSection = btn.closest(".offer-section");
    if (offerSection) {
      const remainingEntries = offerSection.querySelectorAll(".saved-entry");
      if (remainingEntries.length === 0) {
        offerSection.remove();
      }
    }
  }
}

function closeModal() {
  const modal = document.getElementById("csvModal");
  if (modal) modal.style.display = "none";
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// === Multi-step Add Offer Modal ===

let currentStep = 1;
let addedPromoCodes = [];

function goToStep(stepNumber) {
  document.querySelectorAll(".add-offer-step").forEach(step => {
    step.classList.remove("active");
  });

  const step = document.getElementById(`step${stepNumber}`);
  if (step) {
    step.classList.add("active");
    currentStep = stepNumber;

    if (stepNumber === 4) {
      generateReview();
    }
  }
}

// 📌 Add this right after goToStep():
function insertPlaceholder(placeholder) {
  const textarea = document.getElementById("promoDescription");
  if (!textarea) return;
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;

  textarea.value = text.slice(0, start) + placeholder + text.slice(end);
  textarea.focus();
  textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
}

function wrapSelectedWithBraces() {
  const textarea = document.getElementById("promoDescriptionInput");
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  if (start === end) {
    alert("Please highlight a word to mark as editable.");
    return;
  }

  const text = textarea.value;
  const selected = text.substring(start, end);

  // Wrap the selected text with curly braces
  const updated = text.slice(0, start) + `{${selected}}` + text.slice(end);
  textarea.value = updated;

  // Re-position cursor
  const newPos = start + selected.length + 2;
  textarea.focus();
  textarea.setSelectionRange(newPos, newPos);
}



function addPromoCodeStep() {
  const input = document.getElementById("promoCodeInputStep");
  const list = document.getElementById("promoCodeListStep");
  const code = input.value.trim();

  if (code && !addedPromoCodes.includes(code)) {
    addedPromoCodes.push(code);

    const li = document.createElement("li");
    li.textContent = code;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.onclick = () => {
      addedPromoCodes = addedPromoCodes.filter(c => c !== code);
      li.remove();
    };
    li.appendChild(removeBtn);
    list.appendChild(li);

    input.value = "";
  }
}

function generateReview() {
  const name = document.getElementById("offerNameInput").value.trim();
  const summary = document.getElementById("reviewOfferSummary");
  const description = document.getElementById("promoDescriptionInput").value.trim();

  summary.innerHTML = `
    <p><strong>Offer Name:</strong> ${name}</p>
    <p><strong>Promo Codes:</strong> ${addedPromoCodes.join(", ")}</p>
    <p><strong>Description:</strong> ${description || "<em>No description provided</em>"}</p>
  `;
}


function saveFinalOffer() {
  const name = document.getElementById("offerNameInput").value.trim();
  const description = document.getElementById("promoDescriptionInput").value.trim();
  if (!name) return alert("Offer name is required.");

  const data = {
    name,
    title: name,
    promoCodes: addedPromoCodes,
    description
  };

  let offers = JSON.parse(localStorage.getItem("offerRepository") || "[]");
  if (!offers.includes(name)) {
    offers.push(name);
    localStorage.setItem("offerRepository", JSON.stringify(offers));
  }

  localStorage.setItem(`offerData_${name}`, JSON.stringify(data));

  document.getElementById("addOfferModal").style.display = "none";
  addedPromoCodes = [];
  goToStep(1);
  document.getElementById("promoCodeListStep").innerHTML = "";
  document.getElementById("offerNameInput").value = "";
  document.getElementById("promoDescriptionInput").value = "";
  alert("Offer saved successfully!");
}

