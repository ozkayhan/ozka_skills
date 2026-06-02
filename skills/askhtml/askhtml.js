#!/usr/bin/env node

/**
 * AskHTML Skill Executor
 * 
 * Analyzes user prompt and generates appropriate HTML form
 * Then opens it in a new browser tab
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Prompt Analyzer
class PromptAnalyzer {
  constructor(prompt) {
    this.prompt = prompt.toLowerCase();
    this.tokens = prompt.split(/\s+/);
  }

  /**
   * Analyze prompt and return: { type: 1-12, config: {...} }
   */
  analyze() {
    // Remove /askhtml from end
    const cleanedPrompt = this.prompt.replace(/\/askhtml\s*$/i, '').trim();

    // Type 1: Multiple Choice
    if (this.hasKeywords(['choose', 'select', 'pick', 'option', 'alternatives', 'list of'])) {
      if (this.hasKeywords(['50', 'many', 'lots', 'numerous'])) {
        return {
          type: 1,
          config: {
            title: cleanedPrompt,
            options: this.generateMockOptions(50),
            multiple: true
          }
        };
      }
      return {
        type: 1,
        config: {
          title: cleanedPrompt,
          options: this.generateMockOptions(5),
          multiple: this.hasKeywords(['multiple', 'several', 'more than one'])
        }
      };
    }

    // Type 2: Open-Ended
    if (this.hasKeywords(['describe', 'explain', 'tell me', 'what', 'how', 'why', 'write', 'feedback', 'opinion', 'thoughts', 'comment'])) {
      return {
        type: 2,
        config: {
          title: cleanedPrompt,
          placeholder: 'Share your thoughts here...'
        }
      };
    }

    // Type 3: Likert Scale / Rating
    if (this.hasKeywords(['rate', 'rating', 'satisfaction', 'agreement', 'rank', '1-5', '1-10', 'scale', 'score', 'how much', 'how well', 'agree'])) {
      const scale = this.hasKeywords(['1-10', '10']) ? 10 : 5;
      return {
        type: 3,
        config: {
          title: cleanedPrompt,
          scale: scale,
          labels: scale === 5 
            ? ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
            : null
        }
      };
    }

    // Type 4: Form Fields
    if (this.hasKeywords(['name', 'email', 'phone', 'address', 'collect', 'form', 'information', 'details', 'contact', 'personal'])) {
      const fields = this.extractFormFields(cleanedPrompt);
      return {
        type: 4,
        config: {
          fields: fields.length > 0 ? fields : this.generateDefaultFormFields()
        }
      };
    }

    // Type 5: Ranking
    if (this.hasKeywords(['rank', 'order', 'priority', 'sort', 'sequence', 'arrange', 'top 10', 'best to worst', 'most to least'])) {
      return {
        type: 5,
        config: {
          title: cleanedPrompt,
          items: this.generateMockItems(7)
        }
      };
    }

    // Type 6: Matrix
    if (this.hasKeywords(['matrix', 'table', 'grid', 'rows', 'columns', 'features', 'comparison', 'vs', 'each feature'])) {
      return {
        type: 6,
        config: {
          rowLabel: 'Items',
          colLabel: 'Options',
          rows: ['Item 1', 'Item 2', 'Item 3'],
          cols: ['Option A', 'Option B', 'Option C']
        }
      };
    }

    // Type 7: Yes/No Binary
    if (this.hasKeywords(['yes or no', 'true or false', 'is this', 'is it', 'do you', 'binary', 'agree or disagree', 'confirm', 'verify'])) {
      return {
        type: 7,
        config: {
          title: cleanedPrompt
        }
      };
    }

    // Type 8: Slider
    if (this.hasKeywords(['slider', 'scale from', 'range', 'intensity', 'brightness', 'volume', 'temperature', '0 to', '1 to'])) {
      return {
        type: 8,
        config: {
          title: cleanedPrompt,
          min: 0,
          max: 100,
          step: 1
        }
      };
    }

    // Type 9: Semantic Differential
    if (this.hasKeywords(['semantic', 'opposite', 'polar', 'contrary', 'vs', 'boring', 'exciting', 'simple', 'complex'])) {
      return {
        type: 9,
        config: {
          pairs: [
            { left: 'Left Concept', right: 'Right Concept' },
            { left: 'Boring', right: 'Exciting' },
            { left: 'Simple', right: 'Complex' }
          ]
        }
      };
    }

    // Type 10: Image-Based
    if (this.hasKeywords(['image', 'emoji', 'icon', 'picture', 'visual', 'show me', 'looks like'])) {
      return {
        type: 10,
        config: {
          title: cleanedPrompt,
          images: [
            { emoji: '🎨', label: 'Art' },
            { emoji: '🎭', label: 'Theater' },
            { emoji: '🎪', label: 'Fun' },
            { emoji: '🎯', label: 'Target' },
            { emoji: '🎲', label: 'Games' }
          ]
        }
      };
    }

    // Type 11: Location
    if (this.hasKeywords(['location', 'map', 'latitude', 'longitude', 'coordinates', 'where', 'place'])) {
      return {
        type: 11,
        config: {
          title: cleanedPrompt || 'Select a location'
        }
      };
    }

    // Type 12: Wizard (fallback for multi-step)
    if (this.hasKeywords(['step', 'steps', 'wizard', 'multi-step', 'process', 'sequence'])) {
      return {
        type: 12,
        config: {
          steps: [
            { html: '<h2>Step 1</h2><p>First step content</p>' },
            { html: '<h2>Step 2</h2><p>Second step content</p>' }
          ]
        }
      };
    }

    // Default: Open-Ended if nothing matches
    return {
      type: 2,
      config: {
        title: cleanedPrompt,
        placeholder: 'Share your response here...'
      }
    };
  }

  hasKeywords(keywords) {
    return keywords.some(kw => this.prompt.includes(kw.toLowerCase()));
  }

  extractFormFields(text) {
    // Simple heuristic: look for common form field keywords
    const fields = [];
    const fieldPatterns = [
      { id: 'name', label: 'Full Name', type: 'text' },
      { id: 'email', label: 'Email Address', type: 'email' },
      { id: 'phone', label: 'Phone Number', type: 'tel' },
      { id: 'address', label: 'Address', type: 'text' },
      { id: 'company', label: 'Company', type: 'text' },
      { id: 'feedback', label: 'Feedback', type: 'text' }
    ];

    fieldPatterns.forEach(pattern => {
      if (text.toLowerCase().includes(pattern.id)) {
        fields.push(pattern);
      }
    });

    return fields;
  }

  generateDefaultFormFields() {
    return [
      { id: 'name', label: 'Full Name', type: 'text', required: true },
      { id: 'email', label: 'Email Address', type: 'email', required: true },
      { id: 'message', label: 'Message', type: 'text' }
    ];
  }

  generateMockOptions(count) {
    const options = [];
    for (let i = 1; i <= count; i++) {
      options.push(`Option ${i}`);
    }
    return options;
  }

  generateMockItems(count) {
    const items = [];
    for (let i = 1; i <= count; i++) {
      items.push(`Item ${i}`);
    }
    return items;
  }
}

