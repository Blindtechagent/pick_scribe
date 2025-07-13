const scribesList = document.getElementById('scribes_list');
const db = firebase.database().ref('scribes');

let currentPage = 0;
const scribesPerPage = 7;
let totalScribes = 0;
let filteredScribes = [];

// Load and sort scribes initially
db.orderByKey().on('value', (snapshot) => {
	const scribes = snapshot.val();
	filteredScribes = Object.entries(scribes).sort(([, a], [, b]) => new Date(b.serialNumber) - new Date(a.serialNumber));
	totalScribes = filteredScribes.length;
	document.getElementById('totalScribes').innerText = `Total registered scribes: ${totalScribes}`;
	displayScribes();
});

// Display scribes for the current page
function displayScribes() {
	scribesList.innerHTML = '';

	const start = currentPage * scribesPerPage;
	const end = start + scribesPerPage;
	const paginated = filteredScribes.slice(start, end);

	if (paginated.length === 0) {
		scribesList.innerHTML = `
      <div class="no-results">
        <h2>No scribes found</h2>
        <p>Try selecting a different state or subject.</p>
      </div>
    `;
		return;
	}

	paginated.forEach(([id, scribe]) => {
		displayScribe(scribe.full_name, scribe.State, scribe.Subject, id);
	});

	document.getElementById('prevBtn').style.display = currentPage === 0 ? 'none' : 'inline';
	document.getElementById('nextBtn').style.display = (currentPage + 1) * scribesPerPage >= totalScribes ? 'none' : 'inline';
}

// Render a single scribe card (limited details)
function displayScribe(name, state, subject, id) {
	const div = document.createElement('div');
	div.classList.add('scribe-card');
	div.innerHTML = `
    <h3>${name}</h3>
    <p><strong>State:</strong> ${state}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <button onclick="viewScribe('${id}')">View Full Details</button>
  `;
	scribesList.appendChild(div);
}

// Handle redirection to full scribe details
function viewScribe(id) {
	window.location.href = `scribe-details.html?id=${id}`;
}

// Filter form submission
document.querySelector('.filters').addEventListener('submit', function (e) {
	e.preventDefault();
	const selectedState = document.getElementById('state').value;
	const selectedSubject = document.getElementById('subject').value;

	db.orderByKey().once('value', (snapshot) => {
		const scribes = snapshot.val();
		filteredScribes = Object.entries(scribes)
			.filter(([, scribe]) => scribe.State === selectedState && scribe.Subject === selectedSubject)
			.sort(([, a], [, b]) => new Date(b.serialNumber) - new Date(a.serialNumber));

		totalScribes = filteredScribes.length;
		document.getElementById('totalScribes').innerText = `Total registered scribes: ${totalScribes}`;
		currentPage = 0;
		displayScribes();
	});
});

// Pagination controls
function nextPage() {
	if ((currentPage + 1) * scribesPerPage < totalScribes) {
		currentPage++;
		displayScribes();
	}
}

function prevPage() {
	if (currentPage > 0) {
		currentPage--;
		displayScribes();
	}
}

// Setup pagination buttons
const paginationContainer = document.createElement('div');
paginationContainer.id = 'pagination';
paginationContainer.innerHTML = `
  <button id="prevBtn" onclick="prevPage()" style="display:none;">Previous</button>
  <button id="nextBtn" onclick="nextPage()">Next</button>
`;
scribesList.insertAdjacentElement('afterend', paginationContainer);
