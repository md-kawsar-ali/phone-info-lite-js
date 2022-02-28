// Retrieve Html Elements
const resultWrapper = document.getElementById('result-wrapper');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const msgField = document.querySelector('.message');

// Fetch API
const fetchAPI = async text => {
    const url = `https://openapi.programming-hero.com/api/phones?search=${text}`;
    const response = await fetch(url);
    const results = await response.json();
    const data = results.data;

    if (response.ok && data.length !== 0) {
        displayResult(data);
        alertMsg(); // Hide Alert Message
    } else {
        alertMsg('No Result Found!'); // Show Alert Message
    }
    spinner(false); // Hide Spinner
}

// Call Popular Phones (Default for Display)
fetchAPI('iphone');

// Display Results
const displayResult = data => {
    removeAllChildNodes(resultWrapper); // Remove Previous Results

    data?.map(phone => {
        const { image, phone_name, brand, slug } = phone;

        const div = document.createElement('div');
        div.classList.add('col-lg-4', 'col-md-6');

        div.innerHTML = `
            <div class="card">
                <figure onclick="loadDetails('${slug}')">
                    <img src="${image}" class="card-img-top" alt="${phone_name}" />
                </figure>
                <div class="card-body">
                    <div class="d-flex align-items-center justify-content-between">
                        <h5 onclick="loadDetails('${slug}')" class="card-title mb-0">${phone_name}</h5>
                        <h6 class="mb-0">Brand: ${brand}</h6>
                    </div>
                </div>
            </div>
        `;
        resultWrapper.appendChild(div);
    });
}

// Search Phone
searchBtn.addEventListener('click', function (event) {
    event.preventDefault();
    const searchText = searchInput.value;
    const trimSearch = searchText.trim();

    if (trimSearch.length > 0) {
        spinner(); // Show Spinner
        fetchAPI(`${trimSearch}`);
    } else {
        alertMsg('Invalid Search Input!');
    }
    searchInput.value = ''; // Clear Search Input
});

// Remove Previous Results
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// Spinner Function
const spinner = (isShow = true) => {
    if (isShow) {
        searchBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span class="visually-hidden">Loading...</span>
        `;
        searchBtn.classList.add('disabled');
    } else {
        searchBtn.innerHTML = 'Search';
        searchBtn.classList.remove('disabled');
    }
}

// Alert Message Function
const alertMsg = (msg = '') => {
    if (msg.length > 0) {
        msgField.innerHTML = `<h6 class="d-inline-block m-0 bg-danger py-1 px-3 rounded">${msg}</h6>`;

        // Remove Message After 3000 MS
        setTimeout(() => {
            msgField.innerHTML = '';
        }, 3000);
    } else {
        msgField.innerHTML = '';
    }
}