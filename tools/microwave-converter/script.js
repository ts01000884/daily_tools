document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Elements ---
    const storeSelector = document.getElementById('store-selector');
    const sevenElevenPresetsDiv = document.getElementById('seven-eleven-presets');
    const familymartPresetsDiv = document.getElementById('familymart-presets');
    const resultsSection = document.getElementById('results-section');
    const floatingResetBtn = document.getElementById('floating-reset-btn');

    // --- Data: Total Energy Maps (Watts * Seconds) ---
    const ENERGY_MAPS = {
        '7-eleven': {
            '2': 700 * 40, '3': 700 * 52, '4': 700 * 70, '5': 700 * 80,
            '6': 700 * 120, '8': 700 * 225, '9': 700 * 188, '0': 700 * 283,
            '8+2': 700 * 265,
            '1': 10 * 980, // Placeholder
            '7': 110 * 980, // Placeholder
        },
        'familymart': {
            '1': 20 * 1500, '2': 30 * 1500, '3': 45 * 1500,
            '4': 60 * 1500, '5': 90 * 1500, '6': 120 * 1500,
        }
    };

    let activeStore = '7-eleven'; // Default store

    // --- Functions ---

    // Helper function to format total seconds into "X 分 Y 秒"
    function formatTime(totalSeconds) {
        if (isNaN(totalSeconds) || totalSeconds < 0) {
            return '無效時間';
        }
        const roundedSeconds = Math.round(totalSeconds);
        const minutes = Math.floor(roundedSeconds / 60);
        const seconds = roundedSeconds % 60;

        let result = '';
        if (minutes > 0) {
            result += `${minutes} <small>分</small> `;
        }
        if (seconds > 0 || minutes === 0) {
            result += `${seconds} <small>秒</small>`;
        }
        return result.trim();
    }

    // Resets preset selection and results
    function resetSelection() {
        document.querySelectorAll('.preset-btn.active').forEach(btn => {
            btn.classList.remove('active');
            btn.classList.replace('btn-primary', 'btn-outline-secondary');
        });
        resultsSection.classList.add('d-none');
        floatingResetBtn.classList.add('d-none');
    }

    // Handles store selection
    function handleStoreSelection(event) {
        const clickedBtn = event.target.closest('button');
        if (!clickedBtn || clickedBtn.classList.contains('active')) return;

        activeStore = clickedBtn.dataset.store;

        // Update button styles
        storeSelector.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active', 'btn-primary');
            btn.classList.add('btn-outline-primary');
        });
        clickedBtn.classList.add('active', 'btn-primary');
        clickedBtn.classList.remove('btn-outline-primary');

        // Toggle preset divs
        if (activeStore === '7-eleven') {
            sevenElevenPresetsDiv.classList.remove('d-none');
            familymartPresetsDiv.classList.add('d-none');
        } else {
            sevenElevenPresetsDiv.classList.add('d-none');
            familymartPresetsDiv.classList.remove('d-none');
        }
        resetSelection();
    }

    // Handles preset button selection
    function handlePresetSelection(event) {
        const clickedBtn = event.target.closest('.preset-btn');
        if (!clickedBtn) return;

        // Clear previous active preset
        const currentActive = clickedBtn.parentElement.querySelector('.preset-btn.active');
        if (currentActive) {
            currentActive.classList.remove('active');
            currentActive.classList.replace('btn-primary', 'btn-outline-secondary');
        }

        // Set new active preset
        clickedBtn.classList.add('active');
        clickedBtn.classList.replace('btn-outline-secondary', 'btn-primary');
        
        calculateAndDisplay(clickedBtn.dataset.value);
    }

    // Calculates and displays the results
    function calculateAndDisplay(selectedValue) {
        const totalEnergy = ENERGY_MAPS[activeStore][selectedValue];
        if (!totalEnergy) {
            alert('找不到對應的能量數據！');
            return;
        }

        const homeWattages = [1000, 800, 700, 600];
        homeWattages.forEach(wattage => {
            const homeSeconds = totalEnergy / wattage;
            const resultElement = document.getElementById(`result-${wattage}`);
            if (resultElement) {
                resultElement.innerHTML = formatTime(homeSeconds);
            }
        });

        resultsSection.classList.remove('d-none');
        floatingResetBtn.classList.remove('d-none');

        // Scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100); // A small delay can help ensure the section is rendered
    }

    // Handles floating reset button click
    function handleResetAndScrollTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        resetSelection();
    }

    // --- Event Listeners ---
    storeSelector.addEventListener('click', handleStoreSelection);
    sevenElevenPresetsDiv.addEventListener('click', handlePresetSelection);
    familymartPresetsDiv.addEventListener('click', handlePresetSelection);
    floatingResetBtn.addEventListener('click', handleResetAndScrollTop);
});



