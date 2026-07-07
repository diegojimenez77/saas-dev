const externalIcon = `
  <svg class="link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
`

const SESSION_DURATION_MS = 30 * 60 * 1000
let currentView = 'home'

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

async function hashPassword(password) {
  const data = new TextEncoder().encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

window.hashPassword = hashPassword

function openLink(url) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

function getDefaultLinks() {
  return profile.links.map((link) => ({ ...link }))
}

function getLegacyCustomLinks() {
  try {
    const stored = localStorage.getItem(adminConfig.legacyCustomLinksKey)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function getManagedLinks() {
  try {
    const stored = localStorage.getItem(adminConfig.managedLinksKey)
    if (stored) return JSON.parse(stored)

    return [...getDefaultLinks(), ...getLegacyCustomLinks()]
  } catch {
    return getDefaultLinks()
  }
}

function saveManagedLinks(links) {
  localStorage.setItem(adminConfig.managedLinksKey, JSON.stringify(links))
}

function getAllLinks() {
  return getManagedLinks()
}

function isAdminAuthenticated() {
  try {
    const session = JSON.parse(sessionStorage.getItem(adminConfig.sessionKey) || 'null')
    if (!session?.expiresAt) return false
    return Date.now() < session.expiresAt
  } catch {
    return false
  }
}

function setAdminSession() {
  sessionStorage.setItem(
    adminConfig.sessionKey,
    JSON.stringify({ expiresAt: Date.now() + SESSION_DURATION_MS })
  )
}

function normalizeUrl(url) {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^mailto:/i.test(trimmed)) return trimmed
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  return `https://${trimmed}`
}

function validateUrl(url) {
  if (/^mailto:/i.test(url)) return /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(url)
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function createLinkId() {
  return `link-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function moveLink(links, id, direction) {
  const index = links.findIndex((link) => link.id === id)
  if (index === -1) return links

  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= links.length) return links

  const updated = [...links]
  const [item] = updated.splice(index, 1)
  updated.splice(targetIndex, 0, item)
  return updated
}

function renderProfileCard() {
  const name = profile.displayName || profile.username
  const showUsername = Boolean(profile.displayName)

  const avatar = profile.avatarUrl
    ? `
      <div class="avatar-wrap">
        <img
          class="avatar"
          src="${escapeHtml(profile.avatarUrl)}"
          alt="${escapeHtml(name)}"
          onerror="this.parentElement.style.display='none'"
        />
      </div>
    `
    : ''

  const username = showUsername
    ? `<p class="username">@${escapeHtml(profile.username)}</p>`
    : ''

  const bio = profile.bio
    ? `<p class="bio">${escapeHtml(profile.bio)}</p>`
    : ''

  return `
    <section class="profile-card card">
      ${avatar}
      <h1 class="name">${escapeHtml(name)}</h1>
      ${username}
      ${bio}
    </section>
  `
}

function renderPublicLinks() {
  const allLinks = getAllLinks()

  if (!allLinks.length) {
    return `
      <section class="empty card">
        <p>No links yet. Use Manage Links to add one.</p>
      </section>
    `
  }

  return allLinks
    .map((link, index) => {
      const description = link.description
        ? `<p class="link-description">${escapeHtml(link.description)}</p>`
        : ''

      return `
        <button
          type="button"
          class="link-button card animate-fade-in"
          style="--animation-delay: ${index * 80}ms"
          data-url="${escapeHtml(link.url)}"
        >
          <span class="link-content">
            <span class="link-text">
              <span class="link-title">${escapeHtml(link.title)}</span>
              ${description}
            </span>
            ${externalIcon}
          </span>
        </button>
      `
    })
    .join('')
}

function renderManageButton() {
  return `
    <button type="button" class="add-link-btn" id="open-manage">
      <span class="add-link-icon">⚙</span>
      Manage Links
    </button>
  `
}

function renderHomeView() {
  return `
    <div class="container">
      ${renderProfileCard()}
      <div class="links">${renderPublicLinks()}</div>
      <div class="actions">${renderManageButton()}</div>
    </div>
  `
}

function renderManageLinkItem(link, index, total) {
  const description = link.description
    ? `<p class="manage-link-description">${escapeHtml(link.description)}</p>`
    : ''

  return `
    <li class="manage-link-item card" data-id="${escapeHtml(link.id)}">
      <div class="manage-link-order">
        <button type="button" class="order-btn" data-action="up" data-id="${escapeHtml(link.id)}" ${index === 0 ? 'disabled' : ''} aria-label="Move up">↑</button>
        <button type="button" class="order-btn" data-action="down" data-id="${escapeHtml(link.id)}" ${index === total - 1 ? 'disabled' : ''} aria-label="Move down">↓</button>
      </div>
      <div class="manage-link-info">
        <p class="manage-link-title">${escapeHtml(link.title)}</p>
        <p class="manage-link-url">${escapeHtml(link.url)}</p>
        ${description}
      </div>
      <button type="button" class="manage-delete-btn" data-id="${escapeHtml(link.id)}" aria-label="Delete link">Delete</button>
    </li>
  `
}

function renderManageView() {
  const links = getManagedLinks()

  const list = links.length
    ? `<ul class="manage-list">${links.map((link, index) => renderManageLinkItem(link, index, links.length)).join('')}</ul>`
    : `<section class="empty card manage-empty"><p>No links yet. Add your first link below.</p></section>`

  return `
    <div class="container manage-container">
      <div class="manage-header card">
        <button type="button" class="back-btn" id="back-home">← Back to page</button>
        <h2 class="manage-title">Manage Links</h2>
        <p class="manage-subtitle">Reorder, delete, or add links. Changes save automatically in this browser.</p>
      </div>

      <section class="manage-section">
        <h3 class="section-label">Current links (${links.length})</h3>
        ${list}
      </section>

      <section class="manage-section card manage-form-card">
        <h3 class="section-label">Add new link</h3>
        <form id="manage-add-form" class="modal-form">
          <label class="field">
            <span>Title</span>
            <input type="text" name="title" required maxlength="100" placeholder="My Project" />
          </label>
          <label class="field">
            <span>URL</span>
            <input type="text" name="url" required placeholder="https://example.com" />
          </label>
          <label class="field">
            <span>Description (optional)</span>
            <input type="text" name="description" maxlength="200" placeholder="Short description" />
          </label>
          <p class="form-error hidden" id="manage-add-error">Please check the link details.</p>
          <button type="submit" class="modal-submit">Add link</button>
        </form>
      </section>
    </div>
  `
}

function renderPasswordModal() {
  return `
    <div class="modal" id="password-modal" role="dialog" aria-modal="true" aria-labelledby="password-modal-title">
      <div class="modal-backdrop" data-close-password></div>
      <div class="modal-card card">
        <button type="button" class="modal-close" data-close-password aria-label="Close">×</button>
        <h2 class="modal-title" id="password-modal-title">Enter password</h2>
        <p class="modal-text">Password required to manage links.</p>
        <form id="password-form" class="modal-form">
          <label class="field">
            <span>Password</span>
            <input type="password" name="password" required autocomplete="current-password" />
          </label>
          <p class="form-error hidden" id="password-error">Incorrect password.</p>
          <button type="submit" class="modal-submit">Open manager</button>
        </form>
      </div>
    </div>
  `
}

function showPasswordModal() {
  document.getElementById('password-modal')?.classList.remove('hidden')
  document.body.classList.add('modal-open')
  document.querySelector('#password-form input')?.focus()
}

function hidePasswordModal() {
  document.getElementById('password-modal')?.classList.add('hidden')
  document.body.classList.remove('modal-open')
  document.getElementById('password-error')?.classList.add('hidden')
}

function goToManage() {
  currentView = 'manage'
  hidePasswordModal()
  renderPage()
}

function goToHome() {
  currentView = 'home'
  renderPage()
}

function bindHomeEvents() {
  document.querySelectorAll('.link-button').forEach((button) => {
    button.addEventListener('click', () => openLink(button.dataset.url))
  })

  document.getElementById('open-manage')?.addEventListener('click', () => {
    if (isAdminAuthenticated()) {
      goToManage()
    } else {
      showPasswordModal()
    }
  })
}

function bindPasswordEvents() {
  document.querySelectorAll('[data-close-password]').forEach((el) => {
    el.addEventListener('click', hidePasswordModal)
  })

  document.getElementById('password-form')?.addEventListener('submit', async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const password = new FormData(form).get('password')
    const errorEl = document.getElementById('password-error')
    const hash = await hashPassword(String(password))

    if (hash !== adminConfig.passwordHash) {
      errorEl?.classList.remove('hidden')
      return
    }

    errorEl?.classList.add('hidden')
    setAdminSession()
    form.reset()
    goToManage()
  })
}

function bindManageEvents() {
  document.getElementById('back-home')?.addEventListener('click', goToHome)

  document.querySelectorAll('.order-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const { id, action } = button.dataset
      if (!id || !action) return
      const updated = moveLink(getManagedLinks(), id, action)
      saveManagedLinks(updated)
      renderPage()
    })
  })

  document.querySelectorAll('.manage-delete-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.id
      if (!id) return
      if (!confirm('Delete this link?')) return
      const updated = getManagedLinks().filter((link) => link.id !== id)
      saveManagedLinks(updated)
      renderPage()
    })
  })

  document.getElementById('manage-add-form')?.addEventListener('submit', (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const title = String(data.get('title') || '').trim()
    const url = normalizeUrl(String(data.get('url') || ''))
    const description = String(data.get('description') || '').trim()
    const errorEl = document.getElementById('manage-add-error')

    if (!title || !validateUrl(url)) {
      errorEl?.classList.remove('hidden')
      return
    }

    const updated = [
      ...getManagedLinks(),
      {
        id: createLinkId(),
        title,
        url,
        description: description || undefined,
      },
    ]

    saveManagedLinks(updated)
    form.reset()
    errorEl?.classList.add('hidden')
    renderPage()
  })
}

function bindGlobalEvents() {
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    if (currentView === 'manage') {
      goToHome()
      return
    }
    hidePasswordModal()
  })
}

function renderPage() {
  const app = document.getElementById('app')
  if (!app) return

  app.className = `page theme-${profile.theme}`

  const content = currentView === 'manage' ? renderManageView() : renderHomeView()
  const passwordModal = renderPasswordModal()

  app.innerHTML = `${content}${passwordModal}`
  document.getElementById('password-modal')?.classList.add('hidden')

  if (currentView === 'manage') {
    bindManageEvents()
  } else {
    bindHomeEvents()
  }

  bindPasswordEvents()
  bindGlobalEvents()

  document.title =
    currentView === 'manage'
      ? `Manage Links · ${profile.displayName || profile.username}`
      : profile.displayName
        ? `${profile.displayName} (@${profile.username})`
        : `@${profile.username}`
}

renderPage()
