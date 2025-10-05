# My Portfolio Website & Blog

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)  
[Live Site](https://gauravky.vercel.app/)

---

## 🚀 Introduction

Welcome to my personal portfolio and blog website! This site is built to showcase my skills, projects, and blog writings in web development, data science, and AI/ML. It has a clean, responsive design with dynamic content loading via JSON files, and supports features like theme switching, project filtering, and blog search.

---

## 🧰 Tech Stack & Features

- **Frontend:** HTML5, CSS3 (Flexbox & Grid), Vanilla JavaScript (ES6+)  
- **Content Management:** JSON files (`projects.json`, `skills.json`, `blog.json`)  
- **Deployment:** Static hosting (e.g. Vercel)  
- **Key Features:**
  - Fully responsive layout for mobile / desktop / tablets  
  - Light / dark theme toggling (persisted in browser)  
  - Dynamic loading of skills, projects, and blog posts  
  - Project filtering and modals with detailed view  
  - Blog with search and category filtering  
  - Contact form (via Formspree)  
  - Smooth scroll animations using Intersection Observer  

---

## 📁 Project Structure

```text
.
├── index.html
├── blog.html
├── projects.html
├── style.css
├── script.js
├── blog.css
├── blog.js
├── data/
│   ├── projects.json
│   └── skills.json
├── blog.json
├── assets/
│   └── (images, logos, etc.)
└── LICENSE
```

---

## 💼 Portfolio Projects

Here are some example projects showcased in the portfolio (these are defined in `data/projects.json`):

| Project Name | Description | Technologies | Live / Repo Link |
|--------------|-------------|--------------|------------------|
| Project A | A web app to … | React, Node.js, MongoDB | [Live / Repo]() |
| Project B | Data analysis dashboard | Python, Pandas, Flask | [Live / Repo]() |
| Project C | ML model deployment | TensorFlow, FastAPI | [Live / Repo]() |

> ⚠️ Replace above with your actual project names, descriptions, tech stack, and links in `projects.json` and this README.

---

## 🎨 Logos & Branding

You can include logos or icons in your README by putting image files into `assets/` and referencing them here. For example:

```md
![My Logo](assets/logo.png)
```

You can also add technology logos (e.g. HTML5, CSS3, JavaScript) using shields or small icons.

---

## 📥 How to Download & Run Locally

1. Clone this repository:

   ```sh
   git clone https://github.com/ggauravky/My-Portfolio-Website-.git
   cd My-Portfolio-Website-
   ```

2. Serve via a local HTTP server (needed because the site uses `fetch` to load JSON):

   - **Python**:
     ```sh
     python -m http.server 8000
     ```
   - **Node.js (http-server)**:
     ```sh
     npx http-server
     ```
   - Or use **VS Code Live Server** plugin.

3. Open your browser and go to `http://localhost:8000` (or the port used by your server).

4. Edit content:
   - Update `data/projects.json`, `data/skills.json`, `blog.json`
   - Replace images in `assets/`
   - Change text in HTML, meta tags, and contact form `action` URL as needed

---

## 📦 License (MIT)

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for full details.

---

## ℹ️ Notes & Credits

- Theme toggling is saved in local storage  
- JSON‑driven content allows for easy updates without editing HTML  
- Animations via Intersection Observer  
- Contact form is integrated using Formspree (or any similar service)  
