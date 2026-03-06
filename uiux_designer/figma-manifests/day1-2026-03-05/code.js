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

const PALETTE = {
  lightBg: { r: 0.973, g: 0.980, b: 0.988 },
  lightSurface: { r: 0.941, g: 0.949, b: 0.965 },
  darkText: { r: 0.122, g: 0.161, b: 0.224 },
  mutedText: { r: 0.247, g: 0.314, b: 0.392 },
  white: { r: 1, g: 1, b: 1 },
  purple: { r: 0.486, g: 0.227, b: 0.929 },
  blue: { r: 0.231, g: 0.510, b: 0.965 },
  cyan: { r: 0.024, g: 0.714, b: 0.831 },
  green: { r: 0.063, g: 0.725, b: 0.506 }
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

function createRect(frame, x, y, width, height, color, radius) {
  const rect = figma.createRectangle();
  rect.x = x;
  rect.y = y;
  rect.resize(width, height);
  rect.fills = [{ type: "SOLID", color: color }];
  if (typeof radius === "number") {
    rect.cornerRadius = radius;
  }
  frame.appendChild(rect);
  return rect;
}

function createText(frame, x, y, text, fontName, size, color) {
  const node = figma.createText();
  node.fontName = fontName;
  node.characters = text;
  node.fontSize = size;
  node.fills = [{ type: "SOLID", color: color }];
  node.x = x;
  node.y = y;
  frame.appendChild(node);
  return node;
}

function drawHeader(frame, spec, titleFont) {
  createRect(frame, 0, 0, spec.width, 64, CATEGORY_COLOR[spec.category] || CATEGORY_COLOR.foundation, 0);
  createText(frame, 24, 18, spec.name, titleFont, 20, PALETTE.white);
  createText(frame, 24, 84, "Category: " + spec.category + "  Size: " + spec.width + "x" + spec.height, titleFont, 14, PALETTE.mutedText);
}

function drawColorPalette(frame, spec, titleFont) {
  const colors = [PALETTE.darkText, PALETTE.mutedText, PALETTE.purple, PALETTE.blue, PALETTE.cyan, PALETTE.green];
  const names = ["Text", "Muted", "Purple", "Blue", "Cyan", "Green"];
  const startX = 64;
  const startY = 150;
  const box = 170;
  const gap = 32;
  for (let i = 0; i < colors.length; i += 1) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = startX + col * (box + gap);
    const y = startY + row * (box + 70);
    createRect(frame, x, y, box, box, colors[i], 16);
    createText(frame, x, y + box + 14, names[i], titleFont, 16, PALETTE.darkText);
  }
}

function drawTypography(frame, spec, titleFont) {
  const rows = [56, 40, 32, 24, 18, 16, 14, 12];
  let y = 150;
  for (let i = 0; i < rows.length; i += 1) {
    createText(frame, 64, y, "Typography " + rows[i] + "px", titleFont, rows[i], PALETTE.darkText);
    y += rows[i] + 26;
    if (y > spec.height - 80) {
      break;
    }
  }
}

function drawSpacing(frame, spec, titleFont) {
  const spaces = [4, 8, 16, 24, 32, 48, 64, 96];
  let y = 170;
  for (let i = 0; i < spaces.length; i += 1) {
    createText(frame, 64, y - 24, "spacing-" + spaces[i], titleFont, 14, PALETTE.mutedText);
    createRect(frame, 64, y, spaces[i] * 6, 18, PALETTE.blue, 6);
    y += 48;
  }
}

function drawButtons(frame, spec, titleFont) {
  const y = 180;
  createRect(frame, 90, y, 260, 56, PALETTE.purple, 12);
  createText(frame, 190, y + 18, "Primary", titleFont, 18, PALETTE.white);
  createRect(frame, 390, y, 260, 56, PALETTE.blue, 12);
  createText(frame, 485, y + 18, "Secondary", titleFont, 18, PALETTE.white);
  createRect(frame, 690, y, 260, 56, PALETTE.lightBg, 12);
  createText(frame, 800, y + 18, "Ghost", titleFont, 18, PALETTE.darkText);
}

function drawCards(frame, spec, titleFont) {
  const cardW = Math.min(380, Math.floor((spec.width - 180) / 3));
  for (let i = 0; i < 3; i += 1) {
    const x = 60 + i * (cardW + 30);
    createRect(frame, x, 170, cardW, 300, PALETTE.lightSurface, 16);
    createRect(frame, x + 20, 196, cardW - 40, 120, PALETTE.purple, 12);
    createText(frame, x + 20, 340, "Card Title", titleFont, 22, PALETTE.darkText);
    createRect(frame, x + 20, 382, cardW - 40, 12, PALETTE.mutedText, 6);
    createRect(frame, x + 20, 406, cardW - 80, 12, PALETTE.mutedText, 6);
  }
}

function drawWireframeSection(frame, spec, titleFont) {
  const isMobile = spec.width <= 430;
  const margin = isMobile ? 20 : 60;
  const contentW = spec.width - margin * 2;
  const top = 150;

  createRect(frame, margin, top, contentW, 72, PALETTE.lightSurface, 12);
  createRect(frame, margin, top + 96, contentW, isMobile ? 220 : 280, PALETTE.lightSurface, 12);

  const cards = isMobile ? 1 : 3;
  const gap = 20;
  const cardW = Math.floor((contentW - gap * (cards - 1)) / cards);
  for (let i = 0; i < cards; i += 1) {
    const x = margin + i * (cardW + gap);
    createRect(frame, x, top + 400, cardW, 180, PALETTE.lightSurface, 12);
  }

  createText(frame, margin + 16, top + 24, "Section Wireframe", titleFont, 20, PALETTE.darkText);
}

async function createFrameFromSpec(spec, x, y, titleFont) {
  const frame = figma.createFrame();
  frame.name = spec.name;
  frame.x = x;
  frame.y = y;
  frame.resize(spec.width, spec.height);
  frame.fills = [{ type: "SOLID", color: PALETTE.lightBg }];
  drawHeader(frame, spec, titleFont);

  if (spec.name.indexOf("Color Palette") !== -1) {
    drawColorPalette(frame, spec, titleFont);
  } else if (spec.name.indexOf("Typography") !== -1) {
    drawTypography(frame, spec, titleFont);
  } else if (spec.name.indexOf("Spacing") !== -1) {
    drawSpacing(frame, spec, titleFont);
  } else if (spec.name.indexOf("Button") !== -1) {
    drawButtons(frame, spec, titleFont);
  } else if (spec.name.indexOf("Card") !== -1) {
    drawCards(frame, spec, titleFont);
  } else {
    drawWireframeSection(frame, spec, titleFont);
  }

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
