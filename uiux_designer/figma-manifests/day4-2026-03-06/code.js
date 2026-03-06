figma.showUI(__html__, { width: 340, height: 560 });

const FRAME_SPECS = [
  { name: "Admin-Login-PC",          width: 1440, height: 900,  category: "admin" },
  { name: "Admin-Login-Mobile",      width: 375,  height: 812,  category: "admin" },
  { name: "Admin-Dashboard-PC",      width: 1440, height: 900,  category: "admin" },
  { name: "Admin-Dashboard-Mobile",  width: 375,  height: 812,  category: "admin" },
  { name: "Admin-Company-List-PC",   width: 1440, height: 900,  category: "admin" },
  { name: "Admin-Company-Form-PC",   width: 1440, height: 1000, category: "admin" },
  { name: "Admin-Project-List-PC",   width: 1440, height: 900,  category: "admin" },
  { name: "Admin-Project-Form-PC",   width: 1440, height: 1100, category: "admin" },
  { name: "Admin-Skill-List-PC",     width: 1440, height: 800,  category: "admin" },
  { name: "Admin-Skill-Form-PC",     width: 1440, height: 700,  category: "admin" }
];

const CATEGORY_COLOR = {
  hero:        { r: 0.486, g: 0.227, b: 0.929 }, // #7C3AED
  about:       { r: 0.231, g: 0.510, b: 0.965 }, // #3B82F6
  philosophy:  { r: 0.024, g: 0.714, b: 0.804 }, // #06B6D4
  experience:  { r: 0.263, g: 0.220, b: 0.792 }, // #4338CA
  skills:      { r: 0.600, g: 0.200, b: 0.800 }, // #9933CC
  projects:    { r: 0.145, g: 0.388, b: 0.922 }, // #2563EB
  contact:     { r: 0.063, g: 0.725, b: 0.506 }, // #10B981
  admin:       { r: 0.961, g: 0.620, b: 0.043 }  // #F59E0B
};

