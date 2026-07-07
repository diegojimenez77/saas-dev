/** Edit your links here. The page displays every item in this array. */
const links = [
  {
    id: '1',
    title: 'Portfolio',
    url: 'https://diegojimenez77.github.io/djp_portfolio_jun_2023/',
    description: 'Web Developer · PM & Scrum Master',
  },
  {
    id: '2',
    title: 'GitHub',
    url: 'https://github.com/diegojimenez77',
    description: '115+ open source projects',
  },
  {
    id: '3',
    title: 'GatorType',
    url: 'https://project-h8kis.vercel.app',
    description: 'Typing practice app',
  },
  {
    id: '4',
    title: 'GatorTyping',
    url: 'https://github.com/diegojimenez77/GatorTyping',
    description: 'Typing game project on GitHub',
  },
  {
    id: '5',
    title: 'Puppa',
    url: 'https://puppa.vercel.app',
    description: 'Web app project',
  },
  {
    id: '6',
    title: 'Link-in-Bio (this repo)',
    url: 'https://github.com/diegojimenez77/saas-dev',
    description: 'Source code for this page',
  },
  {
    id: '7',
    title: 'DuoLingua',
    url: 'https://github.com/diegojimenez77/DuoLingua',
    description: 'Language learning app',
  },
  {
    id: '8',
    title: 'KitchenServ',
    url: 'https://github.com/diegojimenez77/KitchenServ',
    description: 'Kitchen service web app',
  },
  {
    id: '9',
    title: 'PokeDex',
    url: 'https://github.com/diegojimenez77/PokeDex',
    description: 'Pokédex browser project',
  },
  {
    id: '10',
    title: 'PMO Workflow',
    url: 'https://github.com/diegojimenez77/PMOWorkflow',
    description: 'Project management workflow tool',
  },
  {
    id: '11',
    title: 'Email',
    url: 'mailto:jimpez.diego@gmail.com',
    description: 'jimpez.diego@gmail.com',
  },
]

/** Profile shown at the top. Links come from the array above. */
const profile = {
  username: 'diegojimenez77',
  displayName: 'Diego JP',
  bio: 'Web Developer · PM & Scrum Master · Querétaro, Mexico',
  avatarUrl: 'https://avatars.githubusercontent.com/u/96632452?v=4',
  theme: 'dark', // 'dark' (lime gradients) | 'light' | 'gradient' (purple/blue)
  links,
}

/**
 * Admin settings for managing links from the page.
 * Default password: admin123
 * Generate a new hash: hashPassword('your-password').then(console.log)
 */
const adminConfig = {
  passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
  sessionKey: 'linkBioAdminSession',
  managedLinksKey: 'linkBioManagedLinks',
  legacyCustomLinksKey: 'linkBioCustomLinks',
}
