// Site-wide settings (previously _config.yml). Plain JS so the build script can import it too.
export const site = {
  title: "Sakthivel",
  author: "Sakthivel",
  email: "sakthiveloffcl@gmail.com",
  url: "https://hardy07.github.io",
  description: "Learn. Build. Experiment. Repeat.",
  //image: "https://s.gravatar.com/avatar/2136e716a089f4a3794f4007328c7bfb?s=800",

  twitterUsername: "sakt2011",
  githubUsername: "hardy07",
  linkedinUsername: "sakthiveloffcl",

  homePostLimit: 5,
  commentsRepo: "hardy07/hardy07.github.io", // Utterances
  googleAnalyticsId: "G-RY6FRPMXHZ", // GA4

  // Was `header_pages` in _config.yml
  nav: [
    { title: "Archive", url: "/archive.html" },
    { title: "Bookmarks", url: "/bookmarks.html" },
  ],
};
