// Green Mountain Fog — site script
// Light enhancements: footer year, contact-form submission, GitHub repo cards.

(() => {
  // ----- footer year -----
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ----- contact form -----
  const form = document.getElementById("contact-form");
  if (form) {
    const status = document.getElementById("form-status");
    const submitBtn = form.querySelector('button[type="submit"]');
    const labelDefault = submitBtn?.querySelector('[data-label="default"]');
    const labelSending = submitBtn?.querySelector('[data-label="sending"]');

    const setSending = (sending) => {
      if (!submitBtn) return;
      submitBtn.disabled = sending;
      if (labelDefault) labelDefault.hidden = sending;
      if (labelSending) labelSending.hidden = !sending;
    };

    const setStatus = (msg, kind) => {
      if (!status) return;
      status.textContent = msg;
      status.classList.remove("success", "error");
      if (kind) status.classList.add(kind);
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      setStatus("");

      const data = Object.fromEntries(new FormData(form).entries());

      // honeypot: bots tend to fill every field
      if (data.website && String(data.website).trim() !== "") {
        setStatus("Thanks — message received.", "success");
        form.reset();
        return;
      }

      // minimal client-side check
      if (!data.name || !data.email || !data.topic || !data.message) {
        setStatus("Please fill out every required field.", "error");
        return;
      }

      setSending(true);
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          setStatus("Thanks — your message is on its way. I'll reply within one business day.", "success");
          form.reset();
        } else {
          const body = await res.json().catch(() => ({}));
          setStatus(body.error || "Something went wrong sending your message. Please email hello@greenmountainfog.com directly.", "error");
        }
      } catch (err) {
        setStatus("Network error. Please email hello@greenmountainfog.com directly.", "error");
      } finally {
        setSending(false);
      }
    });
  }

  // ----- GitHub projects -----
  const grid = document.getElementById("projects-grid");
  if (grid) {
    const username = "GreenMountainFog";
    const maxCards = 6;

    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("github request failed"))))
      .then((repos) => {
        const visible = repos
          .filter((r) => !r.fork && !r.archived && !r.private)
          .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at)))
          .slice(0, maxCards);

        if (visible.length === 0) {
          grid.innerHTML = `
            <article class="project-card placeholder">
              <h3>No public repos yet</h3>
              <p>I'm just getting set up on GitHub. Check back soon, or follow me at <a href="https://github.com/${username}" target="_blank" rel="noopener">@${username}</a>.</p>
            </article>`;
          return;
        }

        const escape = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({
          "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
        }[c]));

        grid.innerHTML = visible.map((repo) => `
          <a class="project-card" href="${escape(repo.html_url)}" target="_blank" rel="noopener">
            <div class="project-meta">
              <span class="project-lang">${escape(repo.language || "various")}</span>
              <span class="project-stars">★ ${repo.stargazers_count}</span>
            </div>
            <h3>${escape(repo.name)}</h3>
            <p>${escape(repo.description || "No description.")}</p>
          </a>
        `).join("");
      })
      .catch(() => {
        grid.innerHTML = `
          <article class="project-card placeholder">
            <h3>GitHub temporarily unavailable</h3>
            <p>Couldn't load repositories right now. Visit <a href="https://github.com/${username}" target="_blank" rel="noopener">github.com/${username}</a> directly.</p>
          </article>`;
      });
  }
})();
