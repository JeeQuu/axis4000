// Audio Context and Setup
let audioContext;
let reverbNode;
let reverbGainNode;
let dryGainNode;
let masterGainNode;

// Zone configurations
const zoneConfigs = [
    { id: 'zone-counter', label: '🎵 Countermelody', audio: './audio/zones/countermelody.mp3', cursor: 'cursor-coffee' },
    { id: 'zone-diva-01', label: '🎤 Diva 01', audio: './audio/zones/diva_lead_dry_01.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-02', label: '🎤 Diva 02', audio: './audio/zones/diva_lead_dry_02.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-03', label: '🎤 Diva 03', audio: './audio/zones/diva_lead_dry_03.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-04', label: '🎤 Diva 04', audio: './audio/zones/diva_lead_dry_04.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-05', label: '🎤 Diva 05', audio: './audio/zones/diva_lead_dry_05.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-06', label: '🎤 Diva 06', audio: './audio/zones/diva_lead_dry_06.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-07', label: '🎤 Diva 07', audio: './audio/zones/diva_lead_dry_07.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-08', label: '🎤 Diva 08', audio: './audio/zones/diva_lead_dry_08.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-09', label: '🎤 Diva 09', audio: './audio/zones/diva_lead_dry_09.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-10', label: '🎤 Diva 10', audio: './audio/zones/diva_lead_dry_10.mp3', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-moog-01', label: '🎸 Moog 01', audio: './audio/zones/moog_bass_0101.mp3', cursor: 'cursor-extinguisher' },
    { id: 'zone-moog-02', label: '🎸 Moog 02', audio: './audio/zones/moog_bass_0102.mp3', cursor: 'cursor-extinguisher' },
    { id: 'zone-moog-03', label: '🎸 Moog 03', audio: './audio/zones/moog_bass_0103.mp3', cursor: 'cursor-extinguisher' },
    { id: 'zone-moog-04', label: '🎸 Moog 04', audio: './audio/zones/moog_bass_0104.mp3', cursor: 'cursor-extinguisher' },
    { id: 'zone-moog-05', label: '🎸 Moog 05', audio: './audio/zones/moog_bass_0105.mp3', cursor: 'cursor-extinguisher' },
    { id: 'zone-noise', label: '💥 Noise Splash', audio: './audio/zones/noise_splash.mp3', cursor: 'cursor-tennis' }
];

// Loop configurations
const loopConfigs = [
    { id: 'loop-backing', audio: './audio/loops/MUSIC_BACKING_12jun.mp3' },
    { id: 'loop-diva', audio: './audio/loops/STEM_DIVA_LEAD_12jun.mp3' },
    { id: 'loop-moog', audio: './audio/loops/STEM_MOOGBASS_12jun.mp3' },
    { id: 'loop-noise', audio: './audio/loops/STEM_NOISE_COUNTER_12jun.mp3' }
];

// State management
const zones = new Map();
const loops = new Map();
let triggerMode = 'oneshot';
let trackingLag = 100;
let draggedZone = null;
let resizingZone = null;
let mouseTrackingTimeout = null;
let lastMousePosition = { x: 0, y: 0 };

// Initialize on start button click
document.getElementById('startButton').addEventListener('click', async () => {
    await initializeAudio();
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    initializeZones();
    initializeLoops();
    setupEventListeners();
});

// Initialize Audio Context and Effects
async function initializeAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create master gain
    masterGainNode = audioContext.createGain();
    masterGainNode.connect(audioContext.destination);
    
    // Create reverb using ConvolverNode
    reverbNode = audioContext.createConvolver();
    
    // Create impulse response for reverb
    const length = audioContext.sampleRate * 2; // 2 second reverb
    const impulse = audioContext.createBuffer(2, length, audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
        }
    }
    
    reverbNode.buffer = impulse;
    
    // Create wet/dry mix
    reverbGainNode = audioContext.createGain();
    reverbGainNode.gain.value = 0.3;
    dryGainNode = audioContext.createGain();
    dryGainNode.gain.value = 0.7;
    
    reverbNode.connect(reverbGainNode);
    reverbGainNode.connect(masterGainNode);
    dryGainNode.connect(masterGainNode);
}

