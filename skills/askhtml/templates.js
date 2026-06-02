/**
 * AskHTML Template Generator
 * Generates HTML forms for all 12 question types with AMOLED design
 * 
 * Usage:
 *   const html = generateTemplate(type, config);
 *   // type: 1-12
 *   // config: { title, options, fields, ... }
 */

const AMOLED_STYLES = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    background-color: #000000;
    color: #FFFFFF;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
    line-height: 1.6;
    min-height: 100vh;
  }
  
  body {
    padding: 20px;
    padding-bottom: 120px;
  }
  
  .container {
    max-width: 700px;
    margin: 0 auto;
  }
  
  h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 32px;
    letter-spacing: -0.5px;
  }
  
  h2 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #F0F0F0;
  }
  
  p, label {
    font-size: 16px;
    color: #E0E0E0;
    margin-bottom: 12px;
  }
  
  .section {
    margin-bottom: 40px;
    padding-bottom: 32px;
    border-bottom: 1px solid #222222;
  }
  
  .section:last-of-type {
    border-bottom: none;
  }
  
  /* Type 1: Multiple Choice */
  .options-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .option-button {
    background-color: #111111;
    color: #FFFFFF;
    border: 2px solid #333333;
    padding: 16px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.2s ease;
    text-align: left;
  }
  
  .option-button:hover {
    background-color: #1A1A1A;
    border-color: #00DDFF;
    transform: translateX(4px);
  }
  
  .option-button.selected {
    background-color: #00DDFF;
    color: #000000;
    border-color: #00DDFF;
    font-weight: 600;
  }
  
  /* Type 2: Open-Ended */
  textarea {
    width: 100%;
    min-height: 150px;
    background-color: #111111;
    color: #FFFFFF;
    border: 2px solid #333333;
    border-radius: 8px;
    padding: 16px;
    font-family: inherit;
    font-size: 16px;
    resize: vertical;
    transition: border-color 0.2s;
  }
  
  textarea:focus {
    outline: none;
    border-color: #00DDFF;
  }
  
  /* Type 3: Likert / Rating */
  .likert-scale {
    display: flex;
    gap: 8px;
    justify-content: space-between;
  }
  
  .likert-button {
    width: 48px;
    height: 48px;
    background-color: #111111;
    color: #FFFFFF;
    border: 2px solid #333333;
    border-radius: 50%;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .likert-button:hover {
    background-color: #1A1A1A;
    border-color: #00DDFF;
    transform: scale(1.1);
  }
  
  .likert-button.selected {
    background-color: #00DDFF;
    color: #000000;
    border-color: #00DDFF;
  }
  
  .likert-labels {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #888888;
    margin-top: 8px;
  }
  
  /* Type 4: Form Fields */
  .form-field {
    margin-bottom: 20px;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="tel"],
  input[type="number"],
  input[type="date"] {
    width: 100%;
    background-color: #111111;
    color: #FFFFFF;
    border: 2px solid #333333;
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 16px;
    transition: border-color 0.2s;
    font-family: inherit;
  }
  
  input[type="text"]:focus,
  input[type="email"]:focus,
  input[type="tel"]:focus,
  input[type="number"]:focus,
  input[type="date"]:focus {
    outline: none;
    border-color: #00DDFF;
  }
  
  input::placeholder {
    color: #666666;
  }
  
  /* Type 5: Ranking */
  .ranking-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background-color: #111111;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 12px;
    cursor: move;
    border: 2px solid #333333;
    transition: all 0.2s;
  }
  
  .ranking-item.dragging {
    opacity: 0.5;
    border-color: #00DDFF;
  }
  
  .ranking-handle {
    color: #666666;
    font-size: 20px;
    cursor: grab;
  }
  
  .ranking-handle:active {
    cursor: grabbing;
  }
  
  .ranking-text {
    flex: 1;
    font-size: 16px;
  }
  
  /* Type 6: Matrix */
  .matrix-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #333333;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .matrix-table th,
  .matrix-table td {
    border: 1px solid #222222;
    padding: 12px;
    text-align: center;
  }
  
  .matrix-table th {
    background-color: #111111;
    color: #00DDFF;
    font-weight: 600;
  }
  
  .matrix-table tbody tr:nth-child(odd) {
    background-color: #0A0A0A;
  }
  
  .matrix-cell {
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .matrix-cell:hover {
    background-color: #1A1A1A;
    color: #00DDFF;
  }
  
  .matrix-cell.selected {
    background-color: #00DDFF;
    color: #000000;
    font-weight: 600;
  }
  
  /* Type 7: Yes/No */
  .binary-choice {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  
  .binary-button {
    padding: 32px 24px;
    background-color: #111111;
    color: #FFFFFF;
    border: 2px solid #333333;
    border-radius: 12px;
    cursor: pointer;
    font-size: 18px;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  
  .binary-button:hover {
    background-color: #1A1A1A;
    border-color: #00DDFF;
    transform: translateY(-4px);
  }
  
  .binary-button.selected {
    background-color: #00DDFF;
    color: #000000;
    border-color: #00DDFF;
  }
  
  /* Type 8: Slider */
  .slider-container {
    margin: 32px 0;
  }
  
  input[type="range"] {
    width: 100%;
    height: 6px;
    background-color: #222222;
    border-radius: 3px;
    outline: none;
    -webkit-appearance: none;
    cursor: pointer;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    background-color: #00DDFF;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.2s;
  }
  
  input[type="range"]::-webkit-slider-thumb:hover {
    background-color: #00FFFF;
    box-shadow: 0 0 8px rgba(0, 221, 255, 0.5);
  }
  
  input[type="range"]::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background-color: #00DDFF;
    cursor: pointer;
    border-radius: 50%;
    border: none;
    transition: all 0.2s;
  }
  
  input[type="range"]::-moz-range-thumb:hover {
    background-color: #00FFFF;
    box-shadow: 0 0 8px rgba(0, 221, 255, 0.5);
  }
  
  .slider-value {
    text-align: center;
    font-size: 18px;
    color: #00DDFF;
    margin-top: 12px;
    font-weight: 600;
  }
  
  /* Type 9: Semantic Differential */
  .semantic-item {
    margin-bottom: 28px;
  }
  
  .semantic-labels {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #888888;
    margin-bottom: 12px;
  }
  
  .semantic-scale {
    display: flex;
    gap: 8px;
    justify-content: center;
  }
  
  .semantic-button {
    width: 40px;
    height: 40px;
    background-color: #111111;
    border: 2px solid #333333;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .semantic-button:hover {
    border-color: #00DDFF;
    background-color: #1A1A1A;
  }
  
  .semantic-button.selected {
    background-color: #00DDFF;
    border-color: #00DDFF;
  }
  
  /* Type 10: Image-Based */
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 16px;
  }
  
  .image-option {
    cursor: pointer;
    border: 2px solid #333333;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #111111;
    font-size: 48px;
  }
  
  .image-option:hover {
    border-color: #00DDFF;
    background-color: #1A1A1A;
    transform: scale(1.05);
  }
  
  .image-option.selected {
    border-color: #00DDFF;
    background-color: #00DDFF;
    color: #000000;
  }
  
  /* Type 11: Location / Map */
  .location-input-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .map-placeholder {
    width: 100%;
    height: 400px;
    background-color: #111111;
    border: 2px solid #333333;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666666;
    font-size: 16px;
  }
  
  /* Type 12: Wizard */
  .wizard-progress {
    display: flex;
    gap: 8px;
    margin-bottom: 32px;
    justify-content: center;
  }
  
  .wizard-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #333333;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .wizard-dot.active {
    background-color: #00DDFF;
    transform: scale(1.2);
  }
  
  .wizard-step {
    display: none;
  }
  
  .wizard-step.active {
    display: block;
  }
  
  .wizard-nav {
    display: flex;
    gap: 12px;
    justify-content: space-between;
    margin-top: 32px;
  }
  
  /* Buttons */
  button {
    background-color: #FFFFFF;
    color: #000000;
    border: none;
    padding: 14px 28px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 16px;
    transition: all 0.2s ease;
  }
  
  button:hover:not(:disabled) {
    background-color: #E0E0E0;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(255, 255, 255, 0.2);
  }
  
  button:active:not(:disabled) {
    transform: translateY(0);
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .done-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    padding: 16px 32px;
    font-size: 16px;
  }
  
  /* Toast */
  .toast {
    position: fixed;
    bottom: 100px;
    right: 20px;
    background-color: #00DD00;
    color: #000000;
    padding: 14px 24px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 1001;
    animation: slideIn 0.3s ease, slideOut 0.3s ease 1.7s;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  /* Utility */
  .required {
    color: #FF6B6B;
  }
  
  @media (max-width: 640px) {
    body {
      padding: 16px;
      padding-bottom: 100px;
    }
    
    h1 {
      font-size: 24px;
      margin-bottom: 24px;
    }
    
    .binary-choice,
    .location-input-group {
      grid-template-columns: 1fr;
    }
    
    .image-grid {
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    }
    
    .done-button {
      width: calc(100% - 40px);
      right: 20px;
      left: 20px;
    }
  }
`;

/**
 * Template 1: Multiple Choice
 */
function generateMultipleChoice(title, options, multiple = false) {
  let html = `
    <div class="section">
      <h2>${escapeHtml(title)}</h2>
      <div class="options-grid" id="options">
  `;
  
  options.forEach((option, idx) => {
    html += `
      <button class="option-button" data-id="option_${idx}" onclick="toggleOption(this, ${multiple})">
        ${escapeHtml(option)}
      </button>
    `;
  });
  
  html += `
      </div>
    </div>
  `;
  return html;
}

/**
 * Template 2: Open-Ended
 */
function generateOpenEnded(title, placeholder = "Type your response here...") {
  return `
    <div class="section">
      <h2>${escapeHtml(title)}</h2>
      <textarea id="open_ended" placeholder="${escapeHtml(placeholder)}"></textarea>
    </div>
  `;
}

/**
 * Template 3: Likert Scale
 */
function generateLikert(title, scale = 5, labels = null) {
  const defaultLabels = scale === 5 
    ? ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    : scale === 10
    ? Array.from({length: 10}, (_, i) => (i+1).toString())
    : labels || Array.from({length: scale}, (_, i) => (i+1).toString());
  
  let html = `
    <div class="section">
      <h2>${escapeHtml(title)}</h2>
      <div class="likert-scale" id="likert">
  `;
  
  for (let i = 1; i <= scale; i++) {
    html += `<button class="likert-button" data-value="${i}" onclick="selectLikert(this)">${i}</button>`;
  }
  
  html += `
      </div>
      <div class="likert-labels">
        <span>${escapeHtml(defaultLabels[0])}</span>
        <span>${escapeHtml(defaultLabels[defaultLabels.length-1])}</span>
      </div>
    </div>
  `;
  return html;
}

/**
 * Template 4: Form Fields
 */
function generateFormFields(fields) {
  let html = '<div class="section">';
  
  fields.forEach(field => {
    const required = field.required ? '<span class="required">*</span>' : '';
    const type = field.type || 'text';
    const placeholder = field.placeholder || '';
    
    html += `
      <div class="form-field">
        <label for="field_${field.id}">${escapeHtml(field.label)} ${required}</label>
        <input 
          type="${type}" 
          id="field_${field.id}" 
          name="${field.id}"
          placeholder="${escapeHtml(placeholder)}"
          ${field.required ? 'required' : ''}
        />
      </div>
    `;
  });
  
  html += '</div>';
  return html;
}

/**
 * Template 5: Ranking
 */
function generateRanking(title, items) {
  let html = `
    <div class="section">
      <h2>${escapeHtml(title)}</h2>
      <div id="ranking-list">
  `;
  
  items.forEach((item, idx) => {
    html += `
      <div class="ranking-item" draggable="true" data-id="rank_${idx}" data-order="${idx}">
        <span class="ranking-handle">⋮</span>
        <span class="ranking-text">${escapeHtml(item)}</span>
      </div>
    `;
  });
  
  html += `
      </div>
    </div>
  `;
  return html;
}

/**
 * Template 6: Matrix / Table
 */
function generateMatrix(rowLabel, colLabel, rows, cols) {
  let html = `
    <div class="section">
      <table class="matrix-table">
        <thead>
          <tr>
            <th>${escapeHtml(rowLabel)}</th>
  `;
  
  cols.forEach(col => {
    html += `<th>${escapeHtml(col)}</th>`;
  });
  
  html += `
          </tr>
        </thead>
        <tbody>
  `;
  
  rows.forEach(row => {
    html += `<tr><td><strong>${escapeHtml(row)}</strong></td>`;
    cols.forEach((col, cidx) => {
      html += `<td class="matrix-cell" data-row="${row}" data-col="${col}" onclick="selectMatrixCell(this)">-</td>`;
    });
    html += `</tr>`;
  });
  
  html += `
        </tbody>
      </table>
    </div>
  `;
  return html;
}

/**
 * Template 7: Yes/No Binary
 */
function generateBinary(title) {
  return `
    <div class="section">
      <h2>${escapeHtml(title)}</h2>
      <div class="binary-choice">
        <button class="binary-button" data-value="true" onclick="selectBinary(this)">
          Yes
        </button>
        <button class="binary-button" data-value="false" onclick="selectBinary(this)">
          No
        </button>
      </div>
    </div>
  `;
}

/**
 * Template 8: Slider
 */
function generateSlider(title, min = 0, max = 100, step = 1) {
  return `
    <div class="section">
      <h2>${escapeHtml(title)}</h2>
      <div class="slider-container">
        <input 
          type="range" 
          id="slider" 
          min="${min}" 
          max="${max}" 
          step="${step}"
          value="${(min + max) / 2}"
          oninput="updateSliderValue(this)"
        />
        <div class="slider-value" id="slider-value">${(min + max) / 2}</div>
      </div>
    </div>
  `;
}

/**
 * Template 9: Semantic Differential
 */
function generateSemanticDifferential(pairs) {
  let html = '<div class="section">';
  
  pairs.forEach((pair, idx) => {
    html += `
      <div class="semantic-item">
        <div class="semantic-labels">
          <span>${escapeHtml(pair.left)}</span>
          <span>${escapeHtml(pair.right)}</span>
        </div>
        <div class="semantic-scale" id="semantic_${idx}">
    `;
    
    for (let i = 1; i <= 7; i++) {
      html += `<button class="semantic-button" data-value="${i}" onclick="selectSemantic(this)"></button>`;
    }
    
    html += `
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  return html;
}

