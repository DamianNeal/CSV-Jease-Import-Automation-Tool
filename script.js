// ========================
// HOME PAGE LOGIC (index.html)
// ========================

if (window.location.pathname.includes("index.html")) {
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
  const importBtn = document.getElementById("btnImportFile");
  const templateBtn = document.getElementById("btnUseTemplate");
  const returnBtn = document.getElementById("returnHome");

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
}


// ========================
// OFFER GATEWAY PAGE LOGIC (offer.html)
// ========================

if (window.location.pathname.includes("offerImport.html")) {
  const tableBody = document.querySelector("#excelTable tbody");
  const returnBtn = document.getElementById("returnHome");
  const excelInput = document.getElementById("excelFile");
  const importLabel = document.getElementById("importLabel");
  const clearTableBtn = document.getElementById("clearTableBtn");
  const createCSVBtn = document.getElementById("createCSV");
  const dropZone = document.getElementById("fileDropZone");

  // 🔐 Hide CSV and set defaults
  if (createCSVBtn) createCSVBtn.style.display = "none";
  let selectedLanguage = "EN";

  const languageSelect = document.getElementById("languageSelect");
  if (languageSelect) {
    languageSelect.addEventListener("change", (e) => {
      selectedLanguage = e.target.value;
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

  // 📥 Standard file import
  if (excelInput) {
    excelInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) handleExcelImport(file);
    });
  }

  // 📥 Drag-and-drop import
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

  // ✅ Shared Import Logic
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
        alert(
          "Incorrect file format.\nExpected headers:\n" +
          expectedHeaders.join(", ") +
          "\n\nDetected:\n" + headers.join(", ")
        );
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
}
