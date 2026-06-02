# 🌌 Ozka Custom Agent Skills Library

<p align="center">
  <img src="https://img.shields.io/badge/Open--Source-Premium-00E5FF?style=for-the-badge&logo=github&logoColor=black" alt="Open Source Premium" />
  <img src="https://img.shields.io/badge/License-MIT-white?style=for-the-badge" alt="MIT License" />
  <img src="https://img.shields.io/badge/Scale-100+%20Skills-purple?style=for-the-badge" alt="Scalability" />
</p>

Welcome to the **Ozka Custom Agent Skills Library**! This repository is a premium, open-source workspace designed to store, manage, and document custom-built agent skills. 

The structure is optimized for **infinite scaling**, allowing you to add hundreds of custom skills while keeping code runtimes clean and documentation comprehensive.

---

## 📐 Project Architecture

To ensure speed and neatness, code execution files are kept isolated from verbose user documentation:

```mermaid
graph TD
    Root[📁 ozka_skills]
    Root --> SkillsDir[📁 skills /active runtime/]
    Root --> DocsDir[📁 docs /explanations & diagrams/]
    
    SkillsDir --> SkillA[📁 askhtml]
    SkillA --> SKILLA_MD[📄 SKILL.md /trigger metadata/]
    SkillA --> SKILLA_JS[📄 askhtml.js /code logic/]
    
    DocsDir --> DocA[📄 askhtml.md /detailed user manual/]
```

---

## ⚡ Skill Inventory

Below is a summary of all custom skills currently available in this library. Click on the links to explore the code or read the detailed explanation manuals.

| Skill | Trigger / Command | Problems Solved | Code | Explanation |
| :--- | :--- | :--- | :--- | :--- |
| **AskHTML** | `[prompt] /askhtml` | Turns generic AI chat prompts into beautiful interactive HTML forms, streamlining data collection with structured JSON outputs. | [Code Directory](file:///Users/oka/Documents/work/ozka_skills/skills/askhtml) | [Detail Manual](file:///Users/oka/Documents/work/ozka_skills/docs/askhtml.md) |

---

## 🛠️ Adding Your Own Skills

Adding a new skill is extremely easy. The repository is configured to hold hundreds of personalized skills.

For detailed guidelines on folders, naming conventions, and template requirements, please refer to the [Contributing Guide](file:///Users/oka/Documents/work/ozka_skills/CONTRIBUTING.md).

---

## ⚖️ License

This project is licensed under the MIT License. See the [LICENSE](file:///Users/oka/Documents/work/ozka_skills/LICENSE) file for details.
