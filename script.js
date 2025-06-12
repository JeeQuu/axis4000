// Audio Context and Setup
let audioContext;
let reverbNode;
let reverbGainNode;
let dryGainNode;
let masterGainNode;

// Zone configurations
const zoneConfigs = [
    { id: 'zone-counter', label: '🎵 Countermelody', audio: 'https://www.dropbox.com/scl/fi/lj8zpomf6p5emopzx4gcs/countermelody.mp3?rlkey=4ru6vm80wpls5xr4xi5e2vb3y&raw=1', cursor: 'cursor-coffee' },
    { id: 'zone-diva-01', label: '🎤 Diva 01', audio: 'https://www.dropbox.com/scl/fi/hxvg0zz3n9i2xyl3lvlfz/diva_lead_dry_01.mp3?rlkey=0fjtp18naubeuuvjri6i9y2bu&raw=1', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-02', label: '🎤 Diva 02', audio: 'https://www.dropbox.com/scl/fi/zb21t7gu9uv6h561p1eko/diva_lead_dry_02.mp3?rlkey=lgc79hefw6wvs8wk587smwcdk&raw=1', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-03', label: '🎤 Diva 03', audio: 'https://www.dropbox.com/scl/fi/juhp6wry7y0hfvwir03qk/diva_lead_dry_03.mp3?rlkey=j4xsm200wz8lu5q6d97zl6zh9&raw=1', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-04', label: '🎤 Diva 04', audio: 'https://www.dropbox.com/scl/fi/3p3vybbpati0eminjgyms/diva_lead_dry_04.mp3?rlkey=usmbyrd9iawutfzxambspg2ox&raw=1', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-05', label: '🎤 Diva 05', audio: 'https://www.dropbox.com/scl/fi/t257qxrk5gd56o7moja7t/diva_lead_dry_05.mp3?rlkey=extu09bwjapldsnwusjbrtm4z&raw=1', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-06', label: '🎤 Diva 06', audio: 'https://www.dropbox.com/scl/fi/16p35qrf1o3lzfma5uqom/diva_lead_dry_06.mp3?rlkey=5aiilg2d4nw3dn6y6xjc1rv3u&raw=1', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-07', label: '🎤 Diva 07', audio: 'https://www.dropbox.com/scl/fi/sf9328sl39ar2yxr9s07i/diva_lead_dry_07.mp3?rlkey=a0afxofsgruxzyn4lp9c1v3dm&raw=1', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-08', label: '🎤 Diva 08', audio: 'https://www.dropbox.com/scl/fi/x2df9nbdvtxlt6b5cto5x/diva_lead_dry_08.mp3?rlkey=wbg9izbics336zgumuz7gaxc0&raw=1', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-09', label: '🎤 Diva 09', audio: 'https://www.dropbox.com/scl/fi/s765bdnohfoj71zrv14k9/diva_lead_dry_09.mp3?rlkey=agsi1doff77xmanyrg0ajum23&raw=1', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-diva-10', label: '🎤 Diva 10', audio: 'https://www.dropbox.com/scl/fi/1aqcr14fnn3ioe1veyr3m/diva_lead_dry_10.mp3?rlkey=vxpheur2bf3dva3e6r4m4r2hh&raw=1', cursor: 'cursor-sunflower', reverb: true },
    { id: 'zone-moog-01', label: '🎸 Moog 01', audio: 'https://www.dropbox.com/scl/fi/xeoikxt4ykuivzcf25j4q/moog_bass_0101.mp3?rlkey=um9njh5rkijj89ltxlve0dpu0&raw=1', cursor: 'cursor-extinguisher' },
    { id: 'zone-moog-02', label: '🎸 Moog 02', audio: 'https://www.dropbox.com/scl/fi/fqgumuyffpuoug5flkcsj/moog_bass_0102.mp3?rlkey=bxpxl13dmpax88vqpi382y9z1&raw=1', cursor: 'cursor-extinguisher' },
    { id: 'zone-moog-03', label: '🎸 Moog 03', audio: 'https://www.dropbox.com/scl/fi/e7r024cokmpzoxi3aktmt/moog_bass_0103.mp3?rlkey=29znkr252hb6fqoe2w3p1k30m&raw=1', cursor: 'cursor-extinguisher' },
    { id: 'zone-moog-04', label: '🎸 Moog 04', audio: 'https://www.dropbox.com/scl/fi/sgrg4p0cgknlxsjld2lfm/moog_bass_0104.mp3?rlkey=ujyqm15n2p78papctoqv3p66g&raw=1', cursor: 'cursor-extinguisher' },
    { id: 'zone-moog-05', label: '🎸 Moog 05', audio: 'https://www.dropbox.com/scl/fi/qndgzt9af7z7exhlrejdu/moog_bass_0105.mp3?rlkey=6bm1czhstxcstame0un2dktyo&raw=1', cursor: 'cursor-extinguisher' },
    { id: 'zone-noise', label: '💥 Noise Splash', audio: 'https://www.dropbox.com/scl/fi/bw33aehefilfq374izg4i/noise_splash.mp3?rlkey=lfjg6hppo3jm5mde0pcsm7drc&raw=1', cursor: 'cursor-tennis' }
];

// Loop configurations
const loopConfigs = [
    { id: 'loop-backing', audio: 'https://www.dropbox.com/scl/fi/xsel03thtidcp6on2lk4u/MUSIC_BACKING12jun.mp3?rlkey=m4zcybpahcau106i74y2p83j6&raw=1' },
    { id: 'loop-diva', audio: 'https://www.dropbox.com/scl/fi/7sgs0seprabvo3b43150m/STEM_DIVA_LEAD12jun.mp3?rlkey=hf77ywrgxdo1ba93nin9jwcvj&raw=1' },
    { id: 'loop-moog', audio: 'https://www.dropbox.com/scl/fi/ntnauj18hf6e3oc9uq720/STEM_MOOGBASS12jun.mp3?rlkey=v9y2ppddngt8xl99oxm8n4knr&raw=1' },
    { id: 'loop-noise', audio: 'https://www.dropbox.com/scl/fi/oit4grsofcty43zoaplui/STEM_NOISE_COUNTER12jun.mp3?rlkey=nv58wsia1005va4zkkygcwx9g&raw=1' }
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