/**
 * ==========================================================================
 * TaskFlow — Cute Pinterest Aesthetic & Cozy Task Manager Application Logic
 * InternCircle Virtual Internship — Project 2
 * Author: Upasana Kudape
 * 
 * CORE DEMONSTRATIONS:
 * 1. State Management & Data Structures
 * 2. LocalStorage Persistence (CRUD + Export / Import)
 * 3. Event Delegation & Keyboard Event Listeners (Enter, Esc, /, N, T, S, ?)
 * 4. DOM Manipulation (Dynamic rendering, element creation, class toggles)
 * 5. Web Audio API synthesized kalimba & chime feedback (Offline, zero dependency)
 * 6. Native Canvas Particle Confetti in Warm Pastel Colors
 * ==========================================================================
 */

'use strict';

// ==========================================================================
// 1. DEFAULT DATA & STATE (Pinterest Warm Aesthetic)
// ==========================================================================

const STORAGE_KEY = 'taskflow_cozy_tasks_v1';
const THEME_KEY = 'taskflow_theme_cozy';
const SOUND_KEY = 'taskflow_sound_enabled';

// Cute Pinterest motivational quotes rotation
const MOTIVATIONAL_QUOTES = [
  '"make today wonderfully cozy & productive ☕"',
  '"every little step counts, beautiful soul 🌸"',
  '"progress over perfection, always ✨"',
  '"drink some warm tea, breathe deeply, and bloom 🌷"',
  '"romanticize your daily to-do list 🥐"',
  '"you\'re doing so much better than you think 🧸"',
  '"little daily wins turn into big blooming dreams 🌿"'
];

function getRelativeDateString(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Sample default tasks to showcase features with cute girly photos & diary entries
const DEFAULT_SAMPLE_TASKS = [
  {
    id: 'task_demo_1',
    title: 'Finish Project 2 & write cute weekly reflection journal 🎀',
    completed: true,
    priority: 'urgent',
    category: 'work',
    dueDate: getRelativeDateString(0), // Today
    note: 'Planned out weekly milestones with vanilla candle glowing and soft lofi beats. Feeling super peaceful, proud, and accomplished today! 🎀',
    image: 'assets/diary_desk.jpg',
    imageCaption: 'my cozy study desk & journaling stationery ✨',
    mood: '✨ Inspired',
    sticker: '🎀',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'task_demo_2',
    title: 'Cafe study session with iced strawberry matcha latte 🍵',
    completed: false,
    priority: 'high',
    category: 'study',
    dueDate: getRelativeDateString(1), // Tomorrow
    note: 'Found the sweetest aesthetic cafe! Reviewing JavaScript DOM manipulation and LocalStorage persistence patterns while sipping strawberry matcha. 🌸',
    image: 'assets/strawberry_latte.jpg',
    imageCaption: 'sweet strawberry matcha moments 🍓',
    mood: '🌸 Happy',
    sticker: '🍓',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'task_demo_3',
    title: 'Celebrate internship milestones with strawberry shortcake 🍰',
    completed: false,
    priority: 'medium',
    category: 'personal',
    dueDate: getRelativeDateString(2),
    note: 'A little sweet treat reward for completing Project 2 with flying colors! The pink ribbon decor was so adorable. 🍰',
    image: 'assets/strawberry_cake.jpg',
    imageCaption: 'sweet victory strawberry cake 💖',
    mood: '🍓 Sweet',
    sticker: '🍰',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'task_demo_4',
    title: 'Sunset evening walk & drink fresh herbal berry tea 🌷',
    completed: false,
    priority: 'low',
    category: 'health',
    dueDate: getRelativeDateString(0),
    note: 'Remember to stay hydrated and take deep, relaxing breaths! Cozy little victories every single day. 🧸',
    image: '',
    imageCaption: '',
    mood: '🧸 Cozy',
    sticker: '🧸',
    createdAt: new Date().toISOString()
  }
];

// Additional storage key
const VIEW_MODE_KEY = 'taskflow_view_mode';

// Available cute themes in cycling order
const CUTE_THEMES = ['light', 'buttercream', 'lavender', 'dark'];
const THEME_INFO = {
  light: { name: 'Strawberry Milk 🍓', emoji: '🍓' },
  buttercream: { name: 'Warm Buttercream 🥐', emoji: '🥐' },
  lavender: { name: 'Lavender Dream 💜', emoji: '💜' },
  dark: { name: 'Cozy Mocha ☕', emoji: '☕' }
};

// Global Application State (defaults to cute girly Strawberry Milk light theme)
const state = {
  tasks: [],
  filter: {
    status: 'all',    // 'all' | 'active' | 'completed'
    category: 'all',  // 'all' | 'photos' | 'work' | 'study' | 'personal' | 'health' | 'finance' | 'other'
    search: '',
    sort: 'date-newest'
  },
  viewMode: 'list',   // 'list' | 'diary'
  soundEnabled: true,
  theme: 'light',     // Default to Ultra Cute Girly Strawberry Pink!
  lastDeletedTask: null,
  toastTimeout: null
};

// ==========================================================================
// 2. DOM CACHE
// ==========================================================================

const dom = {
  // Brand & Header
  currentDateTime: document.getElementById('current-date-time'),
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  themeEmojiIcon: document.getElementById('theme-emoji-icon'),
  soundToggleBtn: document.getElementById('sound-toggle-btn'),
  iconSoundOn: document.querySelector('.icon-sound-on'),
  iconSoundOff: document.querySelector('.icon-sound-off'),
  shortcutsModalBtn: document.getElementById('shortcuts-modal-btn'),

  // Hero & Stats
  greetingTitle: document.getElementById('greeting-title'),
  greetingBadge: document.getElementById('greeting-badge'),
  motivationalQuote: document.getElementById('motivational-quote'),
  progressCircleBar: document.getElementById('progress-circle-bar'),
  progressPercentage: document.getElementById('progress-percentage'),
  progressStatusText: document.getElementById('progress-status-text'),
  statTotal: document.getElementById('stat-total'),
  statPending: document.getElementById('stat-pending'),
  statCompleted: document.getElementById('stat-completed'),
  statOverdue: document.getElementById('stat-overdue'),

  // New Task Form
  newTaskForm: document.getElementById('new-task-form'),
  taskTitleInput: document.getElementById('task-title-input'),
  taskPrioritySelect: document.getElementById('task-priority-select'),
  taskCategorySelect: document.getElementById('task-category-select'),
  taskDueDateInput: document.getElementById('task-due-date-input'),
  quickDateChips: document.querySelectorAll('.chip-btn'),

  // Diary Drawer in New Task Form
  toggleDiaryDrawerBtn: document.getElementById('toggle-diary-drawer-btn'),
  newTaskDiaryDrawer: document.getElementById('new-task-diary-drawer'),
  taskNoteInput: document.getElementById('task-note-input'),
  taskPhotoUpload: document.getElementById('task-photo-upload'),
  taskPhotoData: document.getElementById('task-photo-data'),
  newPhotoPreviewWrap: document.getElementById('new-photo-preview-wrap'),
  newPhotoPreviewImg: document.getElementById('new-photo-preview-img'),
  newPhotoPreviewCaption: document.getElementById('new-photo-preview-caption'),
  removeNewPhotoBtn: document.getElementById('remove-new-photo-btn'),
  presetPhotoBtns: document.querySelectorAll('.preset-btn'),
  taskMoodSelect: document.getElementById('task-mood-select'),
  taskStickerSelect: document.getElementById('task-sticker-select'),

  // Toolbar
  searchInput: document.getElementById('search-input'),
  clearSearchBtn: document.getElementById('clear-search-btn'),
  statusTabs: document.querySelectorAll('.status-tab'),
  countAll: document.getElementById('count-all'),
  countActive: document.getElementById('count-active'),
  countCompleted: document.getElementById('count-completed'),
  categoryFilterContainer: document.getElementById('category-filter-container'),
  sortSelect: document.getElementById('sort-select'),

  // View Mode Switcher
  viewModeListBtn: document.getElementById('view-mode-list'),
  viewModeDiaryBtn: document.getElementById('view-mode-diary'),

  // Batch Menu
  batchMenuBtn: document.getElementById('batch-menu-btn'),
  batchMenuDropdown: document.getElementById('batch-menu-dropdown'),
  btnMarkAllDone: document.getElementById('btn-mark-all-done'),
  btnClearCompleted: document.getElementById('btn-clear-completed'),
  btnExportTasks: document.getElementById('btn-export-tasks'),
  btnImportTasksTrigger: document.getElementById('btn-import-tasks-trigger'),
  importFileInput: document.getElementById('import-file-input'),
  btnResetDemo: document.getElementById('btn-reset-demo'),

  // Task List & Empty State
  taskList: document.getElementById('task-list'),
  emptyState: document.getElementById('empty-state'),
  emptyCreateBtn: document.getElementById('empty-create-btn'),

  // Modals
  editModal: document.getElementById('edit-modal'),
  editTaskForm: document.getElementById('edit-task-form'),
  editTaskId: document.getElementById('edit-task-id'),
  editTitleInput: document.getElementById('edit-title-input'),
  editPrioritySelect: document.getElementById('edit-priority-select'),
  editCategorySelect: document.getElementById('edit-category-select'),
  editDueDateInput: document.getElementById('edit-due-date-input'),
  editMoodSelect: document.getElementById('edit-mood-select'),
  editNoteInput: document.getElementById('edit-note-input'),
  editPhotoUpload: document.getElementById('edit-photo-upload'),
  editPhotoData: document.getElementById('edit-photo-data'),
  editPhotoPreviewWrap: document.getElementById('edit-photo-preview-wrap'),
  editPhotoPreviewImg: document.getElementById('edit-photo-preview-img'),
  removeEditPhotoBtn: document.getElementById('remove-edit-photo-btn'),
  editPresetBtns: document.querySelectorAll('.edit-preset-btn'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  modalCancelBtn: document.getElementById('modal-cancel-btn'),

  // Photo Zoom Lightbox Modal
  photoZoomModal: document.getElementById('photo-zoom-modal'),
  photoZoomCloseBtn: document.getElementById('photo-zoom-close-btn'),
  photoZoomImg: document.getElementById('photo-zoom-img'),
  zoomTitle: document.getElementById('zoom-title'),
  zoomMoodBadge: document.getElementById('zoom-mood-badge'),
  zoomCaption: document.getElementById('zoom-caption'),
  zoomDate: document.getElementById('zoom-date'),

  shortcutsModal: document.getElementById('shortcuts-modal'),
  shortcutsCloseBtn: document.getElementById('shortcuts-close-btn'),
  shortcutsOkBtn: document.getElementById('shortcuts-ok-btn'),

  // Toast
  toastContainer: document.getElementById('toast-container'),

  // Canvas
  confettiCanvas: document.getElementById('confetti-canvas')
};

// ==========================================================================
// 3. SOUND SYNTHESIS ENGINE (Warm Kalimba & Gentle Fairy Chimes)
// ==========================================================================

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'add') {
      // Gentle warm kalimba pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);

    } else if (type === 'complete') {
      // Cute ascending fairy chime
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.12, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.28);
      });

    } else if (type === 'delete') {
      // Gentle wooden tap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);

    } else if (type === 'click') {
      // Sweet soft drop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, now);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (err) {
    console.warn('Audio playback inhibited by browser policy:', err);
  }
}

