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
