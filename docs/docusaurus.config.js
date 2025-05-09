module.exports = {
  title: 'Flight Control',
  tagline: 'AI-driven code analysis & refactoring platform',
  url: 'https://your-org.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'your-org',
  projectName: 'flight-control',
  themeConfig: {
    navbar: {
      title: 'Flight Control',
      logo: {
        alt: 'Flight Control Logo',
        src: 'img/logo.svg',
      },
      items: [
        { to: '/docs/getting-started', label: 'Docs', position: 'left' },
        { href: 'https://github.com/your-org/flight-control', label: 'GitHub', position: 'right' },
      ],
    },
  },
};