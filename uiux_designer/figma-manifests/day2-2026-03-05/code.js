figma.showUI(__html__, { width: 360, height: 560 });

const FRAME_SPECS = [
  { name: "🦸 Hero Section - PC (1440px)",        width: 1440, height: 900,  category: "hero" },
  { name: "🦸 Hero Section - Mobile (375px)",      width: 375,  height: 812,  category: "hero" },
  { name: "👤 About Section - PC (1440px)",         width: 1440, height: 800,  category: "about" },
  { name: "👤 About Section - Mobile (375px)",      width: 375,  height: 900,  category: "about" },
  { name: "💡 Philosophy Section - PC (1440px)",    width: 1440, height: 700,  category: "philosophy" },
  { name: "💡 Philosophy Section - Mobile (375px)", width: 375,  height: 900,  category: "philosophy" },
  { name: "💼 Experience Section - PC (1440px)",    width: 1440, height: 1200, category: "experience" },
  { name: "💼 Experience Section - Mobile (375px)", width: 375,  height: 1400, category: "experience" },
  { name: "⚡ Skills Section - PC (1440px)",        width: 1440, height: 900,  category: "skills" },
  { name: "⚡ Skills Section - Mobile (375px)",     width: 375,  height: 1000, category: "skills" },
  { name: "🚀 Projects Section - PC (1440px)",      width: 1440, height: 1200, category: "projects" },
  { name: "🚀 Projects Section - Mobile (375px)",   width: 375,  height: 1400, category: "projects" },
  { name: "📬 Contact Section - PC (1440px)",       width: 1440, height: 600,  category: "contact" },
  { name: "📬 Contact Section - Mobile (375px)",    width: 375,  height: 700,  category: "contact" }
];

const CATEGORY_COLOR = {
  hero:        { r: 0.486, g: 0.227, b: 0.929 }, // #7C3AED
  about:       { r: 0.231, g: 0.510, b: 0.965 }, // #3B82F6
  philosophy:  { r: 0.024, g: 0.714, b: 0.831 }, // #06B6D4
  experience:  { r: 0.263, g: 0.220, b: 0.792 }, // #4338CA
  skills:      { r: 0.600, g: 0.200, b: 0.800 }, // #9933CC
  projects:    { r: 0.145, g: 0.388, b: 0.922 }, // #2563EB
  contact:     { r: 0.063, g: 0.725, b: 0.506 }  // #10B981
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

function drawSectionHeader(frame, spec, titleFont) {
  createRect(frame, 0, 0, spec.width, 64, CATEGORY_COLOR[spec.category] || CATEGORY_COLOR.hero, 0);
  createText(frame, 24, 18, spec.name, titleFont, 20, { r: 1, g: 1, b: 1 });
  createText(frame, 24, 84, "Section: " + spec.category + "  Size: " + spec.width + "x" + spec.height, titleFont, 14, PALETTE.muted);
}

function drawHero(frame, spec, titleFont, isMobile) {
  const margin = isMobile ? 20 : 72;
  const width = spec.width - margin * 2;
  createRect(frame, margin, 156, width * (isMobile ? 1 : 0.56), isMobile ? 160 : 220, PALETTE.elevated, 14);
  createRect(frame, margin, isMobile ? 340 : 400, width * (isMobile ? 1 : 0.4), 52, CATEGORY_COLOR.hero, 12);
  createRect(frame, isMobile ? margin : margin + width * 0.62, 156, isMobile ? width : width * 0.38, isMobile ? 220 : 340, PALETTE.surface, 14);
  createText(frame, margin + 20, 184, "Hero Headline", titleFont, isMobile ? 28 : 44, PALETTE.text);
}

function drawAbout(frame, spec, titleFont, isMobile) {
  const margin = isMobile ? 20 : 72;
  const width = spec.width - margin * 2;
  createRect(frame, margin, 156, isMobile ? width : 280, isMobile ? 200 : 280, PALETTE.elevated, 14);
  createRect(frame, isMobile ? margin : margin + 320, 156, isMobile ? width : width - 320, isMobile ? 300 : 280, PALETTE.surface, 14);
  createText(frame, isMobile ? margin + 16 : margin + 340, 184, "About Content", titleFont, 28, PALETTE.text);
}

function drawPhilosophy(frame, spec, titleFont, isMobile) {
  const margin = isMobile ? 20 : 72;
  const width = spec.width - margin * 2;
  const cols = isMobile ? 1 : 2;
  const gap = 20;
  const cardW = Math.floor((width - gap * (cols - 1)) / cols);
  for (let i = 0; i < 4; i += 1) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    createRect(frame, margin + col * (cardW + gap), 156 + row * 170, cardW, 150, PALETTE.elevated, 12);
  }
  createText(frame, margin + 8, 126, "Philosophy Cards", titleFont, 24, PALETTE.text);
}

