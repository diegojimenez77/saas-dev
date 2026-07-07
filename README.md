# Link-in-Bio

A simple static link-in-bio page built with plain HTML, CSS, and JavaScript. Edit your links in one file and deploy to GitHub Pages.

## Project structure

```
index.html      # Page shell
css/styles.css  # Styles
js/data.js      # Your profile and links (edit this)
js/app.js       # Renders the page
```

## Manage links from the page

Click **Manage Links** at the bottom of the page. You'll be asked for a password first.

- **Default password:** `admin123`
- Opens a management page where you can:
  - View all current links
  - Reorder links with **↑** / **↓**
  - Delete links
  - Add new links
- Changes save automatically in your browser (`localStorage`).
- The session lasts 30 minutes per browser tab.

### Change the password

1. Open the browser console on your site.
2. Run: `hashPassword('your-new-password').then(console.log)`
3. Copy the hash into `adminConfig.passwordHash` in `js/data.js`.

> Note: This is client-side protection only. Anyone can read the hash in your public repo, so use it as a simple gate, not high-security auth.

## Edit default links

Open `js/data.js`:

```js
const links = [
  {
    id: '1',
    title: 'GitHub',
    url: 'https://github.com/yourusername',
    description: 'My projects',
  },
  // add more links...
]

const profile = {
  username: 'yourusername',
  displayName: 'Your Name',
  bio: 'A short bio',
  avatarUrl: 'https://example.com/avatar.jpg', // optional
  theme: 'dark', // 'dark' | 'light' | 'gradient'
  links,
}
```

## Run locally

Open `index.html` in your browser, or use a local server:

```bash
# Python
python -m http.server 3000

# Node (if you have npx)
npx serve .
```

Then visit [http://localhost:3000](http://localhost:3000).

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. Push to the `main` branch.

Your site will be published at:

`https://<your-username>.github.io/saas-dev/`

No build step required — GitHub Pages serves the static files directly.
