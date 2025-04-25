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
    let promoCodes = {};
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

    // Close config modal
    const closeConfigModal = document.getElementById("closeConfigModal");
    if (closeConfigModal) {
      closeConfigModal.addEventListener("click", () => {
        const configModal = document.getElementById("promoConfigModal");
        configModal.style.opacity = "0";
        configModal.style.transition = "opacity 0.3s ease";
        
        setTimeout(() => {
          configModal.style.display = "none";
        }, 300);
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

    // Function to add promo code with status indicators
    function addPromoCodeStep() {
      const promoCodeInput = document.getElementById("promoCodeInputStep");
      const promoCode = promoCodeInput.value.trim();
      const promoCodeList = document.getElementById("promoCodeListStep");
      
      if (!promoCode) {
        alert("Please enter a promo code");
        return;
      }
      
      if (addedPromoCodes.includes(promoCode)) {
        alert("This promo code is already added");
        return;
      }
      
      // Add to the list of promo codes
      addedPromoCodes.push(promoCode);
      
      // Update promo code counter
      updatePromoCounter();
      
      // Create a new promo code element with status indicator
      const promoCodeElement = document.createElement("div");
      promoCodeElement.className = "promo-code-item";
      
      // Add the promo code with edit button and status indicator
      promoCodeElement.innerHTML = `
        <div class="promo-code-container">
          <span class="promo-code-text">${promoCode}</span>
          <div class="promo-code-actions">
            <button class="edit-promo-btn" title="Configure this promo code">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <span class="status-indicator status-pending" title="Pending configuration">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span class="status-text">Pending</span>
            </span>
            <button class="remove-promo-btn" title="Remove this promo code">✕</button>
          </div>
        </div>
      `;
      
      // Add remove button functionality
      const removeBtn = promoCodeElement.querySelector(".remove-promo-btn");
      removeBtn.addEventListener("click", function(e) {
        e.stopPropagation(); // Prevent triggering the parent click event
        
        // Add simple fade out animation before removing
        promoCodeElement.style.opacity = "0";
        promoCodeElement.style.transform = "translateX(10px)";
        promoCodeElement.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        
        setTimeout(() => {
          promoCodeElement.remove();
          
          // Remove from the array
          const index = addedPromoCodes.indexOf(promoCode);
          if (index > -1) {
            addedPromoCodes.splice(index, 1);
          }
          
          // Remove from promoCodes object if it exists
          if (promoCodes[promoCode]) {
            delete promoCodes[promoCode];
          }
          
          // Update counter
          updatePromoCounter();
          
          // Check if we need to disable the next button
          checkPromoCodesConfigured();
        }, 300);
      });
      
      // Add edit button functionality
      const editBtn = promoCodeElement.querySelector(".edit-promo-btn");
      editBtn.addEventListener("click", function(e) {
        e.stopPropagation(); // Prevent triggering the parent click event
        
        // Highlight this element briefly
        promoCodeElement.classList.add("active");
        setTimeout(() => promoCodeElement.classList.remove("active"), 300);
        
        // Store current promo code for later use
        localStorage.setItem("currentPromoCode", promoCode);
        
        // Show configuration dialog/modal for this promo code
        openPromoConfigDialog(promoCode);
      });
      
      // Set initial opacity for fade-in effect
      promoCodeElement.style.opacity = "0";
      promoCodeElement.style.transform = "translateY(10px)";
      
      // Add the promo code to the list
      promoCodeList.appendChild(promoCodeElement);
      
      // Trigger animation after element is added to DOM
      setTimeout(() => {
        promoCodeElement.style.opacity = "1";
        promoCodeElement.style.transform = "translateY(0)";
        promoCodeElement.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      }, 10);
      
      // Clear the input
      promoCodeInput.value = "";
      
      // Auto-focus the input field for next entry
      promoCodeInput.focus();
      
      // Check if all codes are configured to enable/disable next button
      checkPromoCodesConfigured();
    }

    // Function to open the promo code configuration dialog
    function openPromoConfigDialog(promoCode) {
      // Get the description modal and update its title
      const configModal = document.getElementById("promoConfigModal");
      const modalTitle = configModal.querySelector(".config-modal-title");
      modalTitle.textContent = `Configure Promo Code: ${promoCode}`;
      
      // Set up the textarea with existing description if any
      const descriptionTextarea = document.getElementById("promoDescriptionInput");
      descriptionTextarea.value = promoCodes[promoCode] || "";
      
      // Store the current promo code being edited
      configModal.dataset.promoCode = promoCode;
      
      // Show the modal with fade-in effect
      configModal.style.display = "flex";
      configModal.style.opacity = "0";
      setTimeout(() => {
        configModal.style.opacity = "1";
        configModal.style.transition = "opacity 0.3s ease";
      }, 10);
      
      // Focus the textarea
      setTimeout(() => descriptionTextarea.focus(), 300);
    }

    // Function to update promo code status
    function updatePromoCodeStatus(promoCode, status) {
      const promoCodeItems = document.querySelectorAll(".promo-code-item");
      
      for (const item of promoCodeItems) {
        const codeText = item.querySelector(".promo-code-text").textContent;
        
        if (codeText === promoCode) {
          const statusIndicator = item.querySelector(".status-indicator");
          const statusText = item.querySelector(".status-text");
          
          // Remove all status classes
          statusIndicator.classList.remove("status-pending", "status-configured");
          
          // Add the appropriate status class
          if (status === "configured") {
            statusIndicator.classList.add("status-configured");
            statusText.textContent = "Configured";
            // Replace the clock icon with checkmark
            statusIndicator.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span class="status-text">Configured</span>
            `;
            
            // Add a brief highlight animation
            statusIndicator.style.transform = "scale(1.1)";
            setTimeout(() => {
              statusIndicator.style.transform = "scale(1)";
              statusIndicator.style.transition = "transform 0.3s ease";
            }, 300);
          } else {
            statusIndicator.classList.add("status-pending");
            statusText.textContent = "Pending";
          }
          
          break;
        }
      }
      
      // Check if all promo codes are now configured
      checkPromoCodesConfigured();
    }

    // Function to check if all promo codes are configured and enable/disable next button
    function checkPromoCodesConfigured() {
      const promoCodeNextBtn = document.getElementById("promoCodeNextBtn");
      if (!promoCodeNextBtn) return;
      
      // If no promo codes added, disable the button
      if (addedPromoCodes.length === 0) {
        promoCodeNextBtn.disabled = true;
        return;
      }
      
      // Check if all promo codes are configured
      let allConfigured = true;
      const promoCodeItems = document.querySelectorAll(".promo-code-item");
      
      promoCodeItems.forEach(item => {
        const statusIndicator = item.querySelector(".status-indicator");
        if (!statusIndicator.classList.contains("status-configured")) {
          allConfigured = false;
        }
      });
      
      // Enable or disable the next button based on configuration status
      if (allConfigured !== !promoCodeNextBtn.disabled) {
        promoCodeNextBtn.disabled = !allConfigured;
        
        if (allConfigured) {
          // Add a pulse animation when enabled
          promoCodeNextBtn.classList.add("pulse-animation");
          setTimeout(() => promoCodeNextBtn.classList.remove("pulse-animation"), 1000);
          
          // Show a completion message
          showToast("All promo codes configured! You can proceed.");
        }
      }
    }

    // Function to save promo code configuration
    function savePromoConfiguration() {
      const configModal = document.getElementById("promoConfigModal");
      const promoCode = configModal.dataset.promoCode;
      const description = document.getElementById("promoDescriptionInput").value.trim();
      
      if (!description) {
        alert("Please enter a description for this promo code");
        return;
      }
      
      // Save the description
      promoCodes[promoCode] = description;
      
      // Update the status to configured
      updatePromoCodeStatus(promoCode, "configured");
      
      // Hide the modal with fade-out effect
      configModal.style.opacity = "0";
      configModal.style.transition = "opacity 0.3s ease";
      
      setTimeout(() => {
        configModal.style.display = "none";
      }, 300);
      
      // Show success message
      showToast(`Promo code ${promoCode} configured successfully`);
    }

    // Function to update the promo code counter
    function updatePromoCounter() {
      // Add the promo-section class to the container if it doesn't have it
      const container = document.querySelector(".inline-group");
      if (container && !container.classList.contains("promo-section")) {
        container.classList.add("promo-section");
      }
      
      const counterElement = document.getElementById("promoCounter");
      if (!counterElement) {
        // Create counter if it doesn't exist
        const promoSection = document.querySelector(".promo-section");
        if (promoSection) {
          const counter = document.createElement("div");
          counter.id = "promoCounter";
          counter.className = "promo-counter";
          counter.textContent = `${addedPromoCodes.length} codes added`;
          
          // Insert at the top of the section
          promoSection.insertBefore(counter, promoSection.firstChild);
        }
      } else {
        // Update existing counter
        counterElement.textContent = `${addedPromoCodes.length} codes added`;
      }
    }

    // Function to navigate between steps
    function goToStep(stepNumber) {
      // Hide all steps
      document.querySelectorAll(".add-offer-step").forEach(step => {
        step.classList.remove("active");
      });
      
      // Show the target step
      const targetStep = document.getElementById(`step${stepNumber}`);
      if (targetStep) {
        targetStep.classList.add("active");
      }
      
      // Update step indicators
      document.querySelectorAll(".step-indicator .step").forEach((indicator, index) => {
        // Reset all indicators
        indicator.classList.remove("active", "completed");
        
        // Mark previous steps as completed
        if (index + 1 < stepNumber) {
          indicator.classList.add("completed");
        }
        
        // Set the current step as active
        if (index + 1 === stepNumber) {
          indicator.classList.add("active");
        }
      });
      
      // Special handling for Step 3 (Review)
      if (stepNumber === 3) {
        prepareReviewStep();
      }
    }

    // Function to prepare the review step
    function prepareReviewStep() {
      const reviewSummary = document.getElementById("reviewOfferSummary");
      if (!reviewSummary) return;
      
      const offerName = localStorage.getItem("currentOffer");
      if (!offerName) return;
      
      // Create review content
      let reviewHTML = `
        <h3>Offer Name: ${offerName}</h3>
        <h3>Promo Codes:</h3>
        <ul class="review-promo-list">
      `;
      
      // Add each promo code and its description
      addedPromoCodes.forEach(code => {
        const description = promoCodes[code] || "No description";
        reviewHTML += `
          <li>
            <strong>${code}</strong>
            <p>${description}</p>
          </li>
        `;
      });
      
      reviewHTML += `</ul>`;
      reviewSummary.innerHTML = reviewHTML;
    }

    // Function to handle proceeding to the next step
    function handlePromoCodeProceed() {
      // Only proceed if all codes are configured
      const promoCodeItems = document.querySelectorAll(".promo-code-item");
      let allConfigured = true;
      let pendingCodes = [];
      
      promoCodeItems.forEach(item => {
        const codeText = item.querySelector(".promo-code-text").textContent;
        const statusIndicator = item.querySelector(".status-indicator");
        
        if (!statusIndicator.classList.contains("status-configured")) {
          allConfigured = false;
          pendingCodes.push(codeText);
        }
      });
      
      if (!allConfigured) {
        // Create a more user-friendly warning
        const warningHTML = `
          <div class="pending-codes-warning">
            <p>The following promo codes are not configured:</p>
            <ul style="margin-top: 8px; margin-bottom: 8px;">
              ${pendingCodes.map(code => `<li>${code}</li>`).join('')}
            </ul>
            <p>Please configure all promo codes before proceeding.</p>
          </div>
        `;
        
        // Show the warning
        const warningContainer = document.getElementById("pendingCodesWarning");
        if (warningContainer) {
          warningContainer.innerHTML = warningHTML;
          warningContainer.style.display = "block";
        } else {
          const newWarningContainer = document.createElement("div");
          newWarningContainer.id = "pendingCodesWarning";
          newWarningContainer.innerHTML = warningHTML;
          
          const buttonGroup = document.querySelector("#step2 .button-group");
          buttonGroup.parentNode.insertBefore(newWarningContainer, buttonGroup);
        }
        
        return;
      } else {
        // Hide warning if it exists
        const warningContainer = document.getElementById("pendingCodesWarning");
        if (warningContainer) {
          warningContainer.style.display = "none";
        }
      }
      
      // Store all configured promo codes and descriptions
      const offerName = localStorage.getItem("currentOffer");
      if (offerName) {
        const offerData = {
          name: offerName,
          title: offerName,
          promoCodes: addedPromoCodes,
          descriptions: promoCodes
        };
        
        // Save to localStorage
        localStorage.setItem(`offerData_${offerName}`, JSON.stringify(offerData));
      }
      
      // Proceed to step 3 (review)
      goToStep(3);
    }

    // Final save function (from the review step)
    function finalizeOffer() {
      const offerName = localStorage.getItem("currentOffer");
      if (!offerName) {
        alert("Offer name is missing. Please go back to step 1.");
        return;
      }
      
      // Get the offer data we've already stored
      const offerData = JSON.parse(localStorage.getItem(`offerData_${offerName}`));
      if (!offerData) {
        alert("Offer data is missing. Please try again.");
        return;
      }
      
      // Add the offer to the repository if not already there
      let offers = JSON.parse(localStorage.getItem("offerRepository") || "[]");
      if (!offers.includes(offerName)) {
        offers.push(offerName);
        localStorage.setItem("offerRepository", JSON.stringify(offers));
      }
      
      // Add a success animation to the button
      const saveBtn = document.getElementById("finalSaveBtn");
      if (saveBtn) {
        saveBtn.innerHTML = "Saved Successfully!";
        saveBtn.style.backgroundColor = "#28a745";
        saveBtn.disabled = true;
      }
      
      // Show success message
      showToast("Offer saved successfully!");
      
      // Close the modal after a delay
      setTimeout(() => {
        document.getElementById("addOfferModal").style.display = "none";
        loadOffers();
      }, 1500);
    }

    const promoCodeNextBtn = document.getElementById("promoCodeNextBtn");
    if (promoCodeNextBtn) {
      promoCodeNextBtn.addEventListener("click", () => {
        handlePromoCodeProceed();
      });
    }

    // Event listener for cancel button in step 3
    const step3BackBtn = document.getElementById("step3BackBtn");
    if (step3BackBtn) {
      step3BackBtn.addEventListener("click", () => {
        goToStep(2);
      });
    }

    // Event listener for save configuration button
    const saveConfigBtn = document.getElementById("saveConfigBtn");
    if (saveConfigBtn) {
      saveConfigBtn.addEventListener("click", savePromoConfiguration);
    }

    const cancelConfigBtn = document.getElementById("cancelConfigBtn");
    if (cancelConfigBtn) {
      cancelConfigBtn.addEventListener("click", function() {
        const configModal = document.getElementById("promoConfigModal");
        configModal.style.opacity = "0";
        configModal.style.transition = "opacity 0.3s ease";
        
        setTimeout(() => {
          configModal.style.display = "none";
        }, 300);
      });
    }

    const markChangeableBtn = document.getElementById("markChangeableBtn");
    if (markChangeableBtn) {
      markChangeableBtn.addEventListener("click", () => {
        wrapSelectedWithBraces("promoDescriptionInput");
      });
    }

    const finalSaveBtn = document.getElementById("finalSaveBtn");
    if (finalSaveBtn) {
      finalSaveBtn.addEventListener("click", finalizeOffer);
    }

    const cancelReviewBtn = document.getElementById("cancelReviewBtn");
    if (cancelReviewBtn) {
      cancelReviewBtn.addEventListener("click", () => {
        document.getElementById("addOfferModal").style.display = "none";
      });
    }

    if (openAddOfferModal) {
      openAddOfferModal.addEventListener("click", () => {
        document.getElementById("offerNameInput").value = "";
        document.getElementById("promoCodeListStep").innerHTML = "";
        document.getElementById("promoCodeNextBtn").disabled = true;
        addedPromoCodes = [];
        promoCodes = {};

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
        window.location.href = "offerTemplate.html";
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

    // Enhanced toast notification
    function showToast(message) {
      const toast = document.getElementById("toast");
      if (!toast) return;
      
      // Clear any existing timeout
      if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
      }
      
      // Update message and show toast
      toast.textContent = message;
      toast.classList.remove("hidden");
      toast.classList.add("show");
      
      // Auto-hide after 3 seconds
      window.toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.classList.add("hidden"), 300);
      }, 3000);
    }

    // Add keypress handler for promo code input field
    const promoCodeInput = document.getElementById("promoCodeInputStep");
    if (promoCodeInput) {
      promoCodeInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
          e.preventDefault();
          addPromoCodeStep();
        }
      });
    }

    // Add animation to step indicator when changing steps
    const stepBackButtons = document.querySelectorAll("#step2BackBtn, #step3BackBtn");
    stepBackButtons.forEach(btn => {
      btn.addEventListener("click", function() {
        const currentStep = parseInt(this.id.charAt(4));
        goToStep(currentStep - 1);
      });
    });

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

// Add custom animation class
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .pulse-animation {
    animation: pulse 0.5s ease-in-out 2;
  }
`;
document.head.appendChild(style);

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

window.wrapSelectedWithBraces = wrapSelectedWithBraces;

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
function wrapSelectedWithBraces(textareaId) {
  const textarea = document.getElementById(textareaId || "promoDescriptionInput");
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  // Only show alert if nothing is selected
  if (start === end) {
    alert("Please highlight a word to mark as editable.");
    return; // Return early to prevent further processing
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

// ========================
// OFFER TEMPLATE PAGE LOGIC (offerTemplate.html)
// ========================

if (window.location.pathname.includes("offerTemplate.html")) {
  // Wait for DOM to be fully loaded before initializing
  document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM loaded - initializing template page");
    
    // DOM elements
    const templateNameElement = document.getElementById("templateName");
    const promoCodeCountElement = document.getElementById("promoCodeCount");
    const fileDropZone = document.getElementById("templateFileDropZone");
    const fileInput = document.getElementById("templateFileInput");
    const previewSection = document.getElementById("previewSection");
    const previewTable = document.getElementById("previewTable");
    const generateCsvBtn = document.getElementById("generateCsvBtn");
    const returnToOffersBtn = document.getElementById("returnToOffers");
    
    // Create or get language selector
    const languageSelector = document.getElementById("languageSelector") || createLanguageSelector();
    
    // REMOVE OPTIONS SECTION - Find and remove any option elements
    removeOptionsSection();
    
    // Check if required elements exist
    if (!fileDropZone || !fileInput) {
      console.error("Critical elements missing: dropzone or file input not found");
    } else {
      console.log("Critical elements found");
    }
    
    // State variables
    let selectedOffer = null;
    let templateData = null;
    let processedData = null;
    let errors = [];
    let warnings = [];
    let selectedLanguage = "EN"; // Default language
    
    // Initialize the page
    initializeTemplatePage();
    initializeFileHandlers();
    
    // Function to remove options section
    function removeOptionsSection() {
      console.log("Removing options section");
      
      // Check for common option elements and containers
      const optionsToRemove = [
        document.getElementById("insertCurrentDate"),
        document.getElementById("addPrefixSuffix"),
        document.getElementById("prefixSuffixContainer"),
        document.querySelector(".options-container"),
        document.querySelector(".option-group")
      ];
      
      optionsToRemove.forEach(element => {
        if (element && element.parentNode) {
          console.log(`Removing element: ${element.id || element.className}`);
          element.parentNode.removeChild(element);
        }
      });
    }
    
    // Function to force show preview section
    function forceShowPreviewSection() {
      const previewSection = document.getElementById("previewSection");
      if (previewSection) {
        console.log("Forcing preview section to be visible");
        // Remove hidden class
        previewSection.classList.remove("hidden");
        // Force inline display style (takes precedence over CSS)
        previewSection.style.display = "block";
        return true;
      } else {
        console.error("Preview section element not found");
        return false;
      }
    }
    
    // Initialize all file handlers - FIXED VERSION
    function initializeFileHandlers() {
      console.log("Setting up file handlers - FIXED VERSION");
      
      // Set up file input handler - ultra simple
      if (fileInput) {
        // Simple direct handler
        fileInput.onchange = function() {
          console.log("File input change detected", this.files && this.files.length);
          if (this.files && this.files.length > 0) {
            const file = this.files[0];
            console.log(`File selected via input: ${file.name} (${file.size} bytes)`);
            handleFileUpload(file);
          }
        };
      }
      
      // Set up drop zone click handler - FIXED with direct click method
      if (fileDropZone && fileInput) {
        // Ultra-simple handler that JUST calls click()
        fileDropZone.onclick = function() {
          console.log("Drop zone clicked - DIRECT click method");
          // Direct click - simplest possible method
          fileInput.click();
        };
        
        // Drag and drop handlers
        fileDropZone.ondragover = function(e) {
          e.preventDefault();
          this.classList.add("dragover");
        };
        
        fileDropZone.ondragleave = function(e) {
          e.preventDefault();
          this.classList.remove("dragover");
        };
        
        fileDropZone.ondrop = function(e) {
          e.preventDefault();
          this.classList.remove("dragover");
          
          if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            console.log(`File dropped: ${file.name}`);
            handleFileUpload(file);
          }
        };
      }
      
      console.log("File handlers initialized successfully");
    }
    
    // Initialize language selector
    function createLanguageSelector() {
      console.log("Creating language selector");
      const container = document.createElement("div");
      container.className = "form-group";
      container.innerHTML = `
        <label for="languageSelector">Language:</label>
        <select id="languageSelector" class="form-control">
          <option value="EN">English (EN)</option>
          <option value="DE">German (DE)</option>
          <option value="FR">French (FR)</option>
          <option value="IT">Italian (IT)</option>
          <option value="ES">Spanish (ES)</option>
        </select>
      `;
      
      // Insert after template name
      const nameContainer = document.querySelector(".template-name-container");
      if (nameContainer && nameContainer.parentNode) {
        nameContainer.parentNode.insertBefore(container, nameContainer.nextSibling);
      } else {
        // Insert at top of content area
        const contentArea = document.querySelector(".content-area") || document.querySelector("main");
        if (contentArea) {
          contentArea.insertBefore(container, contentArea.firstChild);
        } else {
          // Last resort - append to body
          document.body.appendChild(container);
        }
      }
      
      return document.getElementById("languageSelector");
    }
    
    // Language selector handler
    if (languageSelector) {
      languageSelector.addEventListener("change", function(e) {
        selectedLanguage = e.target.value;
        console.log(`Language changed to: ${selectedLanguage}`);
      });
    }
    
    if (generateCsvBtn) {
      generateCsvBtn.addEventListener("click", generateAndDownloadCsv);
    }
    
    if (returnToOffersBtn) {
      returnToOffersBtn.addEventListener("click", function() {
        window.location.href = "offer.html";
      });
    }
    
    function initializeTemplatePage() {
      // Get the selected offer from localStorage
      const offerName = localStorage.getItem("currentOffer");
      
      if (!offerName) {
        showToast("No offer selected. Please select an offer first.", "error");
        setTimeout(() => {
          window.location.href = "offer.html";
        }, 2000);
        return;
      }
      
      // Load the offer data
      const offerData = JSON.parse(localStorage.getItem(`offerData_${offerName}`));
      
      if (!offerData) {
        showToast("Could not load offer data.", "error");
        setTimeout(() => {
          window.location.href = "offer.html";
        }, 2000);
        return;
      }
      
      selectedOffer = offerData;
      
      // Update UI with offer information
      if (templateNameElement) {
        templateNameElement.textContent = offerData.name;
      }
      
      // Count promo codes
      const promoCodeCount = offerData.promoCodes ? offerData.promoCodes.length : 0;
      if (promoCodeCountElement) {
        promoCodeCountElement.textContent = promoCodeCount;
      }
      
      // Prepare template data
      prepareTemplateData(offerData);
      
      // Debug - log template data
      console.log("Template data prepared:", templateData);
    }
    
    function prepareTemplateData(offerData) {
      // Create a structured format of the template for easy mapping
      templateData = [];
      
      if (offerData.promoCodes && offerData.promoCodes.length > 0) {
        offerData.promoCodes.forEach(code => {
          const description = offerData.descriptions[code] || "";
          const title = offerData.title || offerData.name || "";
          
          templateData.push({
            promo_code: code,
            description: description,
            title: title
          });
          
          // Debug
          console.log(`Added template for ${code}: Title="${title}", Description length=${description.length}`);
        });
      }
    }
    
    // IMPROVED FILE HANDLING FUNCTION
    function handleFileUpload(file) {
      if (!file) {
        console.error("No file provided");
        return;
      }
      
      console.log(`Processing file: ${file.name} (${file.type}, ${file.size} bytes)`);
      
      // Check file type
      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls') && !fileName.endsWith('.csv')) {
        showToast("Please upload an Excel or CSV file", "error");
        return;
      }
      
      // Get a fresh reference to DOM elements to avoid stale references
      const currentDropZone = document.getElementById("templateFileDropZone");
      const currentGenerateBtn = document.getElementById("generateCsvBtn");
      
      // Show loading state
      if (currentDropZone) {
        currentDropZone.classList.add("loading");
        currentDropZone.innerHTML = `<p>Processing ${fileName}...</p>`;
      }
      
      // Process the file
      processTemplateFile(file, templateData)
        .then(result => {
          console.log("✅ File processed successfully with", result.processedData.length, "rows");
          
          processedData = result.processedData;
          errors = result.errors;
          warnings = result.warnings;
          
          // Reset drop zone
          if (currentDropZone) {
            currentDropZone.classList.remove("loading");
            currentDropZone.innerHTML = `<p>File loaded: ${fileName}</p><p>Drop another file or click to browse</p>`;
          }
          
          // Display errors if any
          if (errors.length > 0) {
            const errorMessage = errors.length === 1 
              ? errors[0] 
              : `${errors.length} errors found. Please check your file.`;
            showToast(errorMessage, "error");
            
            // Show detailed errors if there are multiple
            if (errors.length > 1) {
              console.error("File processing errors:", errors);
            }
          }
          
          // CRITICAL: Force the preview section to be visible
          forceShowPreviewSection();
          
          // Generate preview with explicit debug output
          console.log("Calling generatePreview with data rows:", processedData.length);
          generatePreview(processedData);
          
          // Enable generate button if there are no critical errors
          if (currentGenerateBtn) {
            currentGenerateBtn.disabled = errors.length > 0 || processedData.length === 0;
          }
        })
        .catch(error => {
          console.error("Error processing file:", error);
          showToast(`Error: ${error.message}`, "error");
          
          // Reset drop zone
          if (currentDropZone) {
            currentDropZone.classList.remove("loading");
            currentDropZone.innerHTML = `<p>Error processing file. Please try again.</p><p>Drag & drop Excel file or click to browse</p>`;
          }
        });
    }
    
    function processTemplateFile(file, templateData) {
      return new Promise((resolve, reject) => {
        console.log(`Starting to process file: ${file.name} (${file.type})`);
        
        const reader = new FileReader();
        
        reader.onload = async function(e) {
          console.log("FileReader onload event triggered");
          try {
            // Process based on file type
            const fileData = e.target.result;
            console.log(`File data loaded, size: ${typeof fileData === 'string' ? fileData.length : 'binary data'}`);
            
            const fileName = file.name.toLowerCase();
            let rawData;
            
            if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
              // Process Excel file
              try {
                console.log("Processing Excel file...");
                
                // Ensure XLSX is available
                if (typeof XLSX === 'undefined') {
                  console.error("XLSX library not available");
                  throw new Error("Excel processing library not available. Please try a CSV file instead.");
                }
                
                const workbook = XLSX.read(fileData, {type: 'array'});
                console.log("Excel workbook read successfully");
                
                // Get first sheet
                const firstSheet = workbook.SheetNames[0];
                console.log(`Using first sheet: ${firstSheet}`);
                
                // Get the worksheet
                const worksheet = workbook.Sheets[firstSheet];
                
                // Convert to JSON with header rows
                rawData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
                console.log(`Converted ${rawData.length} rows from Excel`);
                
                // Debug - log first few rows
                if (rawData.length > 0) {
                  console.log("First row sample:", JSON.stringify(rawData[0]));
                }
                
                // Find header row - look for row with relevant column names
                let headerRowIndex = -1;
                for (let i = 0; i < Math.min(10, rawData.length); i++) {
                  const row = rawData[i];
                  if (!row || !Array.isArray(row)) continue;
                  
                  // Convert row to string and check for key terms
                  const rowStr = row.join(" ").toLowerCase();
                  if (rowStr.includes("pkg") || rowStr.includes("package") || 
                      rowStr.includes("promo") || rowStr.includes("promotion")) {
                    headerRowIndex = i;
                    break;
                  }
                }
                
                if (headerRowIndex === -1) {
                  // No header found, assume first row is header
                  headerRowIndex = 0;
                }
                
                console.log("Header row index:", headerRowIndex);
                
                // Extract header and data
                const headers = rawData[headerRowIndex];
                const dataRows = rawData.slice(headerRowIndex + 1);
                
                if (headers) {
                  console.log("Headers found:", headers);
                } else {
                  console.error("No headers found in Excel file");
                  throw new Error("No headers found in Excel file");
                }
                
                // Map column indices for PKG_Code and Promo Code
                let pkgColIndex = -1;
                let promoColIndex = -1;
                
                headers.forEach((header, index) => {
                  if (!header) return;
                  
                  const headerStr = String(header).toLowerCase();
                  if (headerStr.includes("pkg") || headerStr.includes("package")) {
                    pkgColIndex = index;
                  }
                  if (headerStr.includes("promo") || headerStr.includes("promotion")) {
                    promoColIndex = index;
                  }
                });
                
                console.log("PKG column index:", pkgColIndex, "Promo column index:", promoColIndex);
                
                if (pkgColIndex === -1) {
                  console.warn("No PKG column found, attempting to use first column");
                  pkgColIndex = 0;
                }
                
                if (promoColIndex === -1) {
                  console.warn("No Promo column found, attempting to use second column");
                  promoColIndex = 1;
                }
                
                // Convert rows to objects with proper keys
                rawData = dataRows
                  .filter(row => row && Array.isArray(row) && row.length > 0)
                  .map(row => {
                    // Ensure we don't exceed array bounds
                    const pkg = pkgColIndex < row.length ? row[pkgColIndex] : null;
                    const promo = promoColIndex < row.length ? row[promoColIndex] : null;
                    
                    return {
                      pkg_code: pkg,
                      promo_code: promo
                    };
                  })
                  .filter(row => row.pkg_code != null || row.promo_code != null);
                
                console.log(`Processed ${rawData.length} valid data rows from Excel`);
              } catch (error) {
                console.error("Excel processing error:", error);
                throw new Error("Could not parse Excel file: " + error.message);
              }
            } else if (fileName.endsWith('.csv')) {
              // Process CSV file with more flexible parsing
              try {
                console.log("Processing CSV file...");
                
                // Ensure Papa Parse is available
                if (typeof Papa === 'undefined') {
                  console.error("Papa Parse library not available");
                  throw new Error("CSV processing library not available");
                }
                
                // First, read raw text to examine headers
                const csvText = fileData;
                console.log(`CSV text loaded, length: ${csvText.length}`);
                
                const lines = csvText.split(/\r\n|\n|\r/);
                console.log(`CSV contains ${lines.length} lines`);
                
                if (lines.length < 2) {
                  throw new Error("CSV file must contain at least a header row and one data row");
                }
                
                // Debug - log the first line
                if (lines.length > 0) {
                  console.log("First line sample:", lines[0]);
                }
                
                // Parse CSV with flexible header detection
                const result = Papa.parse(csvText, {
                  header: true,
                  skipEmptyLines: true,
                  dynamicTyping: true,
                  transformHeader: function(header) {
                    // Standardize headers for consistent access
                    if (!header) return "column_" + Math.random().toString(36).substring(2, 8);
                    
                    const h = String(header).toLowerCase();
                    if (h.includes("pkg") || h.includes("package")) {
                      return "pkg_code";
                    }
                    if (h.includes("promo") || h.includes("promotion")) {
                      return "promo_code";
                    }
                    return header;
                  }
                });
                
                if (result.errors && result.errors.length > 0) {
                  console.error("CSV parsing errors:", result.errors);
                  // Don't reject for minor errors - just log them
                  console.warn(`CSV had ${result.errors.length} parsing warnings`);
                }
                
                rawData = result.data;
                console.log(`Parsed ${rawData.length} rows from CSV`);
                
                // If we don't have pkg_code and promo_code fields, try to identify them
                const firstRow = rawData[0];
                if (firstRow && (!firstRow.hasOwnProperty('pkg_code') || !firstRow.hasOwnProperty('promo_code'))) {
                  console.log("Missing standard field names, attempting to identify columns...");
                  
                  // Get all column names
                  const columns = Object.keys(firstRow);
                  console.log("Available columns:", columns);
                  
                  // Try to map columns to pkg_code and promo_code
                  let pkgColumn = null;
                  let promoColumn = null;
                  
                  // First look for pkg or package in column names
                  columns.forEach(column => {
                    const colLower = column.toLowerCase();
                    if (colLower.includes('pkg') || colLower.includes('package')) {
                      pkgColumn = column;
                    }
                    if (colLower.includes('promo') || colLower.includes('code')) {
                      promoColumn = column;
                    }
                  });
                  
                  // If we didn't find them, try using the first two columns
                  if (!pkgColumn && columns.length > 0) {
                    pkgColumn = columns[0];
                  }
                  
                  if (!promoColumn && columns.length > 1) {
                    promoColumn = columns[1];
                  }
                  
                  console.log(`Using columns: pkg=${pkgColumn}, promo=${promoColumn}`);
                  
                  // Now map the data to our standard format
                  if (pkgColumn || promoColumn) {
                    rawData = rawData.map(row => ({
                      pkg_code: pkgColumn ? row[pkgColumn] : null,
                      promo_code: promoColumn ? row[promoColumn] : null
                    }));
                  }
                }
              } catch (error) {
                console.error("CSV processing error:", error);
                throw new Error("Could not parse CSV file: " + error.message);
              }
            } else {
              throw new Error("Unsupported file type. Please upload .xlsx, .xls, or .csv files.");
            }
            
            // Validate data exists
            if (!rawData || rawData.length === 0) {
              throw new Error("The file contains no data rows.");
            }
            
            console.log(`Successfully extracted ${rawData.length} records from file`);
            
            // Show sample of data extracted
            console.log("Sample data:", rawData.slice(0, 3));
            
            // Process and map data
            const processedData = [];
            const errors = [];
            const warnings = [];
            
            // Process each row
            rawData.forEach((row, index) => {
              try {
                // Skip empty rows
                if (!row) return;
                
                // Extract PKG_Code and Promo Code with maximum flexibility
                let pkgCode = null;
                let promoCode = null;
                
                // Try to find values regardless of key names
                Object.keys(row).forEach(key => {
                  const keyLower = String(key).toLowerCase();
                  const value = row[key];
                  
                  if (value) {
                    if (keyLower.includes("pkg") || keyLower.includes("package")) {
                      pkgCode = value;
                    }
                    if (keyLower.includes("promo") || keyLower.includes("promotion")) {
                      promoCode = value;
                    }
                  }
                });
                
                // If keys weren't found by name, try using standard keys from transformation
                if (!pkgCode && row.pkg_code !== undefined) pkgCode = row.pkg_code;
                if (!promoCode && row.promo_code !== undefined) promoCode = row.promo_code;
                
                // Validate row data
                if (!pkgCode) {
                  errors.push(`Row ${index + 2}: Missing PKG_Code`);
                  return;
                }
                if (!promoCode) {
                  errors.push(`Row ${index + 2}: Missing Promo Code`);
                  return;
                }
                
                // Convert to string to ensure consistency
                pkgCode = String(pkgCode);
                promoCode = String(promoCode);
                
                console.log(`Processing row ${index + 2}: PKG=${pkgCode}, Promo=${promoCode}`);
                
                // Look up template data for this promo code
                const templateEntry = findTemplateEntryForPromo(promoCode, templateData);
                
                if (!templateEntry) {
                  warnings.push(`Row ${index + 2}: Promo code "${promoCode}" not found in template`);
                  console.warn(`Warning: Promo code "${promoCode}" not found in template`);
                  
                  // Still create a row but mark it as requiring attention
                  processedData.push({
                    pkgCode,
                    promoCode,
                    hasTemplate: false,
                    rowStatus: 'warning',
                    rowIndex: index + 2,
                    // Add empty template fields
                    templateFields: createEmptyTemplateFields()
                  });
                } else {
                  console.log(`Found template for ${promoCode}:`, templateEntry);
                  
                  // Create a mapped entry with all template data
                  processedData.push({
                    pkgCode,
                    promoCode,
                    hasTemplate: true,
                    rowStatus: 'valid',
                    rowIndex: index + 2,
                    templateFields: templateEntry
                  });
                }
              } catch (rowError) {
                console.error("Row processing error:", rowError);
                errors.push(`Row ${index + 2}: ${rowError.message}`);
              }
            });
            
            console.log("Final processed data:", processedData);
            
            // Return processed data along with any errors/warnings
            resolve({
              processedData,
              errors,
              warnings,
              rawData: rawData,
              success: errors.length === 0 && processedData.length > 0
            });
          } catch (error) {
            console.error("File processing error:", error);
            reject(error);
          }
        };
        
        reader.onerror = function() {
          reject(new Error("Error reading file"));
        };
        
        // Read the file based on type
        if (file.name.toLowerCase().endsWith('.csv')) {
          reader.readAsText(file);
        } else {
          reader.readAsArrayBuffer(file);
        }
      });
    }
    
    function findTemplateEntryForPromo(promoCode, templateData) {
      // Look up the promo code in the template data (case insensitive)
      const entry = templateData.find(item => {
        return item.promo_code && item.promo_code.toLowerCase() === promoCode.toLowerCase();
      });
      
      return entry || null;
    }
    
    function createEmptyTemplateFields() {
      // Create an object with all template fields set to empty
      return {
        description: '',
        title: '',
        // Add all other template fields here
      };
    }
    
    // IMPROVED generatePreview with explicit visibility forcing
    function generatePreview(processedData) {
      console.log("generatePreview called with", processedData ? processedData.length : 0, "rows");
      
      // CRITICAL: Force preview section to be visible first
      forceShowPreviewSection();
      
      // Get a fresh reference to preview table
      const currentPreviewTable = document.getElementById("previewTable");
      const currentPreviewSection = document.getElementById("previewSection");
      const currentGenerateBtn = document.getElementById("generateCsvBtn");
      
      if (!currentPreviewTable) {
        console.error("Preview table element not found");
        alert("Error: Preview table element not found. Check HTML structure.");
        return;
      }
      
      // Clear the table first
      currentPreviewTable.innerHTML = '';
      console.log("Table cleared, building new content");
      
      // Create header to match the expected format
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      
      // Use the exact header names from the screenshot
      ['PKG_CODE', 'PROMO CODE', 'NAME', 'TITLE', 'DESCRIPTION'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
      });
      
      thead.appendChild(headerRow);
      currentPreviewTable.appendChild(thead);
      console.log("Added table headers");
      
      // Create body
      const tbody = document.createElement('tbody');
      
      // If no data, show empty message
      if (!processedData || processedData.length === 0) {
        console.log("No data available for preview");
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 5;
        emptyCell.textContent = "No data available";
        emptyCell.style.textAlign = "center";
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
      } else {
        // Add data rows
        console.log(`Adding ${processedData.length} rows to preview table`);
        let rowsAdded = 0;
        
        processedData.forEach((row, index) => {
          try {
            const tr = document.createElement('tr');
            
            // Set row color based on status
            if (row.rowStatus === 'valid') {
              tr.className = 'row-valid';
            } else if (row.rowStatus === 'warning') {
              tr.className = 'row-warning';
            } else {
              tr.className = 'row-error';
            }
            
            // Helper function to safely add cell
            function addCell(value) {
              const td = document.createElement('td');
              td.textContent = value || '';
              tr.appendChild(td);
            }
            
            // Add cells in the correct order to match the headers
            addCell(row.pkgCode);                                           // PKG_CODE
            addCell(row.promoCode);                                         // PROMO CODE
            addCell(row.templateFields && row.templateFields.title ? row.templateFields.title : '');         // NAME
            addCell(row.templateFields && row.templateFields.title ? row.templateFields.title : '');         // TITLE
            addCell(row.templateFields && row.templateFields.description ? row.templateFields.description : ''); // DESCRIPTION
            
            tbody.appendChild(tr);
            rowsAdded++;
            
            // Log for debugging
            if (index === 0 || index % 20 === 0) {
              console.log(`Added ${index} rows to table`);
            }
          } catch (rowError) {
            console.error(`Error building preview row ${index}:`, rowError);
          }
        });
        
        console.log(`Successfully added ${rowsAdded} rows to preview table`);
      }
      
      // Add the tbody to the table
      currentPreviewTable.appendChild(tbody);
      console.log("Table body added to the table");
      
      // EXTRA check to ensure preview section is visible
      if (currentPreviewSection) {
        currentPreviewSection.classList.remove('hidden');
        currentPreviewSection.style.display = "block";
      }
      
      // Enable/disable generate button based on errors and data presence
      const hasErrors = processedData && processedData.some(row => row.rowStatus === 'error');
      if (currentGenerateBtn) {
        currentGenerateBtn.disabled = hasErrors || !processedData || processedData.length === 0;
        console.log(`Generate button ${currentGenerateBtn.disabled ? 'disabled' : 'enabled'}`);
      }
      
      // Show warning if there are rows with warnings
      const hasWarnings = processedData && processedData.some(row => row.rowStatus === 'warning');
      if (hasWarnings) {
        showToast("Some promo codes were not found in the template. Check highlighted rows in preview.", "warning");
      }
      
      console.log("Preview table generation complete");
    }
    
    function generateAndDownloadCsv() {
      if (!processedData || processedData.length === 0) {
        showToast("No data to generate CSV", "error");
        return;
      }
      
      // Perform final validation
      const validationErrors = validateBeforeGeneration(processedData);
      if (validationErrors.length > 0) {
        showToast(validationErrors[0], "error");
        return;
      }
      
      // Generate CSV content
      const csvContent = generateFinalCSV(processedData, templateData);
      if (!csvContent) {
        showToast("Failed to generate CSV", "error");
        return;
      }
      
      console.log("Generated CSV content:", csvContent);
      
      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      // Set file name based on the selected language
      const fileName = `${selectedLanguage}.csv`;
      
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.display = "none";
      
      // Append, click, and remove
      document.body.appendChild(link);
      link.click();
      
      // A short delay before removal to ensure the download starts
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up
        showToast(`CSV file '${fileName}' generated successfully!`, "success");
      }, 100);
    }
    
    function generateFinalCSV(processedData, templateData) {
      // Create CSV structure matching the existing import format with # delimiter
      const rows = [];
      
      // Add CSV header exactly matching the format in the createCSVBtn code
      const header = "PKG_CODES#Promo code#Name#Title#Description";
      rows.push(header);
      
      // Add data rows
      processedData.forEach(row => {
        // Build row with # delimiter to match existing format
        const rowData = [
          row.pkgCode,                        // PKG_CODES
          row.promoCode,                      // Promo code
          row.templateFields.title || '',     // Name (using title as name)
          row.templateFields.title || '',     // Title
          row.templateFields.description || '' // Description
        ];
        
        // Only add non-empty rows (matching existing logic)
        if (rowData.some(cell => cell !== "")) {
          // Replace newlines with spaces, trim content (exactly like original code)
          const cleanedRowData = rowData.map(cell => {
            let text = String(cell || "");
            return text.replace(/\r?\n|\r/g, " ").trim();
          });
          
          rows.push(cleanedRowData.join("#"));
        }
      });
      
      // Generate CSV string with newline separators
      const csvContent = rows.join("\n");
      
      return csvContent;
    }
    
    function validateBeforeGeneration(processedData) {
      const errors = [];
      
      if (!processedData || processedData.length === 0) {
        errors.push("No data to generate CSV");
        return errors;
      }
      
      // Check for critical errors
      const rowsWithErrors = processedData.filter(row => row.rowStatus === 'error');
      if (rowsWithErrors.length > 0) {
        errors.push(`${rowsWithErrors.length} rows have errors that must be fixed`);
      }
      
      return errors;
    }
    
    function showToast(message, type = "info") {
      const toast = document.getElementById("toast");
      if (!toast) {
        console.error("Toast element not found");
        return;
      }
      
      // Clear any existing timeout
      if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
      }
      
      // Set toast class based on type
      toast.className = "toast";
      toast.classList.add(`toast-${type}`);
      
      // Update message and show toast
      toast.textContent = message;
      toast.classList.remove("hidden");
      toast.classList.add("show");
      
      console.log(`Toast shown: ${message} (${type})`);
      
      // Auto-hide after a few seconds
      window.toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.classList.add("hidden"), 300);
      }, 4000);
    }
  });
}