function drawExperience(frame, spec, titleFont, isMobile) {
  const margin = isMobile ? 20 : 72;
  const lineX = isMobile ? margin + 24 : margin + 120;
  createRect(frame, lineX, 172, 6, spec.height - 240, CATEGORY_COLOR.experience, 4);
  for (let i = 0; i < 4; i += 1) {
    const y = 190 + i * 210;
    createRect(frame, lineX - 12, y + 16, 30, 30, CATEGORY_COLOR.experience, 9999);
    createRect(frame, isMobile ? margin + 56 : margin + 170, y, isMobile ? spec.width - (margin + 56) - margin : spec.width - (margin + 170) - margin, 150, PALETTE.elevated, 12);
  }
  createText(frame, margin + 8, 126, "Experience Timeline", titleFont, 24, PALETTE.text);
}

function drawSkills(frame, spec, titleFont, isMobile) {
  const margin = isMobile ? 20 : 72;
  const width = spec.width - margin * 2;
  const cols = isMobile ? 1 : 3;
  const gap = 20;
  const cardW = Math.floor((width - gap * (cols - 1)) / cols);
  for (let i = 0; i < 6; i += 1) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = margin + col * (cardW + gap);
    const y = 156 + row * 170;
    createRect(frame, x, y, cardW, 150, PALETTE.elevated, 12);
    for (let d = 0; d < 5; d += 1) {
      createRect(frame, x + 20 + d * 18, y + 100, 12, 12, d < 3 ? CATEGORY_COLOR.skills : PALETTE.surface, 9999);
    }
  }
  createText(frame, margin + 8, 126, "Skills Grid", titleFont, 24, PALETTE.text);
}

function drawProjects(frame, spec, titleFont, isMobile) {
  const margin = isMobile ? 20 : 72;
  const width = spec.width - margin * 2;
  const cols = isMobile ? 1 : 3;
  const gap = 20;
  const cardW = Math.floor((width - gap * (cols - 1)) / cols);
  for (let i = 0; i < 6; i += 1) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = margin + col * (cardW + gap);
    const y = 156 + row * 220;
    createRect(frame, x, y, cardW, 200, PALETTE.elevated, 12);
    createRect(frame, x + 16, y + 16, cardW - 32, 84, PALETTE.surface, 10);
  }
  createText(frame, margin + 8, 126, "Projects Grid", titleFont, 24, PALETTE.text);
}

function drawContact(frame, spec, titleFont, isMobile) {
  const margin = isMobile ? 20 : 72;
  const width = spec.width - margin * 2;
  const cols = isMobile ? 1 : 3;
  const gap = 20;
  const cardW = Math.floor((width - gap * (cols - 1)) / cols);
  for (let i = 0; i < cols; i += 1) {
    createRect(frame, margin + i * (cardW + gap), 200, cardW, 160, PALETTE.elevated, 12);
  }
  createText(frame, margin + 8, 150, "Contact Cards", titleFont, 24, PALETTE.text);
}

async function createFrameFromSpec(spec, x, y, titleFont) {
  const frame = figma.createFrame();
  frame.name = spec.name;
  frame.x = x;
  frame.y = y;
  frame.resize(spec.width, spec.height);
  frame.fills = [{ type: "SOLID", color: PALETTE.bg }];
  drawSectionHeader(frame, spec, titleFont);

  const isMobile = spec.width <= 430;
  if (spec.category === "hero") {
    drawHero(frame, spec, titleFont, isMobile);
  } else if (spec.category === "about") {
    drawAbout(frame, spec, titleFont, isMobile);
  } else if (spec.category === "philosophy") {
    drawPhilosophy(frame, spec, titleFont, isMobile);
  } else if (spec.category === "experience") {
    drawExperience(frame, spec, titleFont, isMobile);
  } else if (spec.category === "skills") {
    drawSkills(frame, spec, titleFont, isMobile);
  } else if (spec.category === "projects") {
    drawProjects(frame, spec, titleFont, isMobile);
  } else if (spec.category === "contact") {
    drawContact(frame, spec, titleFont, isMobile);
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

    const sectionTypes = ["hero", "about", "philosophy", "experience", "skills", "projects", "contact"];
    for (let i = 0; i < sectionTypes.length; i += 1) {
      if (msg.type === "build-" + sectionTypes[i]) {
        await buildFramesByCategory(sectionTypes[i]);
        return;
      }
    }

    if (msg.type === "close") {
      figma.closePlugin();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    figma.notify("오류: " + message, { error: true });
  }
};
