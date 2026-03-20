/** @type {import('next').NextConfig} */
const nextConfig = {
  // 마이그레이션 진행 중 — ESLint 빌드 체크 임시 비활성화
  eslint: {
    ignoreDuringBuilds: true,
  },
  // serverActions는 Next.js 14에서 기본값이므로 experimental 불필요 (경고 제거)
  // experimental: {
  //   serverActions: true,
  // },
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "imagedelivery.net",
      },
      {
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
