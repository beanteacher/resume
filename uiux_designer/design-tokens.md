# Resume Portfolio — Design Tokens

> **프로젝트**: Resume Portfolio
> **디자인 방향**: 크리에이티브 / 그라디언트 / 다크 모드 기본 / 한국어 전용
> **작성일**: 2026-03-05

---

## 1. Color Palette

### 1-1. Dark Mode (기본값)

| 토큰 이름       | Hex       | 용도                              |
|----------------|-----------|-----------------------------------|
| `bg-base`      | `#080812` | 최하단 배경 (body)                |
| `bg-surface`   | `#111120` | 카드, 패널 배경                   |
| `bg-elevated`  | `#1A1A2E` | 떠 있는 요소 (모달, 드롭다운)     |
| `border`       | `#2A2A3E` | 구분선, 보더                      |
| `text-primary` | `#F0F0FF` | 주요 본문 텍스트                  |
| `text-secondary`| `#8B8BA7`| 보조 텍스트, 설명                 |
| `brand-purple` | `#7C3AED` | 메인 브랜드 컬러                  |
| `brand-blue`   | `#3B82F6` | 보조 브랜드 컬러                  |
| `brand-cyan`   | `#06B6D4` | 액센트 컬러                       |

### 1-2. Light Mode

| 토큰 이름        | Hex       | 용도                              |
|-----------------|-----------|-----------------------------------|
| `bg-base`       | `#FAFAFA` | 최하단 배경 (body)                |
| `bg-surface`    | `#F5F5F7` | 카드, 패널 배경                   |
| `bg-elevated`   | `#ECECF0` | 떠 있는 요소 (모달, 드롭다운)     |
| `border`        | `#E2E2EA` | 구분선, 보더                      |
| `text-primary`  | `#0A0A1A` | 주요 본문 텍스트                  |
| `text-secondary`| `#6B6B85` | 보조 텍스트, 설명                 |
| `brand-purple`  | `#7C3AED` | 메인 브랜드 컬러 (다크와 동일)    |
| `brand-blue`    | `#3B82F6` | 보조 브랜드 컬러 (다크와 동일)    |
| `brand-cyan`    | `#06B6D4` | 액센트 컬러 (다크와 동일)         |

---

## 2. Gradients

| 토큰 이름       | 값                                                    | 용도                    |
|----------------|-------------------------------------------------------|-------------------------|
| `grad-hero`    | `linear-gradient(135deg, #7C3AED, #3B82F6, #06B6D4)` | 히어로 섹션 텍스트/배경  |
| `grad-cta`     | `linear-gradient(135deg, #7C3AED, #3B82F6)`           | CTA 버튼, 강조 요소      |
| `grad-subtle`  | `linear-gradient(135deg, #7C3AED22, #3B82F622)`       | 카드 호버, 배경 미묘한 효과 |
| `grad-border`  | `linear-gradient(135deg, #7C3AED, #06B6D4)`           | 그라디언트 보더          |

---

## 3. Typography Scale

> **폰트**: Pretendard (가변 폰트, Google Fonts / Pretendard CDN)
> **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

| 토큰 이름    | Size   | Weight | Line-height | 용도                        |
|-------------|--------|--------|-------------|-----------------------------|
| `display`   | 56px   | 800    | 1.15        | 히어로 메인 타이틀           |
| `h1`        | 40px   | 700    | 1.2         | 섹션 제목                   |
| `h2`        | 32px   | 700    | 1.25        | 서브 섹션 제목              |
| `h3`        | 24px   | 600    | 1.3         | 카드 제목, 소제목           |
| `body1`     | 18px   | 400    | 1.6         | 주요 본문                   |
| `body2`     | 16px   | 400    | 1.6         | 일반 본문                   |
| `caption`   | 14px   | 400    | 1.5         | 보조 설명, 날짜, 태그       |
| `small`     | 12px   | 400    | 1.4         | 최소 텍스트 (툴팁, 메타)    |

---

## 4. Spacing System (8px Grid)

| 토큰 이름   | 값     | px  |
|------------|--------|-----|
| `space-1`  | 0.25rem| 4px |
| `space-2`  | 0.5rem | 8px |
| `space-4`  | 1rem   | 16px|
| `space-6`  | 1.5rem | 24px|
| `space-8`  | 2rem   | 32px|
| `space-12` | 3rem   | 48px|
| `space-16` | 4rem   | 64px|
| `space-24` | 6rem   | 96px|
| `space-32` | 8rem   |128px|

---

## 5. Border Radius

| 토큰 이름   | 값     | 용도                  |
|------------|--------|-----------------------|
| `radius-sm`| 6px    | 인풋, 소형 요소        |
| `radius-md`| 12px   | 카드, 버튼             |
| `radius-lg`| 20px   | 대형 카드, 모달        |
| `radius-xl`| 32px   | 히어로 섹션 이미지     |
| `radius-full`| 9999px | 뱃지, 태그, 아바타  |

---

## 6. Shadow

| 토큰 이름      | 값                                        | 용도            |
|---------------|-------------------------------------------|-----------------|
| `shadow-sm`   | `0 1px 3px rgba(0,0,0,0.3)`              | 기본 카드       |
| `shadow-md`   | `0 4px 16px rgba(0,0,0,0.4)`             | 호버 카드       |
| `shadow-lg`   | `0 8px 32px rgba(0,0,0,0.5)`             | 모달, 드롭다운  |
| `shadow-glow` | `0 0 24px rgba(124,58,237,0.4)`          | 브랜드 글로우   |

