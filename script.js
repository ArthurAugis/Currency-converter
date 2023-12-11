const inputAmount = document.getElementById('inputAmount');
const outputAmount = document.getElementById('outputAmount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countriesData = await response.json();

        const currencyNames = {};

        countriesData.forEach(country => {
            const currencies = country.currencies;
            if (currencies) {
                Object.keys(currencies).forEach(code => {
                    if (!currencyNames[code]) {
                        currencyNames[code] = currencies[code].name;
                    }
                });
            }
        });

        const responseRates = await fetch('https://v6.exchangerate-api.com/v6/2775bb1aca24894a786dcec9/latest/EUR');
        const ratesData = await responseRates.json();

        if (ratesData.conversion_rates) {
            for (const currency in ratesData.conversion_rates) {
                const option1 = document.createElement('option');
                option1.value = currency;
                option1.textContent = `${currency} - ${currencyNames[currency] || 'Unknown'}`;
                const option2 = option1.cloneNode(true);
                fromCurrencySelect.appendChild(option1);
                toCurrencySelect.appendChild(option2);
            }
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des devises :', error);
    }
});


let debounceTimer;

inputAmount.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(convertCurrency, 1000); // Attend 1 seconde après la fin de la saisie
});

fromCurrencySelect.addEventListener('change', convertCurrency);
toCurrencySelect.addEventListener('change', convertCurrency);

async function convertCurrency() {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const amount = parseFloat(inputAmount.value);

    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/2775bb1aca24894a786dcec9/latest/${fromCurrency}`);
        const data = await response.json();

        if (data.conversion_rates) {
            const exchangeRate = data.conversion_rates[toCurrency];
            const result = amount * exchangeRate;
            outputAmount.value = result.toFixed(2);
        } else {
            outputAmount.value = 'Erreur de conversion';
        }
    } catch (error) {
        console.error('Erreur lors de la conversion :', error);
        outputAmount.value = 'Erreur de conversion';
    }
}
