
"use strict";
localStorage.removeItem("qureHospitalQueue_v1");
const STORAGE_KEY = "qureHospitalQueue_v1";

const form = document.getElementById("patientForm");
const nameInput = document.getElementById("patientName");
const ageInput = document.getElementById("patientAge");
const symptomsInput = document.getElementById("patientSymptoms");
const emergencyCheck = document.getElementById("emergencyCheck");

const totalCount = document.getElementById("totalCount");
const waitingCount = document.getElementById("waitingCount");
const servedCount = document.getElementById("servedCount");

const currentName = document.getElementById("currentName");
const currentDetails = document.getElementById("currentDetails");
const currentToken = document.getElementById("currentToken");

const queueTableBody = document.getElementById("queueTableBody");
const recordsTableBody = document.getElementById("recordsTableBody");
const queuePill = document.getElementById("queuePill");
const recordsPill = document.getElementById("recordsPill");
const actionMessage = document.getElementById("actionMessage");
const toast = document.getElementById("toast");

const clearFormButton = document.getElementById("clearFormButton");
const callNextButton = document.getElementById("callNextButton");
const markServedButton = document.getElementById("markServedButton");

let patients = [];
let currentPatientToken = null;
let nextToken = 101;
let toastTimeout;

function loadData() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) return;

    const data = JSON.parse(savedData);

    if (!data || !Array.isArray(data.patients)) return;

    patients = data.patients.filter((patient) =>
      patient &&
      Number.isInteger(patient.tokenNumber) &&
      typeof patient.name === "string" &&
      Number.isInteger(patient.age) &&
      typeof patient.symptoms === "string" &&
      typeof patient.emergency === "boolean" &&
      ["Waiting", "Calling", "Served"].includes(patient.status)
    );

    const savedCurrentToken = data.currentPatientToken;

    if (
      Number.isInteger(savedCurrentToken) &&
      patients.some(
        (patient) =>
          patient.tokenNumber === savedCurrentToken &&
          patient.status === "Calling"
      )
    ) {
      currentPatientToken = savedCurrentToken;
    } else {
      currentPatientToken = null;

      patients.forEach((patient) => {
        if (patient.status === "Calling") {
          patient.status = "Waiting";
        }
      });
    }

    const highestToken = patients.reduce(
      (highest, patient) => Math.max(highest, patient.tokenNumber),
      100
    );

    nextToken = Math.max(101, highestToken + 1);
  } catch (error) {
    console.error("Could not load saved QURE data:", error);
    patients = [];
    currentPatientToken = null;
    nextToken = 101;
  }
}

function saveData() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        patients,
        currentPatientToken
      })
    );
    return true;
  } catch (error) {
    console.error("Could not save QURE data:", error);
    showToast("Browser storage is unavailable. Changes may not persist.", true);
    return false;
  }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return replacements[character];
  });
}

function showToast(message, isError = false) {
  clearTimeout(toastTimeout);

  toast.textContent = message;
  toast.classList.toggle("error", isError);
  toast.classList.add("show");

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

function setActionMessage(message) {
  actionMessage.textContent = message;
}

function getWaitingPatients() {
  return patients
    .filter((patient) => patient.status === "Waiting")
    .sort((a, b) => {
      if (a.emergency !== b.emergency) {
        return a.emergency ? -1 : 1;
      }

      return a.tokenNumber - b.tokenNumber;
    });
}

function getCurrentPatient() {
  return patients.find(
    (patient) => patient.tokenNumber === currentPatientToken
  ) || null;
}

function renderQueue() {
  const waitingPatients = getWaitingPatients();

  queuePill.textContent =
    `${waitingPatients.length} waiting`;

  if (waitingPatients.length === 0) {
    queueTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          No patients are waiting.
        </td>
      </tr>
    `;
    return;
  }

  queueTableBody.innerHTML = waitingPatients.map((patient) => `
    <tr>
      <td class="token-cell">#${patient.tokenNumber}</td>
      <td class="patient-name">${escapeHTML(patient.name)}</td>
      <td>${patient.age}</td>
      <td>${escapeHTML(patient.symptoms)}</td>
      <td>
        <span class="priority-badge ${
          patient.emergency ? "priority-emergency" : "priority-normal"
        }">
          ${patient.emergency ? "Emergency" : "Normal"}
        </span>
      </td>
    </tr>
  `).join("");
}

function renderRecords() {
  const orderedPatients = [...patients].sort(
    (a, b) => a.tokenNumber - b.tokenNumber
  );

  recordsPill.textContent =
    `${orderedPatients.length} records`;

  if (orderedPatients.length === 0) {
    recordsTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          No patient records yet.
        </td>
      </tr>
    `;
    return;
  }

  recordsTableBody.innerHTML = orderedPatients.map((patient) => {
    let statusClass = "status-waiting";

    if (patient.status === "Calling") {
      statusClass = "status-calling";
    } else if (patient.status === "Served") {
      statusClass = "status-served";
    }

    return `
      <tr>
        <td class="token-cell">#${patient.tokenNumber}</td>
        <td class="patient-name">${escapeHTML(patient.name)}</td>
        <td>${patient.age}</td>
        <td>${escapeHTML(patient.symptoms)}</td>
        <td>
          <span class="priority-badge ${
            patient.emergency ? "priority-emergency" : "priority-normal"
          }">
            ${patient.emergency ? "Emergency" : "Normal"}
          </span>
        </td>
        <td>
          <span class="status-badge ${statusClass}">
            ${patient.status}
          </span>
        </td>
      </tr>
    `;
  }).join("");
}

