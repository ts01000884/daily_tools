document.addEventListener('DOMContentLoaded', () => {
    const promptElement = document.getElementById('pwa-install-prompt');
    const closeButton = document.getElementById('pwa-prompt-close');

    if (!promptElement || !closeButton) {
        return;
    }

    // --- Detection Logic ---

    // 1. Check if it's an iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // 2. Check if it's running in standalone mode (already a PWA)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;

    // 3. Check if the user has already dismissed the prompt
    const hasDismissed = localStorage.getItem('pwa_prompt_dismissed') === 'true';

    // --- Show or Hide the Prompt ---

    if (isIOS && !isInStandaloneMode && !hasDismissed) {
        // Use a small timeout to ensure the banner transition is visible
        setTimeout(() => {
            promptElement.classList.remove('d-none');
        }, 500);
    }

    // --- Event Listener for the close button ---

    closeButton.addEventListener('click', () => {
        promptElement.classList.add('d-none');
        // Remember the user's choice not to be prompted again
        localStorage.setItem('pwa_prompt_dismissed', 'true');
    });
});
