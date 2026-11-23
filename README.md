# MediaHunt — Multi-Page Dark Media Discovery Website

A complete, responsive, multi-page media discovery and creator archive website built with **HTML5**, **CSS3**, and **Vanilla JavaScript**. Engineered with relative paths and URL query routing so it works out of the box on **GitHub Pages** with zero backend dependencies.

## Folder Structure

```text
mmshunt-discovery-site/
├── index.html          # Homepage (Hero, Category Strip, Trending, Latest)
├── categories.html     # All Categories Overview
├── category.html       # Individual Category View (?cat=<id>)
├── videos.html         # Full Video & Archive Listing with Filters & Pagination
├── video.html          # Individual Video Player & ZIP Package Details (?id=<id>)
├── search.html         # Live & Query-Based Search Results (?q=<term>)
├── trending.html       # Most Viewed & Trending Leaderboard
├── latest.html         # Chronological Latest Uploads
├── favorites.html      # Saved Library powered by localStorage
├── about.html          # Platform Architecture & Info
├── contact.html        # Interactive Contact & Submission Form
├── privacy.html        # Privacy & localStorage Policy
├── README.md           # Setup & GitHub Pages Deployment Guide
└── assets/
    ├── css/
    │   └── styles.css  # Unified Dark Theme Design System
    ├── js/
    │   ├── data.js     # Centralized Media & Category Catalog
    │   └── app.js      # Reusable Shell, Cards, Pagination, Search & Favorites
    └── img/            # Custom SVG Logo & Responsive Thumbnails
```

## Deploying to GitHub Pages

1. Create a new repository on GitHub (e.g., `mediahunt-site`).
2. Upload all files and folders (`index.html`, the other 11 `.html` files, `README.md`, and the `assets/` folder) to the root of your repository.
3. Open your repository on GitHub and navigate to **Settings → Pages**.
4. Under **Build and deployment → Source**, select **Deploy from a branch**.
5. Choose your `main` branch and `/ (root)` folder, then click **Save**.
6. Wait ~60 seconds and open your live URL at `https://<your-username>.github.io/<repo-name>/`.