// Create audio buffer source
async function createAudioSource(url, loop = false) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = loop;
    
    const gainNode = audioContext.createGain();
    source.connect(gainNode);
    
    return { source, gainNode };
}

// Initialize zones
function initializeZones() {
    const cameras = document.querySelectorAll('.camera-screen');
    const template = document.getElementById('zoneTemplate');
    
    zoneConfigs.forEach((config, index) => {
        const zone = template.content.cloneNode(true);
        const zoneElement = zone.querySelector('.detection-zone');
        
        zoneElement.id = config.id;
        zoneElement.querySelector('.zone-label').textContent = config.label;
        
        // Distribute zones across cameras
        const cameraIndex = index % 4;
        const camera = cameras[cameraIndex];
        
        // Position zones in a grid within each camera
        const zonesPerCamera = Math.ceil(zoneConfigs.length / 4);
        const positionInCamera = Math.floor(index / 4);
        
        zoneElement.style.left = `${20 + (positionInCamera % 2) * 150}px`;
        zoneElement.style.top = `${50 + Math.floor(positionInCamera / 2) * 100}px`;
        zoneElement.style.width = '120px';
        zoneElement.style.height = '80px';
        
        camera.appendChild(zoneElement);
        
        // Store zone data
        zones.set(config.id, {
            element: zoneElement,
            config: config,
            audioSource: null,
            isPlaying: false,
            camera: cameraIndex + 1
        });
        
        setupZoneInteractions(zoneElement, config);
    });
}

// Initialize loops
async function initializeLoops() {
    for (const config of loopConfigs) {
        const checkbox = document.getElementById(config.id);
        const { source, gainNode } = await createAudioSource(config.audio, true);
        
        gainNode.connect(masterGainNode);
        
        loops.set(config.id, {
            source,
            gainNode,
            checkbox,
            isPlaying: checkbox.checked
        });
        
        if (checkbox.checked) {
            source.start();
        }
        
        checkbox.addEventListener('change', (e) => {
            const loop = loops.get(config.id);
            if (e.target.checked && !loop.isPlaying) {
                startLoop(config.id);
            } else if (!e.target.checked && loop.isPlaying) {
                stopLoop(config.id);
            }
        });
    }
}

// Start loop
async function startLoop(loopId) {
    const loop = loops.get(loopId);
    const config = loopConfigs.find(c => c.id === loopId);
    
    const { source, gainNode } = await createAudioSource(config.audio, true);
    gainNode.connect(masterGainNode);
    
    loop.source = source;
    loop.gainNode = gainNode;
    loop.isPlaying = true;
    
    source.start();
    loops.set(loopId, loop);
}

// Stop loop
function stopLoop(loopId) {
    const loop = loops.get(loopId);
    if (loop.source) {
        loop.source.stop();
        loop.isPlaying = false;
    }
}

// Setup zone interactions
function setupZoneInteractions(zoneElement, config) {
    let isMouseDown = false;
    
    // Mouse enter/leave for cursor change
    zoneElement.addEventListener('mouseenter', () => {
        if (!draggedZone && !resizingZone) {
            document.body.className = config.cursor;
        }
    });
    
    zoneElement.addEventListener('mouseleave', () => {
        document.body.className = '';
        if (triggerMode === 'hold') {
            stopZoneWithFade(config.id);
        }
    });
    
    // Click/Hold handling
    zoneElement.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('zone-resize-handle')) return;
        
        isMouseDown = true;
        
        // Simulate tracking lag
        setTimeout(() => {
            if (isMouseDown) {
                triggerZone(config.id);
            }
        }, trackingLag);
    });
    
    zoneElement.addEventListener('mouseup', () => {
        isMouseDown = false;
        if (triggerMode === 'hold') {
            stopZoneWithFade(config.id);
        }
    });
    
    // Drag handling
    zoneElement.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('zone-resize-handle')) return;
        draggedZone = zoneElement;
        zoneElement.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    });
    
    zoneElement.addEventListener('dragend', () => {
        zoneElement.classList.remove('dragging');
        draggedZone = null;
    });
    
    // Resize handling
    const resizeHandle = zoneElement.querySelector('.zone-resize-handle');
    resizeHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        resizingZone = zoneElement;
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = zoneElement.offsetWidth;
        const startHeight = zoneElement.offsetHeight;
        
        function handleResize(e) {
            if (!resizingZone) return;
            
            const newWidth = Math.max(100, startWidth + (e.clientX - startX));
            const newHeight = Math.max(60, startHeight + (e.clientY - startY));
            
            resizingZone.style.width = `${newWidth}px`;
            resizingZone.style.height = `${newHeight}px`;
        }
        
        function stopResize() {
            resizingZone = null;
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', stopResize);
        }
        
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
    });
}

