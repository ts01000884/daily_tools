document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Elements ---
    const storeSelector = document.getElementById('store-selector');
    const sevenElevenPresetsDiv = document.getElementById('seven-eleven-presets');
    const familymartPresetsDiv = document.getElementById('familymart-presets');
    const resultsSection = document.getElementById('results-section');
    const floatingResetBtn = document.getElementById('floating-reset-btn');
    const manualMin = document.getElementById('manual-min');
    const manualSec = document.getElementById('manual-sec');
    const manualCalculateBtn = document.getElementById('manual-calculate-btn');
    const minPicker = document.getElementById('picker-min');
    const secPicker = document.getElementById('picker-sec');

    // --- Data: Total Energy Maps (Watts * Seconds) ---
    const ENERGY_MAPS = {
        '7-eleven': {
            '2': 700 * 40, '3': 700 * 52, '4': 700 * 70, '5': 700 * 80,
            '6': 700 * 120, '8': 700 * 225, '9': 700 * 188, '0': 700 * 283,
            '5+1': 700 * 117,
            '8+2': 700 * 265,
            '1': 10 * 980, // Placeholder
            '7': 110 * 980, // Placeholder
        },
        'familymart': {
            '1': 700 * 12,
            '2': 700 * 36,
            '3': 700 * 46,
            '4': 700 * 62,
            '5': 700 * 71,
            '6': 700 * 120,
            '7': 700 * 150,
            '8': 700 * 200,
            '9': 700 * 167,
            '0': 700 * 252,
            '8+2': 700 * 236,
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
        manualMin.value = '0';
        manualSec.value = '0';
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
        
        totalEnergyCache = ENERGY_MAPS[activeStore][clickedBtn.dataset.value] || 0;
        calculateAndDisplay(clickedBtn.dataset.value);
    }

    // Calculates and displays the results
    function calculateAndDisplay(selectedValue) {
        const totalEnergy = ENERGY_MAPS[activeStore][selectedValue];
        if (!totalEnergy) {
            alert('找不到對應的能量數據！');
            return;
        }
        calculateFromEnergy(totalEnergy);
    }

    // Calculates home microwave times from a given total energy (Watts * Seconds)
    function calculateFromEnergy(totalEnergy) {
        // Safety clamp: reject negative / absurd input
        if (totalEnergy <= 0) {
            alert('請輸入大於 0 的時間。');
            return;
        }

        resultsSection.querySelectorAll('.card-title').forEach(el => {
            el.innerHTML = '0 秒';
        });

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

    // Calculates home microwave times from a manual time (minutes + seconds)
    function calculateFromMinutesSeconds(minutes, seconds) {
        const totalSeconds = minutes * 60 + seconds;
        const totalEnergy = 700 * totalSeconds;
        calculateFromEnergy(totalEnergy);
    }

    // Fires the manual input calculation using the fields' current values
    function handleManualCalculation() {
        const minutes = Math.max(0, parseInt(manualMin.value, 10) || 0);
        const seconds = Math.max(0, parseInt(manualSec.value, 10) || 0);
        calculateFromMinutesSeconds(minutes, seconds);
    }

    // Sets manual fields to the current store's 700W time and calculates
    function fillManualWithCurrent() {
        const activeBtn = document.querySelector('.preset-btn.active');
        if (!activeBtn) {
            alert('請先選擇一個快捷按鈕。');
            return;
        }
        totalEnergyCache = ENERGY_MAPS[activeStore][activeBtn.dataset.value] || 0;
        const totalSeconds = totalEnergyCache / 700;
        manualMin.value = Math.floor(totalSeconds / 60);
        manualSec.value = Math.round(totalSeconds % 60);
        calculateFromMinutesSeconds(parseInt(manualMin.value, 10) || 0, Math.round(totalSeconds % 60));
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
    manualCalculateBtn.addEventListener('click', handleManualCalculation);

    // Allow Enter key in manual fields to trigger calculation
    [manualMin, manualSec].forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleManualCalculation();
            }
        });
    });

    // --- Manual Scroller Picker (phone-first) ---
    // Minutes 0..10, Seconds 0..60 stepped by 10 (10 秒 one tick).
    const MIN_VALUES = Array.from({ length: 11 }, (_, i) => i);
    const SEC_VALUES = [0, 10, 20, 30, 40, 50, 60];

    let minVal = 0;
    let secVal = 0;

    function buildPicker(container) {
        const list = container.querySelector('.manual-picker-list');
        const field = container.dataset.field;
        const values = field === 'min' ? MIN_VALUES : SEC_VALUES;
        values.forEach(value => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'manual-picker-item';
            item.dataset.value = value;
            item.setAttribute('role', 'option');
            item.textContent = field === 'min' ? `${value} 分` : `${value} 秒`;
            list.appendChild(item);
        });
    }

    function markActive(container, item) {
        container.querySelectorAll('.manual-picker-item').forEach(el =>
            el.classList.toggle('active', el === item)
        );
    }

    // Update JS state + active class synchronously (NO scroll here).
    // NOTE: selecting does NOT calculate — only the 換算 button runs the calc.
    function commit(container, value) {
        const field = container.dataset.field;
        if (field === 'min') { minVal = value; } else { secVal = value; }
        manualMin.value = String(minVal);
        manualSec.value = String(secVal);
        const list = container.querySelector('.manual-picker-list');
        const item = list.querySelector(`.manual-picker-item[data-value="${value}"]`);
        if (item) markActive(container, item);
    }

    // Touch / momentum scroll: pick the item nearest viewport center.
    function settleByScroll(container) {
        const list = container.querySelector('.manual-picker-list');
        const vh = container.offsetHeight;
        const rowH = list.firstElementChild.getBoundingClientRect().height;
        const center = list.scrollTop + vh / 2;
        let best = null;
        let bestDist = Infinity;
        container.querySelectorAll('.manual-picker-item').forEach(el => {
            const dist = Math.abs((el.offsetTop + rowH / 2) - center);
            if (dist < bestDist) { bestDist = dist; best = el; }
        });
        if (!best) return;
        commit(container, parseInt(best.dataset.value, 10));
    }

    function attachPicker(container) {
        buildPicker(container);

        // Set to true only when WE change scrollTop (edge-anchored center),
        // so the resulting 'scroll' event doesn't re-derive and clobber the
        // selection the user just made by clicking / tapping / arrow-keying.
        let programmaticScroll = false;

        const list = container.querySelector('.manual-picker-list');
        // Default (value 0) sits naturally at scrollTop 0 — mark it active
        // WITHOUT scrolling so the initial build fires no 'scroll' event.
        const first = container.querySelector('.manual-picker-item');
        if (first) first.classList.add('active');

        // Touch / momentum scroll (the inner list is the scroll container).
        list.addEventListener('scroll', () => {
            if (programmaticScroll) { programmaticScroll = false; return; }
            settleByScroll(container);
        }, { passive: true });

        // Mouse wheel: jump one row at a time (on the scroll container itself).
        list.addEventListener('wheel', (e) => {
            e.preventDefault();
            programmaticScroll = false; // user gesture: re-derive below
            list.scrollTop += e.deltaY < 0 ? -48 : 48;
            settleByScroll(container);
        }, { passive: false });

        // Click / tap an item: select it exactly, then scroll it to its valid
        // (edge-anchored) position. Selection is final — the scroll event below
        // is suppressed via programmaticScroll so it won't pick a neighbor.
        container.addEventListener('click', (e) => {
            const item = e.target.closest('.manual-picker-item');
            if (!item) return;
            commit(container, parseInt(item.dataset.value, 10));
            const vh = container.offsetHeight;
            const rowH = list.firstElementChild.getBoundingClientRect().height;
            const maxScroll = Math.max(0, list.scrollHeight - vh);
            const target = Math.max(0, Math.min(item.offsetTop - (vh - rowH) / 2, maxScroll));
            programmaticScroll = true;
            list.scrollTop = target;
        }, { passive: false });

        // Arrow keys for keyboard users.
        container.addEventListener('keydown', (e) => {
            const items = [...container.querySelectorAll('.manual-picker-item')];
            const active = container.querySelector('.manual-picker-item.active');
            const idx = items.indexOf(active);
            if (idx < 0) return;
            let next;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                next = Math.min(idx + 1, items.length - 1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                next = Math.max(idx - 1, 0);
            } else return;
            const item = items[next];
            item.focus();
            commit(container, parseInt(item.dataset.value, 10));
            const vh = container.offsetHeight;
            const rowH = list.firstElementChild.getBoundingClientRect().height;
            const maxScroll = Math.max(0, list.scrollHeight - vh);
            const target = Math.max(0, Math.min(item.offsetTop - (vh - rowH) / 2, maxScroll));
            programmaticScroll = true;
            list.scrollTop = target;
        });
    }

    // Initialise both columns (no calculation until the user interacts).
    attachPicker(minPicker);
    attachPicker(secPicker);
});

