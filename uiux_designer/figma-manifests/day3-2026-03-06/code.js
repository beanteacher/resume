figma.showUI(__html__, { width: 320, height: 480 });

const FRAME_SPECS = [
  { name: "ProjectDetail-PC",     width: 1440, height: 900,  category: "projects" },
  { name: "ProjectDetail-Mobile", width: 375,  height: 812,  category: "projects" },
  { name: "Skills-PC",            width: 1440, height: 900,  category: "skills" },
  { name: "Skills-Mobile",        width: 375,  height: 812,  category: "skills" }
];

const CATEGORY_COLOR = {
  projects: { r: 0.145, g: 0.388, b: 0.922 }, // #2563EB
  skills:   { r: 0.600, g: 0.200, b: 0.800 }  // #9933CC
};

const PALETTE = {
  bg: { r: 0.031, g: 0.031, b: 0.071 },
  surface: { r: 0.067, g: 0.067, b: 0.125 },
  elevated: { r: 0.102, g: 0.102, b: 0.180 },
  text: { r: 0.941, g: 0.941, b: 1 },
  muted: { r: 0.545, g: 0.545, b: 0.655 }
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
  createRect(frame, 0, 0, spec.width, 64, CATEGORY_COLOR[spec.category] || CATEGORY_COLOR.projects, 0);
  createText(frame, 24, 18, spec.name, titleFont, 20, { r: 1, g: 1, b: 1 });
  createText(frame, 24, 84, "Category: " + spec.category + "  Size: " + spec.width + "x" + spec.height, titleFont, 14, PALETTE.muted);
}

function drawProjectDetail(frame, spec, titleFont, isMobile) {
  const margin = isMobile ? 20 : 72;
  const width = spec.width - margin * 2;

  createRect(frame, margin, 150, width, isMobile ? 200 : 320, PALETTE.elevated, 14);
  createText(frame, margin + 20, 182, "Project Title", titleFont, isMobile ? 28 : 40, PALETTE.text);

  createRect(frame, margin, isMobile ? 378 : 490, width, isMobile ? 220 : 240, PALETTE.surface, 14);
  createRect(frame, margin, isMobile ? 620 : 750, width, isMobile ? 140 : 120, PALETTE.surface, 14);

  const badgeCount = isMobile ? 3 : 5;
  for (let i = 0; i < badgeCount; i += 1) {
    createRect(frame, margin + 20 + i * 120, isMobile ? 540 : 640, 100, 36, CATEGORY_COLOR.projects, 9999);
  }
}

function drawSkills(frame, spec, titleFont, isMobile) {
  const margin = isMobile ? 20 : 72;
  const width = spec.width - margin * 2;
  const cols = isMobile ? 1 : 2;
  const gap = 20;
  const cardW = Math.floor((width - gap * (cols - 1)) / cols);

  createText(frame, margin, 150, "Skills", titleFont, isMobile ? 32 : 44, PALETTE.text);
  for (let i = 0; i < 6; i += 1) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = margin + col * (cardW + gap);
    const y = 220 + row * 150;
    createRect(frame, x, y, cardW, 130, PALETTE.elevated, 12);
    createText(frame, x + 16, y + 16, "Category " + (i + 1), titleFont, 16, PALETTE.text);
    for (let d = 0; d < 5; d += 1) {
      createRect(frame, x + 18 + d * 20, y + 84, 12, 12, d < 4 ? CATEGORY_COLOR.skills : PALETTE.surface, 9999);
    }
  }
}

async function createFrameFromSpec(spec, x, y, titleFont) {
  const frame = figma.createFrame();
  frame.name = spec.name;
  frame.x = x;
  frame.y = y;
  frame.resize(spec.width, spec.height);
  frame.fills = [{ type: "SOLID", color: PALETTE.bg }];
  drawHeader(frame, spec, titleFont);

  const isMobile = spec.width <= 430;
  if (spec.category === "projects") {
    drawProjectDetail(frame, spec, titleFont, isMobile);
  } else if (spec.category === "skills") {
    drawSkills(frame, spec, titleFont, isMobile);
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

    if (msg.type === "import-all") {
      await buildFramesByCategory("all");
      return;
    }

    if (msg.type === "import-project-detail") {
      await buildFramesByCategory("projects");
      return;
    }

    if (msg.type === "import-skills") {
      await buildFramesByCategory("skills");
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
