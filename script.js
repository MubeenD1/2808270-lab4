// DOM Elements
const searchBtn = document.getElementById('search-btn');
const countryInput = document.getElementById('country-input');
const countryInfo = document.getElementById('country-info');
const borderContainer = document.getElementById('border-countries');
const spinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');

// ==========================
// Main Search Function
// ==========================
async function searchCountry(countryName) {
    if (!countryName) return;

    try {
        // Clear previous results
        countryInfo.innerHTML = '';
        borderContainer.innerHTML = '';
        errorMessage.classList.add('hidden');

        // Show loading spinner
        spinner.classList.remove('hidden');

        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

        if (!response.ok) {
            throw new Error('Country not found');
        }

        const data = await response.json();
        const country = data[0];

        // ==========================
        // Display Country Info
        // ==========================
        countryInfo.innerHTML = `
            <div class="country-card">
                <h2>${country.name.common}</h2>
                <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
            </div>
        `;

        // ==========================
        // Fetch Bordering Countries
        // ==========================
        if (country.borders && country.borders.length > 0) {
            borderContainer.innerHTML = '<h3>Bordering Countries:</h3>';
            const grid = document.createElement('div');
            grid.classList.add('border-grid');

            for (const code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                const borderCard = document.createElement('div');
                borderCard.innerHTML = `
                    <p>${borderCountry.name.common}</p>
                    <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag" width="80">
                `;

                grid.appendChild(borderCard);
            }

            borderContainer.appendChild(grid);
        } else {
            borderContainer.innerHTML = '<p>No bordering countries.</p>';
        }

    } catch (error) {
        errorMessage.textContent = 'Sorry, we could not find that country. Please try again.';
        errorMessage.classList.remove('hidden');
    } finally {
        // Hide loading spinner
        spinner.classList.add('hidden');
    }
}

// ==========================
// Event Listeners
// ==========================

// Click button
searchBtn.addEventListener('click', () => {
    const country = countryInput.value.trim();
    searchCountry(country);
});

// Press Enter in input
countryInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const country = countryInput.value.trim();
        searchCountry(country);
    }
});
