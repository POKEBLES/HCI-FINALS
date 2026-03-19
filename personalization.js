document.addEventListener('DOMContentLoaded', () => {
    // Select Inputs
    const inputTo = document.getElementById('ecardTo');
    const inputFrom = document.getElementById('ecardFrom');
    const inputOccasion = document.getElementById('ecardOccasion');
    const inputMessage = document.getElementById('ecardMessage');
    const inputTheme = document.getElementById('ecardTheme');
    const inputFont = document.getElementById('ecardFont');
    const inputFontSize = document.getElementById('ecardFontSize');
    const inputFontColor = document.getElementById('ecardFontColor');
    const inputMood = document.getElementById('ecardMood');
    
    // Select Canvas Elements
    const canvas = document.getElementById('ecardCanvas');
    const canvasHeading = document.getElementById('canvasHeading');
    const canvasOccasion = document.getElementById('canvasOccasion');
    const canvasMessage = document.getElementById('canvasMessage');
    const canvasFrom = document.getElementById('canvasFrom');
    const canvasMood = document.getElementById('canvasMood');
    const fontSizeDisplay = document.getElementById('ecardFontSizeValue');

    // 1. Live Text Sync
    const updateText = () => {
        canvasHeading.textContent = `Happy ${inputOccasion.value}, ${inputTo.value}!`;
        canvasOccasion.textContent = `${inputOccasion.value} wishes`;
        canvasMessage.textContent = inputMessage.value;
        canvasFrom.textContent = `From ${inputFrom.value}`;
        canvasMood.textContent = inputMood.value;
    };

    // 2. Style Sync
    const updateStyles = () => {
        // Theme
        canvas.className = `ecard ecard--${inputTheme.value}`;
        
        // Typography
        canvas.style.fontFamily = inputFont.value;
        canvas.style.fontSize = `${inputFontSize.value}px`;
        canvas.style.color = inputFontColor.value;
        fontSizeDisplay.textContent = `${inputFontSize.value}px`;
    };

    // 3. Background Image Handler
    const bgButtons = document.querySelectorAll('.bg-choice');
    bgButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            bgButtons.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            
            const bgUrl = btn.getAttribute('data-bg');
            if (bgUrl === 'none') {
                canvas.style.backgroundImage = 'none';
            } else {
                canvas.style.backgroundImage = `url('${bgUrl}')`;
                canvas.style.backgroundSize = 'cover';
                canvas.style.backgroundBlendMode = 'overlay'; // Makes text legible over images
            }
        });
    });

    // 4. Action Buttons (Toasts)
    const showToast = (msg) => {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    };

    document.getElementById('sendBtn').addEventListener('click', () => showToast('🚀 Card sent successfully!'));
    document.getElementById('scheduleBtn').addEventListener('click', () => showToast('📅 Card scheduled!'));

    // Listeners for all inputs
    [inputTo, inputFrom, inputOccasion, inputMessage, inputMood].forEach(el => {
        el.addEventListener('input', updateText);
    });

    [inputTheme, inputFont, inputFontSize, inputFontColor].forEach(el => {
        el.addEventListener('input', updateStyles);
    });

    // Initialize
    updateText();
    updateStyles();
});