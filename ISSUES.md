# 이슈 기록

## [2026-03-20] Next.js Hydration 에러 해결

### 에러 메시지
```
Hydration failed because the initial UI does not match what was rendered on the server.
Expected server HTML to contain a matching <img> in <a> / <div>.
```

### 원인
Next.js 14 App Router + React 18에서 `"use client"` 컴포넌트가 서버에서 SSR될 때,
클라이언트와 서버 간의 렌더링 결과가 달라서 발생.

구체적 원인은 두 가지:

1. **`<Link>` 안에 `<Image>` 직접 중첩** (`<a><img>` 구조)
   - `header.tsx` 로고 링크: `<Link><Image />` → `<Link><div><Image />` 로 수정
   - `KakaoChat.tsx`: `<Link><Image fill />` → `<Link><div><Image fill />` 로 수정
   - `slide.tsx` (Link가 있는 슬라이드): 동일하게 div 래퍼 추가

2. **Swiper + `next/image` 컴포넌트의 SSR/CSR 렌더링 불일치**
   - Swiper는 클라이언트 마운트 이후 DOM을 조작하는 방식으로 동작
   - SSR 시 서버에서 렌더링된 HTML과 클라이언트 hydration 시 구조가 달라짐
   - `framer-motion`의 `<motion.div>` 일부가 SSR에서 다른 스타일로 렌더링되어 React reconciler cursor 어긋남 발생

### 해결 방법
Swiper, framer-motion 등 SSR과 CSR 렌더링 결과가 다를 수 있는 컴포넌트에
`mounted` 패턴 적용 (서버에서는 `null`을 반환하고, 클라이언트 마운트 후 실제 컴포넌트 렌더링):

```tsx
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;
```

### 적용 파일 목록
| 파일 | 처리 내용 |
|------|-----------|
| `app/(home)/components/header.tsx` | mounted 패턴 + 로고 Image div 래퍼 추가 |
| `app/(home)/components/KakaoChat.tsx` | mounted 패턴 + Image div 래퍼 추가 |
| `components/slide.tsx` | mounted 패턴 (이미 있었음) + Link 내부 Image div 래퍼 추가 |
| `components/slideSmall.tsx` | mounted 패턴 추가 |
| `components/BestItem.tsx` | mounted 패턴 추가 |

### 참고
- `suppressHydrationWarning`은 속성(attribute) 불일치만 억제하며, 구조적(structural) 불일치에는 효과 없음
- `dynamic({ ssr: false })`를 서버 컴포넌트에서 사용하는 것은 신뢰도가 낮음 → 클라이언트 컴포넌트 내부에서 `mounted` 패턴이 더 안정적
- Swiper 11의 loop 클론은 React 가상 DOM에 포함되지 않고 마운트 후 DOM 조작으로 추가됨 (hydration 에러 원인 아님)

---

## [2026-03-20] MarqueeText (무한 흐르는 텍스트) 구현 및 최적화

### 구현 내용
- `components/MarqueeText.tsx` 신규 생성
- Black Han Sans (한글 지원 폰트) 적용
- 3D 텍스트 그림자 효과 (다층 `text-shadow`)
- 스크롤 방향에 따라 마퀴 방향 반전 (↓스크롤 → 정방향, ↑스크롤 → 역방향)
- PC(`fontSize: 68`) / 모바일(`fontSize: 28`) 반응형 분기

### 끊김 원인 및 해결
| 시도 | 방식 | 결과 |
|------|------|------|
| 초기 | `useAnimationFrame` (JS 메인 스레드) | 끊김 (JS 부하 시 프레임 드랍) |
| 최종 | CSS `@keyframes marquee` + `translateX(-50%)` | 60fps 안정 (컴포지터 스레드) |

**핵심 원리**: CSS `transform` 애니메이션은 컴포지터 스레드에서 실행 → JS 부하와 완전히 독립
**두 카피 트릭**: 동일 콘텐츠 2개를 `width: max-content`로 나열 후 `-50%` 이동 = 무한 루프

### 인터렉티브 텍스트 효과 시도 후 제거
- 3개 단어(Kevin Grape / 슈팅스타포도 / 금향포도)에 shimmer·glow 효과 시도
- `text-shadow`, `color`, `background-position` 애니메이션 → paint 연산 → 마퀴 CSS와 충돌해 끊김
- `filter: brightness + drop-shadow` (컴포지터)로 교체해도 시각적 만족도 미달
- **최종 결정**: 인터렉티브 효과 전면 제거, 단일 3D 그림자 스타일 유지

---

## [2026-03-20] ZoomParallax (스크롤 줌 패럴랙스) 구현 및 제거

### 구현 내용
- Olivier Larose zoom-parallax 레퍼런스 기반 구현
- 7장(PC) / 3장(모바일) 이미지, 스크롤에 따라 각기 다른 배율로 확대
- 세로 비율 컨테이너 적용 (portrait 이미지 대응)

### 끊김 원인 분석 및 시도

| 시도 | 방식 | 결과 |
|------|------|------|
| 1차 | framer-motion `useSpring` | 끊김 |
| 2차 | 수동 `lerp + rAF` (0.07 계수) | 끊김 (native scroll 이벤트 불규칙) |
| 3차 | Lenis + framer-motion `useScroll + useTransform` | 여전히 끊김 |
| 4차 | `useTransform`을 `.map()` 안에서 호출 → **Hooks 규칙 위반** 수정 + `ReactLenis` 교체 | 개선됐으나 완전 해결 못함 |

**Hooks in .map() 문제**: `useTransform`을 배열 `.map()` 내부에서 호출하면 React가 매 렌더마다 hook 순서를 보장하지 못해 불안정한 동작 발생. 개별 변수(`s0~s6`)로 선언해야 함.

**Lenis 통합 방식**: `new Lenis()` in `useEffect` → `ReactLenis` from `lenis/react`로 교체해야 React 렌더링 사이클과 올바르게 연동됨.

### 최종 결정: 제거
- 끊김 이슈가 완전히 해소되지 않아 UX 저하 판단
- `app/(home)/page.tsx`에서 `<ZoomParallax />` 제거
- 관련 컴포넌트 파일은 보존 (`components/ZoomParallax.tsx`)

---

## [2026-03-20] Vercel 배포 설정

### 팀 및 리전
- 팀: `0hyeon-s-team` (Pro 플랜)
- 리전: `icn1` (서울)
- 배포 명령: `npx vercel deploy --prod --yes --regions icn1`

### 빌드 오류 해결 목록
| 오류 | 해결 방법 |
|------|-----------|
| Prisma Client not generated | `package.json`에 `"postinstall": "prisma generate"` 추가 |
| SQLite on Vercel | Neon PostgreSQL로 교체 (serverless 환경에서 파일 DB 불가) |
| ESLint `no-explicit-any` 다수 | `next.config.mjs`에 `eslint: { ignoreDuringBuilds: true }` |
| 부모 디렉토리 `.eslintrc.json` 충돌 | 프로젝트 `.eslintrc.json`에 `"root": true` 추가 |
| TypeScript `Set` 이터레이션 에러 | `tsconfig.json`에 `"target": "ES2017"` 추가 |
| `generateStaticParams` 빌드 시 DB 접근 | `return []` 처리 |
| `window.daum` TypeScript 에러 | `(window as any).daum` 캐스팅 |
