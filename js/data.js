/** Edit your links here. The page displays every item in this array. */

const links = [

  {

    id: '1',

    title: 'GitHub',

    url: 'https://github.com/diegojimenez77/',

    description: 'Project Repositories',

  },

  {

    id: '2',

    title: 'Smart Watch',

    url: 'https://diegojimenez77.github.io/SmartWatch/',

    description: 'Real Weather API Watch',

  },

  {

    id: '3',

    title: 'GatorType',

    url: 'https://diegojimenez77.github.io/GatorType/',

    description: 'Free - Learn to Typing Page',

  },

  {

    id: '4',

    title: 'KitchenServ',

    url: 'https://diegojimenez77.github.io/KitchenServ/',

    description: 'Kitchen equipment service',

  },

  {

    id: '5',

    title: 'Cook&Chill',

    url: 'https://diegojimenez77.github.io/CoockandChill/',

    description: 'Business Landing Page for Apps',

  },

  {

    id: '6',

    title: 'NutriDiego',

    url: 'https://diegojimenez77.github.io/NutriDiego/',

    description: 'Nutrition Plan Landing Page',

  },

  {

    id: '7',

    title: 'PokeDex',

    url: 'https://diegojimenez77.github.io/PokeDex/',

    description: 'Pokemon API App',

  },

  {

    id: '8',

    title: 'PMO Management',

    url: 'https://diegojimenez77.github.io/PMOManagement/',

    description: 'PMO Management System - Demo',

  },

  {

    id: '9',

    title: 'ChuchiPet',

    url: 'https://diegojimenez77.github.io/ChuchiPet/',

    description: 'Virtual Pet Game',

  },

  {

    id: '10',

    title: 'NotesApp',

    url: 'https://diegojimenez77.github.io/NotesApp/',

    description: 'App for quick notes',

  },

  {

    id: '11',

    title: 'Calculadora Financiera Personal',

    url: 'https://diegojimenez77.github.io/CalculadoraFinancieraPersonal/',

    description: 'Persoal Finance App',

  },

  {

    id: '12',

    title: 'Full Stack Course',

    url: 'https://diegojimenez77.github.io/Coding-Exercises/',

    description: 'Web Development Course Exerceses',

  },

  {

    id: '13',

    title: 'DJP Coding Porfolio - Beginer',

    url: 'https://diegojimenez77.github.io/DJPportfolio/',

    description: 'Personal Coding Portfolioo',

  },

  {

    id: '14',

    title: 'Social App',

    url: 'https://diegojimenez77-social-app.netlify.app/',

    description: 'Lama Dev Social App',

  }

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