---

## 7. Transition

| 토큰 이름         | 값                         | 용도              |
|-----------------|----------------------------|-------------------|
| `transition-fast`| `150ms ease`              | 마이크로 인터랙션  |
| `transition-base`| `300ms ease`              | 기본 트랜지션      |
| `transition-slow`| `500ms ease`              | 페이지 전환, 펼침  |

---

## 8. Tailwind v4 @theme CSS 블록

> FE 개발자: `app/globals.css` 상단 `@import` 다음에 아래 블록을 붙여넣으세요.

```css
@import "tailwindcss";

@theme {
  /* ── Colors: Dark Mode Base ── */
  --color-bg-base: #080812;
  --color-bg-surface: #111120;
  --color-bg-elevated: #1A1A2E;
  --color-border: #2A2A3E;
  --color-text-primary: #F0F0FF;
  --color-text-secondary: #8B8BA7;

  /* ── Colors: Brand ── */
  --color-brand-purple: #7C3AED;
  --color-brand-blue: #3B82F6;
  --color-brand-cyan: #06B6D4;

  /* ── Colors: Light Mode (light class 또는 media query로 override) ── */
  --color-bg-base-light: #FAFAFA;
  --color-bg-surface-light: #F5F5F7;
  --color-bg-elevated-light: #ECECF0;
  --color-border-light: #E2E2EA;
  --color-text-primary-light: #0A0A1A;
  --color-text-secondary-light: #6B6B85;

  /* ── Typography ── */
  --font-sans: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  --font-size-display: 3.5rem;    /* 56px */
  --font-size-h1: 2.5rem;         /* 40px */
  --font-size-h2: 2rem;           /* 32px */
  --font-size-h3: 1.5rem;         /* 24px */
  --font-size-body1: 1.125rem;    /* 18px */
  --font-size-body2: 1rem;        /* 16px */
  --font-size-caption: 0.875rem;  /* 14px */
  --font-size-small: 0.75rem;     /* 12px */

  --font-weight-display: 800;
  --font-weight-h1: 700;
  --font-weight-h2: 700;
  --font-weight-h3: 600;
  --font-weight-body: 400;

  --line-height-tight: 1.15;
  --line-height-snug: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.6;

  /* ── Spacing (8px grid) ── */
  --spacing-1: 0.25rem;   /* 4px  */
  --spacing-2: 0.5rem;    /* 8px  */
  --spacing-4: 1rem;      /* 16px */
  --spacing-6: 1.5rem;    /* 24px */
  --spacing-8: 2rem;      /* 32px */
  --spacing-12: 3rem;     /* 48px */
  --spacing-16: 4rem;     /* 64px */
  --spacing-24: 6rem;     /* 96px */
  --spacing-32: 8rem;     /* 128px */

  /* ── Border Radius ── */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 32px;
  --radius-full: 9999px;

  /* ── Shadows ── */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 24px rgba(124, 58, 237, 0.4);

  /* ── Transitions ── */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;

  /* ── Gradients ── */
  --gradient-hero: linear-gradient(135deg, #7C3AED, #3B82F6, #06B6D4);
  --gradient-cta: linear-gradient(135deg, #7C3AED, #3B82F6);
  --gradient-subtle: linear-gradient(135deg, rgba(124,58,237,0.13), rgba(59,130,246,0.13));
  --gradient-border: linear-gradient(135deg, #7C3AED, #06B6D4);
}

/* ── Dark Mode (기본값) ── */
:root {
  color-scheme: dark;
  --bg: var(--color-bg-base);
  --surface: var(--color-bg-surface);
  --elevated: var(--color-bg-elevated);
  --border-color: var(--color-border);
  --text: var(--color-text-primary);
  --text-muted: var(--color-text-secondary);
}

/* ── Light Mode ── */
.light,
[data-theme="light"] {
  color-scheme: light;
  --bg: var(--color-bg-base-light);
  --surface: var(--color-bg-surface-light);
  --elevated: var(--color-bg-elevated-light);
  --border-color: var(--color-border-light);
  --text: var(--color-text-primary-light);
  --text-muted: var(--color-text-secondary-light);
}

/* ── Base Styles ── */
body {
  background-color: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  transition: background-color var(--transition-base), color var(--transition-base);
}
```

---

## 9. 컴포넌트 레퍼런스

### Button 변형

| 변형        | 배경                      | 텍스트         | 호버 효과               |
|------------|---------------------------|----------------|-------------------------|
| Primary    | `grad-cta` (그라디언트)    | `#FFFFFF`      | brightness(1.1) + glow  |
| Secondary  | `bg-elevated`             | `text-primary` | `bg-surface` 배경       |
| Ghost      | 투명                      | `brand-purple` | `bg-elevated` 배경      |

### Card 스타일

```
배경: bg-surface
보더: 1px solid border / 그라디언트 보더 (hover)
패딩: 24px (space-6)
반경: radius-md (12px)
그림자: shadow-sm → shadow-md (hover)
전환: transition-base (300ms)
```
