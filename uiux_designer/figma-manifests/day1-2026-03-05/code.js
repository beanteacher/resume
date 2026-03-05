figma.showUI(__html__, { width: 360, height: 520 });

const FRAME_SPECS = [
  { name: "🎨 Color Palette - Dark Mode", width: 1440, height: 900, category: "foundation" },
  { name: "🎨 Color Palette - Light Mode", width: 1440, height: 900, category: "foundation" },
  { name: "📝 Typography Scale", width: 1440, height: 1200, category: "foundation" },
  { name: "📐 Spacing System", width: 1440, height: 600, category: "foundation" },
  { name: "🔘 Button - Primary / Secondary / Ghost", width: 1440, height: 400, category: "component" },
  { name: "🃏 Card Component", width: 1440, height: 600, category: "component" },
  { name: "🦸 Hero Section - PC (1440px)", width: 1440, height: 900, category: "wireframe" },
  { name: "🦸 Hero Section - Mobile (375px)", width: 375, height: 812, category: "wireframe" },
  { name: "👤 About Section - PC", width: 1440, height: 700, category: "wireframe" },
  { name: "💼 Experience Section - PC", width: 1440, height: 1000, category: "wireframe" },
  { name: "⚡ Skills Section - PC", width: 1440, height: 800, category: "wireframe" },
  { name: "🚀 Projects Section - PC", width: 1440, height: 1200, category: "wireframe" },
  { name: "📬 Contact Section - PC", width: 1440, height: 600, category: "wireframe" }
];

const CATEGORY_COLOR = {
  foundation: { r: 0.129, g: 0.212, b: 0.329 },
  component: { r: 0.145, g: 0.314, b: 0.580 },
  wireframe: { r: 0.286, g: 0.188, b: 0.525 }
};

async function loadFontSafe() {
  const candidates = [
    { family: "Inter", style: "Bold" },
    { family: "Inter", style: "Regular" },
    { family: "Roboto", style: "Bold" },
    { family: "Roboto", style: "Regular" }
  ];

  for (let i = 0; i < candidates.length; i += 1) {
    try {
      await figma.loadFontAsync(candidates[i]);
      return candidates[i];
    } catch (error) {
      // try next candidate
    }
  }

  throw new Error("사용 가능한 폰트를 로드하지 못했습니다.");
}

async function createFrameFromSpec(spec, x, y, titleFont) {
  const frame = figma.createFrame();
  frame.name = spec.name;
  frame.x = x;
  frame.y = y;
  frame.resize(spec.width, spec.height);
  frame.fills = [{ type: "SOLID", color: { r: 0.973, g: 0.980, b: 0.988 } }];

  const header = figma.createRectangle();
  header.resize(spec.width, 64);
  header.fills = [{ type: "SOLID", color: CATEGORY_COLOR[spec.category] || CATEGORY_COLOR.foundation }];
  frame.appendChild(header);

  const title = figma.createText();
  title.fontName = titleFont;
  title.characters = spec.name;
  title.fontSize = 20;
  title.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  title.x = 24;
  title.y = 18;
  frame.appendChild(title);

  const meta = figma.createText();
  meta.fontName = titleFont;
  meta.characters = "Category: " + spec.category + "  Size: " + spec.width + "x" + spec.height;
  meta.fontSize = 14;
  meta.fills = [{ type: "SOLID", color: { r: 0.247, g: 0.314, b: 0.392 } }];
  meta.x = 24;
  meta.y = 84;
  frame.appendChild(meta);

  figma.currentPage.appendChild(frame);
  return frame;
}

async function buildFramesByCategory(category) {
  const targetSpecs = category === "all"
    ? FRAME_SPECS
    : FRAME_SPECS.filter((spec) => spec.category === category);

  if (targetSpecs.length === 0) {
    figma.notify("생성할 프레임이 없습니다.", { error: true });
    return;
  }

  const titleFont = await loadFontSafe();
  const built = [];
  const startX = figma.viewport.center.x + 120;
  const startY = figma.viewport.center.y + 120;

  let x = startX;
  let y = startY;
  const gapX = 120;
  const gapY = 120;
  const maxColumns = 2;

  for (let i = 0; i < targetSpecs.length; i += 1) {
    const spec = targetSpecs[i];
    const frame = await createFrameFromSpec(spec, x, y, titleFont);
    built.push(frame);

    if ((i + 1) % maxColumns === 0) {
      x = startX;
      y += Math.max(spec.height, 900) + gapY;
    } else {
      x += spec.width + gapX;
    }
  }

  figma.viewport.scrollAndZoomIntoView(built);
  figma.notify("프레임 " + built.length + "개 생성 완료");
}

figma.ui.onmessage = async (msg) => {
  try {
    if (!msg || !msg.type) {
      return;
    }

    if (msg.type === "build-all") {
      await buildFramesByCategory("all");
      return;
    }

    if (msg.type === "build-foundation") {
      await buildFramesByCategory("foundation");
      return;
    }

    if (msg.type === "build-component") {
      await buildFramesByCategory("component");
      return;
    }

    if (msg.type === "build-wireframe") {
      await buildFramesByCategory("wireframe");
      return;
    }

    if (msg.type === "close") {
      figma.closePlugin();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    figma.notify("오류: " + message, { error: true });
  }
};