/**
 * HTML Generator using templates
 */
function generateHTML(type, config) {
  const templatesPath = path.join(__dirname, 'templates.js');
  // Read templates.js and execute it
  // For simplicity, we'll inline the template generation here

  const AMOLED_STYLES = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { background-color: #000000; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif; line-height: 1.6; min-height: 100vh; }
    body { padding: 20px; padding-bottom: 120px; }
    .container { max-width: 700px; margin: 0 auto; }
    h1 { font-size: 28px; font-weight: 700; margin-bottom: 32px; letter-spacing: -0.5px; }
    h2 { font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #F0F0F0; }
    p, label { font-size: 16px; color: #E0E0E0; margin-bottom: 12px; }
    .section { margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid #222222; }
    .section:last-of-type { border-bottom: none; }
    .options-grid { display: flex; flex-direction: column; gap: 12px; }
    .option-button { background-color: #111111; color: #FFFFFF; border: 2px solid #333333; padding: 16px 20px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 500; transition: all 0.2s ease; text-align: left; }
    .option-button:hover { background-color: #1A1A1A; border-color: #00DDFF; transform: translateX(4px); }
    .option-button.selected { background-color: #00DDFF; color: #000000; border-color: #00DDFF; font-weight: 600; }
    textarea { width: 100%; min-height: 150px; background-color: #111111; color: #FFFFFF; border: 2px solid #333333; border-radius: 8px; padding: 16px; font-family: inherit; font-size: 16px; resize: vertical; transition: border-color 0.2s; }
    textarea:focus { outline: none; border-color: #00DDFF; }
    .likert-scale { display: flex; gap: 8px; justify-content: space-between; }
    .likert-button { width: 48px; height: 48px; background-color: #111111; color: #FFFFFF; border: 2px solid #333333; border-radius: 50%; cursor: pointer; font-weight: 600; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; }
    .likert-button:hover { background-color: #1A1A1A; border-color: #00DDFF; transform: scale(1.1); }
    .likert-button.selected { background-color: #00DDFF; color: #000000; border-color: #00DDFF; }
    .form-field { margin-bottom: 20px; }
    input[type="text"], input[type="email"], input[type="tel"], input[type="number"], input[type="date"] { width: 100%; background-color: #111111; color: #FFFFFF; border: 2px solid #333333; border-radius: 8px; padding: 12px 16px; font-size: 16px; transition: border-color 0.2s; font-family: inherit; }
    input[type="text"]:focus, input[type="email"]:focus, input[type="tel"]:focus, input[type="number"]:focus, input[type="date"]:focus { outline: none; border-color: #00DDFF; }
    input::placeholder { color: #666666; }
    .ranking-item { display: flex; align-items: center; gap: 12px; background-color: #111111; padding: 16px; border-radius: 8px; margin-bottom: 12px; cursor: move; border: 2px solid #333333; transition: all 0.2s; }
    .ranking-handle { color: #666666; font-size: 20px; cursor: grab; }
    .ranking-text { flex: 1; font-size: 16px; }
    .matrix-table { width: 100%; border-collapse: collapse; border: 1px solid #333333; border-radius: 8px; overflow: hidden; }
    .matrix-table th, .matrix-table td { border: 1px solid #222222; padding: 12px; text-align: center; }
    .matrix-table th { background-color: #111111; color: #00DDFF; font-weight: 600; }
    .matrix-table tbody tr:nth-child(odd) { background-color: #0A0A0A; }
    .matrix-cell { cursor: pointer; transition: all 0.2s; }
    .matrix-cell:hover { background-color: #1A1A1A; color: #00DDFF; }
    .matrix-cell.selected { background-color: #00DDFF; color: #000000; font-weight: 600; }
    .binary-choice { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .binary-button { padding: 32px 24px; background-color: #111111; color: #FFFFFF; border: 2px solid #333333; border-radius: 12px; cursor: pointer; font-size: 18px; font-weight: 600; transition: all 0.2s ease; }
    .binary-button:hover { background-color: #1A1A1A; border-color: #00DDFF; transform: translateY(-4px); }
    .binary-button.selected { background-color: #00DDFF; color: #000000; border-color: #00DDFF; }
    input[type="range"] { width: 100%; height: 6px; background-color: #222222; border-radius: 3px; outline: none; -webkit-appearance: none; cursor: pointer; }
    input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; background-color: #00DDFF; cursor: pointer; border-radius: 50%; transition: all 0.2s; }
    input[type="range"]::-moz-range-thumb { width: 24px; height: 24px; background-color: #00DDFF; cursor: pointer; border-radius: 50%; border: none; transition: all 0.2s; }
    .slider-value { text-align: center; font-size: 18px; color: #00DDFF; margin-top: 12px; font-weight: 600; }
    button { background-color: #FFFFFF; color: #000000; border: none; padding: 14px 28px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 16px; transition: all 0.2s ease; }
    button:hover:not(:disabled) { background-color: #E0E0E0; transform: translateY(-2px); box-shadow: 0 8px 16px rgba(255, 255, 255, 0.2); }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .done-button { position: fixed; bottom: 20px; right: 20px; z-index: 1000; padding: 16px 32px; font-size: 16px; }
    .toast { position: fixed; bottom: 100px; right: 20px; background-color: #00DD00; color: #000000; padding: 14px 24px; border-radius: 8px; font-weight: 600; z-index: 1001; animation: slideIn 0.3s ease, slideOut 0.3s ease 1.7s; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
    @media (max-width: 640px) {
      body { padding: 16px; padding-bottom: 100px; }
      h1 { font-size: 24px; margin-bottom: 24px; }
      .done-button { width: calc(100% - 40px); right: 20px; left: 20px; }
    }
  `;

  let formContent = '';

  switch(type) {
    case 1: // Multiple Choice
      formContent = `
        <div class="section">
          <h2>${escapeHtml(config.title)}</h2>
          <div class="options-grid" id="options">
      `;
      config.options.forEach((opt, i) => {
        formContent += `<button class="option-button" data-id="option_${i}" onclick="toggleOption(this)">${escapeHtml(opt)}</button>`;
      });
      formContent += '</div></div>';
      break;

    case 2: // Open-Ended
      formContent = `
        <div class="section">
          <h2>${escapeHtml(config.title)}</h2>
          <textarea id="open_ended" placeholder="${escapeHtml(config.placeholder)}"></textarea>
        </div>
      `;
      break;

    case 3: // Likert
      formContent = `
        <div class="section">
          <h2>${escapeHtml(config.title)}</h2>
          <div class="likert-scale" id="likert">
      `;
      for (let i = 1; i <= config.scale; i++) {
        formContent += `<button class="likert-button" data-value="${i}" onclick="selectLikert(this)">${i}</button>`;
      }
      formContent += '</div></div>';
      break;

    case 4: // Form Fields
      formContent = '<div class="section">';
      config.fields.forEach(field => {
        formContent += `
          <div class="form-field">
            <label for="field_${field.id}">${escapeHtml(field.label)}</label>
            <input type="${field.type}" id="field_${field.id}" name="${field.id}" placeholder="${escapeHtml(field.placeholder || '')}" />
          </div>
        `;
      });
      formContent += '</div>';
      break;

    case 5: // Ranking
      formContent = `
        <div class="section">
          <h2>${escapeHtml(config.title)}</h2>
          <div id="ranking-list">
      `;
      config.items.forEach((item, i) => {
        formContent += `
          <div class="ranking-item" draggable="true" data-id="rank_${i}">
            <span class="ranking-handle">⋮</span>
            <span class="ranking-text">${escapeHtml(item)}</span>
          </div>
        `;
      });
      formContent += '</div></div>';
      break;

    case 7: // Binary
      formContent = `
        <div class="section">
          <h2>${escapeHtml(config.title)}</h2>
          <div class="binary-choice">
            <button class="binary-button" data-value="true" onclick="selectBinary(this)">Yes</button>
            <button class="binary-button" data-value="false" onclick="selectBinary(this)">No</button>
          </div>
        </div>
      `;
      break;

    default:
      formContent = `
        <div class="section">
          <h2>${escapeHtml(config.title)}</h2>
          <textarea id="open_ended" placeholder="Enter your response..."></textarea>
        </div>
      `;
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AskHTML Form</title>
  <style>${AMOLED_STYLES}</style>
</head>
<body>
  <div class="container">
    <h1>📋 Answer</h1>
    ${formContent}
  </div>
  <button class="done-button" onclick="copyJSON()">Done</button>
  
  <script>
    const formData = {};
    
    function toggleOption(btn) {
      btn.classList.toggle('selected');
      const selected = document.querySelectorAll('.option-button.selected');
      const ids = Array.from(selected).map(b => b.dataset.id);
      formData['selection'] = ids.length === 1 ? ids[0] : ids;
    }
    
    function selectLikert(btn) {
      document.querySelectorAll('.likert-button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      formData['rating'] = parseInt(btn.dataset.value);
    }
    
    function selectBinary(btn) {
      document.querySelectorAll('.binary-button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      formData['answer'] = btn.dataset.value === 'true';
    }
    
    function copyJSON() {
      // Collect form fields
      document.querySelectorAll('[id^="field_"]').forEach(field => {
        formData[field.name] = field.value;
      });
      
      // Collect textarea
      const textarea = document.getElementById('open_ended');
      if (textarea) {
        formData['response'] = textarea.value;
      }
      
      const json = JSON.stringify(formData);
      navigator.clipboard.writeText(json).then(() => {
        showToast('Copied to clipboard!');
      }).catch(err => {
        alert('Could not copy: ' + err);
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

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

/**
 * Main execution
 */
function main() {
  // Get prompt from command line argument
  const fullPrompt = process.argv.slice(2).join(' ');
  
  if (!fullPrompt.includes('/askhtml')) {
    console.error('Error: Prompt must end with /askhtml');
    process.exit(1);
  }

  // Analyze
  const analyzer = new PromptAnalyzer(fullPrompt);
  const { type, config } = analyzer.analyze();

  console.log(`[AskHTML] Detected type: ${type}`);
  console.log(`[AskHTML] Config:`, JSON.stringify(config, null, 2));

  // Generate HTML
  const html = generateHTML(type, config);

  // Write to temp file
  const tempFile = `/tmp/askhtml_form_${Date.now()}.html`;
  fs.writeFileSync(tempFile, html);

  console.log(`[AskHTML] Generated HTML: ${tempFile}`);

  // Open in browser
  const commands = {
    'darwin': `open "${tempFile}"`,
    'linux': `xdg-open "${tempFile}"`,
    'win32': `start "${tempFile}"`
  };

  const cmd = commands[process.platform] || commands.linux;
  exec(cmd, (err) => {
    if (err) {
      console.error('Could not open browser:', err);
      console.log(`Open this file manually: ${tempFile}`);
    } else {
      console.log('[AskHTML] Form opened in new tab');
    }
  });
}

if (require.main === module) {
  main();
}

module.exports = { PromptAnalyzer, generateHTML };