/**
 * Template 10: Image-Based
 */
function generateImageBased(title, images) {
  let html = `
    <div class="section">
      <h2>${escapeHtml(title)}</h2>
      <div class="image-grid">
  `;
  
  images.forEach((img, idx) => {
    html += `
      <div class="image-option" data-id="img_${idx}" onclick="selectImageOption(this)">
        ${img.emoji || '🖼️'}
      </div>
    `;
  });
  
  html += `
      </div>
    </div>
  `;
  return html;
}

/**
 * Template 11: Location Picker
 */
function generateLocation(title) {
  return `
    <div class="section">
      <h2>${escapeHtml(title)}</h2>
      <div class="location-input-group">
        <div>
          <label for="lat">Latitude</label>
          <input type="number" id="lat" placeholder="e.g., 40.7128" step="0.0001" />
        </div>
        <div>
          <label for="lng">Longitude</label>
          <input type="number" id="lng" placeholder="e.g., -74.0060" step="0.0001" />
        </div>
      </div>
      <div class="map-placeholder">Map integration available (for demo: enter lat/lng above)</div>
    </div>
  `;
}

/**
 * Template 12: Wizard / Multi-Step
 */
function generateWizard(steps) {
  let html = `
    <div class="wizard-progress" id="wizard-progress">
  `;
  
  steps.forEach((_, idx) => {
    html += `<div class="wizard-dot ${idx === 0 ? 'active' : ''}" data-step="${idx}" onclick="goToWizardStep(${idx})"></div>`;
  });
  
  html += '</div>';
  
  steps.forEach((step, idx) => {
    html += `<div class="wizard-step ${idx === 0 ? 'active' : ''}" data-step="${idx}">`;
    html += step.html;
    html += `</div>`;
  });
  
  html += `
    <div class="wizard-nav">
      <button onclick="prevWizardStep()" id="prev-btn">← Back</button>
      <button onclick="nextWizardStep()" id="next-btn">Next →</button>
    </div>
  `;
  
  return html;
}

