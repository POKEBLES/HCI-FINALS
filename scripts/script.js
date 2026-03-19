function initApp() {
    // --- Shared Elements ---
    const pw = document.getElementById("pw");
    const eye = document.querySelector(".eye");
    const toast = document.getElementById("toast");
    const registerBtn = document.getElementById("registerBtn");
    const profileShortcutTrigger = document.getElementById("profileShortcutTrigger");
    const profileShortcutBtn = document.getElementById("profileShortcutBtn");
  
    // --- Helper Functions ---
    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("toast--show");
        setTimeout(() => toast.classList.remove("toast--show"), 1800);
    }
  
    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
  
    // --- Login / Profile Logic ---
    if (eye && pw) {
        eye.addEventListener("click", () => {
            pw.type = pw.type === "password" ? "text" : "password";
        });
    }
  
    if (registerBtn && toast) {
        registerBtn.addEventListener("click", () => {
            showToast("Account created successfully!");
        });
    }
  
    if (profileShortcutTrigger && profileShortcutBtn) {
        profileShortcutTrigger.addEventListener("click", () => {
            const isHidden = profileShortcutBtn.hasAttribute("hidden");
            if (isHidden) {
                profileShortcutBtn.removeAttribute("hidden");
            } else {
                profileShortcutBtn.setAttribute("hidden", "");
            }
            profileShortcutTrigger.setAttribute("aria-expanded", String(isHidden));
        });
  
        profileShortcutBtn.addEventListener("click", () => {
            window.location.href = "profile.html";
        });
    }
  
    // --- Personalization Page Logic ---
    const personalizationPage = document.querySelector('.personalization-page');

    if (personalizationPage) {
        if (window.__ecardEditorReady) return;
        const ecardCanvas = document.getElementById('ecardCanvas');
        if (!ecardCanvas) return;

        const ecardOccasion = document.getElementById('ecardOccasion');
        const ecardTo = document.getElementById('ecardTo');
        const ecardFrom = document.getElementById('ecardFrom');
        const ecardMessage = document.getElementById('ecardMessage');
        const ecardFontColor = document.getElementById('ecardFontColor');
        const ecardFontSize = document.getElementById('ecardFontSize');
        const ecardTheme = document.getElementById('ecardTheme');
        const ecardEffect = document.getElementById('ecardEffect');
        const ecardSendDate = document.getElementById('ecardSendDate');
        const themeBtns = document.querySelectorAll('.theme-btn');
        const newTextContent = document.getElementById('newTextContent');
        const addTextBoxBtn = document.getElementById('addTextBoxBtn');

        const bgUploadInput = document.getElementById('bgUploadInput');
        const bgChoices = document.querySelectorAll('.bg-choice');
        const stickerBtns = document.querySelectorAll('.sticker-btn');

        const previewBtn = document.getElementById('previewBtn');
        const closePreviewBtn = document.getElementById('closePreviewBtn');
        const previewOverlay = document.getElementById('previewOverlay');
        const previewEnvelope = document.getElementById('previewEnvelope');
        const envelopeCardSlot = document.getElementById('envelopeCardSlot');
        const scheduleBtn = document.getElementById('scheduleBtn');
        const sendBtn = document.getElementById('sendBtn');

        const canvasOccasion = document.getElementById('canvasOccasion');
        const canvasHeading = document.getElementById('canvasHeading');
        const canvasMessage = document.getElementById('canvasMessage');
        const canvasFrom = document.getElementById('canvasFrom');
        const canvasEffect = document.getElementById('canvasEffect');
        const stickerLayer = document.getElementById('stickerLayer');

        const draggableFrom = document.getElementById('draggableFrom');
        const draggableOccasion = document.getElementById('draggableOccasion');
        const draggableHeading = document.getElementById('draggableHeading');
        const draggableMessage = document.getElementById('draggableMessage');

        const fontDropdownBtn = document.getElementById('fontDropdownBtn');
        const fontDropdownMenu = document.getElementById('fontDropdownMenu');
        const currentFontName = document.getElementById('currentFontName');
        const fontOptions = document.querySelectorAll('.font-option');

        const textTargetSelect = document.getElementById('textTargetSelect');
        const textBoldBtn = document.getElementById('textBoldBtn');
        const textItalicBtn = document.getElementById('textItalicBtn');
        const alignLeftBtn = document.getElementById('alignLeftBtn');
        const alignCenterBtn = document.getElementById('alignCenterBtn');
        const alignRightBtn = document.getElementById('alignRightBtn');
        const fontSizeValue = document.getElementById('fontSizeValue');

        const toolBtns = document.querySelectorAll('.tool-btn');
        const toolSections = document.querySelectorAll('.tool-section');
        const zoomSlider = document.querySelector('.zoom-slider');
        const STORAGE_KEY = 'ecard_editor_state_v3';

        let currentScale = 1;
        let saveTimer = null;
        let lockedControlLayerKey = null;
        let customTextCounter = 0;

        const textLayers = {
            heading: canvasHeading,
            message: canvasMessage,
            occasion: canvasOccasion,
            from: canvasFrom
        };

        const wrappers = {
            heading: draggableHeading,
            message: draggableMessage,
            occasion: draggableOccasion,
            from: draggableFrom
        };

        let activeLayerKey = 'heading';
        const restoredState = restoreState();

        wireTabs();
        wireTextInputs();
        wireStyleControls();
        wireFontDropdown();
        wireThemeAndBackground();
        wireStickers();
        wireCustomTextBoxes();
        wireZoom();
        wirePreview();
        wireActions();
        setupDraggables();

        if (previewOverlay) {
            previewOverlay.hidden = true;
            previewOverlay.classList.remove('is-open', 'is-playing');
        }

        updateCanvasText();
        activateTool(restoredState && restoredState.activeTool ? restoredState.activeTool : 'text');
        setActiveLayer(restoredState && restoredState.activeLayer ? restoredState.activeLayer : 'heading');
        syncControlsFromActive();
        window.__ecardEditorReady = true;

        function wireTabs() {
            toolBtns.forEach((btn) => {
                btn.addEventListener('click', () => {
                    const toolId = btn.getAttribute('data-tool');
                    activateTool(toolId || 'text');
                    scheduleSaveState();
                });
            });
        }

        function activateTool(toolId) {
            toolBtns.forEach((b) => b.classList.remove('active'));
            toolSections.forEach((s) => {
                s.classList.remove('active');
                s.style.display = 'none';
            });

            const activeBtn = Array.from(toolBtns).find((b) => b.getAttribute('data-tool') === toolId);
            if (activeBtn) activeBtn.classList.add('active');

            const target = document.getElementById(`tool-${toolId}`);
            if (target) {
                target.classList.add('active');
                target.style.display = 'block';
            }
        }

        function wireTextInputs() {
            if (ecardOccasion) {
                ecardOccasion.addEventListener('change', () => {
                    if (canvasOccasion) canvasOccasion.textContent = getOccasionLabel(ecardOccasion.value);
                    if (canvasHeading) canvasHeading.textContent = getHeadingText(ecardOccasion.value, ecardTo ? ecardTo.value : '');
                    scheduleSaveState();
                });
            }

            if (ecardTo) {
                ecardTo.addEventListener('input', () => {
                    if (canvasHeading) canvasHeading.textContent = getHeadingText(ecardOccasion ? ecardOccasion.value : 'Birthday', ecardTo.value);
                    scheduleSaveState();
                });
            }

            if (ecardFrom) {
                ecardFrom.addEventListener('input', () => {
                    if (canvasFrom) canvasFrom.textContent = `From ${ecardFrom.value}`;
                    scheduleSaveState();
                });
            }

            if (ecardMessage) {
                ecardMessage.addEventListener('input', () => {
                    if (canvasMessage) canvasMessage.textContent = ecardMessage.value;
                    scheduleSaveState();
                });
            }
        }

        function wireStyleControls() {
            if (textTargetSelect) {
                textTargetSelect.addEventListener('change', () => {
                    setActiveLayer(textTargetSelect.value);
                    scheduleSaveState();
                });
            }

            Object.entries(wrappers).forEach(([key, wrapper]) => bindWrapperSelection(key, wrapper));

            if (ecardFontColor) {
                ecardFontColor.addEventListener('pointerdown', () => {
                    lockedControlLayerKey = getFormattingLayerKey();
                });
                ecardFontColor.addEventListener('pointerup', () => {
                    lockedControlLayerKey = null;
                });
                ecardFontColor.addEventListener('pointercancel', () => {
                    lockedControlLayerKey = null;
                });
                ecardFontColor.addEventListener('input', (e) => {
                    const key = lockedControlLayerKey || getFormattingLayerKey();
                    const target = textLayers[key] || getFormattingLayerElement();
                    if (target) target.style.color = e.target.value;
                    scheduleSaveState();
                });
            }

            if (ecardFontSize) {
                ecardFontSize.addEventListener('pointerdown', () => {
                    lockedControlLayerKey = getFormattingLayerKey();
                });
                ecardFontSize.addEventListener('pointerup', () => {
                    lockedControlLayerKey = null;
                });
                ecardFontSize.addEventListener('pointercancel', () => {
                    lockedControlLayerKey = null;
                });
                ecardFontSize.addEventListener('input', (e) => {
                    const px = parseInt(e.target.value, 10);
                    const key = lockedControlLayerKey || getFormattingLayerKey();
                    const target = textLayers[key] || getFormattingLayerElement();
                    if (target && Number.isFinite(px)) target.style.fontSize = `${px}px`;
                    if (fontSizeValue) fontSizeValue.textContent = `Size: ${px}px`;
                    scheduleSaveState();
                });
            }

            if (textBoldBtn) {
                textBoldBtn.addEventListener('click', () => {
                    const target = getFormattingLayerElement();
                    if (!target) return;
                    const weight = window.getComputedStyle(target).fontWeight;
                    const isBold = parseInt(weight, 10) >= 600 || weight === 'bold';
                    target.style.fontWeight = isBold ? '400' : '700';
                    syncControlsFromActive();
                    scheduleSaveState();
                });
            }

            if (textItalicBtn) {
                textItalicBtn.addEventListener('click', () => {
                    const target = getFormattingLayerElement();
                    if (!target) return;
                    const style = window.getComputedStyle(target).fontStyle;
                    target.style.fontStyle = style === 'italic' ? 'normal' : 'italic';
                    syncControlsFromActive();
                    scheduleSaveState();
                });
            }

            if (alignLeftBtn) alignLeftBtn.addEventListener('click', () => {
                setTextAlign('left');
                scheduleSaveState();
            });
            if (alignCenterBtn) alignCenterBtn.addEventListener('click', () => {
                setTextAlign('center');
                scheduleSaveState();
            });
            if (alignRightBtn) alignRightBtn.addEventListener('click', () => {
                setTextAlign('right');
                scheduleSaveState();
            });
        }

        function wireFontDropdown() {
            if (!fontDropdownBtn || !fontDropdownMenu) return;

            fontDropdownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                fontDropdownMenu.classList.toggle('show');
            });

            document.addEventListener('click', () => {
                fontDropdownMenu.classList.remove('show');
            });

            fontOptions.forEach((opt) => {
                opt.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const font = opt.getAttribute('data-font');
                    const target = getFormattingLayerElement();
                    if (target && font) target.style.fontFamily = font;

                    if (currentFontName) {
                        currentFontName.textContent = opt.textContent;
                        if (font) currentFontName.style.fontFamily = font;
                    }

                    fontDropdownMenu.classList.remove('show');
                    scheduleSaveState();
                });
            });
        }

        function wireThemeAndBackground() {
            themeBtns.forEach((btn) => {
                btn.addEventListener('click', () => {
                    themeBtns.forEach((b) => b.classList.remove('active'));
                    btn.classList.add('active');
                    scheduleSaveState();
                });
            });

            if (ecardTheme) {
                ecardTheme.addEventListener('change', () => {
                    const theme = ecardTheme.value;
                    ecardCanvas.classList.remove('ecard--blossom', 'ecard--sunrise', 'ecard--mint', 'ecard--night');
                    ecardCanvas.classList.add(`ecard--${theme}`);
                    setThemeButtonActive(theme);
                    scheduleSaveState();
                });
            }

            if (ecardEffect && canvasEffect) {
                ecardEffect.addEventListener('change', () => {
                    canvasEffect.className = 'ecard__effect-layer';
                    const effect = ecardEffect.value;
                    if (effect !== 'none') canvasEffect.classList.add(`effect-${effect}`);
                    scheduleSaveState();
                });
            }

            if (bgUploadInput) {
                bgUploadInput.addEventListener('change', (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        ecardCanvas.style.backgroundImage = `url('${evt.target.result}')`;
                        ecardCanvas.style.backgroundSize = 'cover';
                        ecardCanvas.style.backgroundPosition = 'center';
                        bgChoices.forEach((b) => b.classList.remove('is-active'));
                        showToast('Background uploaded!');
                        scheduleSaveState();
                    };
                    reader.readAsDataURL(file);
                });
            }

            bgChoices.forEach((btn) => {
                btn.addEventListener('click', () => {
                    bgChoices.forEach((b) => b.classList.remove('is-active'));
                    btn.classList.add('is-active');

                    const bg = btn.getAttribute('data-bg');
                    if (bg === 'none') {
                        ecardCanvas.style.backgroundImage = '';
                    } else {
                        ecardCanvas.style.backgroundImage = `url('${bg}')`;
                        ecardCanvas.style.backgroundSize = 'cover';
                        ecardCanvas.style.backgroundPosition = 'center';
                    }
                    scheduleSaveState();
                });
            });
        }

        function setThemeButtonActive(theme) {
            themeBtns.forEach((b) => {
                b.classList.toggle('active', b.getAttribute('data-value') === theme);
            });
        }

        function wireStickers() {
            stickerBtns.forEach((btn) => {
                btn.addEventListener('click', () => {
                    const char = btn.getAttribute('data-sticker');
                    if (!char) return;
                    const el = document.createElement('div');
                    el.classList.add('draggable-sticker');
                    el.textContent = char;
                    el.style.left = '50%';
                    el.style.top = '50%';
                    el.style.transform = 'translate(-50%, -50%)';
                    stickerLayer.appendChild(el);
                    makeDraggable(el);
                    scheduleSaveState();
                });
            });
        }

        function wireCustomTextBoxes() {
            if (!addTextBoxBtn) return;

            const createFromInput = () => {
                const text = (newTextContent && newTextContent.value ? newTextContent.value : '').trim();
                createCustomTextLayer(text || `New text ${customTextCounter + 1}`);
                if (newTextContent) newTextContent.value = '';
            };

            addTextBoxBtn.addEventListener('click', createFromInput);

            if (newTextContent) {
                newTextContent.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        createFromInput();
                    }
                });
            }
        }

        function createCustomTextLayer(text, keyFromState) {
            if (!ecardCanvas) return null;
            const key = keyFromState || `custom-${++customTextCounter}`;

            const wrapper = document.createElement('div');
            wrapper.className = 'draggable-text';
            wrapper.id = `draggable-${key}`;
            wrapper.style.left = '50%';
            wrapper.style.top = '50%';
            wrapper.style.transform = 'translateX(-50%)';

            const textEl = document.createElement('p');
            textEl.id = `canvas-${key}`;
            textEl.className = 'ecard__message';
            textEl.textContent = text;
            wrapper.appendChild(textEl);

            ecardCanvas.appendChild(wrapper);
            textLayers[key] = textEl;
            wrappers[key] = wrapper;

            if (textTargetSelect) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = `Custom: ${text.slice(0, 18)}`;
                textTargetSelect.appendChild(option);
            }

            bindWrapperSelection(key, wrapper);
            makeDraggable(wrapper);
            setActiveLayer(key);
            scheduleSaveState();
            return { key, wrapper, textEl };
        }

        function bindWrapperSelection(key, wrapper) {
            if (!wrapper) return;
            wrapper.addEventListener('click', (e) => {
                e.stopPropagation();
                setActiveLayer(key);
                scheduleSaveState();
            });
        }

        function wireZoom() {
            if (!zoomSlider) return;

            const applyScale = (value) => {
                currentScale = value;
                ecardCanvas.style.transform = `scale(${value})`;
            };

            applyScale(parseFloat(zoomSlider.value) || 1);

            zoomSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                if (!Number.isFinite(value)) return;
                applyScale(value);
                scheduleSaveState();
            });
        }

        function wirePreview() {
            if (!previewBtn || !previewOverlay || !previewEnvelope || !envelopeCardSlot) return;

            const closePreview = () => {
                previewOverlay.classList.remove('is-playing');
                previewOverlay.classList.remove('is-open');
                setTimeout(() => {
                    previewOverlay.hidden = true;
                    envelopeCardSlot.innerHTML = '';
                }, 220);
            };

            previewBtn.addEventListener('click', () => {
                envelopeCardSlot.innerHTML = '';
                const clone = ecardCanvas.cloneNode(true);
                clone.removeAttribute('id');
                clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
                envelopeCardSlot.appendChild(clone);

                previewOverlay.hidden = false;
                requestAnimationFrame(() => {
                    previewOverlay.classList.add('is-open');
                    requestAnimationFrame(() => {
                        previewOverlay.classList.add('is-playing');
                    });
                });
            });

            if (closePreviewBtn) closePreviewBtn.addEventListener('click', closePreview);
            previewOverlay.addEventListener('click', (e) => {
                if (e.target === previewOverlay) closePreview();
            });
        }

        function wireActions() {
            if (scheduleBtn) {
                scheduleBtn.addEventListener('click', () => {
                    if (!ecardSendDate || !ecardSendDate.value) {
                        showToast('Please select a date.');
                        return;
                    }
                    showToast('Scheduled successfully!');
                });
            }

            if (sendBtn) {
                sendBtn.addEventListener('click', () => {
                    showToast('Card sent successfully! (Demo)');
                });
            }
        }

        function setupDraggables() {
            document.querySelectorAll('.draggable-text').forEach(makeDraggable);
        }

        function updateCanvasText() {
            if (ecardOccasion) ecardOccasion.dispatchEvent(new Event('change'));
            if (ecardMessage) ecardMessage.dispatchEvent(new Event('input'));
            if (ecardFrom) ecardFrom.dispatchEvent(new Event('input'));
        }

        function getOccasionLabel(val) {
            const map = {
                Birthday: 'Birthday wishes',
                Anniversary: 'Anniversary cheer',
                'Thank You': 'Thank you note',
                'Get Well Soon': 'Get well soon',
                Congratulations: 'Congratulations'
            };
            return map[val] || val;
        }

        function getHeadingText(occasion, toName) {
            const name = toName || '...';
            const map = {
                Birthday: `Happy Birthday, ${name}!`,
                Anniversary: `Happy Anniversary, ${name}!`,
                'Thank You': `Thank You, ${name}!`,
                'Get Well Soon': `Get Well Soon, ${name}`,
                Congratulations: `Congratulations, ${name}!`
            };
            return map[occasion] || `${occasion}, ${name}`;
        }

        function setActiveLayer(key) {
            if (!textLayers[key]) return;
            activeLayerKey = key;

            Object.values(wrappers).forEach((box) => {
                if (box) box.classList.remove('is-selected');
            });

            const activeWrapper = wrappers[key];
            if (activeWrapper) activeWrapper.classList.add('is-selected');
            if (textTargetSelect) textTargetSelect.value = key;

            syncControlsFromActive();
        }

        function getActiveLayerElement() {
            return textLayers[activeLayerKey] || textLayers.heading;
        }

        function getFormattingLayerKey() {
            if (textTargetSelect && textLayers[textTargetSelect.value]) return textTargetSelect.value;
            return activeLayerKey;
        }

        function getFormattingLayerElement() {
            return textLayers[getFormattingLayerKey()] || getActiveLayerElement();
        }

        function setTextAlign(align) {
            const target = getFormattingLayerElement();
            if (!target) return;

            const wrapper = target.closest('.draggable-text');
            target.style.textAlign = align;
            if (wrapper) wrapper.style.textAlign = align;

            if (alignLeftBtn) alignLeftBtn.classList.toggle('active', align === 'left');
            if (alignCenterBtn) alignCenterBtn.classList.toggle('active', align === 'center');
            if (alignRightBtn) alignRightBtn.classList.toggle('active', align === 'right');
        }

        function syncControlsFromActive() {
            const target = getActiveLayerElement();
            if (!target) return;

            const styles = window.getComputedStyle(target);
            const size = parseInt(styles.fontSize, 10) || 24;
            if (ecardFontSize) ecardFontSize.value = String(size);
            if (fontSizeValue) fontSizeValue.textContent = `Size: ${size}px`;

            const color = rgbToHex(styles.color);
            if (color && ecardFontColor) ecardFontColor.value = color;

            if (textBoldBtn) {
                const weight = styles.fontWeight;
                const isBold = parseInt(weight, 10) >= 600 || weight === 'bold';
                textBoldBtn.classList.toggle('active', isBold);
            }

            if (textItalicBtn) textItalicBtn.classList.toggle('active', styles.fontStyle === 'italic');
            setTextAlign(styles.textAlign || 'center');

            if (currentFontName) {
                const normalized = normalizeFont(styles.fontFamily);
                const matched = Array.from(fontOptions).find((opt) => {
                    const val = normalizeFont(opt.getAttribute('data-font') || '');
                    return normalized.includes(val.split(',')[0]);
                });
                if (matched) {
                    currentFontName.textContent = matched.textContent;
                    currentFontName.style.fontFamily = matched.getAttribute('data-font') || '';
                } else {
                    currentFontName.textContent = 'Custom Font';
                    currentFontName.style.fontFamily = styles.fontFamily;
                }
            }
        }

        function makeDraggable(el) {
            let isDragging = false;
            let pointerId = null;
            let pointerOffsetX = 0;
            let pointerOffsetY = 0;
            let dragParent = null;

            function resolveLayerKeyFromElement(node) {
                if (!node || !node.id) return null;
                if (node.id === 'draggableHeading') return 'heading';
                if (node.id === 'draggableMessage') return 'message';
                if (node.id === 'draggableOccasion') return 'occasion';
                if (node.id === 'draggableFrom') return 'from';
                return null;
            }

            const handleWindowBlur = () => {
                if (isDragging) dragEnd();
            };

            el.style.touchAction = 'none';
            el.addEventListener('pointerdown', dragStart);
            window.addEventListener('blur', handleWindowBlur);

            function dragStart(e) {
                if (e.pointerType === 'mouse' && e.button !== 0) return;

                // Selection must happen before drag to ensure side-panel edits target this box.
                const selectedKey = resolveLayerKeyFromElement(el);
                if (selectedKey) {
                    setActiveLayer(selectedKey);
                    scheduleSaveState();
                }

                e.preventDefault();

                dragParent = el.offsetParent;
                if (!dragParent) return;

                const rect = el.getBoundingClientRect();
                const parentRect = dragParent.getBoundingClientRect();
                const parentStyle = window.getComputedStyle(dragParent);
                const borderLeft = parseFloat(parentStyle.borderLeftWidth) || 0;
                const borderTop = parseFloat(parentStyle.borderTopWidth) || 0;

                const visualLeft = (rect.left - parentRect.left) - borderLeft;
                const visualTop = (rect.top - parentRect.top) - borderTop;

                el.style.position = 'absolute';
                el.style.left = `${visualLeft / currentScale}px`;
                el.style.top = `${visualTop / currentScale}px`;
                el.style.transform = 'none';

                pointerOffsetX = (e.clientX - rect.left) / currentScale;
                pointerOffsetY = (e.clientY - rect.top) / currentScale;

                isDragging = true;
                pointerId = e.pointerId;
                el.classList.add('dragging');
                el.style.zIndex = '1000';

                if (el.setPointerCapture) el.setPointerCapture(pointerId);
                el.addEventListener('lostpointercapture', dragEnd, { once: true });

                document.addEventListener('pointermove', dragMove);
                document.addEventListener('pointerup', dragEnd);
                document.addEventListener('pointercancel', dragEnd);
            }

            function dragMove(e) {
                if (!isDragging || e.pointerId !== pointerId || !dragParent) return;
                e.preventDefault();

                const parentRect = dragParent.getBoundingClientRect();
                const parentStyle = window.getComputedStyle(dragParent);
                const borderLeft = parseFloat(parentStyle.borderLeftWidth) || 0;
                const borderTop = parseFloat(parentStyle.borderTopWidth) || 0;

                const cssX = ((e.clientX - parentRect.left) - borderLeft) / currentScale;
                const cssY = ((e.clientY - parentRect.top) - borderTop) / currentScale;

                el.style.left = `${cssX - pointerOffsetX}px`;
                el.style.top = `${cssY - pointerOffsetY}px`;
            }

            function dragEnd(e) {
                if (!isDragging) return;
                if (e && typeof e.pointerId === 'number' && e.pointerId !== pointerId) return;

                isDragging = false;
                el.classList.remove('dragging');
                el.style.zIndex = '';

                if (el.releasePointerCapture && pointerId !== null && el.hasPointerCapture(pointerId)) {
                    el.releasePointerCapture(pointerId);
                }

                pointerId = null;
                document.removeEventListener('pointermove', dragMove);
                document.removeEventListener('pointerup', dragEnd);
                document.removeEventListener('pointercancel', dragEnd);
                scheduleSaveState();
            }
        }

        function scheduleSaveState() {
            if (saveTimer) clearTimeout(saveTimer);
            saveTimer = setTimeout(saveState, 120);
        }

        function saveState() {
            try {
                const customTextboxes = Object.keys(textLayers)
                    .filter((key) => key.startsWith('custom-'))
                    .map((key) => ({
                        key,
                        text: textLayers[key] ? textLayers[key].textContent : '',
                        layerStyle: textLayers[key] ? textLayers[key].style.cssText : '',
                        wrapperStyle: wrappers[key] ? wrappers[key].style.cssText : ''
                    }));

                const state = {
                    activeTool: getActiveTool(),
                    activeLayer: activeLayerKey,
                    scale: currentScale,
                    inputs: {
                        occasion: ecardOccasion ? ecardOccasion.value : '',
                        to: ecardTo ? ecardTo.value : '',
                        from: ecardFrom ? ecardFrom.value : '',
                        message: ecardMessage ? ecardMessage.value : '',
                        theme: ecardTheme ? ecardTheme.value : ''
                    },
                    canvasStyles: {
                        backgroundImage: ecardCanvas.style.backgroundImage || '',
                        backgroundSize: ecardCanvas.style.backgroundSize || '',
                        backgroundPosition: ecardCanvas.style.backgroundPosition || ''
                    },
                    layers: Object.fromEntries(Object.entries(textLayers).map(([k, el]) => [k, el ? el.style.cssText : ''])),
                    wrappers: Object.fromEntries(Object.entries(wrappers).map(([k, el]) => [k, el ? el.style.cssText : ''])),
                    customTextboxes
                };

                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            } catch (err) {
                // ignore persistence issues (private mode/storage blocked)
            }
        }

        function restoreState() {
            try {
                const raw = window.localStorage.getItem(STORAGE_KEY);
                if (!raw) return null;
                const state = JSON.parse(raw);

                if (state.inputs) {
                    if (ecardOccasion && state.inputs.occasion) ecardOccasion.value = state.inputs.occasion;
                    if (ecardTo && typeof state.inputs.to === 'string') ecardTo.value = state.inputs.to;
                    if (ecardFrom && typeof state.inputs.from === 'string') ecardFrom.value = state.inputs.from;
                    if (ecardMessage && typeof state.inputs.message === 'string') ecardMessage.value = state.inputs.message;
                    if (ecardTheme && state.inputs.theme) ecardTheme.value = state.inputs.theme;
                }

                if (state.canvasStyles) {
                    ecardCanvas.style.backgroundImage = state.canvasStyles.backgroundImage || '';
                    ecardCanvas.style.backgroundSize = state.canvasStyles.backgroundSize || '';
                    ecardCanvas.style.backgroundPosition = state.canvasStyles.backgroundPosition || '';
                }

                if (Array.isArray(state.customTextboxes)) {
                    state.customTextboxes.forEach((entry) => {
                        const created = createCustomTextLayer(entry.text || 'New text', entry.key);
                        if (!created) return;
                        if (entry.layerStyle) created.textEl.style.cssText = entry.layerStyle;
                        if (entry.wrapperStyle) created.wrapper.style.cssText = entry.wrapperStyle;
                    });
                    customTextCounter = Math.max(
                        customTextCounter,
                        ...state.customTextboxes
                            .map((entry) => parseInt(String(entry.key || '').replace('custom-', ''), 10))
                            .filter((n) => Number.isFinite(n))
                    );
                }

                if (state.layers) {
                    Object.entries(state.layers).forEach(([k, cssText]) => {
                        if (textLayers[k] && cssText) textLayers[k].style.cssText = cssText;
                    });
                }

                if (state.wrappers) {
                    Object.entries(state.wrappers).forEach(([k, cssText]) => {
                        if (wrappers[k] && cssText) wrappers[k].style.cssText = cssText;
                    });

                    // Guard against stale oversized widths from older drag logic.
                    Object.values(wrappers).forEach((wrapper) => {
                        if (!wrapper) return;
                        wrapper.style.pointerEvents = 'auto';
                        wrapper.style.width = 'fit-content';
                        wrapper.style.maxWidth = '90%';
                    });
                }

                if (typeof state.scale === 'number' && Number.isFinite(state.scale)) {
                    currentScale = state.scale;
                    if (zoomSlider) zoomSlider.value = String(state.scale);
                    ecardCanvas.style.transform = `scale(${state.scale})`;
                }

                if (state.inputs && state.inputs.theme) {
                    ecardCanvas.classList.remove('ecard--blossom', 'ecard--sunrise', 'ecard--mint', 'ecard--night');
                    ecardCanvas.classList.add(`ecard--${state.inputs.theme}`);
                    setThemeButtonActive(state.inputs.theme);
                }

                return state;
            } catch (err) {
                return null;
            }
        }

        function getActiveTool() {
            const activeBtn = Array.from(toolBtns).find((btn) => btn.classList.contains('active'));
            return activeBtn ? activeBtn.getAttribute('data-tool') : 'text';
        }

        function normalizeFont(value) {
            return String(value || '')
                .toLowerCase()
                .replace(/"/g, '')
                .replace(/'/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        }

        function rgbToHex(color) {
            const match = color && color.match(/\d+/g);
            if (!match || match.length < 3) return null;
            const [r, g, b] = match.map((v) => parseInt(v, 10));
            const toHex = (v) => v.toString(16).padStart(2, '0');
            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

window.addEventListener('pageshow', () => {
    initApp();
});
