const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwGmv-VPKk1XcVQszb6sQ9qETW5KAzmIdHGRBx7JdfmiQxIofz_E_x_1oOY0SUk-Hrv/exec';

let data = [];
let currentPage = 1;
const cardsPerPage = 6;

async function fetchPPTData() {
  try {
    const response = await fetch(WEB_APP_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    data = result;
    console.log(data);
    renderCards();
  } catch (error) {
    console.error('Error fetching PPT data:', error);
    document.querySelector('.card-container').innerHTML = '<p class="text-danger">Failed to load data.</p>';
  } finally {
    // Hide loading spinner once done or failed
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) loadingScreen.style.display = 'none';
  }
}

function renderCards() {
  const container = document.querySelector('.card-container');
  container.innerHTML = '';

  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = Math.min(startIndex + cardsPerPage, data.length);
  const visibleData = data.slice(startIndex, endIndex);

  if (visibleData.length === 0) {
    container.innerHTML = '<p>No papers available.</p>';
    updatePagination();
    return;
  }

  visibleData.forEach(entry => {
    const card = document.createElement('div');
    card.className = 'card shadow-sm';
    card.className = 'l_card';
    card.style.width = '18rem';
    card.style.margin = '10px';

    card.innerHTML = `
      <img src="${entry.img_url}" class="course_img card-img-top" alt="PPT Image" style="height: 180px; object-fit: cover;">
      <div class="card-body d-flex flex-column justify-content-between">
        <h2 class="card-title">${entry.pptsname}</h2>
        <button class="take-btn btn-${entry.output.toLowerCase() == 'off' ? 'secondary' : 'primary'} explore-btn" ${entry.output.toLowerCase() == 'off' ? 'disabled' : ''}>
          Explore
        </button>
      </div>
    `;

    if (entry.output.toLowerCase() !== 'off') {
      const btn = card.querySelector('button');
      btn.addEventListener('click', () => {
        const pptType = encodeURIComponent(entry.pptsname);
        sessionStorage.setItem('selectedPPT', pptType);
        window.location.href = 'vjthappt.html';
      });
    }

    container.appendChild(card);
  });

  updatePagination();
}

function updatePagination() {
  const pageIndicator = document.getElementById('page-indicator');
  const totalPages = Math.ceil(data.length / cardsPerPage);
  pageIndicator.textContent = `Page ${currentPage} of ${totalPages || 1}`;
}

function nextPage() {
  const totalPages = Math.ceil(data.length / cardsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderCards();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderCards();
  }
}

// Load data on page load
window.onload = fetchPPTData;