/**
 * Utility Functions
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Event Handlers (populated in generated HTML)
 */
// These are implemented in the actual HTML document

/**
 * Main Generator
 */
function generateTemplate(type, config) {
  let formHtml = '';
  
  switch(type) {
    case 1:
      formHtml = generateMultipleChoice(config.title, config.options, config.multiple);
      break;
    case 2:
      formHtml = generateOpenEnded(config.title, config.placeholder);
      break;
    case 3:
      formHtml = generateLikert(config.title, config.scale, config.labels);
      break;
    case 4:
      formHtml = generateFormFields(config.fields);
      break;
    case 5:
      formHtml = generateRanking(config.title, config.items);
      break;
    case 6:
      formHtml = generateMatrix(config.rowLabel, config.colLabel, config.rows, config.cols);
      break;
    case 7:
      formHtml = generateBinary(config.title);
      break;
    case 8:
      formHtml = generateSlider(config.title, config.min, config.max, config.step);
      break;
    case 9:
      formHtml = generateSemanticDifferential(config.pairs);
      break;
    case 10:
      formHtml = generateImageBased(config.title, config.images);
      break;
    case 11:
      formHtml = generateLocation(config.title);
      break;
    case 12:
      formHtml = generateWizard(config.steps);
      break;
  }
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(config.title || 'AskHTML Form')}</title>
  <style>${AMOLED_STYLES}</style>
</head>
<body>
  <div class="container">
    ${formHtml}
  </div>
  <button class="done-button" onclick="copyJSON()">Done</button>
  <script>
    // Form data collector
    const formData = {};
    
    function copyJSON() {
      const json = JSON.stringify(formData);
      navigator.clipboard.writeText(json).then(() => {
        showToast('Copied!');
      }).catch(() => {
        // Fallback
        showToast('Could not copy - try manually');
      });
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
</html>`;
}

// Export for Node.js if applicable
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateTemplate, AMOLED_STYLES };
}
