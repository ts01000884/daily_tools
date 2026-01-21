document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Elements ---
    const conversionForm = document.getElementById('conversion-form');
    const storeSelect = document.getElementById('store-select');
    const sevenElevenPresetsDiv = document.getElementById('seven-eleven-presets');
    const familymartPresetsDiv = document.getElementById('familymart-presets');
    const sevenElevenSelect = document.getElementById('7-eleven-preset-select');
    const familymartSelect = document.getElementById('familymart-preset-select');
    const resultsSection = document.getElementById('results-section');

    // --- Data: Total Energy Maps (Watts * Seconds) ---
    // NOTE: These are placeholder values. Replace with actual measured data.
    const ENERGY_MAPS = {
        '7-eleven': {
            // Placeholder based on (Original Seconds * 980W)
            '1': 10 * 980,   // 9800
            '2': 15 * 980,   // 14700
            '3': 24 * 980,   // 23520
            '4': 30 * 980,   // 29400
            '5': 36 * 980,   // 35280
            '6': 48 * 980,   // 47040
            '7': 110 * 980,  // 107800
            '8': 100 * 980,  // 98000
            '9': 130 * 980,  // 127400
            '0': 220 * 980   // 215600
        },
        'familymart': {
            // !!! COMPLETELY FICTIONAL PLACEHOLDER VALUES !!!
            // Assuming 1500W and arbitrary seconds
            '1': 20 * 1500,  // 30000
            '2': 30 * 1500,  // 45000
            '3': 45 * 1500,  // 67500
            '4': 60 * 1500,  // 90000
            '5': 90 * 1500,  // 135000
            '6': 120 * 1500  // 180000
        }
    };

    // --- Functions ---
    function toggleInputMode() {
        const selectedOption = storeSelect.options[storeSelect.selectedIndex];
        const storeType = selectedOption.getAttribute('data-store');

        if (storeType === '7-eleven') {
            sevenElevenPresetsDiv.classList.remove('d-none');
            familymartPresetsDiv.classList.add('d-none');
        } else if (storeType === 'familymart') {
            sevenElevenPresetsDiv.classList.add('d-none');
            familymartPresetsDiv.classList.remove('d-none');
        }
    }

    function calculateAndDisplay() {
        const selectedStoreOption = storeSelect.options[storeSelect.selectedIndex];
        const storeType = selectedStoreOption.getAttribute('data-store');
        
        let selectedPresetValue;
        if (storeType === '7-eleven') {
            selectedPresetValue = sevenElevenSelect.value;
        } else if (storeType === 'familymart') {
            selectedPresetValue = familymartSelect.value;
        }

        // 1. Get total energy from the map
        const totalEnergy = ENERGY_MAPS[storeType][selectedPresetValue];

        if (!totalEnergy) {
            alert('找不到對應的能量數據！');
            return;
        }

        // 2. Define home wattages
        const homeWattages = [1000, 800, 700, 600];

        // 3. Loop, calculate, and update results
        homeWattages.forEach(wattage => {
            const homeSeconds = totalEnergy / wattage;
            const resultElement = document.getElementById(`result-${wattage}`);
            if (resultElement) {
                resultElement.textContent = homeSeconds.toFixed(1);
            }
        });

        // 4. Show results
        resultsSection.classList.remove('d-none');
    }

    // --- Event Listeners ---
    storeSelect.addEventListener('change', toggleInputMode);
    conversionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        calculateAndDisplay();
    });

    // --- Initial State ---
    toggleInputMode();
});


