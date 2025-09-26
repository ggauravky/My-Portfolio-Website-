# My Portfolio & Blog

A personal portfolio website designed to showcase my skills, projects, and experience in web development, data science, and AI/ML. It features a clean, responsive, single-page layout with a separate, fully-functional blog.

## Features

-   **Fully Responsive**: Adapts seamlessly to all screen sizes, from mobile to desktop.
-   **Light/Dark Theme**: A user-friendly theme switcher that saves your preference in local storage.
-   **Dynamic Content**: Skills, projects, and blog posts are loaded from external `JSON` files, making content updates simple and quick without touching the HTML.
-   **Interactive Projects Section**: Includes live search and tag-based filtering to easily navigate through projects.
-   **Detailed Project Modals**: Click on any project to view more details, including descriptions, tech stack, and links, in an accessible modal window.
-   **Functional Blog**: A complete blog with a dedicated page, search, and category filters, also powered by a `JSON` file.
-   **Smooth Animations**: Subtle scroll-based animations using the Intersection Observer API for a modern user experience.
-   **Contact Form**: Integrated with Formspree for a hassle-free way to get in touch.

## Tech Stack

-   **Frontend**: HTML5, CSS3 (Flexbox & Grid), Vanilla JavaScript (ES6+)
-   **Content Management**: `JSON` files for skills, projects, and blog posts.
-   **Deployment**: Ready to be deployed on any static hosting platform (Vercel, Netlify, GitHub Pages).

## Project Structure

```
.
├── index.html          # The main portfolio page
├── blog.html           # The blog page
├── projects.html       # A placeholder page for all projects
├── style.css           # Main stylesheet for the portfolio
├── script.js           # Main JavaScript for the portfolio
├── blog.css            # Stylesheet for the blog page
├── blog.js             # JavaScript for the blog page
├── data/
│   ├── projects.json   # Data for the project showcase
│   └── skills.json     # Data for the skills section
├── blog.json           # Data for the blog posts
├── assets/             # Images, logos, and other static files
└── README.md
```

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need a local server to run the project due to the use of the `fetch` API to load JSON data.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/my-portfolio-website.git](https://github.com/your-username/my-portfolio-website.git)
    cd my-portfolio-website
    ```
2.  **Run a local server.** Here are a few options:
    -   **Using Python:**
        ```bash
        python -m http.server
        ```
    -   **Using Node.js (with `http-server` package):**
        ```bash
        npx http-server
        ```
    -   **Using the VS Code Live Server extension.**

3.  Open your browser and navigate to `http://localhost:8000` (or the address provided by your local server).

## Customization Guide

1.  **Update Personal Information (`index.html`):**
    -   Change the page `<title>` and meta tags.
    -   Edit the "About Me" section with your own bio.
    -   Update social media `href` attributes in the hero and contact sections.
    -   Modify the "Experience" section with your work history.
    -   Replace the `action` URL in the `<form>` tag with your own Formspree endpoint.

2.  **Update Skills (`data/skills.json`):**
    -   Edit the skill categories and the list of items under each to match your skillset.

3.  **Update Projects (`data/projects.json`):**
    -   Add your project objects to the `projects` array.
    -   Set the `id` of your top project as the value for the `featured` key.
    -   Make sure all image paths in the `images` array are correct.

4.  **Update Blog Posts (`blog.json`):**
    -   Add new post objects to the `posts` array.
    -   Ensure the image paths are correct.

5.  **Replace Images (`assets/`):**
    -   Add your own images (profile picture, project screenshots, etc.) to the `assets` folder.
    -   Update the corresponding paths in the `.html` and `.json` files.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.