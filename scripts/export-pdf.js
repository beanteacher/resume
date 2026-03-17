// scripts/export-pdf.js
// 사용법: node scripts/export-pdf.js
// 사전 조건: npm run dev 실행 중 상태여야 함

const { chromium } = require('playwright')
const path = require('path')

async function exportPdf() {
  console.log('브라우저 실행 중...')
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

  console.log('페이지 로딩 중...')
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 })

  // 라이트 모드 강제 적용
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  })

  // 스크롤하여 InView 트리거 + 전체 콘텐츠 로드
  console.log('페이지 스크롤 중 (InView 트리거)...')
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let pos = 0
      const timer = setInterval(() => {
        pos += 600
        window.scrollTo(0, pos)
        if (pos >= document.body.scrollHeight) {
          clearInterval(timer)
          resolve()
        }
      }, 120)
    })
  })
  await page.waitForTimeout(1500)

  // 모든 InView 애니메이션 강제 표시 + 코드 줄바꿈 처리
  await page.evaluate(() => {
    // inline style로 설정된 opacity/transform을 직접 제거 (CSS !important로는 못 덮어씀)
    document.querySelectorAll('*').forEach((el) => {
      const htmlEl = el
      if (htmlEl.style) {
        htmlEl.style.opacity = '1'
        htmlEl.style.transform = 'none'
        htmlEl.style.animation = 'none'
        htmlEl.style.transition = 'none'
      }
    })

    const style = document.createElement('style')
    style.textContent = `
      * {
        opacity: 1 !important;
        transform: none !important;
        animation: none !important;
        transition: none !important;
      }
      /* 코드 블록 줄바꿈 */
      pre, code, pre *, code * {
        white-space: pre-wrap !important;
        word-break: break-all !important;
        overflow: visible !important;
        overflow-x: visible !important;
      }
      /* 코드 블록 컨테이너 overflow 제거 */
      .react-syntax-highlighter-line-number {
        min-width: 2em !important;
      }
    `
    document.head.appendChild(style)
  })

  // 코드 예시 버튼 전체 클릭
  await page.evaluate(() => window.scrollTo(0, 0))
  const codeButtons = await page.locator('button:has-text("코드 예시")').all()
  console.log(`코드 예시 버튼 ${codeButtons.length}개 펼치는 중...`)
  for (const btn of codeButtons) {
    await btn.scrollIntoViewIfNeeded()
    await btn.click()
    await page.waitForTimeout(400)
  }

  // 신택스 하이라이터 렌더링 대기
  await page.waitForTimeout(1500)

  // 헤더/네비 숨기기 (PDF에서 불필요)
  await page.evaluate(() => {
    const header = document.querySelector('header')
    if (header) header.style.display = 'none'
  })

  // PDF 출력
  const outputPath = path.join(process.cwd(), 'resume-오민성.pdf')
  console.log('PDF 생성 중...')
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' },
  })

  await browser.close()
  console.log(`✅ 완료: ${outputPath}`)
}

exportPdf().catch((err) => {
  console.error('❌ 실패:', err.message)
  process.exit(1)
})
