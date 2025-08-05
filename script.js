
// Data structure to hold sample PYQ data
const pyqData = {
  Physics: ["2024", "2023", "2022"],
  Chemistry: ["2024", "2023", "2021"],
  Mathematics: ["2023", "2022", "2020"],
  "Computer Science": ["2024", "2023", "2022", "2021"],
  English: ["2024", "2023"],
  Biology: ["2023", "2022", "2021"]
};

// Handle clicks on subject cards
document.querySelectorAll(".subject-card").forEach(card => {
  card.addEventListener("click", () => {
    const subject = card.textContent;
    showYearPopup(subject, pyqData[subject] || []);
  });
});

// Function to show popup with years
function showYearPopup(subject, years) {
  const existingPopup = document.getElementById("popup");
  if (existingPopup) existingPopup.remove();

  const popup = document.createElement("div");
  popup.id = "popup";
  popup.innerHTML = `
    <div class="popup-content">
      <h3>${subject} - Select Year</h3>
      <ul>
        ${years
          .map(
            year =>
              `<li><a href="#" onclick="downloadPaper('${subject}', '${year}')">${year}</a></li>`
          )
          .join("")}
      </ul>
      <button onclick="closePopup()">Close</button>
    </div>
  `;

  document.body.appendChild(popup);
}

// Close popup
function closePopup() {
  const popup = document.getElementById("popup");
  if (popup) popup.remove();
}

// Simulate download
function downloadPaper(subject, year) {
  alert(`📄 Downloading ${subject} paper for year ${year}...`);
  closePopup();
}

// Search filter logic (only if searchInput exists)
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase();
      const cards = document.querySelectorAll(".subject-card");

      cards.forEach(card => {
        const subject = card.textContent.toLowerCase();
        card.style.display = subject.includes(query) ? "block" : "none";
      });
    });
  }
});