// Trigger zone audio
async function triggerZone(zoneId) {
    const zone = zones.get(zoneId);
    if (!zone || zone.isPlaying) return;
    
    zone.element.classList.add('active');
    
    // Stop previous audio if in oneshot mode
    if (triggerMode === 'oneshot' && zone.audioSource) {
        zone.audioSource.source.stop();
    }
    
    const { source, gainNode } = await createAudioSource(zone.config.audio);
    
    // Connect to reverb if needed
    if (zone.config.reverb) {
        gainNode.connect(reverbNode);
        gainNode.connect(dryGainNode);
    } else {
        gainNode.connect(masterGainNode);
    }
    
    zone.audioSource = { source, gainNode };
    zone.isPlaying = true;
    
    source.start();
    
    source.onended = () => {
        zone.isPlaying = false;
        zone.element.classList.remove('active');
    };
}

// Stop zone with fade
function stopZoneWithFade(zoneId) {
    const zone = zones.get(zoneId);
    if (!zone || !zone.isPlaying || !zone.audioSource) return;
    
    const { gainNode, source } = zone.audioSource;
    
    // Fade out over 200ms
    gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
    
    setTimeout(() => {
        source.stop();
        zone.isPlaying = false;
        zone.element.classList.remove('active');
    }, 200);
}

// Setup camera drop zones
function setupCameraDropZones() {
    const cameras = document.querySelectorAll('.camera-screen');
    
    cameras.forEach((camera) => {
        camera.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        camera.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!draggedZone) return;
            
            const rect = camera.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Update position
            draggedZone.style.left = `${Math.max(0, x - draggedZone.offsetWidth / 2)}px`;
            draggedZone.style.top = `${Math.max(0, y - draggedZone.offsetHeight / 2)}px`;
            
            // Move to new camera
            camera.appendChild(draggedZone);
            
            // Update zone camera reference
            const zoneId = draggedZone.id;
            const zone = zones.get(zoneId);
            if (zone) {
                zone.camera = parseInt(camera.parentElement.dataset.camera);
            }
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    setupCameraDropZones();
    
    // Trigger mode toggle
    document.querySelectorAll('input[name="triggerMode"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            triggerMode = e.target.value;
        });
    });
    
    // Reverb controls
    const reverbMixSlider = document.getElementById('reverbMix');
    const reverbMixValue = document.getElementById('reverbMixValue');
    
    reverbMixSlider.addEventListener('input', (e) => {
        const mix = e.target.value / 100;
        reverbGainNode.gain.value = mix;
        dryGainNode.gain.value = 1 - mix;
        reverbMixValue.textContent = `${e.target.value}%`;
    });
    
    // Reverb length control
    const reverbLengthSlider = document.getElementById('reverbLength');
    const reverbLengthValue = document.getElementById('reverbLengthValue');
    
    reverbLengthSlider.addEventListener('input', async (e) => {
        const length = parseFloat(e.target.value);
        reverbLengthValue.textContent = `${length.toFixed(1)}s`;
        
        // Recreate impulse response with new length
        const sampleLength = audioContext.sampleRate * length;
        const impulse = audioContext.createBuffer(2, sampleLength, audioContext.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < sampleLength; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / sampleLength, 2);
            }
        }
        
        reverbNode.buffer = impulse;
    });
    
    // Tracking lag control
    const trackingLagSlider = document.getElementById('trackingLag');
    const trackingLagValue = document.getElementById('trackingLagValue');
    
    trackingLagSlider.addEventListener('input', (e) => {
        trackingLag = parseInt(e.target.value);
        trackingLagValue.textContent = `${trackingLag}ms`;
    });
    
    // Save/Load layout
    document.getElementById('saveLayout').addEventListener('click', saveLayout);
    document.getElementById('loadLayout').addEventListener('click', loadLayout);
    
    // Mouse tracking for lag simulation
    document.addEventListener('mousemove', (e) => {
        if (mouseTrackingTimeout) {
            clearTimeout(mouseTrackingTimeout);
        }
        
        const deltaX = Math.abs(e.clientX - lastMousePosition.x);
        const deltaY = Math.abs(e.clientY - lastMousePosition.y);
        const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Simulate tracking loss at high speeds
        if (speed > 50 && trackingLag > 0) {
            document.body.style.pointerEvents = 'none';
            
            mouseTrackingTimeout = setTimeout(() => {
                document.body.style.pointerEvents = 'auto';
            }, trackingLag);
        }
        
        lastMousePosition = { x: e.clientX, y: e.clientY };
    });
}

