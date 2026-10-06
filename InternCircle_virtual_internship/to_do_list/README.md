# 🌸 TaskFlow — Cute Pinterest Aesthetic & Cozy To-Do Planner

> **InternCircle Virtual Internship — Project 2**  
> **Author:** Upasana Kudape  
> **Aesthetic:** Warm Pinterest Vibes · Oat Milk, Buttercream, Peach Blossom, Strawberry Red, Warm Terracotta & Matcha Latte  
> **Tech Stack:** Vanilla HTML5 · CSS3 · Modern JavaScript (ES6+) · LocalStorage API · Web Audio API · HTML5 Canvas

---

## 🌟 Overview

**TaskFlow** is a warm, aesthetically pleasing task manager and daily planner designed with cute **Pinterest-inspired stationery aesthetics**. It pairs gentle colors (buttercream, warm peach, soft rose, strawberry, honey, and matcha latte) with modern typography (`Quicksand`, `Fredoka`, and handwritten `Caveat`), cute washi tape accents, and smooth micro-animations.

Under the hood, it demonstrates front-end engineering principles:
- **DOM manipulation** with Vanilla JavaScript
- **Event listeners and event delegation** (Click, Enter key, and custom keyboard shortcuts)
- **State management and browser LocalStorage persistence**
- **Web Audio API** synthesized kalimba and fairy chime sound effects (100% offline)
- **HTML5 Canvas** confetti celebrations in warm pastel palettes

---

## ✨ Key Features & Pinterest Design Highlights

### 🎨 1. Cute Pinterest Aesthetic
- **Warm Color Palette**:
  - 🥛 **Oat Milk & Buttercream** backgrounds (`#fcf9f4`)
  - 🍑 **Peach Blossom** & **Warm Terracotta** primary accents (`#e07a5f`, `#f4a261`)
  - 🍓 **Berry Urgent** (`#e76f51`)
  - 🍯 **Warm Honey** (`#e9c46a`)
  - 🍵 **Matcha Latte** (`#81b29a`)
  - ☕ **Warm Espresso Bean** text typography (`#3d2b27`)
- **Stationery & Journal Accents**: Washi tape strips (`.washi-tape`), cute floating stickers (🧸, 🌸, 🥐, ☕), paper grain texture, and handwritten notes.
- **Warm Mocha Dark Mode**: An alternate cozy evening cafe theme (`#1c1514` roasted cocoa with warm marshmallow text).

### ⚙️ 2. Dynamic DOM Manipulation
- **Interactive Bloom Meter**: Custom circular SVG progress indicator tracking percentage completed in real time.
- **Animated Checkboxes**: Custom checkboxes that smoothly check off goals with strikethroughs and fairy chime sounds.
- **Dynamic Task Badges**: Dynamic date formatting highlighting overdue goals (⏰ Overdue), goals for 🌸 Today, and 🥐 Tomorrow.
- **Batch DOM Injection**: Fast rendering using `DocumentFragment`.

### 💾 3. LocalStorage Persistence & Data Handling
- **Full CRUD Persistence**: Tasks are saved automatically under `taskflow_cozy_tasks_v1` on creation, update, completion, and deletion.
- **Safe Bootstrapping**: Default cute sample tasks loaded on first launch.
- **Preference Persistence**: Active theme (`Warm Cream` vs `Cozy Mocha`) and sound toggle are saved across reloads.
- **JSON Backup (Export & Import)**: Download a portable `.json` backup of your daily goals and restore them whenever you want.

### ⌨️ 4. Event Delegation & Keyboard Shortcuts
- <kbd>N</kbd> — Focus the new task input field
- <kbd>↵ Enter</kbd> — Add task
- <kbd>/</kbd> — Focus live search
- <kbd>T</kbd> — Switch between Warm Cream and Cozy Mocha theme
- <kbd>S</kbd> — Toggle cute kalimba/fairy sound effects
- <kbd>?</kbd> — Open the shortcuts guide
- <kbd>Esc</kbd> — Close active modal or clear search

### 🔍 5. Filter, Search & Reorder
- **Status Filter**: All ✨, To Do ⏳, and Done 💖.
- **Category Filter**: Filter by 💼 Work, 📚 Study, 🧸 Self Care, 🍵 Health, 🥐 Budget, or 📌 Notes.
- **Live Search**: Instant substring query matching with warm peach text highlighting.
- **Multi-Criteria Sorting**: Newest, Oldest, Due Date, Priority, Alphabetical.
- **HTML5 Drag & Drop**: Native drag handles for easy manual reordering.

---

## 📂 Project Structure

```text
to_do_list/
├── index.html       ← Semantic HTML5 layout, washi tape memo cards, modals & SVG icons
├── style.css        ← Warm Pinterest design system, pastel blobs, washi tape, bubbly responsive cards
├── app.js           ← State management, event delegation, LocalStorage, Web Audio API & pastel confetti
└── README.md        ← Project documentation and internship report
```

---

## 🚀 How to Run Locally

1. Open [`index.html`](file:///d:/projects/InternCircle_virtual_internship/to_do_list/index.html) directly in any modern web browser.
2. Or run a local dev server:
   ```bash
   cd d:\projects\InternCircle_virtual_internship\to_do_list
   python -m http.server 3000
   ```
   Then visit `http://localhost:3000`.

---

© 2026 Upasana Kudape. Built for **InternCircle Virtual Internship** · Project 2.