function renderCurrentPatient() {
  const patient = getCurrentPatient();

  if (!patient) {
    currentName.textContent = "No patient is being called";
    currentDetails.textContent =
      "Call the next patient when you are ready.";
    currentToken.textContent = "---";
    markServedButton.disabled = true;
    return;
  }

  currentName.textContent = patient.name;
  currentDetails.textContent =
    `Age ${patient.age} · ${patient.symptoms}` +
    (patient.emergency ? " · EMERGENCY" : "");

  currentToken.textContent = `#${patient.tokenNumber}`;
  markServedButton.disabled = false;
}

function renderDashboard() {
  totalCount.textContent = patients.length;

  waitingCount.textContent = patients.filter(
    (patient) => patient.status === "Waiting"
  ).length;

  servedCount.textContent = patients.filter(
    (patient) => patient.status === "Served"
  ).length;

  renderCurrentPatient();
  renderQueue();
  renderRecords();

  callNextButton.disabled =
    currentPatientToken !== null || getWaitingPatients().length === 0;
}

function clearForm() {
  form.reset();
  nameInput.focus();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const age = Number(ageInput.value);
  const symptoms = symptomsInput.value.trim();
  const emergency = emergencyCheck.checked;

  if (!name || !symptoms) {
    showToast("Please enter the patient's name and symptoms.", true);
    return;
  }

  if (!Number.isInteger(age) || age < 1 || age > 120) {
    showToast("Please enter an age between 1 and 120.", true);
    ageInput.focus();
    return;
  }

  const patient = {
    tokenNumber: nextToken,
    name,
    age,
    symptoms,
    emergency,
    status: "Waiting"
  };

  patients.push(patient);
  nextToken += 1;

  saveData();
  renderDashboard();
  clearForm();

  showToast(
    `Patient registered successfully. Token number: ${patient.tokenNumber}`
  );

  setActionMessage(
    `${patient.name} was registered with token #${patient.tokenNumber}.`
  );
});

callNextButton.addEventListener("click", () => {
  if (currentPatientToken !== null) {
    showToast("Mark the current patient as served first.", true);
    return;
  }

  const waitingPatients = getWaitingPatients();

  if (waitingPatients.length === 0) {
    showToast("There are no patients waiting.", true);
    return;
  }

  const nextPatient = waitingPatients[0];

  nextPatient.status = "Calling";
  currentPatientToken = nextPatient.tokenNumber;

  saveData();
  renderDashboard();

  showToast(
    `Now calling ${nextPatient.name}, token #${nextPatient.tokenNumber}.`
  );

  setActionMessage(
    `Now calling token #${nextPatient.tokenNumber}. Mark the patient as served before calling the next patient.`
  );
});

markServedButton.addEventListener("click", () => {
  const patient = getCurrentPatient();

  if (!patient) {
    showToast("There is no current patient to mark as served.", true);
    return;
  }

  patient.status = "Served";
  currentPatientToken = null;

  saveData();
  renderDashboard();

  showToast(
    `${patient.name}, token #${patient.tokenNumber}, has been marked as served.`
  );

  setActionMessage(
    `Token #${patient.tokenNumber} has been served. You can call the next patient.`
  );
});

clearFormButton.addEventListener("click", () => {
  clearForm();
  showToast("Registration form cleared.");
  setActionMessage("The registration form is ready for a new patient.");
});

function updateDate() {
  const today = new Date();

  document.getElementById("todayDate").textContent =
    today.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
}

loadData();
updateDate();
renderDashboard();
