# Gaurav’s Portfolio Website

"Hi, I’m Gaurav 👋 — A BCA Student passionate about Data Science, Web Development, AI/ML, and Python Development."  
A single-page responsive portfolio site to showcase skills, projects, and experience.

## Features
- Single-page design
- Responsive layout
- Light/dark theme with localStorage
- Dynamic skills and projects via JSON
- Filters and search for projects
- Accessible modal for project details
- Smooth IntersectionObserver reveal animations
- Contact form with Formspree
- SEO meta tags and Open Graph image
- No build tools required (plain HTML, CSS, JS)

## Project Structure
```
portfolio-gav/
├─ index.html
├─ styles.css
├─ script.js
├─ data/
│  ├─ skills.json
│  └─ projects.json
├─ assets/
│  ├─ profile.jpg
│  ├─ codec-logo.png
│  ├─ codec-cert.jpg
│  └─ og-image.jpg
├─ README.md
└─ LICENSE
```

## Editing Guide
- Edit About text, socials, and experience details in `index.html` (look for `EDIT` comments).
- Update experience period, description, and certificate “Verify” link in `index.html`.
- Replace images in `assets/` (profile, logo, certificate, og-image) with your own.

## Skills (data/skills.json)
Skills are fetched at runtime.

```json
{
  "skills": [
    { "category": "Web Development", "items": ["HTML", "CSS", "JavaScript"] },
    { "category": "Data Science", "items": ["Pandas", "NumPy", "Matplotlib", "Seaborn", "EDA"] },
    { "category": "AI/ML", "items": ["Scikit-learn", "TensorFlow (optional)", "Regression", "Classification", "Clustering"] },
    { "category": "Python Development", "items": ["Core Python (OOP)", "File Handling", "Automation & Scripting", "Problem Solving / DSA"] }
  ]
}
```

## Projects (data/projects.json)
Projects are fetched at runtime. AIReel Studio is the featured project.

```json
{
  "featured": "aireel-studio",
  "projects": [
    {
      "id": "aireel-studio",
      "title": "AIReel Studio",
      "short": "A tool to generate short, AI-assisted video reels with auto-captions and smart edits.",
      "description": "Longer description for modal...",
      "tech": ["React (demo)", "Node.js", "FFmpeg", "Python"],
      "github": "https://github.com/ggauravky/AIReel-Studio",
      "live": "",
      "tags": ["AI", "Video", "MERN"],
      "images": ["assets/aireel-1.jpg", "assets/aireel-2.jpg"]
    }
  ]
}
```

## Experience (Codec Technologies India)
- Role: MERN Stack Developer Intern  
- Period: June 2024 — Aug 2024  
- Logo: `assets/codec-logo.png`  
- Certificate: [Certified — View certificate](assets/codec-cert.jpg)  
- Verification link: [External verification URL](#)

## Contact Form
- Default: Formspree — replace the `action` URL with your endpoint.  
- Netlify Forms: remove `action`, add `netlify` and `name` attributes to the `<form>`.

## SEO
Update in `index.html`:  
- `<title>` meta title  
- Meta description  
- Open Graph image → `assets/og-image.jpg`  
- Canonical URL placeholder

## Local Preview
```bash
cd portfolio-gav
python -m http.server 8000

open http://localhost:8000
```

```bash
cd portfolio-gav
npx http-server -p 8000

open http://localhost:8000
```

## Deployment

### Vercel
```bash
npx vercel --prod
```

### Netlify
- In UI: no build command; publish directory = root  
- CLI:
```bash
npm i -g netlify-cli
netlify deploy --prod --dir .
```

### GitHub Pages
Enable Pages in repository settings:  
- Branch: `main`  
- Folder: `/ (root)`  
- Use the provided GitHub Pages URL

## Checklist
- [ ] Replace images in assets/  
- [ ] Update Formspree ID  
- [ ] Update About and Experience info  
- [ ] Skills/projects render correctly  
- [ ] Theme toggle works  
- [ ] Filters and search work  
- [ ] Featured project modal opens  
- [ ] Test a form submission

## Changelog / What to replace
- assets/profile.jpg  
- assets/codec-logo.png  
- assets/codec-cert.jpg  
- assets/og-image.jpg  
- Certificate verification URL  
- Canonical URL  
- Formspree ID  
- skills.json  
- projects.json

## License
[MIT License](LICENSE)
