// ========================
// HOME PAGE LOGIC (index.html)
// ========================

if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
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
    const modal = document.getElementById("offerModal");
    const closeModal = document.getElementById("closeOfferModal");
    const offerList = document.getElementById("offerList");
    const offerSelector = document.getElementById("offerSelector");
    const selectedOfferName = document.getElementById("selectedOfferName");
    let promoCodes = [];
    let addedPromoCodes = [];

    // NEW CODE: Function to handle edit button clicks in the offer list
    function handleEditOffer(offerName) {
      // Load the offer data
      const offerData = JSON.parse(localStorage.getItem(`offerData_${offerName}`)) || {
        name: offerName,
        title: offerName,
        promoCodes: [],
        descriptions: {}
      };
      
      // Populate the edit modal
      document.getElementById("editOfferName").value = offerData.name;
      document.getElementById("editOfferTitle").value = offerData.title || offerData.name;
      
      // Clear previous promo codes
      const promoList = document.getElementById("editPromoCodeList");
      promoList.innerHTML = "";
      
      // Add section header
      const sectionHeader = document.createElement("h3");
      sectionHeader.textContent = "Promo Codes";
      promoList.appendChild(sectionHeader);
      
      // Add promo code input field and button
      const addPromoDiv = document.createElement("div");
      addPromoDiv.className = "promo-input-container";
      addPromoDiv.innerHTML = `
        <div class="promo-input-group">
          <input type="text" id="newPromoCodeInput" class="form-control" placeholder="Enter new promo code">
          <button id="addNewPromoBtn" class="add-btn">Add</button>
        </div>
      `;
      promoList.appendChild(addPromoDiv);
      
      // Add existing promo codes to the list
      if (offerData.promoCodes && offerData.promoCodes.length > 0) {
        offerData.promoCodes.forEach(code => {
          const promoCard = document.createElement("div");
          promoCard.className = "promo-card";
          
          const description = offerData.descriptions[code] || "";
          
          promoCard.innerHTML = `
            <div class="promo-code-header">
              <span class="promo-label">${code}</span>
              <div class="promo-buttons">
                <button class="edit-description-btn">Edit Description</button>
                <button class="remove-btn">Remove</button>
              </div>
            </div>
            <div class="promo-description">${description.substring(0, 50)}${description.length > 50 ? '...' : ''}</div>
          `;
          
          // Add a click event to edit description
          const editBtn = promoCard.querySelector(".edit-description-btn");
          editBtn.addEventListener("click", () => {
            document.getElementById("editPromoCode").value = code;
            document.getElementById("editPromoDescription").value = description;
            document.getElementById("editDescriptionModal").style.display = "flex";
          });
          
          // Add a click event to remove promo code
          const removeBtn = promoCard.querySelector(".remove-btn");
          removeBtn.addEventListener("click", () => {
            if (confirm(`Remove promo code ${code}?`)) {
              // Remove from the UI
              promoCard.remove();
              
              // Remove from the data
              const index = offerData.promoCodes.indexOf(code);
              if (index !== -1) {
                offerData.promoCodes.splice(index, 1);
                delete offerData.descriptions[code];
                
                // Save the updated data
                localStorage.setItem(`offerData_${offerName}`, JSON.stringify(offerData));
                showToast(`Promo code ${code} removed`);
              }
            }
          });
          
          promoList.appendChild(promoCard);
        });
      }
      
      // Add event listener for the add new promo button
      setTimeout(() => {
        const addNewPromoBtn = document.getElementById("addNewPromoBtn");
        const newPromoCodeInput = document.getElementById("newPromoCodeInput");
        
        if (addNewPromoBtn && newPromoCodeInput) {
          addNewPromoBtn.addEventListener("click", () => {
            const newCode = newPromoCodeInput.value.trim();
            
            if (!newCode) {
              alert("Please enter a promo code");
              return;
            }
            
            if (offerData.promoCodes.includes(newCode)) {
              alert("This promo code already exists");
              return;
            }
            
            // Add to data
            offerData.promoCodes.push(newCode);
            offerData.descriptions[newCode] = "";
            
            // Save the updated data
            localStorage.setItem(`offerData_${offerName}`, JSON.stringify(offerData));
            
            // Clear input
            newPromoCodeInput.value = "";
            
            // Refresh the promo list
            handleEditOffer(offerName);
            
            // Show success message
            showToast(`Promo code ${newCode} added`);
          });
        }
      }, 100);
      
      // If no promo codes, show message
      if (!offerData.promoCodes || offerData.promoCodes.length === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent = "No promo codes yet. Add one above.";
        promoList.appendChild(emptyMessage);
      }
      
      // Display the edit modal
      document.getElementById("editOfferModal").style.display = "flex";
      localStorage.setItem("currentEditingOffer", offerName);
    }
    
    // NEW CODE: Save edited offer
    const saveEditBtn = document.getElementById("saveEditBtn");
    if (saveEditBtn) {
      saveEditBtn.addEventListener("click", () => {
        const originalName = localStorage.getItem("currentEditingOffer");
        const newName = document.getElementById("editOfferName").value.trim();
        const newTitle = document.getElementById("editOfferTitle").value.trim();
        
        if (!newName) {
          alert("Offer name cannot be empty");
          return;
        }
        
        // Load existing data
        const offerData = JSON.parse(localStorage.getItem(`offerData_${originalName}`)) || {
          name: originalName,
          title: originalName,
          promoCodes: [],
          descriptions: {}
        };
        
        // Update with new values
        offerData.name = newName;
        offerData.title = newTitle;
        
        // If the name changed, update localStorage
        if (originalName !== newName) {
          // Save with new name
          localStorage.setItem(`offerData_${newName}`, JSON.stringify(offerData));
          
          // Update offer repository
          let offers = JSON.parse(localStorage.getItem("offerRepository") || "[]");
          const index = offers.indexOf(originalName);
          if (index !== -1) {
            offers[index] = newName;
            localStorage.setItem("offerRepository", JSON.stringify(offers));
          }
          
          // Remove old data
          localStorage.removeItem(`offerData_${originalName}`);
        } else {
          // Just save updates
          localStorage.setItem(`offerData_${newName}`, JSON.stringify(offerData));
        }
        
        // Close modal and refresh list
        document.getElementById("editOfferModal").style.display = "none";
        loadOffers();
        showToast("Offer updated successfully!");
      });
    }
    
    // NEW CODE: Save edited description
    const saveDescriptionBtn = document.getElementById("saveDescriptionBtn");
    if (saveDescriptionBtn) {
      saveDescriptionBtn.addEventListener("click", () => {
        const offerName = localStorage.getItem("currentEditingOffer");
        const promoCode = document.getElementById("editPromoCode").value;
        const description = document.getElementById("editPromoDescription").value;
        
        // Load offer data
        const offerData = JSON.parse(localStorage.getItem(`offerData_${offerName}`));
        if (offerData && promoCode) {
          // Update description
          offerData.descriptions[promoCode] = description;
          localStorage.setItem(`offerData_${offerName}`, JSON.stringify(offerData));
          
          // Close modal
          document.getElementById("editDescriptionModal").style.display = "none";
          
          // Refresh promo code list to show updated description
          handleEditOffer(offerName);
          
          showToast("Description updated!");
        }
      });
    }
    
    // NEW CODE: Close buttons for edit modals
    const closeEditOfferBtn = document.getElementById("closeEditOfferModal");
    if (closeEditOfferBtn) {
      closeEditOfferBtn.addEventListener("click", () => {
        document.getElementById("editOfferModal").style.display = "none";
      });
    }
    
    const closeDescriptionModal = document.getElementById("closeDescriptionModal");
    if (closeDescriptionModal) {
      closeDescriptionModal.addEventListener("click", () => {
        document.getElementById("editDescriptionModal").style.display = "none";
      });
    }

    // Close modal event handlers
    const closeAddOfferModal = document.getElementById("closeAddOfferModal");
    if (closeAddOfferModal) {
      closeAddOfferModal.addEventListener("click", () => {
        document.getElementById("addOfferModal").style.display = "none";
      });
    }

    const closeTemplateModal = document.getElementById("closeTemplateModal");
    if (closeTemplateModal) {
      closeTemplateModal.addEventListener("click", () => {
        document.getElementById("templateModal").style.display = "none";
      });
    }

    // Step 1 event handlers
    const step1NextBtn = document.getElementById("step1NextBtn");
    if (step1NextBtn) {
      step1NextBtn.addEventListener("click", () => {
        const name = document.getElementById("offerNameInput").value.trim();
        if (!name) {
          alert("Please enter a name for the offer.");
          return;
        }
        
        let offers = JSON.parse(localStorage.getItem("offerRepository") || "[]");
        if (offers.includes(name)) {
          alert("Offer already exists.");
          return;
        }
        
        // Store the current name for later — don't save the offer yet
        localStorage.setItem("currentOffer", name);
        goToStep(2);
      });
    }

    // Step 2 event handlers
    const step2BackBtn = document.getElementById("step2BackBtn");
    if (step2BackBtn) {
      step2BackBtn.addEventListener("click", () => {
        goToStep(1);
      });
    }

    const addPromoBtn = document.getElementById("addPromoBtn");
    if (addPromoBtn) {
      addPromoBtn.addEventListener("click", () => {
        addPromoCodeStep();
      });
    }

    const promoCodeNextBtn = document.getElementById("promoCodeNextBtn");
    if (promoCodeNextBtn) {
      promoCodeNextBtn.addEventListener("click", () => {
        handlePromoCodeProceed();
      });
    }

    // Step 3 event handlers
    const markChangeableBtn = document.getElementById("markChangeableBtn");
    if (markChangeableBtn) {
      markChangeableBtn.addEventListener("click", () => {
        wrapSelectedWithBraces();
      });
    }

    const cancelOfferBtn = document.getElementById("cancelOfferBtn");
    if (cancelOfferBtn) {
      cancelOfferBtn.addEventListener("click", () => {
        document.getElementById("addOfferModal").style.display = "none";
      });
    }

    const saveAndNextBtn = document.getElementById("saveAndNextBtn");
    if (saveAndNextBtn) {
      saveAndNextBtn.addEventListener("click", () => {
        saveFinalOffer();
      });
    }

    const saveFinalButton = document.getElementById("saveFinalButton");
    if (saveFinalButton) {
      saveFinalButton.addEventListener("click", () => {
        finalizeOffer();
      });
    }

    // Step 4 event handlers
    const cancelReviewBtn = document.getElementById("cancelReviewBtn");
    if (cancelReviewBtn) {
      cancelReviewBtn.addEventListener("click", () => {
        document.getElementById("addOfferModal").style.display = "none";
      });
    }

    const finalSaveBtn = document.getElementById("finalSaveBtn");
    if (finalSaveBtn) {
      finalSaveBtn.addEventListener("click", () => {
        saveFinalOffer();
      });
    }

    if (openAddOfferModal) {
      openAddOfferModal.addEventListener("click", () => {
        document.getElementById("offerNameInput").value = "";
        document.getElementById("promoDescriptionInput").value = "";
        document.getElementById("promoCodeListStep").innerHTML = "";
        document.getElementById("promoCodeNextBtn").disabled = true;
        addedPromoCodes = [];

        localStorage.removeItem("currentOffer");
        document.getElementById("addOfferModal").style.display = "flex";
        goToStep(1);
      });
    }

    // Load offers when the page loads
    loadOffers();

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
        if (!modal) {
          console.error("❌ Modal with ID 'offerModal' not found.");
          return;
        }
        modal.style.display = "flex";
        loadOffers();
      });
    }

    if (closeModal) {
      closeModal.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    function loadOffers() {
      const offers = JSON.parse(localStorage.getItem("offerRepository") || "[]");

      // Clear existing options except the default one
      offerSelector.innerHTML = `<option disabled selected>SELECT EXISTING OFFER</option>`;
      
      // Clear the offer list
      if (offerList) {
        offerList.innerHTML = "";
      }

      offers.forEach((offer) => {
        const option = document.createElement("option");
        option.textContent = offer;
        option.value = offer;
        offerSelector.appendChild(option);

        if (offerList) {
          const li = document.createElement("li");
          const offerText = document.createElement("span");
          offerText.textContent = offer;
          offerText.classList.add("offer-name");

          const editBtn = document.createElement("button");
          editBtn.textContent = "Edit";
          editBtn.classList.add("csv-btn", "edit");
          
          // MODIFIED: Change to use our new edit handler instead of the template modal
          editBtn.addEventListener("click", () => handleEditOffer(offer));

          const removeBtn = document.createElement("button");
          removeBtn.textContent = "Remove";
          removeBtn.classList.add("csv-btn", "danger");
          removeBtn.onclick = () => showConfirmDeleteModal(offer);

          const buttonGroup = document.createElement("div");
          buttonGroup.classList.add("button-group-inline");
          buttonGroup.appendChild(editBtn);
          buttonGroup.appendChild(removeBtn);

          li.appendChild(offerText);
          li.appendChild(buttonGroup);
          offerList.appendChild(li);
        }
      });
    }

    function showConfirmDeleteModal(offerName) {
      const modal = document.getElementById("confirmDeleteModal");
      const text = document.getElementById("deleteOfferText");
      const confirmBtn = document.getElementById("confirmDeleteBtn");
      const cancelBtn = document.getElementById("cancelDeleteBtn");
      const closeIcon = document.getElementById("closeConfirmModal");

      text.innerHTML = `Are you sure you want to delete <strong>${offerName}</strong>?<br>This action cannot be undone.`;
      modal.style.display = "flex";

      confirmBtn.replaceWith(confirmBtn.cloneNode(true));
      cancelBtn.replaceWith(cancelBtn.cloneNode(true));
      closeIcon.replaceWith(closeIcon.cloneNode(true));

      document.getElementById("confirmDeleteBtn").onclick = () => {
        const offers = JSON.parse(localStorage.getItem("offerRepository") || "[]");
        const filtered = offers.filter(o => o !== offerName);
        localStorage.setItem("offerRepository", JSON.stringify(filtered));
        localStorage.removeItem(`offerData_${offerName}`);
        modal.style.display = "none";
        loadOffers();
      };

      document.getElementById("cancelDeleteBtn").onclick = () => {
        modal.style.display = "none";
      };

      document.getElementById("closeConfirmModal").onclick = () => {
        modal.style.display = "none";
      };
    }

    // Make loadOffers accessible globally for the page
    window.loadOffers = loadOffers;
  });
}

