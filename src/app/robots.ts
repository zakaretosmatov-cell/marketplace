import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/seller', '/profile', '/checkout', '/orders'],
      },
    ],
    sitemap: 'https://mymarketplace-0111.netlify.app/sitemap.xml',
  };
}