const PALETTE = {
  bg: { r: 0.031, g: 0.031, b: 0.071 },
  surface: { r: 0.067, g: 0.067, b: 0.125 },
  elevated: { r: 0.102, g: 0.102, b: 0.180 },
  border: { r: 0.165, g: 0.165, b: 0.243 },
  text: { r: 0.941, g: 0.941, b: 1 },
  muted: { r: 0.545, g: 0.545, b: 0.655 },
  accent: { r: 0.961, g: 0.620, b: 0.043 },
  positive: { r: 0.180, g: 0.780, b: 0.443 }
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

function createRect(frame, x, y, width, height, color, cornerRadius) {
  const rect = figma.createRectangle();
  rect.x = x;
  rect.y = y;
  rect.resize(width, height);
  rect.fills = [{ type: "SOLID", color: color }];
  if (typeof cornerRadius === "number") {
    rect.cornerRadius = cornerRadius;
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

function drawAdminShell(frame, spec, titleFont) {
  const isMobile = spec.width <= 430;
  const top = createRect(frame, 0, 0, spec.width, 64, CATEGORY_COLOR.admin);
  top.cornerRadius = 0;
  createText(frame, 24, 18, spec.name, titleFont, 20, { r: 1, g: 1, b: 1 });
  createText(
    frame,
    24,
    84,
    "Category: " + spec.category + "  Size: " + spec.width + "x" + spec.height,
    titleFont,
    14,
    PALETTE.muted
  );

  const contentTop = 120;
  if (isMobile) {
    createRect(frame, 16, contentTop, spec.width - 32, spec.height - contentTop - 16, PALETTE.surface, 12);
  } else {
    createRect(frame, 24, contentTop, 240, spec.height - contentTop - 24, PALETTE.surface, 14);
    createRect(frame, 288, contentTop, spec.width - 312, spec.height - contentTop - 24, PALETTE.surface, 14);
  }
}

function drawLogin(frame, spec, titleFont) {
  const isMobile = spec.width <= 430;
  const cardWidth = isMobile ? spec.width - 48 : 420;
  const cardHeight = 300;
  const x = Math.round((spec.width - cardWidth) / 2);
  const y = Math.round((spec.height - cardHeight) / 2);

  createRect(frame, x, y, cardWidth, cardHeight, PALETTE.elevated, 16);
  createText(frame, x + 24, y + 24, "오민성 Admin", titleFont, 28, PALETTE.text);
  createText(frame, x + 24, y + 72, "관리자 비밀번호", titleFont, 14, PALETTE.muted);

  createRect(frame, x + 24, y + 98, cardWidth - 48, 48, PALETTE.bg, 10);
  createRect(frame, x + 24, y + 164, cardWidth - 48, 52, PALETTE.accent, 10);
  createText(frame, x + 24 + (cardWidth - 48) / 2 - 30, y + 182, "로그인", titleFont, 18, { r: 1, g: 1, b: 1 });
  createText(frame, x + 24, y + 232, "비밀번호가 일치하지 않습니다", titleFont, 12, { r: 0.965, g: 0.263, b: 0.263 });
}

function drawDashboard(frame, spec, titleFont) {
  const isMobile = spec.width <= 430;
  const contentTop = 150;

  if (isMobile) {
    const mainX = 24;
    const mainW = spec.width - 48;
    createText(frame, mainX, 160, "Dashboard", titleFont, 26, PALETTE.text);
    const cardW = Math.floor((mainW - 12) / 2);
    const labels = ["회사", "프로젝트", "스킬", "방문자"];
    for (let i = 0; i < 4; i += 1) {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const x = mainX + col * (cardW + 12);
      const y = 210 + row * 120;
      createRect(frame, x, y, cardW, 108, PALETTE.elevated, 10);
      createText(frame, x + 14, y + 14, labels[i], titleFont, 12, PALETTE.muted);
      createText(frame, x + 14, y + 42, String((i + 1) * 12), titleFont, 30, PALETTE.text);
    }

    createRect(frame, mainX, 466, mainW, 210, PALETTE.elevated, 10);
    createText(frame, mainX + 14, 480, "최근 업데이트", titleFont, 14, PALETTE.text);
    for (let i = 0; i < 4; i += 1) {
      createRect(frame, mainX + 14, 512 + i * 36, mainW - 28, 24, PALETTE.bg, 6);
    }
    createRect(frame, 16, spec.height - 72, spec.width - 32, 56, PALETTE.elevated, 12);
  } else {
    const mainX = 312;
    const mainW = spec.width - 336;
    createText(frame, mainX + 24, contentTop + 16, "Admin Dashboard", titleFont, 34, PALETTE.text);

    const statW = Math.floor((mainW - 96) / 4);
    const labels = ["회사", "프로젝트", "스킬", "방문자"];
    for (let i = 0; i < 4; i += 1) {
      const x = mainX + 24 + i * (statW + 16);
      const y = contentTop + 84;
      createRect(frame, x, y, statW, 140, PALETTE.elevated, 12);
      createText(frame, x + 16, y + 16, labels[i], titleFont, 14, PALETTE.muted);
      createText(frame, x + 16, y + 56, String((i + 1) * 24), titleFont, 40, PALETTE.text);
    }

    createRect(frame, mainX + 24, contentTop + 246, mainW - 48, 320, PALETTE.elevated, 12);
    createText(frame, mainX + 40, contentTop + 268, "최근 업데이트", titleFont, 16, PALETTE.text);
    for (let i = 0; i < 6; i += 1) {
      createRect(frame, mainX + 40, contentTop + 304 + i * 44, mainW - 80, 30, PALETTE.bg, 8);
    }
  }
}

function drawList(frame, spec, titleFont, label) {
  const mainX = 312;
  const mainW = spec.width - 336;
  const topY = 168;
  createText(frame, mainX + 24, topY, label + " 목록", titleFont, 32, PALETTE.text);
  createRect(frame, mainX + mainW - 184, topY - 4, 160, 44, PALETTE.accent, 10);
  createText(frame, mainX + mainW - 130, topY + 8, "추가", titleFont, 18, { r: 1, g: 1, b: 1 });

  createRect(frame, mainX + 24, topY + 72, mainW - 48, 520, PALETTE.elevated, 12);
  for (let i = 0; i < 8; i += 1) {
    createRect(frame, mainX + 40, topY + 114 + i * 54, mainW - 80, 34, PALETTE.bg, 8);
  }
}

function drawForm(frame, spec, titleFont, label) {
  const mainX = 312;
  const topY = 168;
  const formW = Math.min(840, spec.width - 380);
  createText(frame, mainX + 24, topY, label + " 폼", titleFont, 32, PALETTE.text);
  createRect(frame, mainX + 24, topY + 72, formW, spec.height - topY - 130, PALETTE.elevated, 12);

  let y = topY + 110;
  for (let i = 0; i < 6; i += 1) {
    createText(frame, mainX + 44, y, "필드 " + (i + 1), titleFont, 14, PALETTE.muted);
    createRect(frame, mainX + 44, y + 26, formW - 40, 46, PALETTE.bg, 10);
    y += 96;
    if (y + 100 > spec.height - 130) {
      break;
    }
  }

  createRect(frame, mainX + 44, spec.height - 104, 120, 44, PALETTE.accent, 10);
  createText(frame, mainX + 82, spec.height - 92, "저장", titleFont, 16, { r: 1, g: 1, b: 1 });
  createRect(frame, mainX + 176, spec.height - 104, 120, 44, PALETTE.bg, 10);
  createText(frame, mainX + 214, spec.height - 92, "취소", titleFont, 16, PALETTE.text);
}

function drawSidebarContents(frame, spec, titleFont) {
  if (spec.width <= 430) {
    return;
  }

  createText(frame, 48, 160, "Admin", titleFont, 22, PALETTE.text);
  const menus = ["대시보드", "회사", "프로젝트", "스킬", "설정"];
  for (let i = 0; i < menus.length; i += 1) {
    const y = 206 + i * 54;
    const active = i === 0;
    createRect(frame, 40, y, 208, 40, active ? PALETTE.elevated : PALETTE.surface, 8);
    createText(frame, 56, y + 10, menus[i], titleFont, 15, active ? PALETTE.accent : PALETTE.muted);
  }
  createRect(frame, 40, spec.height - 90, 208, 38, PALETTE.surface, 8);
  createText(frame, 56, spec.height - 78, "로그아웃", titleFont, 14, PALETTE.muted);
}

async function createFrameFromSpec(spec, x, y, titleFont) {
  const frame = figma.createFrame();
  frame.name = spec.name;
  frame.x = x;
  frame.y = y;
  frame.resize(spec.width, spec.height);
  frame.fills = [{ type: "SOLID", color: PALETTE.bg }];

  drawAdminShell(frame, spec, titleFont);
  drawSidebarContents(frame, spec, titleFont);

  if (spec.name.indexOf("Login") !== -1) {
    drawLogin(frame, spec, titleFont);
  } else if (spec.name.indexOf("Dashboard") !== -1) {
    drawDashboard(frame, spec, titleFont);
  } else if (spec.name.indexOf("Company-List") !== -1) {
    drawList(frame, spec, titleFont, "회사");
  } else if (spec.name.indexOf("Project-List") !== -1) {
    drawList(frame, spec, titleFont, "프로젝트");
  } else if (spec.name.indexOf("Skill-List") !== -1) {
    drawList(frame, spec, titleFont, "스킬");
  } else if (spec.name.indexOf("Company-Form") !== -1) {
    drawForm(frame, spec, titleFont, "회사");
  } else if (spec.name.indexOf("Project-Form") !== -1) {
    drawForm(frame, spec, titleFont, "프로젝트");
  } else if (spec.name.indexOf("Skill-Form") !== -1) {
    drawForm(frame, spec, titleFont, "스킬");
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

    if (msg.type === "import-login") {
      await buildFramesByCategory("admin");
      return;
    }

    if (msg.type === "create-frames") {
      await buildFramesByCategory("all");
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
