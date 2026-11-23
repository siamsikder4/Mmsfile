/**
 * MEDIAHUNT — Reusable UI Components, State Management & Page Controllers
 * 100% Static & GitHub Pages Compatible (Relative paths + URLSearchParams + localStorage)
 */

(function () {
  const FAV_STORAGE_KEY = "mediahunt_favorites_v1";

  // -------------------------------------------------------------------------
  // Favorites Manager (localStorage)
  // -------------------------------------------------------------------------
  const Favorites = {
    getAll() {
      try {
        const raw = localStorage.getItem(FAV_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    },
    has(id) {
      return this.getAll().includes(id);
    },
    toggle(id) {
      const list = this.getAll();
      const idx = list.indexOf(id);
      let added = false;
      if (idx === -1) {
        list.push(id);
        added = true;
      } else {
        list.splice(idx, 1);
      }
      localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(list));
      this.updateBadges();
      return added;
    },
    updateBadges() {
      const count = this.getAll().length;
      document.querySelectorAll("[data-fav-count]").forEach((el) => {
        el.textContent = count;
      });
    }
  };

  window.MediaFavorites = Favorites;

  // -------------------------------------------------------------------------
  // Utility Helpers
  // -------------------------------------------------------------------------
  function formatViews(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return String(num);
  }

  function getParam(key) {
    return new URLSearchParams(window.location.search).get(key) || "";
  }

  function showToast(message) {
    let toast = document.getElementById("global-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "global-toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
  }

  window.showMediaToast = showToast;

  // -------------------------------------------------------------------------
  // Reusable Shell Renderer (Header, Sidebar, Footer)
  // -------------------------------------------------------------------------
  function renderLayoutShell() {
    const activePage = document.body.dataset.page || "home";
    const currentQuery = getParam("q");
    const activeCatParam = getParam("cat");

    const headerMount = document.getElementById("site-header");
    if (headerMount) {
      headerMount.className = "site-header";
      headerMount.innerHTML = `
        <div class="header-inner">
          <div class="header-left">
            <button type="button" class="mobile-menu-btn" id="mobile-menu-toggle" aria-label="Toggle Menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <a href="index.html" class="brand-logo">
              <div class="brand-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff">
                  <polygon points="6,4 20,12 6,20"></polygon>
                </svg>
              </div>
              <div class="brand-text">MEDIA<span>HUNT</span></div>
            </a>
            <nav class="top-nav-links" aria-label="Primary Navigation">
              <a href="index.html" class="top-nav-link ${activePage === "home" ? "active" : ""}">Home</a>
              <a href="videos.html" class="top-nav-link ${activePage === "videos" ? "active" : ""}">Videos</a>
              <a href="categories.html" class="top-nav-link ${activePage === "categories" || activePage === "category" ? "active" : ""}">Categories</a>
              <a href="trending.html" class="top-nav-link ${activePage === "trending" ? "active" : ""}">Trending</a>
              <a href="latest.html" class="top-nav-link ${activePage === "latest" ? "active" : ""}">Latest</a>
            </nav>
          </div>

          <div class="header-search">
            <form class="header-search-form" action="search.html" method="get">
              <input
                type="search"
                name="q"
                class="header-search-input"
                placeholder="Search 4K reels, VFX packs, tags..."
                value="${escapeHtml(currentQuery)}"
                aria-label="Search media"
              />
              <button type="submit" class="header-search-btn" aria-label="Submit Search">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>
          </div>

          <div class="header-actions">
            <a href="favorites.html" class="fav-pill-btn ${activePage === "favorites" ? "active" : ""}">
              <span>♥</span>
              <span class="fav-label">Saved</span>
              <span class="fav-count-badge" data-fav-count>${Favorites.getAll().length}</span>
            </a>
          </div>
        </div>
      `;
    }

    const sidebarMount = document.getElementById("site-sidebar");
    if (sidebarMount) {
      const categoriesHtml = (window.MEDIA_CATEGORIES || [])
        .map((cat) => {
          const count = (window.MEDIA_ITEMS || []).filter((i) => i.category === cat.id).length;
          const isCatActive = activePage === "category" && activeCatParam === cat.id;
          return `
            <a href="category.html?cat=${encodeURIComponent(cat.id)}" class="sidebar-link ${isCatActive ? "active" : ""}">
              <span class="sidebar-link-left"><span>${cat.icon}</span><span>${cat.name}</span></span>
              <span class="sidebar-count">${count}</span>
            </a>
          `;
        })
        .join("");

      sidebarMount.className = "sidebar";
      sidebarMount.innerHTML = `
        <div class="sidebar-section">
          <div class="sidebar-title">Discover</div>
          <nav class="sidebar-nav">
            <a href="index.html" class="sidebar-link ${activePage === "home" ? "active" : ""}">
              <span class="sidebar-link-left"><span>🏠</span><span>Home Feed</span></span>
            </a>
            <a href="videos.html" class="sidebar-link ${activePage === "videos" ? "active" : ""}">
              <span class="sidebar-link-left"><span>🎞️</span><span>All Videos</span></span>
              <span class="sidebar-count">${(window.MEDIA_ITEMS || []).length}</span>
            </a>
            <a href="trending.html" class="sidebar-link ${activePage === "trending" ? "active" : ""}">
              <span class="sidebar-link-left"><span>🔥</span><span>Trending Now</span></span>
            </a>
            <a href="latest.html" class="sidebar-link ${activePage === "latest" ? "active" : ""}">
              <span class="sidebar-link-left"><span>✨</span><span>Latest Uploads</span></span>
            </a>
            <a href="favorites.html" class="sidebar-link ${activePage === "favorites" ? "active" : ""}">
              <span class="sidebar-link-left"><span>♥</span><span>Saved Library</span></span>
              <span class="sidebar-count" data-fav-count>${Favorites.getAll().length}</span>
            </a>
          </nav>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-title">Categories</div>
          <nav class="sidebar-nav">
            <a href="categories.html" class="sidebar-link ${activePage === "categories" ? "active" : ""}">
              <span class="sidebar-link-left"><span>📂</span><span>All Categories</span></span>
            </a>
            ${categoriesHtml}
          </nav>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-title">Platform</div>
          <nav class="sidebar-nav">
            <a href="about.html" class="sidebar-link ${activePage === "about" ? "active" : ""}">
              <span class="sidebar-link-left"><span>ℹ️</span><span>About</span></span>
            </a>
            <a href="contact.html" class="sidebar-link ${activePage === "contact" ? "active" : ""}">
              <span class="sidebar-link-left"><span>✉️</span><span>Contact</span></span>
            </a>
            <a href="privacy.html" class="sidebar-link ${activePage === "privacy" ? "active" : ""}">
              <span class="sidebar-link-left"><span>🛡️</span><span>Privacy Policy</span></span>
            </a>
          </nav>
        </div>
      `;
    }

    const overlay = document.getElementById("sidebar-overlay");
    const menuBtn = document.getElementById("mobile-menu-toggle");
    if (menuBtn && sidebarMount && overlay) {
      menuBtn.addEventListener("click", () => {
        sidebarMount.classList.toggle("open");
        overlay.classList.toggle("open");
      });
      overlay.addEventListener("click", () => {
        sidebarMount.classList.remove("open");
        overlay.classList.remove("open");
      });
    }

    const footerMount = document.getElementById("site-footer");
    if (footerMount) {
      footerMount.className = "site-footer";
      footerMount.innerHTML = `
        <div class="footer-inner">
          <div>
            <a href="index.html" class="brand-logo" style="margin-bottom: 6px;">
              <div class="brand-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff"><polygon points="6,4 20,12 6,20"></polygon></svg>
              </div>
              <div class="brand-text">MEDIA<span>HUNT</span></div>
            </a>
            <p class="footer-copy">Curated 4K video showcases, VFX reels, and downloadable creator archives.</p>
          </div>
          <div class="footer-links">
            <a href="index.html">Home</a>
            <a href="categories.html">Categories</a>
            <a href="videos.html">Videos</a>
            <a href="trending.html">Trending</a>
            <a href="latest.html">Latest</a>
            <a href="favorites.html">Favorites</a>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
            <a href="privacy.html">Privacy</a>
          </div>
          <div class="footer-copy">&copy; 2026 MediaHunt Discovery Directory. Static GitHub Pages Build.</div>
        </div>
      `;
    }
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // -------------------------------------------------------------------------
  // Category Strip Component
  // -------------------------------------------------------------------------
  function renderCategoryStrip(containerId, activeCatId = "all", mode = "link") {
    const el = document.getElementById(containerId);
    if (!el) return;
    const cats = window.MEDIA_CATEGORIES || [];
    const allHref = mode === "link" ? "videos.html" : "#";

    let html = `<a href="${allHref}" data-cat-filter="all" class="cat-chip ${activeCatId === "all" ? "active" : ""}">All Media</a>`;
    html += cats
      .map((c) => {
        const href = mode === "link" ? `category.html?cat=${encodeURIComponent(c.id)}` : "#";
        return `<a href="${href}" data-cat-filter="${c.id}" class="cat-chip ${activeCatId === c.id ? "active" : ""}">${c.icon} ${c.name}</a>`;
      })
      .join("");
    el.innerHTML = html;
  }

  // -------------------------------------------------------------------------
  // Content Card Component
  // -------------------------------------------------------------------------
  function createMediaCardHtml(item) {
    const isSaved = Favorites.has(item.id);
    const detailUrl = `video.html?id=${encodeURIComponent(item.id)}`;
    const catUrl = `category.html?cat=${encodeURIComponent(item.category)}`;
    const tagsHtml = (item.tags || [])
      .slice(0, 3)
      .map((t) => `<a href="search.html?q=${encodeURIComponent(t)}" class="card-tag">#${escapeHtml(t)}</a>`)
      .join("");

    return `
      <article class="media-card">
        <div class="card-thumb-wrap">
          <a href="${detailUrl}" aria-label="${escapeHtml(item.title)}">
            <img src="${item.thumbnail}" alt="${escapeHtml(item.title)}" class="card-thumb" loading="lazy" />
            <div class="card-overlay-gradient"></div>
            <div class="card-play-indicator">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff"><polygon points="7,4 20,12 7,20"></polygon></svg>
            </div>
          </a>
          <div class="card-badges-top">
            <span class="badge-quality">${escapeHtml(item.quality)}</span>
            ${item.trending ? `<span class="badge-hot">HOT</span>` : `<span class="badge-zip">${escapeHtml(item.archiveSize)}</span>`}
          </div>
          <button
            type="button"
            class="card-fav-btn ${isSaved ? "saved" : ""}"
            data-toggle-fav="${item.id}"
            title="${isSaved ? "Remove from Saved" : "Save to Favorites"}"
            aria-label="Save item"
          >
            ♥
          </button>
          <span class="card-duration">${escapeHtml(item.duration)}</span>
        </div>

        <div class="card-body">
          <div class="card-cat-row">
            <a href="${catUrl}" class="card-cat-label">${escapeHtml(item.categoryName)}</a>
            <span class="card-rating">★ ${escapeHtml(item.rating)}</span>
          </div>
          <h3 class="card-title">
            <a href="${detailUrl}">${escapeHtml(item.title)}</a>
          </h3>
          <div class="card-tags">${tagsHtml}</div>
          <div class="card-meta-footer">
            <span>👁 ${formatViews(item.views)} views</span>
            <span>📦 ${escapeHtml(item.archiveSize)}</span>
            <span>${escapeHtml(item.dateLabel)}</span>
          </div>
        </div>
      </article>
    `;
  }

  // -------------------------------------------------------------------------
  // Loading Skeletons & Grid Renderer with Pagination
  // -------------------------------------------------------------------------
  function renderSkeletons(container, count = 8) {
    if (!container) return;
    container.innerHTML = Array.from({ length: count })
      .map(
        () => `
        <div class="skeleton-card">
          <div class="skeleton-thumb"></div>
          <div class="skeleton-body">
            <div class="skeleton-line" style="width: 40%;"></div>
            <div class="skeleton-line" style="width: 90%; height: 16px;"></div>
            <div class="skeleton-line" style="width: 65%;"></div>
          </div>
        </div>
      `
      )
      .join("");
  }

  function renderPaginatedGrid({
    items,
    gridId,
    paginationId,
    pageSize = 8,
    currentPage = 1,
    emptyTitle = "No media items found",
    emptyText = "Try adjusting your search keywords or clearing active category filters.",
    onPageChange
  }) {
    const grid = document.getElementById(gridId);
    const pagEl = document.getElementById(paginationId);
    if (!grid) return;

    if (!items || items.length === 0) {
      grid.style.display = "block";
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>${escapeHtml(emptyTitle)}</h3>
          <p>${escapeHtml(emptyText)}</p>
          <a href="videos.html" class="btn btn-primary">Browse All Media</a>
        </div>
      `;
      if (pagEl) pagEl.innerHTML = "";
      return;
    }

    grid.style.display = "grid";
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const safePage = Math.min(Math.max(1, currentPage), totalPages);
    const startIdx = (safePage - 1) * pageSize;
    const slice = items.slice(startIdx, startIdx + pageSize);

    grid.innerHTML = slice.map(createMediaCardHtml).join("");

    if (pagEl) {
      if (totalPages <= 1) {
        pagEl.innerHTML = "";
      } else {
        let btns = `<button type="button" class="page-btn" data-page="${safePage - 1}" ${safePage === 1 ? "disabled" : ""}>← Prev</button>`;
        for (let p = 1; p <= totalPages; p++) {
          btns += `<button type="button" class="page-btn ${p === safePage ? "active" : ""}" data-page="${p}">${p}</button>`;
        }
        btns += `<button type="button" class="page-btn" data-page="${safePage + 1}" ${safePage === totalPages ? "disabled" : ""}>Next →</button>`;
        pagEl.innerHTML = btns;

        pagEl.querySelectorAll("[data-page]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const targetPage = Number(btn.dataset.page);
            if (targetPage >= 1 && targetPage <= totalPages && onPageChange) {
              onPageChange(targetPage);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          });
        });
      }
    }
  }

  // Global Delegate for Favorite Heart Buttons
  document.addEventListener("click", (e) => {
    const favBtn = e.target.closest("[data-toggle-fav]");
    if (!favBtn) return;
    e.preventDefault();
    const id = favBtn.dataset.toggleFav;
    const added = Favorites.toggle(id);
    document.querySelectorAll(`[data-toggle-fav="${id}"]`).forEach((btn) => {
      btn.classList.toggle("saved", added);
      btn.title = added ? "Remove from Saved" : "Save to Favorites";
    });
    showToast(added ? "Added to your Saved Library ♥" : "Removed from Saved Library");
    if (document.body.dataset.page === "favorites") {
      initFavoritesPage();
    }
  });

  // -------------------------------------------------------------------------
  // Page Controllers
  // -------------------------------------------------------------------------
  function initHomePage() {
    renderCategoryStrip("home-category-strip", "all", "link");
    const items = window.MEDIA_ITEMS || [];
    const featured = items.find((i) => i.featured) || items[0];

    const heroMount = document.getElementById("home-hero");
    if (heroMount && featured) {
      heroMount.innerHTML = `
        <div>
          <div class="hero-tag">🔥 Featured Release • ${escapeHtml(featured.quality)}</div>
          <h1 class="hero-title">${escapeHtml(featured.title)}</h1>
          <p class="hero-desc">${escapeHtml(featured.description)}</p>
          <div class="hero-actions">
            <a href="video.html?id=${encodeURIComponent(featured.id)}" class="btn btn-primary">▶ Watch & Inspect Pack</a>
            <a href="trending.html" class="btn btn-secondary">Explore Trending</a>
          </div>
        </div>
        <a href="video.html?id=${encodeURIComponent(featured.id)}" class="hero-featured-preview">
          <img src="${featured.thumbnail}" alt="${escapeHtml(featured.title)}" />
        </a>
      `;
    }

    const trendingGrid = document.getElementById("home-trending-grid");
    const latestGrid = document.getElementById("home-latest-grid");
    renderSkeletons(trendingGrid, 4);
    renderSkeletons(latestGrid, 4);

    setTimeout(() => {
      const trendingItems = items.filter((i) => i.trending).slice(0, 4);
      const latestItems = [...items]
        .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
        .slice(0, 8);
      if (trendingGrid) trendingGrid.innerHTML = trendingItems.map(createMediaCardHtml).join("");
      if (latestGrid) latestGrid.innerHTML = latestItems.map(createMediaCardHtml).join("");
    }, 160);
  }

  function initCategoriesPage() {
    const grid = document.getElementById("all-categories-grid");
    if (!grid) return;
    const cats = window.MEDIA_CATEGORIES || [];
    const items = window.MEDIA_ITEMS || [];

    grid.innerHTML = cats
      .map((cat) => {
        const catItems = items.filter((i) => i.category === cat.id);
        const totalViews = catItems.reduce((sum, i) => sum + i.views, 0);
        return `
          <a href="category.html?cat=${encodeURIComponent(cat.id)}" class="category-card">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div class="category-card-icon">${cat.icon}</div>
              <span class="badge-quality">${catItems.length} Releases</span>
            </div>
            <h2 style="font-size:1.15rem;font-weight:800;">${escapeHtml(cat.name)}</h2>
            <p style="color:var(--text-secondary);font-size:0.88rem;line-height:1.55;">${escapeHtml(cat.description)}</p>
            <div style="margin-top:auto;padding-top:12px;border-top:1px solid var(--border-subtle);display:flex;justify-content:space-between;font-size:0.8rem;color:var(--text-muted);">
              <span>👁 ${formatViews(totalViews)} total views</span>
              <span style="color:var(--accent-primary);font-weight:700;">Browse →</span>
            </div>
          </a>
        `;
      })
      .join("");
  }

  function initCategoryPage() {
    const catId = getParam("cat") || (window.MEDIA_CATEGORIES[0] && window.MEDIA_CATEGORIES[0].id);
    const catObj = (window.MEDIA_CATEGORIES || []).find((c) => c.id === catId);
    const titleEl = document.getElementById("category-page-title");
    const descEl = document.getElementById("category-page-desc");
    const sortSelect = document.getElementById("category-sort-select");

    renderCategoryStrip("category-strip-mount", catId, "link");

    if (catObj) {
      document.title = `${catObj.name} — MediaHunt`;
      if (titleEl) titleEl.textContent = `${catObj.icon} ${catObj.name}`;
      if (descEl) descEl.textContent = catObj.description;
    } else {
      if (titleEl) titleEl.textContent = "Category Not Found";
      if (descEl) descEl.textContent = "The requested category does not exist.";
    }

    let currentPage = 1;
    function update() {
      const sortBy = sortSelect ? sortSelect.value : "latest";
      let list = (window.MEDIA_ITEMS || []).filter((i) => i.category === catId);
      list = sortItems(list, sortBy);
      renderPaginatedGrid({
        items: list,
        gridId: "category-media-grid",
        paginationId: "category-pagination",
        pageSize: 6,
        currentPage,
        emptyTitle: "No releases in this category yet",
        emptyText: "Explore other categories from the strip above.",
        onPageChange: (p) => {
          currentPage = p;
          update();
        }
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        currentPage = 1;
        update();
      });
    }
    update();
  }

  function initVideosPage() {
    const catSelect = document.getElementById("videos-cat-filter");
    const sortSelect = document.getElementById("videos-sort-filter");
    const countLabel = document.getElementById("videos-count-label");

    if (catSelect) {
      const opts = (window.MEDIA_CATEGORIES || [])
        .map((c) => `<option value="${c.id}">${c.name}</option>`)
        .join("");
      catSelect.innerHTML = `<option value="all">All Categories</option>${opts}`;
    }

    let currentPage = 1;
    function update() {
      const selectedCat = catSelect ? catSelect.value : "all";
      const sortBy = sortSelect ? sortSelect.value : "latest";
      let list = [...(window.MEDIA_ITEMS || [])];
      if (selectedCat !== "all") {
        list = list.filter((i) => i.category === selectedCat);
      }
      list = sortItems(list, sortBy);
      if (countLabel) countLabel.textContent = `${list.length} releases available`;

      renderPaginatedGrid({
        items: list,
        gridId: "videos-grid",
        paginationId: "videos-pagination",
        pageSize: 8,
        currentPage,
        onPageChange: (p) => {
          currentPage = p;
          update();
        }
      });
    }

    if (catSelect) catSelect.addEventListener("change", () => { currentPage = 1; update(); });
    if (sortSelect) sortSelect.addEventListener("change", () => { currentPage = 1; update(); });
    update();
  }

  function initVideoDetailPage() {
    const id = getParam("id");
    const items = window.MEDIA_ITEMS || [];
    const item = items.find((i) => i.id === id) || items[0];
    const mount = document.getElementById("video-detail-mount");
    if (!mount || !item) return;

    document.title = `${item.title} — MediaHunt`;
    const isSaved = Favorites.has(item.id);
    const related = items.filter((i) => i.id !== item.id && i.category === item.category)
      .concat(items.filter((i) => i.id !== item.id && i.category !== item.category))
      .slice(0, 5);

    mount.innerHTML = `
      <div class="video-layout">
        <div>
          <div class="player-container">
            <video controls preload="metadata" poster="${item.thumbnail}">
              <source src="${item.videoUrl}" type="video/mp4" />
              Your browser does not support HTML5 video playback.
            </video>
          </div>

          <div class="details-box">
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
              <a href="category.html?cat=${encodeURIComponent(item.category)}" class="badge-hot">${escapeHtml(item.categoryName)}</a>
              <span class="badge-quality">${escapeHtml(item.quality)}</span>
              <span class="badge-zip">ARCHIVE: ${escapeHtml(item.archiveSize)}</span>
            </div>

            <h1 class="details-title">${escapeHtml(item.title)}</h1>

            <div class="details-meta-bar">
              <div class="details-stats">
                <span>👤 <strong>${escapeHtml(item.author)}</strong></span>
                <span>👁 ${formatViews(item.views)} views</span>
                <span>★ ${escapeHtml(item.rating)} rating</span>
                <span>📅 ${escapeHtml(item.uploadedAt)}</span>
              </div>

              <div class="details-actions">
                <button type="button" class="btn ${isSaved ? "btn-primary" : "btn-secondary"}" data-toggle-fav="${item.id}" id="detail-fav-btn">
                  ♥ ${isSaved ? "Saved" : "Save"}
                </button>
                <button type="button" class="btn btn-secondary" id="copy-share-btn">
                  🔗 Share Link
                </button>
                <button type="button" class="btn btn-primary" id="download-zip-btn">
                  ⬇ Download ZIP (${escapeHtml(item.archiveSize)})
                </button>
              </div>
            </div>

            <p class="details-description">${escapeHtml(item.description)}</p>

            <div class="specs-grid" style="margin-bottom:18px;">
              <div class="spec-item"><span>Resolution</span><strong>${escapeHtml(item.resolution)}</strong></div>
              <div class="spec-item"><span>Duration</span><strong>${escapeHtml(item.duration)}</strong></div>
              <div class="spec-item"><span>Package File</span><strong>${escapeHtml(item.archiveName)}</strong></div>
              <div class="spec-item"><span>Archive Size</span><strong>${escapeHtml(item.archiveSize)}</strong></div>
            </div>

            <div class="card-tags">
              ${(item.tags || []).map((t) => `<a href="search.html?q=${encodeURIComponent(t)}" class="card-tag">#${escapeHtml(t)}</a>`).join("")}
            </div>
          </div>
        </div>

        <aside>
          <div class="section-header" style="margin-bottom:12px;">
            <div class="section-title-group">
              <div class="section-accent-bar"></div>
              <h2 class="section-title" style="font-size:1.05rem;">Related Releases</h2>
            </div>
          </div>
          <div class="related-list">
            ${related
              .map(
                (rel) => `
                <a href="video.html?id=${encodeURIComponent(rel.id)}" class="related-item">
                  <div class="related-thumb">
                    <img src="${rel.thumbnail}" alt="${escapeHtml(rel.title)}" loading="lazy" />
                    <span class="card-duration" style="font-size:0.66rem;padding:1px 5px;bottom:4px;right:4px;">${escapeHtml(rel.duration)}</span>
                  </div>
                  <div class="related-info">
                    <h4>${escapeHtml(rel.title)}</h4>
                    <p>${escapeHtml(rel.categoryName)} • ${formatViews(rel.views)} views</p>
                    <p style="color:var(--accent-green);margin-top:2px;">📦 ${escapeHtml(rel.archiveSize)}</p>
                  </div>
                </a>
              `
              )
              .join("")}
          </div>
        </aside>
      </div>
    `;

    const detailFavBtn = document.getElementById("detail-fav-btn");
    if (detailFavBtn) {
      detailFavBtn.addEventListener("click", () => {
        setTimeout(() => {
          const nowSaved = Favorites.has(item.id);
          detailFavBtn.className = `btn ${nowSaved ? "btn-primary" : "btn-secondary"}`;
          detailFavBtn.innerHTML = `♥ ${nowSaved ? "Saved" : "Save"}`;
        }, 10);
      });
    }

    const shareBtn = document.getElementById("copy-share-btn");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href).catch(() => {});
        }
        showToast("Page URL copied to clipboard!");
      });
    }

    const dlBtn = document.getElementById("download-zip-btn");
    if (dlBtn) {
      dlBtn.addEventListener("click", () => {
        const manifest = [
          `MEDIAHUNT ARCHIVE MANIFEST`,
          `==========================`,
          `Release: ${item.title}`,
          `Archive: ${item.archiveName}`,
          `Size: ${item.archiveSize}`,
          `Resolution: ${item.resolution}`,
          `Creator: ${item.author}`,
          `Stream URL: ${item.videoUrl}`
        ].join("
");
        const blob = new Blob([manifest], { type: "application/zip" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = item.archiveName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        showToast(`Downloading ${item.archiveName}...`);
      });
    }
  }

  function initSearchPage() {
    const q = getParam("q").trim();
    const titleEl = document.getElementById("search-heading");
    const subEl = document.getElementById("search-subheading");
    const inlineInput = document.getElementById("search-page-input");
    const catSelect = document.getElementById("search-cat-select");

    if (inlineInput) inlineInput.value = q;
    if (catSelect) {
      const opts = (window.MEDIA_CATEGORIES || [])
        .map((c) => `<option value="${c.id}">${c.name}</option>`)
        .join("");
      catSelect.innerHTML = `<option value="all">All Categories</option>${opts}`;
    }

    let currentPage = 1;
    function runSearch() {
      const term = (inlineInput ? inlineInput.value : q).trim().toLowerCase();
      const catFilter = catSelect ? catSelect.value : "all";
      let results = [...(window.MEDIA_ITEMS || [])];

      if (catFilter !== "all") {
        results = results.filter((i) => i.category === catFilter);
      }
      if (term) {
        results = results.filter(
          (i) =>
            i.title.toLowerCase().includes(term) ||
            i.description.toLowerCase().includes(term) ||
            i.categoryName.toLowerCase().includes(term) ||
            i.author.toLowerCase().includes(term) ||
            (i.tags || []).some((t) => t.toLowerCase().includes(term))
        );
      }

      if (titleEl) {
        titleEl.textContent = term ? `Search Results for "${term}"` : "Search Media Directory";
      }
      if (subEl) {
        subEl.textContent = `Found ${results.length} matching release${results.length === 1 ? "" : "s"}`;
      }

      renderPaginatedGrid({
        items: results,
        gridId: "search-results-grid",
        paginationId: "search-pagination",
        pageSize: 8,
        currentPage,
        emptyTitle: `No matches found for "${term}"`,
        emptyText: "Try searching for keywords like 4K, cyberpunk, tokyo, FPV, mecha, aurora, or ocean.",
        onPageChange: (p) => {
          currentPage = p;
          runSearch();
        }
      });
    }

    if (inlineInput) {
      inlineInput.addEventListener("input", () => {
        currentPage = 1;
        runSearch();
      });
    }
    if (catSelect) {
      catSelect.addEventListener("change", () => {
        currentPage = 1;
        runSearch();
      });
    }
    runSearch();
  }

  function initTrendingPage() {
    let currentPage = 1;
    function update() {
      const items = [...(window.MEDIA_ITEMS || [])].sort((a, b) => b.views - a.views);
      renderPaginatedGrid({
        items,
        gridId: "trending-grid",
        paginationId: "trending-pagination",
        pageSize: 8,
        currentPage,
        onPageChange: (p) => {
          currentPage = p;
          update();
        }
      });
    }
    update();
  }

  function initLatestPage() {
    let currentPage = 1;
    function update() {
      const items = [...(window.MEDIA_ITEMS || [])].sort((a, b) =>
        b.uploadedAt.localeCompare(a.uploadedAt)
      );
      renderPaginatedGrid({
        items,
        gridId: "latest-grid",
        paginationId: "latest-pagination",
        pageSize: 8,
        currentPage,
        onPageChange: (p) => {
          currentPage = p;
          update();
        }
      });
    }
    update();
  }

  function initFavoritesPage() {
    const clearBtn = document.getElementById("clear-favs-btn");
    const countEl = document.getElementById("fav-page-count");
    const savedIds = Favorites.getAll();
    const savedItems = (window.MEDIA_ITEMS || []).filter((i) => savedIds.includes(i.id));

    if (countEl) {
      countEl.textContent = `${savedItems.length} saved item${savedItems.length === 1 ? "" : "s"} stored locally in your browser`;
    }
    if (clearBtn) {
      clearBtn.style.display = savedItems.length > 0 ? "inline-flex" : "none";
      clearBtn.onclick = () => {
        localStorage.removeItem(FAV_STORAGE_KEY);
        Favorites.updateBadges();
        showToast("Saved library cleared");
        initFavoritesPage();
      };
    }

    renderPaginatedGrid({
      items: savedItems,
      gridId: "favorites-grid",
      paginationId: "favorites-pagination",
      pageSize: 8,
      currentPage: 1,
      emptyTitle: "Your Saved Library is Empty",
      emptyText: "Click the heart icon (♥) on any video or asset card to bookmark it here using localStorage."
    });
  }

  function initContactPage() {
    const form = document.getElementById("contact-form");
    const feedback = document.getElementById("contact-feedback");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (feedback) {
        feedback.style.display = "block";
      }
      showToast("Message received! Thank you for contacting MediaHunt.");
      form.reset();
    });
  }

  function sortItems(list, sortBy) {
    const arr = [...list];
    if (sortBy === "views") return arr.sort((a, b) => b.views - a.views);
    if (sortBy === "rating") return arr.sort((a, b) => parseInt(b.rating, 10) - parseInt(a.rating, 10));
    return arr.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  }

  // -------------------------------------------------------------------------
  // Bootstrap on DOMContentLoaded
  // -------------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    renderLayoutShell();
    const page = document.body.dataset.page;
    switch (page) {
      case "home":
        initHomePage();
        break;
      case "categories":
        initCategoriesPage();
        break;
      case "category":
        initCategoryPage();
        break;
      case "videos":
        initVideosPage();
        break;
      case "video":
        initVideoDetailPage();
        break;
      case "search":
        initSearchPage();
        break;
      case "trending":
        initTrendingPage();
        break;
      case "latest":
        initLatestPage();
        break;
      case "favorites":
        initFavoritesPage();
        break;
      case "contact":
        initContactPage();
        break;
      default:
        break;
    }
  });
})();
