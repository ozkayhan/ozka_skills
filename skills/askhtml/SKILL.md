---
name: askhtml
description: |
  When a user adds /askhtml to ANY prompt, analyze their intent and generate a beautiful, responsive HTML form matching one of 12 question types. Types include: multiple choice, open-ended, Likert scales, form fields, ranking, matrix tables, yes/no, sliders, semantic differential, image-based questions, location pickers, and multi-step wizards. The form opens in a new browser tab with AMOLED black background, high contrast, and premium UX. User fills it out, can scroll back and edit, then hits "Done" to auto-copy JSON response to clipboard. That JSON can be pasted directly back into chat to continue the conversation. This creates a seamless data collection experience within Claude conversations.
  
  TRIGGER: Any prompt ending with /askhtml. Analyze the prompt to auto-select the best matching form type (no asking). If unclear, pick closest match. Design with: pure black (#000000) background, high contrast white/accent text, premium minimal aesthetic, fully responsive, WCAG accessible.
---

# AskHTML Skill

## Overview

The `/askhtml` suffix transforms any prompt into an interactive data-collection experience. Instead of typing structured responses in chat, users fill out beautiful forms and get machine-readable JSON output.

**User workflow:**
1. User writes prompt + `/askhtml`
2. Skill analyzes intent → picks form type → opens HTML in new tab
3. User fills form (can edit by scrolling back up)
4. Hit "Done" → JSON auto-copies to clipboard
5. Paste JSON back to chat → continue conversation

**For Claude:** This skill reads the prompt, determines the best question type, generates appropriate HTML with all 12 template options available, and returns a properly formatted JSON schema based on what the user submitted.

---

## Form Types Reference

| # | Type | Use When | JSON Structure |
|---|------|----------|-----------------|
| 1 | **Multiple Choice** | Single or multi-select options | `{key: "option_id"}` or `{key: ["id1", "id2"]}` |
| 2 | **Open-Ended** | Free text response | `{key: "user text string"}` |
| 3 | **Likert / Rating** | 1-5 or 1-10 scale | `{key: 3}` (integer) |
| 4 | **Form Fields** | Name, email, phone, etc. | `{field1: "value", field2: "value"}` |
| 5 | **Ranking** | Drag-and-drop order | `{key: ["id_3", "id_1", "id_2"]}` (ordered) |
| 6 | **Matrix / Table** | Rows + columns (e.g., Likert matrix) | `{row_id: {col_id: value}}` nested |
| 7 | **Yes/No Binary** | Two-choice decision | `{key: true}` or `{key: false}` |
| 8 | **Slider** | Range selection | `{key: 42}` (int or float) |
| 9 | **Semantic Differential** | Opposite poles (e.g., "boring←→exciting") | `{key: 4}` (index) or `{key: "left_term"}` |
| 10 | **Image-Based** | Click image to select | `{key: "image_id"}` or `{key: ["img_1", "img_2"]}` |
| 11 | **Location / Map** | Pin on map or lat/lng input | `{location: {lat: 40.7128, lng: -74.0060}}` |
| 12 | **Wizard / Multi-Step** | Sequential form pages | `{step1_key: value, step2_key: value, ...}` combined |

---

## Design System

### Visual Principles
- **Background:** Pure AMOLED black (`#000000`)
- **Text:** High-contrast white (`#FFFFFF`) for primary, accent colors for interactive elements
- **Accent Colors:**
  - Primary action: Bright cyan or white with hover state
  - Success: Soft green for feedback
  - Focus indicators: Bright cyan outline (WCAG AA+)
- **Typography:** Clean sans-serif (system fonts), generous spacing
- **Spacing:** Minimal clutter, breathing room around elements
- **Responsiveness:** Mobile-first, works on all screen sizes

### Premium Micro-interactions
- Smooth hover effects
- Clear focus states (keyboard navigation)
- Button press feedback (visual/haptic ready)
- "Copied!" toast notification on JSON copy
- Smooth scroll back to edit previous fields

### Accessibility
- WCAG AA compliant
- Keyboard navigable (Tab, Enter, Arrow keys)
- Clear focus indicators
- Sufficient color contrast (WCAG AA minimum, shoot for AAA)
- Semantic HTML (labels, buttons, inputs)
- Screen-reader friendly labels

---

## Implementation Flow

### Step 1: Analyze Prompt
Read the prompt (without the `/askhtml` suffix). Determine:
- **What data is being collected?**
- **How many options/fields?**
- **What format makes sense?**

Then map to one of the 12 types. Examples:
- "Give me 50 options, pick 3 or mark maybe" → **Multiple Choice** (Type 1)
- "Rate your satisfaction 1-10" → **Likert** (Type 3)
- "What's your name, email, phone?" → **Form Fields** (Type 4)
- "Rank these features by priority" → **Ranking** (Type 5)
- "Show me cities on a map" → **Location** (Type 11)

### Step 2: Generate HTML
Create a self-contained HTML file that:
1. **Renders the form** based on the chosen type
2. **Collects data** with a clean UI
3. **Validates input** (required fields, format checks)
4. **Enables editing** (scroll back, change earlier responses)
5. **Exports JSON** with "Done" button
6. **Auto-copies** JSON to clipboard
7. **Shows confirmation** ("Copied!")

### Step 3: Open in Browser
Open the HTML in a new browser tab (user sees it immediately).

### Step 4: User Interaction
User fills form, can:
- Scroll up to edit previous fields
- Change selections
- Re-submit multiple times (JSON updates)
- Hit "Done" whenever ready

### Step 5: JSON in Chat
JSON auto-copies to clipboard. User pastes into chat:
```
{"questions": {"q1": "option_2", "q2": "option_5"}, "confidence": {"q1": 8}}
```

Skill terminates here; user continues conversation with their data.

---

## HTML Template Structure (Pseudo-code)

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background-color: #000000;
      color: #FFFFFF;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      margin: 0;
      padding: 20px;
      min-height: 100vh;
    }
    .container { max-width: 600px; margin: 0 auto; }
    .question { margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #333; }
    .options { display: flex; flex-wrap: wrap; gap: 12px; }
    button {
      background: #FFFFFF;
      color: #000000;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    button:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255,255,255,0.2); }
    .done-btn { position: fixed; bottom: 20px; right: 20px; }
    .toast { position: fixed; bottom: 100px; right: 20px; background: #00DD00; color: #000; padding: 12px 24px; border-radius: 6px; z-index: 1000; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Your Question</h1>
    <!-- Form fields rendered here -->
  </div>
  <button class="done-btn" onclick="copyJSON()">Done</button>
  <script>
    function copyJSON() {
      const data = { /* collected form data */ };
      const json = JSON.stringify(data);
      navigator.clipboard.writeText(json);
      showToast("Copied!");
    }
    function showToast(msg) {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = msg;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    }
  </script>
</body>
</html>
```

---

## Edge Cases & Notes

1. **Empty/Incomplete Forms:** Validation happens in HTML. "Done" won't work if required fields are empty.
2. **Scrolling & Editing:** All fields remain accessible. No "next/prev" buttons—user controls flow.
3. **Multiple Submissions:** User can hit "Done" multiple times; JSON updates each time.
4. **Clipboard Fallback:** If auto-copy fails (rare), show JSON in text area with copy button.
5. **Mobile:** Full responsive. Touch-friendly button sizes (48px min), readable text.
6. **Browser Compatibility:** Works in modern browsers (Chrome, Firefox, Safari, Edge). No special plugins needed.

---

## Test Scenarios

When testing this skill:
1. **Multiple Choice (50 items + maybe)** — "I want to pick music genres, maybe list" → generates searchable list with 3-button UX
2. **Rating Scale** — "Rate each idea 1-5" → generates Likert matrix or individual sliders
3. **Form Fields** — "Collect: Name, Email, Phone" → generates labeled form fields with validation
4. **Ranking** — "Rank priorities 1-10" → generates drag-and-drop or arrow-based ordering
5. **Yes/No Decision** — "Is this correct?" → generates two large buttons
6. **Open-Ended** — "Describe your experience" → generates text area with word count
7. **Map Location** — "Show me where you live" → generates map picker or lat/lng fields
8. **Matrix** → "Rate each feature per platform" → generates 2D table with selectable cells

---

## Success Criteria

✅ Form opens in new tab immediately  
✅ Design is premium (black bg, high contrast)  
✅ User can fill all fields and edit by scrolling  
✅ "Done" button copies valid JSON to clipboard  
✅ Toast shows "Copied!"  
✅ JSON can be pasted directly into chat  
✅ Form works on mobile  
✅ No errors in browser console  
✅ Keyboard navigable (Tab, Enter)  
✅ Clear, readable text at all sizes  

---

## Related Skills & Tools

- **No external dependencies** — HTML + vanilla JS only
- **Browser-native:** Uses `navigator.clipboard.writeText()` for copy
- **Chat integration:** User pastes JSON back to continue conversation with AI

