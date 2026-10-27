/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/admin/:path*', destination: '/parshad', permanent: false },
      { source: '/admin', destination: '/parshad', permanent: false },
      { source: '/chairman/:path*', destination: '/parshad', permanent: false },
      { source: '/chairman', destination: '/parshad', permanent: false },
      { source: '/officer/:path*', destination: '/parshad', permanent: false },
      { source: '/officer', destination: '/parshad', permanent: false },
      { source: '/employee/:path*', destination: '/citizen', permanent: false },
      { source: '/employee', destination: '/citizen', permanent: false },
      { source: '/citizen/appointment/:path*', destination: '/citizen', permanent: false },
      { source: '/citizen/appointment', destination: '/citizen', permanent: false },
    ];
  },
};

export default nextConfig;
