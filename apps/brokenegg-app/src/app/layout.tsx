import './global.css';

export const metadata = {
  title: 'Broken Egg — 3D Interactive Simulation',
  description:
    '도면 속에 갇혀 있던 제품을, 손으로 만지듯 보여주세요. 브로큰에그의 3D 인터랙션 시뮬레이션 · XR 산업안전 교육 솔루션.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
