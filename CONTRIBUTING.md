# 🤝 Contributing to Ozka Skills

Welcome! This repository is designed to house a library of personalized, premium agent skills. With this structure, you can easily scale to hundreds of skills.

## 📁 Repository Structure

```
├── skills/                   # Active skill implementations
│   └── <skill_name>/         # Folder for the specific skill
│       ├── SKILL.md          # Trigger prompts & metadata (read by agent)
│       └── <logic files>     # JavaScript, Python, or shell scripts
└── docs/                     # Detailed, off-folder documentations
    └── <skill_name>.md       # Markdown containing diagrams, logic, and manuals
```

---

## 🚀 How to Add a New Skill

To add a new skill to this project, follow these 3 simple steps:

### Step 1: Create the Skill Directory
Create a folder inside `skills/` named after your skill (use lowercase-kebab-case):
```bash
mkdir -p skills/my-awesome-skill
```

### Step 2: Implement the Skill Files
Create the following files inside your new skill directory:

1. **`SKILL.md`**: Contains the YAML frontmatter defining the name, description, and trigger instructions for the AI Agent.
   ```markdown
   ---
   name: my-awesome-skill
   description: |
     Brief summary of what this skill does and when the agent should trigger it.
     
     TRIGGER: Any prompt mentioning 'magic keyword'
   ---
   # My Awesome Skill
   ...
   ```
2. **Logic File(s)**: Implement scripts (e.g., `index.js`, `main.py`) to execute your skill tasks.

### Step 3: Write Detailed Documentation
Do **NOT** write the detailed user manual or diagrams inside the skill's directory. Instead, create a separate documentation file in the `docs/` folder:
```bash
touch docs/my-awesome-skill.md
```
In this file, explain:
- **Why** the skill exists.
- Detailed architecture and flow diagrams (using Mermaid).
- Inputs, outputs, and edge cases.

---

## 🎨 Design Guidelines
- All generated HTML forms or web templates must follow the **AMOLED Black theme** (`#000000` background, high contrast text, vibrant cyan/blue accent highlights).
- Keep execution directories lightweight (only active runtime files).
- Keep descriptions clear, structured, and helpful.