// ==========================================================================
// 4. CONFETTI CELEBRATION ENGINE (Warm Pastel Palette)
// ==========================================================================

let confettiParticles = [];
let confettiAnimationId = null;

function fireConfetti(duration = 2200) {
  const canvas = dom.confettiCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Warm Pinterest Palette Confetti: Peach, Strawberry, Matcha, Honey, Lavender, Rose
  const colors = ['#e07a5f', '#f4a261', '#f28482', '#81b29a', '#e9c46a', '#ffb5a7', '#fad2e1'];
  const particleCount = 75;

  for (let i = 0; i < particleCount; i++) {
    confettiParticles.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 220,
      y: window.innerHeight * 0.45,
      radius: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 11,
      vy: (Math.random() - 1.2) * 11,
      gravity: 0.32,
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 9,
      alpha: 1
    });
  }

  const startTime = Date.now();

  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId);
  }

  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elapsed = Date.now() - startTime;

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vRotation;
      p.alpha = Math.max(0, 1 - elapsed / duration);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 1.5);
      ctx.restore();

      if (p.y > canvas.height || p.alpha <= 0) {
        confettiParticles.splice(i, 1);
      }
    }

    if (confettiParticles.length > 0) {
      confettiAnimationId = requestAnimationFrame(renderConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiAnimationId = null;
    }
  }

  confettiAnimationId = requestAnimationFrame(renderConfetti);
}

// ==========================================================================
// 4.5 IMAGE COMPRESSION & OPTIMIZATION (Prevent LocalStorage Quota Exceed)
// ==========================================================================

/**
 * Compress and downscale uploaded photo to keep within LocalStorage quota
 * @param {File} file - Raw File from input[type=file]
 * @param {number} maxWidth - Maximum width in pixels (e.g. 720)
 * @param {number} maxHeight - Maximum height in pixels (e.g. 720)
 * @param {number} quality - JPEG compression quality (0.0 to 1.0)
 * @returns {Promise<string>} Base64 data URL
 */
function compressImageFile(file, maxWidth = 720, maxHeight = 720, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Selected file must be an image'));
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// ==========================================================================
// 5. LOCALSTORAGE MANAGEMENT & PERSISTENCE
// ==========================================================================

function loadStateFromStorage() {
  try {
    // 1. Tasks
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (storedTasks) {
      const parsed = JSON.parse(storedTasks);
      state.tasks = Array.isArray(parsed) ? parsed : [];
    } else {
      // First run: load default sample tasks
      state.tasks = [...DEFAULT_SAMPLE_TASKS];
      saveTasksToStorage();
    }

    // 2. Theme (Default to Ultra Cute Girly Strawberry Milk)
    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme && CUTE_THEMES.includes(storedTheme)) {
      state.theme = storedTheme;
    } else {
      state.theme = 'light';
    }
    applyTheme(state.theme);

    // 3. View Mode (Compact List vs Scrapbook Polaroid Grid)
    const storedViewMode = localStorage.getItem(VIEW_MODE_KEY);
    if (storedViewMode === 'diary' || storedViewMode === 'list') {
      state.viewMode = storedViewMode;
    } else {
      state.viewMode = 'list';
    }
    applyViewModeUI(state.viewMode);

    // 4. Sound
    const storedSound = localStorage.getItem(SOUND_KEY);
    if (storedSound !== null) {
      state.soundEnabled = storedSound === 'true';
    }
    updateSoundUI();

  } catch (err) {
    console.error('Error reading from localStorage:', err);
    state.tasks = [...DEFAULT_SAMPLE_TASKS];
  }
}

function saveTasksToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage:', err);
    showToast('Storage quota reached! Try removing some photos 🌸', 'warning');
  }
}

function saveThemeToStorage(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.warn('Could not save theme preference:', err);
  }
}

function saveViewModeToStorage(mode) {
  try {
    localStorage.setItem(VIEW_MODE_KEY, mode);
  } catch (err) {
    console.warn('Could not save view mode preference:', err);
  }
}

function saveSoundToStorage(enabled) {
  try {
    localStorage.setItem(SOUND_KEY, enabled.toString());
  } catch (err) {
    console.warn('Could not save sound preference:', err);
  }
}

// ==========================================================================
// 6. TASK CRUD OPERATIONS
// ==========================================================================

/**
 * Add a new task to state and persist
 */
function addTask(title, priority = 'medium', category = 'work', dueDate = '', note = '', image = '', imageCaption = '', mood = '🌸 Happy', sticker = '🎀') {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return;

  const newTask = {
    id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    title: trimmedTitle,
    completed: false,
    priority: priority || 'medium',
    category: category || 'work',
    dueDate: dueDate || '',
    note: (note || '').trim(),
    image: image || '',
    imageCaption: (imageCaption || "today's memory ✨").trim(),
    mood: mood || '🌸 Happy',
    sticker: sticker || '🎀',
    createdAt: new Date().toISOString()
  };

  // Prepend to show immediately at the top
  state.tasks.unshift(newTask);
  saveTasksToStorage();
  renderApp();
  playSound('add');
  showToast(`Goal added: "${trimmedTitle.slice(0, 24)}${trimmedTitle.length > 24 ? '...' : ''}" 🌸`, 'success');
}

/**
 * Toggle task completion status
 */
function toggleTaskCompletion(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  task.completed = !task.completed;
  saveTasksToStorage();
  renderApp();

  if (task.completed) {
    playSound('complete');
    
    // Check if ALL active tasks are now completed
    const pendingCount = state.tasks.filter(t => !t.completed).length;
    if (pendingCount === 0 && state.tasks.length > 0) {
      fireConfetti(3500);
      showToast('🎉 Yay! All tasks completed! You are amazing 💖', 'success');
    } else if (task.priority === 'urgent') {
      fireConfetti(1800);
      showToast('🍓 Berry urgent task completed! ✨', 'success');
    }
  } else {
    playSound('click');
  }
}

/**
 * Delete a task with animated exit and Undo capability
 */
function deleteTask(taskId) {
  const taskIndex = state.tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return;

  const taskElement = document.querySelector(`.task-item[data-id="${taskId}"]`);
  const deletedTask = state.tasks[taskIndex];
  state.lastDeletedTask = { task: deletedTask, index: taskIndex };

  playSound('delete');

  if (taskElement) {
    taskElement.classList.add('exiting');
    setTimeout(() => {
      state.tasks.splice(taskIndex, 1);
      saveTasksToStorage();
      renderApp();
      showToast(`Removed "${deletedTask.title.slice(0, 24)}..."`, 'info', true);
    }, 280);
  } else {
    state.tasks.splice(taskIndex, 1);
    saveTasksToStorage();
    renderApp();
    showToast(`Removed task`, 'info', true);
  }
}

/**
 * Undo the last deleted task
 */
function undoDelete() {
  if (!state.lastDeletedTask) return;

  const { task, index } = state.lastDeletedTask;
  state.tasks.splice(index, 0, task);
  state.lastDeletedTask = null;

  saveTasksToStorage();
  renderApp();
  playSound('add');
  showToast('Task restored! 🌸', 'success');
}

/**
 * Update an existing task's details
 */
function updateTask(id, newTitle, newPriority, newCategory, newDueDate, newNote = '', newImage = '', newMood = '🌸 Happy') {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;

  task.title = newTitle.trim();
  task.priority = newPriority;
  task.category = newCategory;
  task.dueDate = newDueDate;
  task.note = (newNote || '').trim();
  task.image = newImage || '';
  task.mood = newMood || '🌸 Happy';

  saveTasksToStorage();
  renderApp();
  playSound('add');
  showToast('Task updated successfully ✨', 'success');
}

/**
 * Mark all visible tasks as done
 */
function markAllTasksDone() {
  let modified = false;
  state.tasks.forEach(t => {
    if (!t.completed) {
      t.completed = true;
      modified = true;
    }
  });

  if (modified) {
    saveTasksToStorage();
    renderApp();
    playSound('complete');
    fireConfetti(2500);
    showToast('All tasks marked as completed! 💖', 'success');
  } else {
    showToast('All tasks are already completed 🌸', 'info');
  }
}

/**
 * Clear all completed tasks
 */
function clearCompletedTasks() {
  const initialLength = state.tasks.length;
  state.tasks = state.tasks.filter(t => !t.completed);

  if (state.tasks.length < initialLength) {
    saveTasksToStorage();
    renderApp();
    playSound('delete');
    showToast(`Removed ${initialLength - state.tasks.length} completed tasks 🧹`, 'info');
  } else {
    showToast('No completed tasks to remove ☕', 'info');
  }
}

/**
 * Reset / restore demo tasks
 */
function resetToDemoData() {
  state.tasks = JSON.parse(JSON.stringify(DEFAULT_SAMPLE_TASKS));
  saveTasksToStorage();
  renderApp();
  playSound('add');
  showToast('Cute sample tasks reloaded 🌸', 'success');
}

// ==========================================================================
// 7. FILTERING, SEARCHING & SORTING
// ==========================================================================

