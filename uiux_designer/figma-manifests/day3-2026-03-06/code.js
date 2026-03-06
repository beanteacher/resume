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
  frame.fills = [{ type: "SOLID", color: { r: 0.031, g: 0.031, b: 0.071 } }]; // #080812

  const header = figma.createRectangle();
  header.resize(spec.width, 64);
  header.fills = [{ type: "SOLID", color: CATEGORY_COLOR[spec.category] || CATEGORY_COLOR.projects }];
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
  meta.fills = [{ type: "SOLID", color: { r: 0.545, g: 0.545, b: 0.655 } }]; // #8B8BA7
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
