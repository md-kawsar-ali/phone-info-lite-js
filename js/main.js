// Retrieve Html Elements
const resultWrapper = document.getElementById('result-wrapper');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const msgField = document.querySelector('.message');
const showAllBtn = document.getElementById('show-all');

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

// Call Popular IPhones (Default)
fetchAPI('iphone');

// Display Results
const displayResult = data => {
    removeAllChildNodes(resultWrapper); // Remove Previous Results
    data?.map((phone, index) => {
        const { image, phone_name, brand, slug } = phone;

        const div = document.createElement('div');
        div.classList.add('col-lg-4', 'col-md-6');

        div.innerHTML = `
            <div class="card">
                <figure onclick="loadDetails('${slug}')" data-bs-toggle="modal" data-bs-target="#phoneDetails">
                    <img src="${image}" class="card-img-top" alt="${phone_name}" />
                </figure>
                <div class="card-body">
                    <div class="d-flex align-items-center justify-content-between">
                        <h5 onclick="loadDetails('${slug}')" class="card-title mb-0" data-bs-toggle="modal" data-bs-target="#phoneDetails">${phone_name}</h5>
                        <h6 class="mb-0">Brand: ${brand}</h6>
                    </div>
                </div>
            </div>
        `;
        resultWrapper.appendChild(div);

        // Hide Extra Elements
        if (index >= 12) {
            div.classList.add('d-none');
        }
    });

    // Display Show All Button
    if (data.length > 12) {
        showAllBtn.classList.remove('d-none');
    } else {
        showAllBtn.classList.add('d-none');
    }
}

// Load Phone Details (Function)
const modalPreloader = document.querySelector('.preloader');
const singleName = document.getElementById('name');
const singleImage = document.getElementById('image');
const singleBrand = document.getElementById('brand');
const singleReleased = document.getElementById('released');
const singleStorage = document.getElementById('storage');
const singleDisplay = document.getElementById('display');
const singleChipSet = document.getElementById('chipset');
const singleMemory = document.getElementById('memory');
const singleSensors = document.getElementById('sensors');
const singleWlan = document.getElementById('wlan');
const singleUsb = document.getElementById('usb');

const loadDetails = async slug => {
    // Show Preloader
    modalPreloader.style.display = 'flex';
    modalPreloader.style.opacity = '1';

    // Fetch API
    const url = `https://openapi.programming-hero.com/api/phone/${slug}`;
    const response = await fetch(url);
    const results = await response.json();
    const data = results.data;

    // Object Destructuring (With default value for undefined Property)
    const {
        name, image, brand, releaseDate,
        mainFeatures: { storage, displaySize, chipSet, memory, sensors } = { storage: 'N/A', displaySize: 'N/A', chipSet: 'N/A', memory: 'N/A', sensors: 'N/A' },
        others: { WLAN, USB } = { WLAN: 'N/A', USB: 'N/A' }
    } = data;

    // Get All Items from Sensors
    const allSensors = sensors?.map(sensor => ' ' + sensor);

    // Display All Information
    if (data) {
        singleName.innerText = name;
        singleImage.src = image;
        singleBrand.innerText = brand;
        singleReleased.innerText = releaseDate;
        singleStorage.innerText = storage;
        singleDisplay.innerText = displaySize;
        singleChipSet.innerText = chipSet;
        singleMemory.innerText = memory;
        singleSensors.innerText = allSensors;
        singleWlan.innerText = WLAN;
        singleUsb.innerText = USB;
    }

    // Hide Preloader
    modalPreloader.style.opacity = '0';
    modalPreloader.style.display = 'none';
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

// Show All Hidden Elements
showAllBtn.addEventListener('click', event => {
    const hiddenElement = document.getElementsByClassName('d-none');
    while (hiddenElement[0]) {
        hiddenElement[0].classList.remove('d-none');
    }
    event.target.classList.add('d-none');
});