function getFilteredAndSortedTasks() {
  let list = [...state.tasks];

  // 1. Status Filter
  if (state.filter.status === 'active') {
    list = list.filter(t => !t.completed);
  } else if (state.filter.status === 'completed') {
    list = list.filter(t => t.completed);
  }

  // 2. Category Filter
  if (state.filter.category === 'photos') {
    list = list.filter(t => Boolean(t.image && t.image.trim()));
  } else if (state.filter.category !== 'all') {
    list = list.filter(t => t.category === state.filter.category);
  }

  // 3. Search Filter (Matches Title, Category, Priority, Note, or Mood)
  if (state.filter.search.trim()) {
    const q = state.filter.search.trim().toLowerCase();
    list = list.filter(t => 
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.priority.toLowerCase().includes(q) ||
      (t.note && t.note.toLowerCase().includes(q)) ||
      (t.mood && t.mood.toLowerCase().includes(q))
    );
  }

  // 4. Sorting
  const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };

  list.sort((a, b) => {
    switch (state.filter.sort) {
      case 'date-newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'date-oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'due-date':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'priority':
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      case 'alpha':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return list;
}

// ==========================================================================
// 8. DOM RENDERING & UI UPDATES
// ==========================================================================

function renderApp() {
  renderStatsAndProgress();
  renderTaskList();
  renderFilterCounts();
}

/**
 * Render dashboard stats, progress ring, and greeting
 */
function renderStatsAndProgress() {
  const total = state.tasks.length;
  const completed = state.tasks.filter(t => t.completed).length;
  const pending = total - completed;

  // Calculate overdue tasks
  const todayStr = getRelativeDateString(0);
  const overdue = state.tasks.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr).length;

  // Update Stat Numbers
  dom.statTotal.textContent = total;
  dom.statCompleted.textContent = completed;
  dom.statPending.textContent = pending;
  dom.statOverdue.textContent = overdue;

  // Update Progress Ring (r=38, circumference = 2 * PI * 38 ≈ 238.76)
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  dom.progressPercentage.textContent = `${percentage}%`;
  dom.progressStatusText.textContent = `${completed} of ${total} goals done`;

  const circumference = 238.76;
  const offset = circumference - (percentage / 100) * circumference;
  dom.progressCircleBar.style.strokeDashoffset = offset;

  // Change ring color when 100% completed
  if (percentage === 100 && total > 0) {
    dom.progressCircleBar.style.stroke = 'var(--color-urgent)';
  } else {
    dom.progressCircleBar.style.stroke = 'var(--primary-accent)';
  }

  // Dynamic Cute Greeting based on progress
  if (total === 0) {
    dom.greetingBadge.textContent = '✨ fresh start';
    dom.greetingTitle.textContent = 'ready for a cozy, peaceful day.';
  } else if (percentage === 100) {
    dom.greetingBadge.textContent = '💖 all goals completed!';
    dom.greetingTitle.textContent = 'you bloomed so wonderfully today! treat yourself 🥐';
  } else if (percentage >= 50) {
    dom.greetingBadge.textContent = '🌷 blooming nicely!';
    dom.greetingTitle.textContent = 'halfway there! you are doing so well, darling ✨';
  } else {
    dom.greetingBadge.textContent = '🌸 cozy focus mode';
    dom.greetingTitle.textContent = 'one gentle step at a time, you got this!';
  }
}

/**
 * Render the task items list or empty state
 */
function renderTaskList() {
  const visibleTasks = getFilteredAndSortedTasks();
  dom.taskList.innerHTML = '';

  // Synchronize view mode classes — always set both to keep CSS clean
  const isDiary = state.viewMode === 'diary';
  dom.taskList.classList.toggle('view-diary', isDiary);
  dom.taskList.classList.toggle('view-list', !isDiary);

  if (visibleTasks.length === 0) {
    dom.emptyState.style.display = 'flex';
    dom.taskList.style.display = 'none';

    if (state.filter.search.trim()) {
      dom.emptyState.querySelector('.empty-title').textContent = 'No matching tasks found';
      dom.emptyState.querySelector('.empty-subtitle').textContent = `No little goals matched "${state.filter.search}". Try clearing the search or checking another tag!`;
    } else if (state.filter.category === 'photos') {
      dom.emptyState.querySelector('.empty-title').textContent = 'No photo diary entries yet 📷';
      dom.emptyState.querySelector('.empty-subtitle').textContent = 'Attach polaroids or presets when adding tasks to create a cute photo memory scrapbook!';
    } else if (state.filter.status === 'completed') {
      dom.emptyState.querySelector('.empty-title').textContent = 'No completed tasks yet 🌸';
      dom.emptyState.querySelector('.empty-subtitle').textContent = 'Check off your goals above to see them bloom here!';
    } else {
      dom.emptyState.querySelector('.empty-title').textContent = 'All tasks completed or none found! 🌷';
      dom.emptyState.querySelector('.empty-subtitle').textContent = 'Take a cozy sip of tea or add a new little goal above ✨';
    }
    return;
  }

  dom.emptyState.style.display = 'none';
  // Explicitly set the correct display so inline style never blocks CSS classes
  dom.taskList.style.display = isDiary ? 'grid' : 'flex';

  const fragment = document.createDocumentFragment();

  visibleTasks.forEach(task => {
    const li = createTaskElement(task);
    fragment.appendChild(li);
  });

  dom.taskList.appendChild(fragment);
}

/**
 * Create an individual task item DOM node supporting both List and Diary Scrapbook views
 */
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item ${task.completed ? 'completed' : ''}`;
  li.dataset.id = task.id;
  li.dataset.priority = task.priority;
  li.draggable = true;

  // Cute Category labels
  const categoryLabels = {
    work: '💼 Work & Career',
    study: '📚 Study & Code',
    personal: '🧸 Self Care',
    health: '🍵 Health & Matcha',
    finance: '🥐 Daily Budget',
    other: '📌 Little Notes'
  };

  // Cute Priority labels
  const priorityLabels = {
    urgent: '🍓 Berry Urgent',
    high: '🍑 Peach High',
    medium: '🍯 Warm Honey',
    low: '🍵 Matcha Low'
  };

  // Format Due Date Badge
  let dueDateBadge = '';
  if (task.dueDate) {
    const todayStr = getRelativeDateString(0);
    const tomorrowStr = getRelativeDateString(1);
    let dateText = task.dueDate;
    let extraClass = '';

    if (task.dueDate < todayStr && !task.completed) {
      dateText = `⏰ Overdue (${formatDisplayDate(task.dueDate)})`;
      extraClass = 'overdue';
    } else if (task.dueDate === todayStr) {
      dateText = '🌸 Today';
      extraClass = 'today';
    } else if (task.dueDate === tomorrowStr) {
      dateText = '🥐 Tomorrow';
    } else {
      dateText = `📅 ${formatDisplayDate(task.dueDate)}`;
    }

    dueDateBadge = `<span class="meta-badge badge-due-date ${extraClass}">${dateText}</span>`;
  }

  // Highlight search matches in title
  let displayTitle = escapeHtml(task.title);
  if (state.filter.search.trim()) {
    const regex = new RegExp(`(${escapeRegExp(state.filter.search.trim())})`, 'gi');
    displayTitle = displayTitle.replace(regex, '<mark style="background: rgba(244, 162, 97, 0.4); color: inherit; padding: 0 3px; border-radius: 4px;">$1</mark>');
  }

  // Common Heart Checkbox HTML
  const heartCheckboxHtml = `
    <label class="custom-checkbox-wrapper" title="${task.completed ? 'Mark pending' : 'Mark complete'}">
      <input type="checkbox" class="task-checkbox-input" ${task.completed ? 'checked' : ''} aria-label="Mark task complete" />
      <span class="checkbox-visual" aria-hidden="true">
        <span class="check-heart-emoji">💖</span>
        <svg class="check-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
    </label>
  `;

  // Common Action Buttons (Edit & Delete)
  const actionButtonsHtml = `
    <div class="task-actions">
      <button class="action-icon-btn btn-edit" title="Edit task details" aria-label="Edit task">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
      <button class="action-icon-btn btn-delete" title="Delete task" aria-label="Delete task">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  `;

  // ==========================================
  // VIEW MODE: DIARY & POLAROID SCRAPBOOK
  // ==========================================
  if (state.viewMode === 'diary') {
    let photoBlock = '';
    if (task.image) {
      photoBlock = `
        <div class="scrapbook-photo-wrap">
          <div class="scrapbook-polaroid" data-task-id="${task.id}" title="Click to view full memory ✨">
            <img src="${task.image}" class="scrapbook-img" alt="${escapeHtml(task.title)}" loading="lazy" />
            <span class="scrapbook-polaroid-caption">${escapeHtml(task.imageCaption || "today's memory ✨")}</span>
          </div>
        </div>
      `;
    }

    let noteBlock = '';
    if (task.note) {
      noteBlock = `
        <div class="scrapbook-note-box">
          "${escapeHtml(task.note)}"
        </div>
      `;
    }

    li.innerHTML = `
      <div class="scrapbook-card-tape" aria-hidden="true"></div>
      ${photoBlock}
      <div class="scrapbook-header-row">
        <span class="scrapbook-mood-sticker">${task.sticker || '🎀'} ${escapeHtml(task.mood || '🌸 Happy')}</span>
        <span class="meta-badge badge-priority-${task.priority}">
          ${priorityLabels[task.priority] || task.priority}
        </span>
      </div>
      <div style="display: flex; align-items: flex-start; gap: 0.65rem; width: 100%;">
        ${heartCheckboxHtml}
        <span class="task-text" title="Double click to edit">${displayTitle}</span>
      </div>
      ${noteBlock}
      <div class="scrapbook-bottom-bar">
        <div class="task-meta-row" style="margin-top: 0;">
          <span class="meta-badge badge-cat-${task.category}">
            ${categoryLabels[task.category] || task.category}
          </span>
          ${dueDateBadge}
        </div>
        ${actionButtonsHtml}
      </div>
    `;
    return li;
  }

  // ==========================================
  // VIEW MODE: COMPACT LIST
  // ==========================================
  let polaroidInlineBlock = '';
  if (task.image) {
    polaroidInlineBlock = `
      <div class="task-polaroid-inline" data-task-id="${task.id}" title="Click to view photo memory ✨">
        <div class="polaroid-mini-card">
          <div class="polaroid-mini-tape" aria-hidden="true"></div>
          <img src="${task.image}" alt="${escapeHtml(task.title)}" loading="lazy" />
        </div>
        <span class="polaroid-click-hint">📸 ${escapeHtml(task.imageCaption || 'view memory')}</span>
      </div>
    `;
  }

  let diaryNotePreviewBlock = '';
  if (task.note) {
    diaryNotePreviewBlock = `
      <div class="task-diary-preview">
        <span class="diary-preview-note-text">"${escapeHtml(task.note)}"</span>
      </div>
    `;
  }

  let moodBadge = '';
  if (task.mood) {
    moodBadge = `<span class="meta-badge badge-mood">${task.sticker || '🎀'} ${escapeHtml(task.mood)}</span>`;
  }

  li.innerHTML = `
    <!-- Drag Handle -->
    <div class="drag-handle" title="Drag to reorder" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="12" r="1"></circle>
        <circle cx="9" cy="5" r="1"></circle>
        <circle cx="9" cy="19" r="1"></circle>
        <circle cx="15" cy="12" r="1"></circle>
        <circle cx="15" cy="5" r="1"></circle>
        <circle cx="15" cy="19" r="1"></circle>
      </svg>
    </div>

    <!-- Heart Checkbox -->
    ${heartCheckboxHtml}

    <!-- Task Content & Metadata -->
    <div class="task-content">
      <div class="task-main-row">
        <span class="task-text" title="Double click to edit">${displayTitle}</span>
      </div>
      ${polaroidInlineBlock}
      ${diaryNotePreviewBlock}
      <div class="task-meta-row">
        <span class="meta-badge badge-priority-${task.priority}">
          ${priorityLabels[task.priority] || task.priority}
        </span>
        <span class="meta-badge badge-cat-${task.category}">
          ${categoryLabels[task.category] || task.category}
        </span>
        ${dueDateBadge}
        ${moodBadge}
      </div>
    </div>

    <!-- Task Actions -->
    ${actionButtonsHtml}
  `;

  return li;
}

/**
 * Update tab counter badges (All, Active, Completed)
 */
function renderFilterCounts() {
  const total = state.tasks.length;
  const active = state.tasks.filter(t => !t.completed).length;
  const completed = total - active;

  dom.countAll.textContent = total;
  dom.countActive.textContent = active;
  dom.countCompleted.textContent = completed;
}

// ==========================================================================
// 9. THEME & VIEW MODE CONTROLS
// ==========================================================================

function applyTheme(theme) {
  if (!CUTE_THEMES.includes(theme)) theme = 'light';
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  if (dom.themeEmojiIcon) {
    dom.themeEmojiIcon.textContent = THEME_INFO[theme]?.emoji || '🍓';
  }
  saveThemeToStorage(theme);
}

function cycleTheme() {
  const currentIndex = CUTE_THEMES.indexOf(state.theme);
  const nextIndex = (currentIndex + 1) % CUTE_THEMES.length;
  const newTheme = CUTE_THEMES[nextIndex];
  applyTheme(newTheme);
  playSound('click');
  showToast(`Theme: ${THEME_INFO[newTheme].name} ✨`, 'info');
}

function applyViewModeUI(mode) {
  state.viewMode = mode;
  if (dom.viewModeListBtn && dom.viewModeDiaryBtn) {
    dom.viewModeListBtn.classList.toggle('active', mode === 'list');
    dom.viewModeDiaryBtn.classList.toggle('active', mode === 'diary');
  }
  if (dom.taskList) {
    dom.taskList.classList.toggle('view-diary', mode === 'diary');
    dom.taskList.classList.toggle('view-list', mode !== 'diary');
    // Ensure inline display is also updated
    dom.taskList.style.display = mode === 'diary' ? 'grid' : 'flex';
  }
}

function setViewMode(mode) {
  applyViewModeUI(mode);
  saveViewModeToStorage(mode);
  renderTaskList();
  playSound('click');
  showToast(`Switched to ${mode === 'diary' ? '📖 Cute Diary Scrapbook View' : '📋 List View'} ✨`, 'info');
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  saveSoundToStorage(state.soundEnabled);
  updateSoundUI();
  if (state.soundEnabled) playSound('click');
  showToast(`Cute sound effects ${state.soundEnabled ? 'enabled 🎵' : 'muted 🔕'}`, 'info');
}

function updateSoundUI() {
  if (state.soundEnabled) {
    dom.iconSoundOn.style.display = 'block';
    dom.iconSoundOff.style.display = 'none';
  } else {
    dom.iconSoundOn.style.display = 'none';
    dom.iconSoundOff.style.display = 'block';
  }
}

// ==========================================================================
// 10. MODAL MANAGEMENT & PHOTO LIGHTBOX
// ==========================================================================

function openPhotoZoomModal(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task || !task.image) return;

  dom.photoZoomImg.src = task.image;
  dom.zoomTitle.textContent = task.title;
  dom.zoomMoodBadge.textContent = `${task.sticker || '🎀'} ${task.mood || '🌸 Happy'}`;
  dom.zoomCaption.textContent = task.note ? `"${task.note}"` : (task.imageCaption || "Today's sweet memory ✨");
  dom.zoomDate.textContent = task.dueDate
    ? `📅 Due: ${formatDisplayDate(task.dueDate)}`
    : `✨ Recorded: ${formatDisplayDate(task.createdAt ? task.createdAt.slice(0, 10) : '')}`;

  dom.photoZoomModal.classList.add('open');
  dom.photoZoomModal.setAttribute('aria-hidden', 'false');
  playSound('click');
}

function closePhotoZoomModal() {
  dom.photoZoomModal.classList.remove('open');
  dom.photoZoomModal.setAttribute('aria-hidden', 'true');
}

function openEditModal(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  dom.editTaskId.value = task.id;
  dom.editTitleInput.value = task.title;
  dom.editPrioritySelect.value = task.priority;
  dom.editCategorySelect.value = task.category;
  dom.editDueDateInput.value = task.dueDate || '';
  dom.editMoodSelect.value = task.mood || '🌸 Happy';
  dom.editNoteInput.value = task.note || '';

  // Photo data & preview in edit modal
  dom.editPhotoData.value = task.image || '';
  if (task.image) {
    dom.editPhotoPreviewImg.src = task.image;
    dom.editPhotoPreviewWrap.style.display = 'block';
  } else {
    dom.editPhotoPreviewImg.src = '';
    dom.editPhotoPreviewWrap.style.display = 'none';
  }

  dom.editModal.classList.add('open');
  dom.editModal.setAttribute('aria-hidden', 'false');
  dom.editTitleInput.focus();
}

function closeEditModal() {
  dom.editModal.classList.remove('open');
  dom.editModal.setAttribute('aria-hidden', 'true');
}

function openShortcutsModal() {
  dom.shortcutsModal.classList.add('open');
  dom.shortcutsModal.setAttribute('aria-hidden', 'false');
}

function closeShortcutsModal() {
  dom.shortcutsModal.classList.remove('open');
  dom.shortcutsModal.setAttribute('aria-hidden', 'true');
}

// ==========================================================================
// 11. TOAST NOTIFICATION SYSTEM
// ==========================================================================

function showToast(message, type = 'info', allowUndo = false) {
  dom.toastContainer.innerHTML = '';
  if (state.toastTimeout) {
    clearTimeout(state.toastTimeout);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconSvg = type === 'success'
    ? '<span class="toast-icon">💖</span>'
    : '<span class="toast-icon">🌸</span>';

  let undoButtonHtml = '';
  if (allowUndo) {
    undoButtonHtml = `<button class="toast-undo-btn" id="toast-undo-action">Undo ↩️</button>`;
  }

  toast.innerHTML = `
    ${iconSvg}
    <span class="toast-message">${escapeHtml(message)}</span>
    ${undoButtonHtml}
    <div class="toast-progress" style="animation-duration: 4000ms;"></div>
  `;

  dom.toastContainer.appendChild(toast);

  if (allowUndo) {
    const undoBtn = toast.querySelector('#toast-undo-action');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        undoDelete();
        toast.remove();
      });
    }
  }

  state.toastTimeout = setTimeout(() => {
    toast.classList.add('toast-hiding');
    setTimeout(() => toast.remove(), 250);
  }, 4000);
}

// ==========================================================================
// 12. EXPORT & IMPORT (JSON BACKUP)
// ==========================================================================

function exportTasksToJson() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.tasks, null, 2));
  const downloadAnchor = document.createElement('a');
  const filename = `taskflow_cozy_backup_${new Date().toISOString().slice(0, 10)}.json`;

  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  playSound('click');
  showToast('Task backup exported successfully! 📦', 'success');
}

function importTasksFromJson(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedTasks = JSON.parse(e.target.result);
      if (Array.isArray(importedTasks)) {
        state.tasks = importedTasks;
        saveTasksToStorage();
        renderApp();
        playSound('complete');
        showToast(`Restored ${importedTasks.length} tasks! 🌸`, 'success');
      } else {
        showToast('Invalid file structure. Expected JSON array of tasks.', 'warning');
      }
    } catch (err) {
      console.error('JSON parse error during import:', err);
      showToast('Could not parse JSON file. Please check file format.', 'warning');
    }
  };
  reader.readAsText(file);
}

// ==========================================================================
// 13. DRAG AND DROP REORDERING
// ==========================================================================

let draggedItemId = null;

function setupDragAndDrop() {
  dom.taskList.addEventListener('dragstart', (e) => {
    const item = e.target.closest('.task-item');
    if (!item) return;

    draggedItemId = item.dataset.id;
    item.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedItemId);
  });

  dom.taskList.addEventListener('dragend', (e) => {
    const item = e.target.closest('.task-item');
    if (item) item.classList.remove('dragging');
    draggedItemId = null;
  });

  dom.taskList.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const overItem = e.target.closest('.task-item');
    if (!overItem || overItem.dataset.id === draggedItemId) return;

    const bounding = overItem.getBoundingClientRect();
    const offset = e.clientY - bounding.top - bounding.height / 2;

    if (offset > 0) {
      overItem.after(document.querySelector(`[data-id="${draggedItemId}"]`));
    } else {
      overItem.before(document.querySelector(`[data-id="${draggedItemId}"]`));
    }
  });

  dom.taskList.addEventListener('drop', (e) => {
    e.preventDefault();
    const newOrderedIds = Array.from(dom.taskList.querySelectorAll('.task-item')).map(el => el.dataset.id);
    const reorderedTasks = [];

    newOrderedIds.forEach(id => {
      const task = state.tasks.find(t => t.id === id);
      if (task) reorderedTasks.push(task);
    });

    state.tasks = reorderedTasks;
    saveTasksToStorage();
    playSound('click');
  });
}

// ==========================================================================
// 14. EVENT LISTENERS SETUP
// ==========================================================================

function attachEventListeners() {
  // 1. New Task Form Submission
  dom.newTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let title = dom.taskTitleInput.value.trim();
    const priority = dom.taskPrioritySelect.value;
    const category = dom.taskCategorySelect.value;
    const dueDate = dom.taskDueDateInput.value;
    const note = dom.taskNoteInput ? dom.taskNoteInput.value : '';
    const image = dom.taskPhotoData ? dom.taskPhotoData.value : '';
    const mood = dom.taskMoodSelect ? dom.taskMoodSelect.value : '🌸 Happy';
    const sticker = dom.taskStickerSelect ? dom.taskStickerSelect.value : '🎀';
    const caption = dom.newPhotoPreviewCaption ? dom.newPhotoPreviewCaption.textContent : "today's memory ✨";

    // If title is empty, check if user wrote a diary entry or attached a photo memory
    if (!title) {
      if (note.trim()) {
        title = note.trim().slice(0, 38) + (note.trim().length > 38 ? '...' : '');
      } else if (image) {
        title = (caption ? caption.replace(/✨/g, '').trim() : 'Cozy Photo Memory') + ' 🌸';
      } else {
        showToast('Please type a task title or write a cozy diary note! 🌸', 'warning');
        dom.taskTitleInput.focus();
        return;
      }
    }

    addTask(title, priority, category, dueDate, note, image, caption, mood, sticker);
    dom.taskTitleInput.value = '';
    dom.taskDueDateInput.value = '';
    if (dom.taskNoteInput) dom.taskNoteInput.value = '';
    if (dom.taskPhotoData) dom.taskPhotoData.value = '';
    if (dom.newPhotoPreviewWrap) dom.newPhotoPreviewWrap.style.display = 'none';
    if (dom.newPhotoPreviewImg) dom.newPhotoPreviewImg.src = '';
    if (dom.presetPhotoBtns) dom.presetPhotoBtns.forEach(b => b.classList.remove('active-preset'));
    dom.taskTitleInput.focus();
  });

  // 2. Diary Drawer Toggle in New Task Form
  if (dom.toggleDiaryDrawerBtn && dom.newTaskDiaryDrawer) {
    dom.toggleDiaryDrawerBtn.addEventListener('click', () => {
      const isClosed = dom.newTaskDiaryDrawer.style.display === 'none' || !dom.newTaskDiaryDrawer.style.display;
      dom.newTaskDiaryDrawer.style.display = isClosed ? 'block' : 'none';
      dom.toggleDiaryDrawerBtn.setAttribute('aria-expanded', isClosed.toString());
      const arrow = dom.toggleDiaryDrawerBtn.querySelector('.diary-toggle-arrow');
      if (arrow) arrow.textContent = isClosed ? '▴' : '▾';
      playSound('click');
    });
  }

  // 3. User Photo Upload with Automatic Canvas Downscaling / Compression
  if (dom.taskPhotoUpload) {
    dom.taskPhotoUpload.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        showToast('Compressing photo memory... 🌸', 'info');
        const compressedDataUrl = await compressImageFile(file);
        dom.taskPhotoData.value = compressedDataUrl;
        dom.newPhotoPreviewImg.src = compressedDataUrl;
        if (dom.newPhotoPreviewCaption) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').slice(0, 20);
          dom.newPhotoPreviewCaption.textContent = cleanName ? `${cleanName} ✨` : "today's memory ✨";
        }
        dom.newPhotoPreviewWrap.style.display = 'block';
        if (dom.presetPhotoBtns) dom.presetPhotoBtns.forEach(b => b.classList.remove('active-preset'));
        playSound('add');
        showToast('Photo attached beautifully! 📸✨', 'success');
      } catch (err) {
        console.error('Image compression failed:', err);
        showToast('Could not load image. Please select a valid picture file.', 'warning');
      }
      dom.taskPhotoUpload.value = '';
    });
  }

  // Edit Modal Photo Upload with Compression
  if (dom.editPhotoUpload) {
    dom.editPhotoUpload.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        showToast('Compressing photo memory... 🌸', 'info');
        const compressedDataUrl = await compressImageFile(file);
        dom.editPhotoData.value = compressedDataUrl;
        dom.editPhotoPreviewImg.src = compressedDataUrl;
        dom.editPhotoPreviewWrap.style.display = 'block';
        if (dom.editPresetBtns) dom.editPresetBtns.forEach(b => b.classList.remove('active-preset'));
        playSound('add');
        showToast('Photo memory updated! 📸✨', 'success');
      } catch (err) {
        console.error('Image compression failed:', err);
        showToast('Could not load image. Please select another file.', 'warning');
      }
      dom.editPhotoUpload.value = '';
    });
  }

  // 4. Aesthetic Presets (Latte, Study Desk, Strawberry Cake)
  dom.presetPhotoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.src;
      if (!src) return;
      dom.taskPhotoData.value = src;
      dom.newPhotoPreviewImg.src = src;
      if (dom.newPhotoPreviewCaption) {
        dom.newPhotoPreviewCaption.textContent = `${btn.textContent.trim()} moments ✨`;
      }
      dom.newPhotoPreviewWrap.style.display = 'block';
      dom.presetPhotoBtns.forEach(b => b.classList.remove('active-preset'));
      btn.classList.add('active-preset');
      playSound('click');
      showToast(`Selected ${btn.textContent.trim()} preset! 🌸 Click Save below ✨`, 'success');
    });
  });

  dom.editPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.src;
      if (!src) return;
      dom.editPhotoData.value = src;
      dom.editPhotoPreviewImg.src = src;
      dom.editPhotoPreviewWrap.style.display = 'block';
      dom.editPresetBtns.forEach(b => b.classList.remove('active-preset'));
      btn.classList.add('active-preset');
      playSound('click');
      showToast(`Selected ${btn.textContent.trim()} preset! 🌸`, 'success');
    });
  });

  // 5. Remove Photo Buttons
  if (dom.removeNewPhotoBtn) {
    dom.removeNewPhotoBtn.addEventListener('click', () => {
      dom.taskPhotoData.value = '';
      dom.newPhotoPreviewImg.src = '';
      dom.newPhotoPreviewWrap.style.display = 'none';
      if (dom.presetPhotoBtns) dom.presetPhotoBtns.forEach(b => b.classList.remove('active-preset'));
      playSound('delete');
      showToast('Photo memory removed 🗑️', 'info');
    });
  }

  if (dom.removeEditPhotoBtn) {
    dom.removeEditPhotoBtn.addEventListener('click', () => {
      dom.editPhotoData.value = '';
      dom.editPhotoPreviewImg.src = '';
      dom.editPhotoPreviewWrap.style.display = 'none';
      if (dom.editPresetBtns) dom.editPresetBtns.forEach(b => b.classList.remove('active-preset'));
      playSound('delete');
      showToast('Photo memory removed 🗑️', 'info');
    });
  }

  // 6. View Mode Switcher (List vs Scrapbook Diary)
  if (dom.viewModeListBtn) {
    dom.viewModeListBtn.addEventListener('click', () => setViewMode('list'));
  }
  if (dom.viewModeDiaryBtn) {
    dom.viewModeDiaryBtn.addEventListener('click', () => setViewMode('diary'));
  }

  // 7. Photo Zoom Lightbox Modal
  dom.taskList.addEventListener('click', (e) => {
    const polaroidTrigger = e.target.closest('.task-polaroid-inline, .scrapbook-polaroid');
    if (polaroidTrigger) {
      const taskId = polaroidTrigger.dataset.taskId;
      if (taskId) {
        openPhotoZoomModal(taskId);
      }
    }
  });

  if (dom.photoZoomCloseBtn) {
    dom.photoZoomCloseBtn.addEventListener('click', closePhotoZoomModal);
  }
  if (dom.photoZoomModal) {
    dom.photoZoomModal.addEventListener('click', (e) => {
      if (e.target === dom.photoZoomModal) {
        closePhotoZoomModal();
      }
    });
  }

  // 8. Quick Date Chips (Today, Tomorrow, Weekend)
  dom.quickDateChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const dateType = chip.dataset.date;
      if (dateType === 'today') {
        dom.taskDueDateInput.value = getRelativeDateString(0);
      } else if (dateType === 'tomorrow') {
        dom.taskDueDateInput.value = getRelativeDateString(1);
      } else if (dateType === 'weekend') {
        dom.taskDueDateInput.value = getNextWeekendString();
      }
      playSound('click');
    });
  });

  // 9. Task List Event Delegation (Checkbox, Edit, Delete, Double Click)
  dom.taskList.addEventListener('click', (e) => {
    // Avoid triggering card click actions if clicking polaroid photo
    if (e.target.closest('.task-polaroid-inline, .scrapbook-polaroid')) {
      return;
    }

    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    const taskId = taskItem.dataset.id;

    // Checkbox toggle
    if (e.target.closest('.custom-checkbox-wrapper')) {
      toggleTaskCompletion(taskId);
      return;
    }

    // Delete button
    if (e.target.closest('.btn-delete')) {
      deleteTask(taskId);
      return;
    }

    // Edit button
    if (e.target.closest('.btn-edit')) {
      openEditModal(taskId);
      return;
    }
  });

  // Double click on task text to quick-edit
  dom.taskList.addEventListener('dblclick', (e) => {
    const taskText = e.target.closest('.task-text');
    if (taskText) {
      const taskItem = taskText.closest('.task-item');
      if (taskItem) {
        openEditModal(taskItem.dataset.id);
      }
    }
  });

  // 10. Status Tabs Filtering
  dom.statusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dom.statusTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      state.filter.status = tab.dataset.status;
      renderApp();
      playSound('click');
    });
  });

  // 11. Category Chips Filtering
  dom.categoryFilterContainer.addEventListener('click', (e) => {
    const chip = e.target.closest('.cat-chip');
    if (!chip) return;

    dom.categoryFilterContainer.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    state.filter.category = chip.dataset.category;
    renderApp();
    playSound('click');
  });

  // 12. Live Search
  dom.searchInput.addEventListener('input', (e) => {
    state.filter.search = e.target.value;
    dom.clearSearchBtn.style.display = e.target.value.length > 0 ? 'block' : 'none';
    renderTaskList();
  });

  dom.clearSearchBtn.addEventListener('click', () => {
    dom.searchInput.value = '';
    state.filter.search = '';
    dom.clearSearchBtn.style.display = 'none';
    dom.searchInput.focus();
    renderTaskList();
    playSound('click');
  });

  // 13. Sort Selector
  dom.sortSelect.addEventListener('change', (e) => {
    state.filter.sort = e.target.value;
    renderTaskList();
    playSound('click');
  });

  // 14. Batch Actions Dropdown Toggle
  dom.batchMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isShown = dom.batchMenuDropdown.classList.toggle('show');
    dom.batchMenuBtn.setAttribute('aria-expanded', isShown.toString());
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.action-dropdown-container')) {
      dom.batchMenuDropdown.classList.remove('show');
      dom.batchMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Batch menu items
  dom.btnMarkAllDone.addEventListener('click', () => {
    dom.batchMenuDropdown.classList.remove('show');
    markAllTasksDone();
  });

  dom.btnClearCompleted.addEventListener('click', () => {
    dom.batchMenuDropdown.classList.remove('show');
    clearCompletedTasks();
  });

  dom.btnExportTasks.addEventListener('click', () => {
    dom.batchMenuDropdown.classList.remove('show');
    exportTasksToJson();
  });

  dom.btnImportTasksTrigger.addEventListener('click', () => {
    dom.batchMenuDropdown.classList.remove('show');
    dom.importFileInput.click();
  });

  dom.importFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      importTasksFromJson(file);
      dom.importFileInput.value = '';
    }
  });

  dom.btnResetDemo.addEventListener('click', () => {
    dom.batchMenuDropdown.classList.remove('show');
    if (confirm('Reload cute sample tasks? Your current tasks will be replaced.')) {
      resetToDemoData();
    }
  });

  // Empty state button
  dom.emptyCreateBtn.addEventListener('click', () => {
    dom.taskTitleInput.focus();
  });

  // Header Action Buttons (Cycle 4 Girly Themes & Toggle Audio)
  dom.themeToggleBtn.addEventListener('click', cycleTheme);
  dom.soundToggleBtn.addEventListener('click', toggleSound);
  dom.shortcutsModalBtn.addEventListener('click', openShortcutsModal);

  // Modals Listeners
  dom.modalCloseBtn.addEventListener('click', closeEditModal);
  dom.modalCancelBtn.addEventListener('click', closeEditModal);
  dom.shortcutsCloseBtn.addEventListener('click', closeShortcutsModal);
  dom.shortcutsOkBtn.addEventListener('click', closeShortcutsModal);

  // Close modals on backdrop click
  [dom.editModal, dom.shortcutsModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  });

  // Edit Task Form Submit
  dom.editTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = dom.editTaskId.value;
    const title = dom.editTitleInput.value;
    const priority = dom.editPrioritySelect.value;
    const category = dom.editCategorySelect.value;
    const dueDate = dom.editDueDateInput.value;
    const note = dom.editNoteInput ? dom.editNoteInput.value : '';
    const image = dom.editPhotoData ? dom.editPhotoData.value : '';
    const mood = dom.editMoodSelect ? dom.editMoodSelect.value : '🌸 Happy';

    if (title.trim()) {
      updateTask(id, title, priority, category, dueDate, note, image, mood);
      closeEditModal();
    }
  });

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    const activeTagName = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    const isEditing = activeTagName === 'input' || activeTagName === 'textarea' || activeTagName === 'select';

    if (e.key === 'Escape') {
      if (dom.photoZoomModal && dom.photoZoomModal.classList.contains('open')) {
        closePhotoZoomModal();
        return;
      }
      if (dom.editModal.classList.contains('open')) {
        closeEditModal();
        return;
      }
      if (dom.shortcutsModal.classList.contains('open')) {
        closeShortcutsModal();
        return;
      }
      if (document.activeElement === dom.searchInput) {
        dom.searchInput.value = '';
        state.filter.search = '';
        dom.clearSearchBtn.style.display = 'none';
        dom.searchInput.blur();
        renderTaskList();
      }
      return;
    }

    if (isEditing) return;

    if (e.key === '/' || e.key === '?') {
      if (e.key === '/') {
        e.preventDefault();
        dom.searchInput.focus();
      } else if (e.key === '?') {
        e.preventDefault();
        openShortcutsModal();
      }
    } else if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      dom.taskTitleInput.focus();
    } else if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      cycleTheme();
    } else if (e.key === 'v' || e.key === 'V') {
      e.preventDefault();
      setViewMode(state.viewMode === 'diary' ? 'list' : 'diary');
    } else if (e.key === 's' || e.key === 'S') {
      e.preventDefault();
      toggleSound();
    }
  });

  // Initialize drag & drop support
  setupDragAndDrop();
}

// ==========================================================================
// 15. DATE & TIME UTILITY HELPERS
// ==========================================================================

function updateClockAndGreeting() {
  const now = new Date();
  const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  dom.currentDateTime.textContent = now.toLocaleDateString('en-US', options);

  const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  dom.motivationalQuote.textContent = randomQuote;
}

function getNextWeekendString() {
  const d = new Date();
  const dayOfWeek = d.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
  d.setDate(d.getDate() + daysUntilSaturday);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ==========================================================================
// 16. APPLICATION INITIALIZATION
// ==========================================================================

function initApp() {
  loadStateFromStorage();
  attachEventListeners();
  updateClockAndGreeting();
  renderApp();

  const todayStr = getRelativeDateString(0);
  dom.taskDueDateInput.min = todayStr;
  dom.editDueDateInput.min = todayStr;

  setInterval(updateClockAndGreeting, 60000);

  console.log('%c🌸 TaskFlow Cozy Planner initialized!', 'color: #e07a5f; font-weight: bold; font-size: 14px;');
  console.log('%cWarm Pinterest aesthetic with LocalStorage persistence', 'color: #81b29a;');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
