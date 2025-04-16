// ========================
// HOME PAGE LOGIC (index.html)
// ========================
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
// IMPORT PAGE LOGIC (offerImport.html)
// ========================
if (window.location.pathname.includes("offerImport.html")) {
  const tableBody = document.querySelector("#excelTable tbody");
  const returnBtn = document.getElementById("returnHome");
  const excelInput = document.getElementById("excelFile");

  let selectedLanguage = "EN";
  const languageSelect = document.getElementById("languageSelect");
  if (languageSelect) {
    languageSelect.addEventListener("change", (e) => {
      selectedLanguage = e.target.value;
      console.log("Selected Language:", selectedLanguage);
    });
  }

  if (returnBtn) {
    returnBtn.addEventListener("click", () => {
      window.location.href = "offer.html";
    });
  }

  if (excelInput) {
    excelInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const expectedHeaders = ["PKG_CODES", "Promo Code", "Name", "Title", "Description"];
        const headers = jsonData[0] ? jsonData[0].map(h => h?.toString().trim().toLowerCase()) : [];

        const headersMatch = expectedHeaders.every((h, i) => {
          return headers[i] === h.toLowerCase();
        });

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
      };

      reader.readAsArrayBuffer(file);
    });
  }
}