// Function to wrap selected text with braces
function wrapSelectedWithBraces(textareaId) {
  const textarea = document.getElementById(textareaId || "promoDescriptionInput");
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

// Make the function available globally
window.wrapSelectedWithBraces = wrapSelectedWithBraces;

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

    // NEW CODE: Check if table already has data and show buttons accordingly
    function checkTableHasData() {
      if (!tableBody) return false;
      
      const rows = tableBody.querySelectorAll("tr");
      for (const row of rows) {
        const cells = row.querySelectorAll("td");
        for (const cell of cells) {
          if (cell.textContent.trim() !== "") {
            return true; // Found non-empty cell
          }
        }
      }
      return false;
    }
    
    // NEW CODE: Show CREATE CSV button if table has data
    if (checkTableHasData()) {
      if (createCSVBtn) createCSVBtn.style.display = "inline-block";
      if (clearTableBtn) clearTableBtn.style.display = "inline-block";
      if (importLabel) importLabel.style.display = "none";
      if (dropZone) dropZone.style.display = "none";
      
      // Add visual indicator
      document.body.classList.add("has-table-data");
    }
    
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
      // Remove this line to prevent hiding the button if it's already visible
      // createCSVBtn.style.display = "none";
      
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
          offer: currentOffer,
          language: selectedLanguage
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
          
          // NEW CODE: Update body class
          document.body.classList.remove("has-table-data");
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

        // Check if headers match (case insensitive)
        const headersMatch = expectedHeaders.every((h, i) => 
          headers[i] && headers[i].toLowerCase() === h.toLowerCase()
        );

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
        
        // NEW CODE: Add body class indicator
        document.body.classList.add("has-table-data");
        
        // NEW CODE: Extra check to ensure button is visible
        setTimeout(() => {
          if (createCSVBtn) createCSVBtn.style.display = "inline-block";
        }, 100);
      };

      reader.readAsArrayBuffer(file);
    }
    
    // NEW CODE: Add direct watch for table changes to show/hide buttons
    if (tableBody) {
      // Watch for changes to table content
      const observer = new MutationObserver(function(mutations) {
        const hasData = checkTableHasData();
        if (hasData && createCSVBtn) {
          createCSVBtn.style.display = "inline-block";
          document.body.classList.add("has-table-data");
        }
      });
      
      observer.observe(tableBody, { 
        childList: true, 
        subtree: true, 
        characterData: true 
      });
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

// ========================
// GLOBAL FUNCTIONS 
// ========================

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
  // Extract just the language code from the key
  const match = key.match(/^csv_(.+?)_(\w{2})$/);
  const langCode = match ? match[2] : "EN"; // Default to EN if no match
  link.download = `${langCode}.csv`;
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
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function wrapSelectedWithBraces(textareaId) {
  const textarea = document.getElementById(textareaId || "promoDescriptionInput");
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

// ========================
// MULTI-STEP ADD OFFER MODAL LOGIC
// ========================

// Global variables
let addedPromoCodes = [];
let currentStep = 1;

// Step navigation
function goToStep(stepNumber) {
  // Hide all steps
  document.querySelectorAll(".add-offer-step").forEach(step => {
    step.classList.remove("active");
  });

  // Show selected step
  const step = document.getElementById(`step${stepNumber}`);
  if (step) {
    step.classList.add("active");
    currentStep = stepNumber;

    // Update UI based on step
    if (stepNumber === 3) {
      const name = document.getElementById("offerNameInput").value.trim();
      const offerData = JSON.parse(localStorage.getItem(`offerData_${name}`)) || {};
      const filledDescriptions = offerData.descriptions || {};
      const filledCount = Object.keys(filledDescriptions).length;
      const totalPromos = addedPromoCodes.length;

      const saveAndNextBtn = document.getElementById("saveAndNextBtn");
      const saveFinalButton = document.getElementById("saveFinalButton");

      // If only one promo or all others are already filled, just show final Save button
      if (totalPromos === 1 || filledCount === totalPromos - 1) {
        if (saveAndNextBtn) saveAndNextBtn.style.display = "none";
        if (saveFinalButton) saveFinalButton.style.display = "inline-block";
      } else {
        if (saveAndNextBtn) saveAndNextBtn.style.display = "inline-block";
        if (saveFinalButton) saveFinalButton.style.display = "none";
      }
    }

    // Generate review on step 4
    if (stepNumber === 4) {
      generateReview();
    }
  }

  // Update step indicator
  const indicators = document.querySelectorAll(".step-indicator .step");
  indicators.forEach((el, idx) => {
    el.classList.toggle("active", idx === stepNumber - 1);
  });
}

// Handle promo code selection and proceeding to next step
function handlePromoCodeProceed() {
  // Get selected promo code from the list
  const selectedElement = document.querySelector(".promo-code-item.selected");
  if (!selectedElement) {
    alert("Please select a promo code before continuing.");
    return;
  }

  const selectedCode = selectedElement.textContent.replace("✕", "").trim();
  if (!selectedCode) {
    alert("Please select a promo code before continuing.");
    return;
  }

  // Store the selected promo code
  localStorage.setItem("currentPromoCode", selectedCode);
  
  // Update UI for single promo code case
  if (addedPromoCodes.length === 1) {
    const saveAndNextBtn = document.getElementById("saveAndNextBtn");
    const saveFinalButton = document.getElementById("saveFinalButton");
    
    if (saveAndNextBtn) saveAndNextBtn.style.display = "none";
    if (saveFinalButton) saveFinalButton.style.display = "inline-block";
  }

  // Proceed to step 3
  goToStep(3);
}

// Mark selected text as changeable by wrapping with braces
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

// Add promo code in the multi-step flow
function addPromoCodeStep() {
  const input = document.getElementById("promoCodeInputStep");
  const list = document.getElementById("promoCodeListStep");
  const nextBtn = document.getElementById("promoCodeNextBtn");
  
  if (!input || !list) return;
  
  const code = input.value.trim();

  if (!code || addedPromoCodes.includes(code)) {
    if (!code) alert("Please enter a promo code");
    if (addedPromoCodes.includes(code)) alert("This promo code is already added");
    return;
  }

  addedPromoCodes.push(code);

  const li = document.createElement("li");
  li.textContent = code;
  li.classList.add("promo-code-item");
  li.dataset.code = code;

  li.addEventListener("click", () => {
    // Deselect all first
    document.querySelectorAll(".promo-code-item").forEach(item => {
      item.classList.remove("selected");
    });

    // Select this one
    li.classList.add("selected");

    // Enable Next button
    if (nextBtn) nextBtn.disabled = false;

    // Store selected code
    localStorage.setItem("currentPromoCode", code);
  });

  // Add remove button
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "✕";
  removeBtn.onclick = (e) => {
    e.stopPropagation();
    const idx = addedPromoCodes.indexOf(code);
    if (idx !== -1) addedPromoCodes.splice(idx, 1);
    li.remove();

    // If it was selected, reset state
    if (li.classList.contains("selected")) {
      localStorage.removeItem("currentPromoCode");
      if (nextBtn) nextBtn.disabled = true;
    }
  };
  
  li.appendChild(removeBtn);
  list.appendChild(li);

  input.value = "";

  // Auto-select if it's the only one
  if (addedPromoCodes.length === 1) {
    li.click(); // This triggers the click event to select it
  }
}

// Generate review summary
function generateReview() {
  const name = document.getElementById("offerNameInput").value.trim();
  const summary = document.getElementById("reviewOfferSummary");
  if (!summary) return;
  
  // Get offer data with all promo codes and descriptions
  const offerData = JSON.parse(localStorage.getItem(`offerData_${name}`)) || {};
  const descriptions = offerData.descriptions || {};
  
  let descriptionsList = '';
  Object.entries(descriptions).forEach(([promoCode, description]) => {
    descriptionsList += `<p><strong>${promoCode}:</strong> ${description || "<em>No description</em>"}</p>`;
  });

  summary.innerHTML = `
    <p><strong>Offer Name:</strong> ${name}</p>
    <p><strong>Promo Codes:</strong> ${addedPromoCodes.join(", ")}</p>
    <h3>Descriptions:</h3>
    ${descriptionsList || "<p><em>No descriptions provided</em></p>"}
  `;
}

// Save the current promo code description and handle next steps
function saveFinalOffer() {
  const name = document.getElementById("offerNameInput").value.trim();
  const description = document.getElementById("promoDescriptionInput").value.trim();
  const currentPromoCode = localStorage.getItem("currentPromoCode");

  if (!name) return alert("Offer name is required.");
  if (!currentPromoCode) return alert("No promo code selected.");

  // Get or initialize offer data
  let offerData = JSON.parse(localStorage.getItem(`offerData_${name}`)) || {
    name,
    title: name,
    promoCodes: [],
    descriptions: {}
  };

  // Make sure promoCodes array is up to date
  offerData.promoCodes = addedPromoCodes;
  
  // Save this promo code's description
  offerData.descriptions[currentPromoCode] = description;
  localStorage.setItem(`offerData_${name}`, JSON.stringify(offerData));
  
  // Update offerRepository list
  let offers = JSON.parse(localStorage.getItem("offerRepository") || "[]");
  if (!offers.includes(name)) {
    offers.push(name);
    localStorage.setItem("offerRepository", JSON.stringify(offers));
  }

  // Remove current promoCode from localStorage as we're done with it
  localStorage.removeItem("currentPromoCode");
  
  // Set this as the current offer
  localStorage.setItem("currentOffer", name);

  // Find the next promo code that has not been filled yet
  const remaining = addedPromoCodes.find(code => !offerData.descriptions[code]);

  if (remaining) {
    localStorage.setItem("currentPromoCode", remaining);
    goToStep(2); // Go back to Step 2
    highlightPromoCodeInStep2(remaining);
    document.getElementById("promoDescriptionInput").value = "";
    
    // Update button visibility
    const saveAndNextBtn = document.getElementById("saveAndNextBtn");
    const saveFinalButton = document.getElementById("saveFinalButton");
    
    // Calculate how many promo codes are left to fill
    const remainingCount = addedPromoCodes.filter(code => !offerData.descriptions[code]).length;
    
    // If this is the last one to fill, show the final save button
    if (remainingCount <= 1) {
      if (saveAndNextBtn) saveAndNextBtn.style.display = "none";
      if (saveFinalButton) saveFinalButton.style.display = "inline-block";
    } else {
      if (saveAndNextBtn) saveAndNextBtn.style.display = "inline-block";
      if (saveFinalButton) saveFinalButton.style.display = "none";
    }
    
    return; // Don't continue to review step
  }
  
  // If all promo codes are filled, go to final summary step
  generateReview();
  goToStep(4);
  
  // Hide the add offer modal and show the manage offers modal after saving
  setTimeout(() => {
    document.getElementById("addOfferModal").style.display = "none";
    const offerModal = document.getElementById("offerModal");
    if (offerModal) offerModal.style.display = "flex";
    if (window.loadOffers) window.loadOffers(); // Reload offers list if function exists
  }, 100);
}

// Helper function to highlight a promo code in step 2
function highlightPromoCodeInStep2(code) {
  document.querySelectorAll(".promo-code-item").forEach(item => {
    const itemCode = item.textContent.replace("✕", "").trim();
    item.classList.toggle("selected", itemCode === code);
  });

  const nextBtn = document.getElementById("promoCodeNextBtn");
  if (nextBtn) nextBtn.disabled = !code;
}

// Final save of the complete offer
function finalizeOffer() {
  const name = document.getElementById("offerNameInput").value.trim();
  
  if (!name) {
    alert("Offer name is required.");
    return;
  }

  // Get the current offer data
  let offerData = JSON.parse(localStorage.getItem(`offerData_${name}`)) || {
    name,
    title: name,
    promoCodes: addedPromoCodes,
    descriptions: {}
  };
  
  // Make sure all promo codes are in the promoCodes array
  offerData.promoCodes = [...new Set([...offerData.promoCodes, ...addedPromoCodes])]; 

  // Save to localStorage
  localStorage.setItem(`offerData_${name}`, JSON.stringify(offerData));
  
  // Add to offer repository if not already there
  let offers = JSON.parse(localStorage.getItem("offerRepository") || "[]");
  if (!offers.includes(name)) {
    offers.push(name);
    localStorage.setItem("offerRepository", JSON.stringify(offers));
  }
  
  // Set as current offer
  localStorage.setItem("currentOffer", name);

  // Reset modal and inputs
  document.getElementById("addOfferModal").style.display = "none";
  document.getElementById("promoCodeListStep").innerHTML = "";
  document.getElementById("offerNameInput").value = "";
  document.getElementById("promoDescriptionInput").value = "";
  addedPromoCodes = [];
  goToStep(1);

  // Show success message
  showToast("Full offer saved successfully!");
  
  // Show manage offers modal and refresh list
  setTimeout(() => {
    const offerModal = document.getElementById("offerModal");
    if (offerModal) offerModal.style.display = "flex";
    if (window.loadOffers) window.loadOffers();
  }, 100);
}