// Save layout to localStorage
function saveLayout() {
    const layout = {
        zones: []
    };
    
    zones.forEach((zone, id) => {
        const element = zone.element;
        const camera = element.parentElement.parentElement.dataset.camera;
        
        layout.zones.push({
            id: id,
            camera: camera,
            left: element.style.left,
            top: element.style.top,
            width: element.style.width,
            height: element.style.height
        });
    });
    
    localStorage.setItem('quantastical-layout', JSON.stringify(layout));
    
    // Visual feedback
    const button = document.getElementById('saveLayout');
    const originalText = button.textContent;
    button.textContent = 'Saved!';
    button.style.backgroundColor = '#22c55e';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 2000);
}

// Load layout from localStorage
function loadLayout() {
    const savedLayout = localStorage.getItem('quantastical-layout');
    if (!savedLayout) {
        alert('No saved layout found');
        return;
    }
    
    const layout = JSON.parse(savedLayout);
    const cameras = document.querySelectorAll('.camera-screen');
    
    layout.zones.forEach(zoneLayout => {
        const zone = zones.get(zoneLayout.id);
        if (!zone) return;
        
        const element = zone.element;
        const targetCamera = cameras[parseInt(zoneLayout.camera) - 1];
        
        if (targetCamera) {
            targetCamera.appendChild(element);
            element.style.left = zoneLayout.left;
            element.style.top = zoneLayout.top;
            element.style.width = zoneLayout.width;
            element.style.height = zoneLayout.height;
            
            zone.camera = parseInt(zoneLayout.camera);
        }
    });
    
    // Visual feedback
    const button = document.getElementById('loadLayout');
    const originalText = button.textContent;
    button.textContent = 'Loaded!';
    button.style.backgroundColor = '#22c55e';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 2000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Space to toggle trigger mode
    if (e.code === 'Space' && !e.target.matches('input')) {
        e.preventDefault();
        const currentMode = document.querySelector('input[name="triggerMode"]:checked').value;
        const newMode = currentMode === 'oneshot' ? 'hold' : 'oneshot';
        document.getElementById(newMode === 'oneshot' ? 'modeOneShot' : 'modeHold').checked = true;
        triggerMode = newMode;
    }
    
    // Number keys 1-4 to toggle loops
    if (e.code >= 'Digit1' && e.code <= 'Digit4') {
        const index = parseInt(e.code.slice(-1)) - 1;
        const checkbox = document.querySelectorAll('.loop-toggle input')[index];
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        }
    }
    
    // S to save layout
    if (e.code === 'KeyS' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        saveLayout();
    }
    
    // L to load layout
    if (e.code === 'KeyL' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        loadLayout();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Ensure zones stay within camera bounds
    zones.forEach(zone => {
        const element = zone.element;
        const camera = element.parentElement;
        if (!camera) return;
        
        const maxX = camera.offsetWidth - element.offsetWidth;
        const maxY = camera.offsetHeight - element.offsetHeight;
        
        const currentX = parseInt(element.style.left) || 0;
        const currentY = parseInt(element.style.top) || 0;
        
        element.style.left = `${Math.min(currentX, Math.max(0, maxX))}px`;
        element.style.top = `${Math.min(currentY, Math.max(0, maxY))}px`;
    });
});