export interface navItem {
  label: string;
  href: string;
  key?: string;
}


export const navItems: navItem[] = [
  { label: 'WORKS', href: '/works' },
  { label: 'GALLERY', href: '/gallery' },
  { label: 'MOVIE', href: '/#movie', key: 'movie' },
  { label: 'ABOUT', href: '/about' },
  { label: 'NEWS', href: '/news' },
  { label: 'CONTACT', href: '/contact#contact-form' },
];
