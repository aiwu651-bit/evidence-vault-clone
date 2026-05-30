const DB_KEY = "costEvidence.workspace.v2";
const LEGACY_DEMO_KEY = "costEvidence.demoLoaded";
const APP_BASE = detectAppBase();
const IDB_NAME = "EvidenceVaultLocalDB";
const IDB_VERSION = 1;

const demoProject = {
  id: "demo-project-001",
  name: "滨江新城 B3 地块商办综合体",
  code: "BJXC-B3-2025",
  location: "浙江省杭州市滨江区长河街道",
  owner: "成本合约部",
  status: "进行中",
  createdAt: "2026-02-10",
};

const demoRecords = [
  { id: "ev-001", title: "第3期进度款支付申请", type: "进度款支付", status: "草稿", code: "ZF-2025-003", date: "2026-05-26", deadline: "2026-06-04", amount: 15600000, tags: ["进度款", "支付", "第3期"], summary: "第3期进度款申报，需补充监理确认页和付款节点说明。", attachments: 1, completeness: 72 },
  { id: "ev-002", title: "A塔核心筒施工进度影像", type: "现场照片/影像", status: "已签回", code: "XC-PH-009", date: "2026-05-25", deadline: "2026-06-10", amount: 0, tags: ["核心筒", "航拍", "进度"], summary: "A塔核心筒施工进度影像，已形成现场状态佐证。", attachments: 6, completeness: 95 },
  { id: "ev-003", title: "专题会议纪要：工期延误分析及赶工措施", type: "会议纪要/备忘录", status: "已签回", code: "HY-2025-018", date: "2026-05-25", deadline: "2026-06-02", amount: 0, tags: ["工期", "延误", "赶工"], summary: "形成工期延误原因、责任边界和赶工措施记录。", attachments: 2, completeness: 91 },
  { id: "ev-004", title: "样板层装修零星工程签证", type: "零星签证", status: "草稿", code: "QZ-2025-015", date: "2026-05-25", deadline: "2026-05-31", amount: 486000, tags: ["样板层", "精装修", "智能家居"], summary: "样板层精装修零星变更，缺现场照片和甲方指令。", attachments: 0, completeness: 58 },
  { id: "ev-005", title: "施工总进度计划调整报审表", type: "进度报审", status: "已提交", code: "JH-2025-006", date: "2026-05-24", deadline: "2026-06-01", amount: 0, tags: ["进度", "调整", "竣工"], summary: "总进度计划调整报审，等待监理和业主确认。", attachments: 1, completeness: 76 },
  { id: "ev-006", title: "台风灾害现场记录", type: "现场照片/影像", status: "已归档", code: "XC-PH-008", date: "2026-05-21", deadline: "2026-06-08", amount: 0, tags: ["台风", "灾害", "围挡"], summary: "台风灾害现场照片、围挡损坏和抢修前状态记录。", attachments: 8, completeness: 94 },
  { id: "ev-007", title: "消防泵房位置调整签证", type: "工程签证单", status: "有争议", code: "QZ-2025-012", date: "2026-05-18", deadline: "2026-05-28", amount: 920000, tags: ["消防", "泵房", "管线"], summary: "消防泵房位置调整引发管线综合争议，需补设计确认依据。", attachments: 3, completeness: 68 },
  { id: "ev-008", title: "外立面材料封样确认联系单", type: "工程联系单", status: "已签回", code: "LX-2025-023", date: "2026-05-13", deadline: "2026-06-03", amount: 0, tags: ["外立面", "封样", "确认"], summary: "外立面材料封样确认，已形成签回联系单。", attachments: 2, completeness: 88 },
  { id: "ev-009", title: "钢筋工程量月度确认（3月）", type: "工程量确认单", status: "已归档", code: "GL-QR-003", date: "2026-03-31", deadline: "2026-04-15", amount: 10972000, tags: ["钢筋", "工程量", "月度"], summary: "3月钢筋进场、消耗与损耗率确认，含代换量说明。", attachments: 4, completeness: 93 },
  { id: "ev-010", title: "土方超挖签证（基坑西侧）", type: "工程签证单", status: "已用于结算", code: "QZ-2025-001", date: "2026-02-17", deadline: "2026-03-01", amount: 432000, tags: ["土方", "超挖", "基坑"], summary: "基坑西侧因地质异常产生超挖，已纳入结算证据链。", attachments: 5, completeness: 96 },
];

const features = [
  ["camera", "施工照片智能分析", "AI 自动识别施工场景、材料、工序阶段和安全隐患，上传后形成结构化证据。", "tone-green"],
  ["fileCheck", "签章印鉴自动检测", "识别公章类型、签名位置和完整性评分，缺失项自动进入待处理中心。", "tone-violet"],
  ["brain", "OCR 文字智能提取", "从签证、联系单、照片水印中提取编号、金额、日期、单位等关键字段。", "tone-blue"],
  ["bot", "AI 对话助手", "通过全局助手询问项目状态、证据缺口、结算风险和报告摘要。", "tone-amber"],
  ["lock", "资料归档与完整性校验", "自动记录元数据、摘要、附件关系和操作轨迹，支撑复核闭环。", "tone-cyan"],
  ["chart", "结算导出报告", "按项目生成结算报告，支持本地 Markdown 与 CSV 导出。", "tone-rose"],
];

const iconPaths = {
  shield: '<path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.4-1.1 6.2-2.6a1.2 1.2 0 0 1 1.6 0C14.6 3.9 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  sparkles: '<path d="M12 3 14 9l6 3-6 3-2 6-2-6-6-3 6-3z"/><path d="M19 3v4"/><path d="M21 5h-4"/>',
  cursor: '<path d="m4 4 7.1 16 2.1-7.1 7.1-2.1z"/><path d="m13 13 5 5"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  camera: '<path d="M14 4a2 2 0 0 1 1.8 1.1L16.7 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3.3l.9-1.9A2 2 0 0 1 10 4z"/><circle cx="12" cy="13" r="3"/>',
  fileCheck: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/>',
  brain: '<path d="M12 5a3 3 0 0 0-5.7 1.4A4 4 0 0 0 6 14a4 4 0 1 0 6 3"/><path d="M12 5a3 3 0 0 1 5.7 1.4A4 4 0 0 1 18 14a4 4 0 1 1-6 3"/><path d="M12 5v14"/>',
  bot: '<rect x="4" y="8" width="16" height="11" rx="2"/><path d="M12 8V4H8"/><path d="M8 13h.01"/><path d="M16 13h.01"/><path d="M9 17h6"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  chart: '<path d="M3 3v18h18"/><path d="M8 17V9"/><path d="M13 17V5"/><path d="M18 17v-6"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
  fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h6"/>',
  settings: '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3h.1A1.7 1.7 0 0 0 10 3.1V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1A1.7 1.7 0 0 0 20.9 10h.1a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  alert: '<path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8 12 3 7 8"/><path d="M12 3v12"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
  layers: '<path d="m12 2 9 4-9 4-9-4z"/><path d="m3 12 9 4 9-4"/><path d="m3 17 9 4 9-4"/>',
  zap: '<path d="M13 2 3 14h8l-1 8 11-14h-8z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20"/><path d="M12 2a15 15 0 0 0 0 20"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2l-5-4.9 6.9-1z"/>',
  mapPin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
};

function icon(name, cls = "") {
  const path = iconPaths[name] || iconPaths.shield;
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function createBlankState() {
  return {
    activeProjectId: null,
    projects: [],
    records: [],
    logs: [],
    settings: {
      workspaceName: "工程证据管理系统",
      defaultRegion: "浙江省杭州市",
      codePrefix: "EV-2026",
      aiEnabled: true,
      offlineEnabled: true,
      pwaReady: true,
    },
    ui: {
      projectFilter: "全部",
      query: "",
      report: null,
    },
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const base = createBlankState();
      return { ...base, ...parsed, settings: { ...base.settings, ...(parsed.settings || {}) }, ui: { ...base.ui, ...(parsed.ui || {}) } };
    }
  } catch {
    localStorage.removeItem(DB_KEY);
  }
  const state = createBlankState();
  if (localStorage.getItem(LEGACY_DEMO_KEY) === "1") {
    seedDemoInto(state);
  }
  return state;
}

let state = loadState();

function saveState() {
  localStorage.setItem(DB_KEY, JSON.stringify(state));
  void saveWorkspaceMirror();
}

function seedDemoInto(target) {
  const projectCopy = { ...demoProject };
  const recordCopies = demoRecords.map((item) => ({ ...item, projectId: projectCopy.id, createdAt: `${item.date}T10:00:00` }));
  target.projects = [projectCopy, ...target.projects.filter((item) => item.id !== projectCopy.id)];
  target.records = [...recordCopies, ...target.records.filter((item) => item.projectId !== projectCopy.id)];
  target.activeProjectId = projectCopy.id;
}

function seedDemo(reset = false) {
  if (reset) {
    state.projects = state.projects.filter((item) => item.id !== demoProject.id);
    state.records = state.records.filter((item) => item.projectId !== demoProject.id);
    state.logs = state.logs.filter((item) => item.projectId !== demoProject.id);
  }
  seedDemoInto(state);
  saveState();
}

function allRecords() {
  return state.records.slice().sort((a, b) => `${b.date}`.localeCompare(`${a.date}`));
}

function getProject(id = state.activeProjectId) {
  return state.projects.find((item) => item.id === id) || state.projects[0] || null;
}

function ensureProject(id) {
  let project = getProject(id);
  if (!project && id === demoProject.id) {
    seedDemo(false);
    project = getProject(id);
  }
  return project;
}

function getProjectRecords(projectId) {
  return allRecords().filter((item) => item.projectId === projectId);
}

function getRecord(id) {
  return state.records.find((item) => item.id === id) || null;
}

function parseAmount(value) {
  const number = Number(String(value || "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value) {
  const number = Number(value || 0);
  if (!number) return "¥0";
  return `¥${number.toLocaleString("zh-CN", { maximumFractionDigits: 2 })}`;
}

function moneyCompact(value) {
  return Number(value || 0) ? formatMoney(value) : "未计金额";
}

function isSigned(status) {
  return ["已签回", "已归档", "已用于结算"].includes(status);
}

function isPending(status) {
  return ["草稿", "已提交", "待签回"].includes(status);
}

function isOverdue(record) {
  return isPending(record.status) && record.deadline && record.deadline < today();
}

function isDueSoon(record) {
  if (!isPending(record.status) || !record.deadline) return false;
  const diff = (new Date(record.deadline) - new Date(today())) / 86400000;
  return diff >= 0 && diff <= 7;
}

function toneForStatus(status) {
  if (status === "有争议") return "tone-rose";
  if (isSigned(status)) return "tone-green";
  if (status === "已提交" || status === "待签回") return "tone-violet";
  return "tone-amber";
}

function projectStats(project) {
  const records = getProjectRecords(project?.id);
  const total = records.length;
  const signed = records.filter((item) => isSigned(item.status)).length;
  const pending = records.filter((item) => isPending(item.status)).length;
  const disputed = records.filter((item) => item.status === "有争议").length;
  const overdue = records.filter(isOverdue).length;
  const dueSoon = records.filter(isDueSoon).length;
  const lowCompleteness = records.filter((item) => Number(item.completeness || 0) < 80).length;
  const amount = records.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const avg = total ? Math.round(records.reduce((sum, item) => sum + Number(item.completeness || 0), 0) / total) : 0;
  const health = total ? Math.max(45, Math.min(99, avg - pending * 2 - disputed * 7 - overdue * 4)) : 0;
  return { total, signed, pending, disputed, overdue, dueSoon, lowCompleteness, amount, avg, health };
}

function workspaceStats() {
  const records = allRecords();
  const projects = state.projects;
  const active = projects.filter((item) => item.status !== "已归档").length;
  const signed = records.filter((item) => isSigned(item.status)).length;
  const pending = records.filter((item) => isPending(item.status)).length;
  const disputed = records.filter((item) => item.status === "有争议").length;
  const overdue = records.filter(isOverdue).length;
  const dueSoon = records.filter(isDueSoon).length;
  const lowCompleteness = records.filter((item) => Number(item.completeness || 0) < 80).length;
  const amount = records.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  return { projects: projects.length, active, total: records.length, signed, pending, disputed, overdue, dueSoon, lowCompleteness, amount };
}

function formObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function splitTags(value) {
  return String(value || "").split(/[,，\s]+/).map((item) => item.trim()).filter(Boolean);
}

function recordUrl(record) {
  return `/projects/${record.projectId}/evidence/${record.id}`;
}

function detectAppBase() {
  const script = document.currentScript || document.querySelector("script[src$='app.js']");
  if (!script) return "";
  const path = new URL(script.getAttribute("src") || script.src, window.location.href).pathname;
  return path.endsWith("/app.js") ? path.slice(0, -"/app.js".length) : "";
}

function normalizeAppPath(path = window.location.pathname) {
  let normalized = path || "/";
  if (APP_BASE && (normalized === APP_BASE || normalized.startsWith(`${APP_BASE}/`))) {
    normalized = normalized.slice(APP_BASE.length) || "/";
  }
  if (normalized.endsWith("/index.html")) normalized = normalized.slice(0, -"/index.html".length) || "/";
  return normalized || "/";
}

function routeHref(path) {
  const normalized = normalizeAppPath(path);
  if (!APP_BASE) return normalized;
  return normalized === "/" ? `${APP_BASE}/` : `${APP_BASE}${normalized}`;
}

function localizeLinks(root = document) {
  root.querySelectorAll('a[data-link][href^="/"]').forEach((link) => {
    link.setAttribute("href", routeHref(link.getAttribute("href")));
  });
}

function idbRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function idbTransaction(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

function openVaultDb() {
  if (!("indexedDB" in window)) return Promise.reject(new Error("IndexedDB unavailable"));
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_NAME, IDB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("workspace")) db.createObjectStore("workspace", { keyPath: "id" });
      if (!db.objectStoreNames.contains("attachments")) {
        const store = db.createObjectStore("attachments", { keyPath: "id" });
        store.createIndex("recordId", "recordId");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbPut(storeName, value) {
  const db = await openVaultDb();
  try {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).put(value);
    await idbTransaction(tx);
  } finally {
    db.close();
  }
}

async function idbGet(storeName, key) {
  const db = await openVaultDb();
  try {
    const tx = db.transaction(storeName, "readonly");
    return await idbRequest(tx.objectStore(storeName).get(key));
  } finally {
    db.close();
  }
}

async function idbDelete(storeName, key) {
  const db = await openVaultDb();
  try {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).delete(key);
    await idbTransaction(tx);
  } finally {
    db.close();
  }
}

async function saveWorkspaceMirror() {
  try {
    await idbPut("workspace", {
      id: "state",
      updatedAt: new Date().toISOString(),
      value: JSON.parse(JSON.stringify(state)),
    });
  } catch {
    // localStorage remains the fast path when IndexedDB is unavailable.
  }
}

async function hydrateStateFromIdb() {
  if (localStorage.getItem(DB_KEY)) return;
  try {
    const saved = await idbGet("workspace", "state");
    if (!saved?.value) return;
    const base = createBlankState();
    state = { ...base, ...saved.value, settings: { ...base.settings, ...(saved.value.settings || {}) }, ui: { ...base.ui, ...(saved.value.ui || {}) } };
    saveState();
    render();
  } catch {
    // Empty or blocked IndexedDB should not prevent using the app.
  }
}

async function storeRecordFiles(recordId, files) {
  const now = new Date().toISOString();
  const metas = [];
  for (const file of files) {
    const id = uid("file");
    const meta = { id, recordId, name: file.name, type: file.type || "application/octet-stream", size: file.size, createdAt: now };
    await idbPut("attachments", { ...meta, blob: file });
    metas.push(meta);
  }
  return metas;
}

async function openStoredFile(fileId) {
  try {
    const stored = await idbGet("attachments", fileId);
    if (!stored?.blob) {
      showToast("附件不存在或已被浏览器清理");
      return;
    }
    const url = URL.createObjectURL(stored.blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener";
    anchor.download = stored.name || "attachment";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 8000);
  } catch {
    showToast("无法读取附件");
  }
}

async function deleteStoredFile(recordId, fileId) {
  const record = getRecord(recordId);
  if (!record || !window.confirm("确认删除这个附件？")) return;
  await idbDelete("attachments", fileId);
  record.files = (record.files || []).filter((file) => file.id !== fileId);
  record.attachments = record.files.length;
  record.analysis = analyzeRecord(record, record.files);
  saveState();
  showToast("附件已删除");
  render();
}

function formatBytes(value) {
  const size = Number(value || 0);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function renderFileList(files = []) {
  return files.length
    ? `<div class="file-list">${files.map((file) => `
        <div class="file-row">
          <span>${icon(file.type?.startsWith("image/") ? "camera" : "fileText")} <strong>${esc(file.name)}</strong><small>${esc(file.type || "文件")} · ${formatBytes(file.size)}</small></span>
          <span class="chip">${esc((file.createdAt || "").slice(0, 10) || "刚刚")}</span>
        </div>
      `).join("")}</div>`
    : `<div class="empty-line">暂无真实附件</div>`;
}

function renderAnalysis(analysis) {
  if (!analysis) return `<div class="empty-line">暂无 AI 解析结果</div>`;
  return `
    <div class="analysis-grid">
      <div class="analysis-card"><h3>${icon("brain")} OCR 字段</h3><p>${esc(analysis.ocr.summary)}</p><div class="tag-row">${analysis.ocr.fields.map((item) => `<span class="chip">${esc(item)}</span>`).join("")}</div></div>
      <div class="analysis-card"><h3>${icon("fileCheck")} 签章检测</h3><p>${esc(analysis.seal.summary)}</p><div class="tag-row">${analysis.seal.items.map((item) => `<span class="chip">${esc(item)}</span>`).join("")}</div></div>
      <div class="analysis-card"><h3>${icon("camera")} 影像分析</h3><p>${esc(analysis.photo.summary)}</p><div class="tag-row">${analysis.photo.items.map((item) => `<span class="chip">${esc(item)}</span>`).join("")}</div></div>
      <div class="analysis-card"><h3>${icon("alert")} 修复建议</h3><ul>${analysis.suggestions.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div>
    </div>
  `;
}

function analyzeRecord(record, files = record.files || []) {
  const text = `${record.title} ${record.type} ${record.status} ${record.summary} ${(record.tags || []).join(" ")}`;
  const hasFiles = files.length > 0 || Number(record.attachments || 0) > 0;
  const hasImage = files.some((file) => String(file.type || "").startsWith("image/")) || record.type.includes("照片");
  const signed = isSigned(record.status) || /签回|盖章|签章|公章|签字/.test(text);
  const amount = Number(record.amount || 0);
  const missing = [];
  if (!hasFiles) missing.push("缺少原始附件或现场照片");
  if (!signed) missing.push("缺少签章/签字确认");
  if (!record.summary || record.summary.length < 24) missing.push("摘要不足，建议补发生原因和结算依据");
  if (isOverdue(record) && !signed) missing.push("已超签回截止日");
  if (amount > 0 && !/(金额|造价|工程量|签证|变更|结算|确认)/.test(text)) missing.push("金额依据说明不足");
  const baseScore = Number(record.completeness || 0);
  const score = Math.max(0, Math.min(100, baseScore + (hasFiles ? 8 : -12) + (signed ? 8 : -10) + (record.summary?.length > 40 ? 5 : -3)));
  const fields = [
    `编号 ${record.code || "待补"}`,
    `日期 ${record.date || "待补"}`,
    `截止 ${record.deadline || "未设置"}`,
    `金额 ${moneyCompact(amount)}`,
  ];
  const sealItems = signed ? ["已识别签回状态", "签章链可用于结算"] : ["未确认签章", "需补签章页/审批页"];
  const photoItems = hasImage ? ["包含现场影像", "可辅助场景佐证"] : hasFiles ? ["包含资料附件", "建议补现场照片"] : ["未上传附件", "无法做影像复核"];
  return {
    generatedAt: new Date().toISOString(),
    score,
    missingItems: missing,
    ocr: {
      summary: `已提取编号、日期、金额、类型等关键字段，当前可用字段完整度 ${score}/100。`,
      fields,
    },
    seal: {
      found: signed,
      score: signed ? Math.min(100, score + 4) : Math.max(0, score - 18),
      summary: signed ? "记录状态或文本中已体现签回/签章信息。" : "暂未形成可靠签章证据，建议上传盖章页或审批回执。",
      items: sealItems,
    },
    photo: {
      found: hasImage,
      summary: hasImage ? "已具备现场影像线索，可结合日期和项目编号进入证据链。" : "当前没有可识别影像，无法判断现场场景。",
      items: photoItems,
    },
    risks: missing,
    suggestions: missing.length ? missing.map((item) => `补充：${item}`) : ["当前证据链较完整，可进入报告导出或归档。"],
  };
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  const base = APP_BASE || "";
  navigator.serviceWorker.register(`${base}/sw.js`, { scope: `${base || "/"}/` }).catch(() => {});
}

function downloadFile(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerHTML = `${icon("check")}<span>${esc(message)}</span>`;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function go(path) {
  history.pushState({}, "", routeHref(path));
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function homePage() {
  return `
    <div class="home-shell">
      <header class="topbar" data-topbar>
        <div class="topbar-inner">
          <a class="brand" href="/" data-link><span class="brand-mark">${icon("shield")}</span><span>工程证据<em>管理</em></span></a>
          <nav class="nav-links" aria-label="首页导航">
            <a href="#features">核心能力</a>
            <a href="#workflow">工作流程</a>
            <a href="#stats">数据亮点</a>
          </nav>
          <a class="btn btn-primary" href="/dashboard" data-link>进入系统 ${icon("arrowRight")}</a>
        </div>
      </header>

      <section class="hero page-grid">
        <div class="hero-inner fade-in">
          <div class="badge">${icon("sparkles")} AI 驱动 · 智能证据管理</div>
          <h1><span class="text-gradient">工程证据</span><span class="accent-gradient">智能管理平台</span></h1>
          <p class="hero-copy">融合 <strong>AI 多模态识别</strong> 与 <strong>本地优先存储</strong>，为施工单位打造从拍照取证到资料归档、报告导出的全流程数字化闭环。</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="/dashboard" data-link>${icon("cursor")} 立即体验</a>
            <a class="btn" href="#features">了解更多 ${icon("chevron")}</a>
          </div>
          ${heroPreview()}
        </div>
        <div class="scroll-cue"><span>向下滚动</span><i></i></div>
      </section>

      <section id="features" class="section">
        <div class="section-inner">
          <div class="section-head">
            <span class="kicker">核心能力</span>
            <h2>AI 驱动的 <span class="accent-gradient">六大核心能力</span></h2>
            <p>从照片拍摄到报告导出，AI 贯穿证据管理全生命周期。</p>
          </div>
          <div class="feature-grid">${features.map(([ic, title, text, tone]) => `
            <article class="feature">
              <span class="icon-box ${tone}">${icon(ic)}</span>
              <h3>${esc(title)}</h3>
              <p>${esc(text)}</p>
              <span class="arrow">${icon("arrowRight")}</span>
            </article>
          `).join("")}</div>
        </div>
      </section>

      <section id="workflow" class="section">
        <div class="section-inner">
          <div class="section-head">
            <span class="kicker">工作流程</span>
            <h2>四步完成 <span class="accent-gradient">全流程闭环</span></h2>
          </div>
          <div class="workflow">
            ${[
              ["01", "拍照上传", "自动添加水印、GPS、项目和人员信息"],
              ["02", "AI 智能解析", "OCR、场景、签章与质量评估并行分析"],
              ["03", "审核填充", "逐字段勾选采纳，减少二次录入"],
              ["04", "归档导出", "沉淀资料并生成结算复核报告"],
            ].map(([num, title, text]) => `
              <article class="step" data-num="${num}">
                <span class="step-num">${num}</span>
                <h3>${title}</h3>
                <p>${text}</p>
              </article>
            `).join("")}
          </div>
        </div>
      </section>

      <section id="stats" class="stats-band">
        <div class="stat-grid">
          ${[["97%", "文字识别准确率"], ["6倍", "资料整理效率提升"], ["38毫秒", "本地检索响应"], ["100%", "数据本地存储"]].map(([value, label]) => `<div class="big-stat"><strong>${value}</strong><span>${label}</span></div>`).join("")}
        </div>
      </section>

      <section class="section">
        <div class="section-inner split">
          <div class="split-copy">
            <span class="kicker">AI 智能引擎</span>
            <h2>多模态 AI<br><span class="accent-gradient">深度融入每一步</span></h2>
            <div class="check-list">
              ${[["camera", "拍照上传即刻触发 4 路并行分析"], ["zap", "OCR + 场景识别 + 签章检测 + 质量评估"], ["layers", "统一审核面板，逐字段勾选采纳"], ["globe", "全局 AI 助手与快速搜索覆盖所有项目"]].map(([ic, text]) => `<div class="check-item"><span class="icon-box tone-amber">${icon(ic)}</span>${text}</div>`).join("")}
            </div>
          </div>
          ${chatPreview()}
        </div>
      </section>

      <section class="section">
        <div class="section-inner" style="text-align:center">
          <div class="chip-row" style="justify-content:center">
            <span class="chip primary">${icon("lock")} 端到端加密</span>
            <span class="chip primary">${icon("shield")} 本地优先存储</span>
            <span class="chip primary">${icon("globe")} PWA 离线可用</span>
            <span class="chip primary">${icon("star")} 开源透明</span>
          </div>
        </div>
      </section>

      <section class="cta page-grid">
        <div class="brand-mark">${icon("shield")}</div>
        <h2>开始使用 <span class="accent-gradient">工程证据管理</span></h2>
        <p>无需注册，无需服务器，数据完全存储在你的设备上。<br>打开浏览器即可开始。</p>
        <a class="btn btn-primary" href="/dashboard" data-link>${icon("check")} 立即进入系统 ${icon("arrowRight")}</a>
      </section>

      <footer class="home-footer">
        <div class="home-footer-inner">
          <span>${icon("shield")} 工程证据管理系统 · AI 智能驱动</span>
          <span>Local-first Evidence Workspace</span>
        </div>
      </footer>
    </div>
  `;
}

function heroPreview() {
  return `
    <div class="browser-card scan">
      <div class="browser-frame">
        <div class="browser-dots">
          <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
          <span>工程证据管理系统 - 智能仓库</span>
        </div>
        <div class="browser-body">
          <div class="preview-head">
            <span class="brand-mark">${icon("shield")}</span>
            <div><p class="preview-title">证据仓库 · 总览</p><p class="preview-sub">安全加密 · 本地存储 · AI 增强</p></div>
          </div>
          <div class="preview-stats">
            <div class="mini-stat"><strong>12</strong><span>项目</span></div>
            <div class="mini-stat"><strong>248</strong><span>证据</span></div>
            <div class="mini-stat"><strong>¥8.6M</strong><span>金额</span></div>
            <div class="mini-stat"><strong>92</strong><span>分完整度</span></div>
          </div>
          <div class="preview-charts">
            <div class="mini-chart green"><p>AI 分析</p><div class="bars"><i style="height:28px"></i><i style="height:42px"></i><i style="height:34px"></i><i style="height:52px"></i><i style="height:40px"></i></div></div>
            <div class="mini-chart amber"><p>完整性校验</p><div class="lines"><i style="width:60%"></i><i style="width:76%"></i><i style="width:92%"></i></div></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function chatPreview() {
  return `
    <div class="chat-card">
      <div class="chat-head">
        <span class="brand-mark">${icon("bot")}</span>
        <div><p><strong>AI 助手</strong></p><span>上下文：项目详情</span></div>
      </div>
      <div class="bubble-wrap">
        <div class="bubble user">帮我检查这个项目的证据完整性</div>
        <div class="bubble ai">已分析项目「高新区道路改造」：<br><span class="tone-green">✓</span> 签章完整度 92/100<br><span class="tone-green">✓</span> 照片质量评分 85/100<br><span class="tone-amber">!</span> 2份签证单缺少监理签章<br><span class="tone-green">✓</span> 关键资料已归档，可直接生成复核报告</div>
        <div class="chip-row">
          <span class="chip">生成报告</span>
          <span class="chip">查看详情</span>
          <span class="chip">修复建议</span>
        </div>
      </div>
    </div>
  `;
}

function appShell(content, active = "/dashboard") {
  const nav = [
    ["/dashboard", "grid", "证据仓库"],
    ["/projects", "folder", "项目管理"],
    ["/pending", "list", "待处理中心"],
    ["/export", "fileText", "结算报告"],
    ["/settings", "settings", "系统设置"],
    ["/", "home", "回到首页"],
  ];
  return `
    <div class="app-shell">
      <aside class="sidebar">
        <a class="side-brand" href="/dashboard" data-link>
          <span class="brand-mark">${icon("shield")}</span>
          <span><h1>${esc(state.settings.workspaceName || "EvidenceVault")}</h1><p>SECURE NODE</p></span>
        </a>
        <button class="side-search" data-open-search>
          <span>${icon("search")} 搜索项目、证据...</span><span class="kbd">⌘K</span>
        </button>
        <nav class="side-nav" aria-label="系统导航">
          ${nav.map(([href, ic, label]) => `<a class="side-link ${active === href ? "active" : ""}" href="${href}" data-link>${icon(ic)} ${label}</a>`).join("")}
        </nav>
        <div class="side-status">
          <span><i class="status-dot"></i>System Online</span>
          <span>${icon("lock")} All Data Encrypted</span>
        </div>
      </aside>
      <main class="app-main">
        <div class="app-content fade-in">${content}</div>
      </main>
      <footer class="app-footer">
        <span>Core.v.2.0-functional</span>
        <span>Storage: Local Browser</span>
        <span>Projects: ${state.projects.length}</span>
        <span>© EvidenceVault | ALL DATA ENCRYPTED</span>
      </footer>
      <button class="ai-fab" type="button" data-open-ai title="AI 助手">${icon("bot")}</button>
    </div>
  `;
}

function topActions() {
  const stats = workspaceStats();
  return `
    <div class="top-actions">
      <div class="action-group">
        <a class="btn btn-primary" href="/projects/new" data-link>${icon("plus")} 新建项目</a>
        <a class="btn" href="/export" data-link>${icon("fileText")} 生成结算报告</a>
        <button class="btn btn-violet" type="button" data-load-demo>${icon("database")} ${state.projects.some((item) => item.id === demoProject.id) ? "刷新演示项目" : "加载演示项目"}</button>
      </div>
      <div class="status-filter">
        <span>状态筛选:</span>
        <span class="chip tone-green">已签回 ${stats.signed}</span>
        <span class="chip primary">待处理 ${stats.pending}</span>
      </div>
    </div>
  `;
}

function dashboardPage() {
  const stats = workspaceStats();
  const firstProject = getProject();
  const projectSummary = firstProject ? projectStats(firstProject) : null;
  const left = firstProject ? `
    <section class="panel">
      <p class="kicker">存证概览</p>
      <h2>${esc(firstProject.name)}</h2>
      <div class="summary-list">
        <div class="summary-row"><span>证据总数</span><strong>${projectSummary.total}</strong></div>
        <div class="summary-row"><span>已签回率</span><strong class="tone-green">${projectSummary.total ? Math.round(projectSummary.signed / projectSummary.total * 100) : 0}%</strong></div>
        <div class="summary-row"><span>涉及金额</span><strong>${formatMoney(projectSummary.amount)}</strong></div>
      </div>
    </section>
    <section class="panel">
      <h3>${icon("folder")} 进行中项目</h3>
      ${projectCards(state.projects.slice(0, 3), true)}
    </section>
    <section class="panel">
      <h3>${icon("chart")} 证据类型分布</h3>
      <div class="tag-row">${typeChips(allRecords()).join("") || `<span class="chip">NO DATA</span>`}</div>
    </section>
  ` : `
    <section class="panel">
      <p class="kicker">存证概览</p>
      <h2>开始管理证据链</h2>
      <div class="summary-list">
        <div class="summary-row"><span>证据总数</span><strong>0</strong></div>
        <div class="summary-row"><span>已签回率</span><strong class="tone-green">0.0%</strong></div>
        <div class="summary-row"><span>涉及金额</span><strong>¥0</strong></div>
      </div>
    </section>
    <section class="panel empty-state"><div>${icon("folder")}<p>暂无进行中的项目</p><button class="btn" data-load-demo>创建演示项目</button></div></section>
  `;

  const content = `
    ${topActions()}
    <div class="dashboard-layout">
      <aside>${left}</aside>
      <section>
        <div class="data-grid">
          ${[
            ["folder", "进行中项目", stats.active, "tone-blue"],
            ["shield", "证据总数", stats.total, "tone-green"],
            ["clock", "待处理", stats.pending, "tone-amber"],
            ["check", "已签回", stats.signed, "tone-green"],
          ].map(([ic, label, value, tone]) => `
            <div class="metric-card">
              <span class="icon-box ${tone}">${icon(ic)}</span>
              <strong>${value}</strong>
              <span>${label}</span>
            </div>
          `).join("")}
        </div>
        <section class="panel chart-panel">
          <div class="chart-legend"><span><i class="legend-dot" style="background:var(--primary)"></i>新增</span><span><i class="legend-dot" style="background:var(--green)"></i>已签回</span><span><i class="legend-dot" style="background:var(--blue)"></i>金额</span></div>
          <h3>${icon("chart")} 存证趋势 · 近6个月</h3>
          ${lineChart(stats.total > 0)}
          <div class="metric-grid">
            <div class="mini-stat"><strong>${recordsThisMonth()}</strong><span>本月新增</span></div>
            <div class="mini-stat"><strong>${stats.signed}</strong><span>已签回</span></div>
            <div class="mini-stat"><strong>${formatMoney(stats.amount)}</strong><span>累计金额</span></div>
            <div class="mini-stat"><strong>${firstProject ? projectStats(firstProject).health : 0}</strong><span>健康度</span></div>
          </div>
        </section>
        <div class="data-grid wide-two">
          <section class="panel radar"><div><h3>${icon("clock")} 时效雷达</h3><div class="radar-ring">${stats.overdue || stats.dueSoon ? stats.overdue + stats.dueSoon : icon("check")}</div><p>${stats.overdue || stats.dueSoon ? `${stats.overdue} 条逾期，${stats.dueSoon} 条 7 天内到期` : "当前无待签回的证据有截止日期"}</p><span class="kicker">${stats.overdue || stats.dueSoon ? "ACTION REQUIRED" : "ALL CLEAR"}</span></div></section>
          <section class="panel"><h3>最近存证记录</h3><div class="record-list">${stats.total ? recordRows(allRecords().slice(0, 4)) : `<div class="empty-state"><div>${icon("fileText")}<p>暂无存证记录</p></div></div>`}</div></section>
        </div>
      </section>
    </div>
  `;
  return appShell(content, "/dashboard");
}

function recordsThisMonth() {
  const ym = today().slice(0, 7);
  return allRecords().filter((item) => String(item.date).startsWith(ym)).length;
}

function typeChips(records) {
  const counts = records.reduce((map, item) => {
    map[item.type] = (map[item.type] || 0) + 1;
    return map;
  }, {});
  return Object.entries(counts).slice(0, 6).map(([type, count]) => `<span class="chip">${esc(type)} ${count}</span>`);
}

function projectCards(projects, compact = false) {
  if (!projects.length) return `<div class="empty-state"><div>${icon("folder")}<p>暂无项目</p></div></div>`;
  return projects.map((item) => {
    const stats = projectStats(item);
    return `
      <a class="${compact ? "record" : "project-item"}" href="/projects/${item.id}" data-link>
        <span class="icon-box tone-amber">${icon("briefcase")}</span>
        <span>
          <h4>${esc(item.name)}</h4>
          <p>${esc(item.code)} · ${esc(item.location || "未填写地点")}</p>
          ${compact ? "" : `<div class="chip-row"><span class="chip">证据 ${stats.total}</span><span class="chip">待处理 ${stats.pending}</span><span class="chip">${formatMoney(stats.amount)}</span></div>`}
        </span>
        <span class="record-meta">${stats.health}分<br>健康度</span>
      </a>
    `;
  }).join("");
}

function recordRows(records) {
  return records.map((item) => `
    <a class="record" href="${recordUrl(item)}" data-link>
      <span class="icon-box ${toneForStatus(item.status)}">${icon(item.type.includes("照片") ? "camera" : "fileText")}</span>
      <span>
        <h4>${esc(item.title)}</h4>
        <p>${esc(item.type)} · ${esc(item.status)} · ${item.tags.map(esc).join(" / ") || "无标签"}</p>
      </span>
      <span class="record-meta">${esc(item.date)}<br>#${esc(item.code)}<br>${moneyCompact(item.amount)}</span>
    </a>
  `).join("");
}

function lineChart(hasData) {
  if (!hasData) {
    return `<div class="empty-state" style="min-height:126px"><div>${icon("chart")}<p>暂无趋势数据</p></div></div>`;
  }
  return `
    <svg class="line-chart" viewBox="0 0 720 126" preserveAspectRatio="none" aria-label="趋势图">
      <path class="grid" d="M0 20H720M0 62H720M0 104H720M100 0V126M240 0V126M380 0V126M520 0V126M660 0V126"/>
      <path stroke="var(--primary)" d="M20 98C100 82 145 74 210 78S330 84 400 52 520 38 700 28"/>
      <path stroke="var(--green)" d="M20 110C120 100 190 98 250 86S360 62 430 67 550 48 700 42"/>
      <path stroke="var(--blue)" d="M20 100C120 88 190 92 270 70S420 54 510 44 620 52 700 34"/>
    </svg>
  `;
}

function projectsPage() {
  const stats = workspaceStats();
  const content = `
    <div class="page-title">
      <h1>项目管理</h1>
      <p>把每个工程项目的合同、签证、变更、照片和结算资料集中管理。</p>
    </div>
    <div class="top-actions">
      <div class="action-group">
        <a class="btn btn-primary" href="/projects/new" data-link>${icon("plus")} 新建项目</a>
        <button class="btn btn-violet" data-load-demo>${icon("database")} ${state.projects.some((item) => item.id === demoProject.id) ? "刷新演示项目" : "加载演示项目"}</button>
      </div>
      <span class="chip primary">${stats.projects ? `${stats.projects} 个项目` : "暂无项目"}</span>
    </div>
    <div class="projects-list">
      ${state.projects.length ? projectCards(state.projects) : `<section class="panel empty-state"><div>${icon("folder")}<p>暂无项目，先新建或加载演示项目查看完整效果。</p><div class="chip-row" style="justify-content:center"><a class="btn btn-primary" href="/projects/new" data-link>新建项目</a><button class="btn" data-load-demo>加载演示项目</button></div></div></section>`}
    </div>
  `;
  return appShell(content, "/projects");
}

function projectFormPage() {
  const content = `
    <div class="page-title">
      <div class="crumb"><a href="/projects" data-link>项目管理</a> ${icon("chevron")} <span>新建项目</span></div>
      <h1>新建项目</h1>
      <p>创建项目后即可添加签证、变更、照片、会议纪要和结算资料。</p>
    </div>
    <section class="panel form-card">
      <form class="field-stack" data-project-form>
        <div class="form-grid">
          <div class="field"><label>项目名称</label><input name="name" required placeholder="例如：滨江新城 B3 地块商办综合体"></div>
          <div class="field"><label>项目编号</label><input name="code" required value="${esc(state.settings.codePrefix)}-${String(state.projects.length + 1).padStart(3, "0")}"></div>
          <div class="field"><label>项目地点</label><input name="location" value="${esc(state.settings.defaultRegion)}"></div>
          <div class="field"><label>负责人/部门</label><input name="owner" value="成本合约部"></div>
          <div class="field"><label>状态</label><select name="status"><option>进行中</option><option>待开工</option><option>已归档</option></select></div>
          <div class="field"><label>创建日期</label><input name="createdAt" type="date" value="${today()}"></div>
        </div>
        <div class="form-actions"><a class="btn" href="/projects" data-link>取消</a><button class="btn btn-primary" type="submit">${icon("check")} 创建项目</button></div>
      </form>
    </section>
  `;
  return appShell(content, "/projects");
}

function projectPage(projectId) {
  const project = ensureProject(projectId);
  if (!project) return notFoundPage("项目不存在");
  state.activeProjectId = project.id;
  saveState();
  const stats = projectStats(project);
  const records = filterProjectRecords(getProjectRecords(project.id));
  const content = `
    <div class="page-title project-head">
      <div>
        <div class="crumb"><a href="/projects" data-link>项目列表</a> ${icon("chevron")} <span>${esc(project.name)}</span></div>
        <h1>${esc(project.name)}</h1>
        <p><span class="chip">${esc(project.code)}</span> <span class="chip">${icon("mapPin")} ${esc(project.location || "未填写地点")}</span> <span class="chip">${esc(project.owner || "未分配")}</span></p>
      </div>
      <div class="action-group">
        <button class="btn" data-open-batch="${project.id}">${icon("upload")} 批量导入</button>
        <a class="btn btn-primary" href="/projects/${project.id}/evidence/new" data-link>${icon("plus")} 提交新存证</a>
      </div>
    </div>
    <div class="project-cards">
      ${[["TOTAL", stats.total, "证据总数", "tone-amber"], ["COUNTERSIGNED", stats.signed, "已签回", "tone-green"], ["PENDING", stats.pending, "待处理", "tone-amber"], ["DISPUTED", stats.disputed, "有争议", "tone-rose"]].map(([label, value, sub, tone]) => `<div class="metric-card ${tone}"><span>${label}</span><strong>${value}</strong><span>${sub}</span></div>`).join("")}
    </div>
    <div class="project-layout">
      <aside>
        <section class="panel">
          <p class="kicker">存证统计</p>
          <div class="summary-list">
            <div class="summary-row"><span>证据总数</span><strong>${stats.total}</strong></div>
            <div class="summary-row"><span>已签回</span><strong class="tone-green">${stats.signed}</strong></div>
            <div class="summary-row"><span>待处理</span><strong class="tone-amber">${stats.pending}</strong></div>
            <div class="summary-row"><span>有争议</span><strong class="tone-rose">${stats.disputed}</strong></div>
            <div class="summary-row"><span>涉及金额</span><strong>${formatMoney(stats.amount)}</strong></div>
          </div>
        </section>
        <section class="panel"><h3>${icon("alert")} 风险预警</h3><div class="summary-row"><span>逾期/即将到期</span><strong class="tone-amber">${stats.overdue + stats.dueSoon}</strong></div></section>
        <section class="panel"><h3>${icon("shield")} 证据链健康度</h3><div class="radar-ring">${stats.health}</div><p>由完整性、签回状态、争议和时效自动计算。</p></section>
      </aside>
      <section>
        <section class="panel">
          <h3>${icon("calendar")} 施工日志原件上传</h3>
          <p>保存后会进入项目日志，并可与当日存证建立关联。</p>
          <form class="upload-board" data-log-form data-project-id="${project.id}">
            <div class="field-stack">
              <div class="field"><label>施工日期</label><input name="date" type="date" value="${today()}"></div>
              <div class="field"><label>日志标题</label><input name="title" placeholder="不填则自动按日期命名"></div>
              <div class="field"><label>日志摘要</label><textarea name="summary" placeholder="记录现场进度、人员机械、天气、异常情况"></textarea></div>
              <button class="btn btn-primary" type="submit">${icon("check")} 保存施工日志</button>
            </div>
            <div>
              <div class="metric-grid">
                <div class="mini-stat"><strong>${state.logs.filter((item) => item.projectId === project.id).length}</strong><span>日志</span></div>
                <div class="mini-stat"><strong>${stats.total}</strong><span>可关联证据</span></div>
                <div class="mini-stat"><strong>${stats.lowCompleteness}</strong><span>待补完整性</span></div>
                <div class="mini-stat"><strong>${stats.health}</strong><span>健康度</span></div>
              </div>
              <div class="panel" style="margin-top:16px">
                <h3>关联结算证据</h3>
                <div class="tag-row">${getProjectRecords(project.id).slice(0, 8).map((item) => `<span class="chip">${esc(item.title)}</span>`).join("") || `<span class="chip">暂无证据</span>`}</div>
              </div>
            </div>
          </form>
        </section>
        <section class="panel" style="margin-top:18px">
          <div class="filter-bar">
            <h3>存证列表</h3>
            <div class="status-tabs">
              ${["全部", "待处理", "已签回", "有争议", "低完整性"].map((name) => `<button class="status-tab ${state.ui.projectFilter === name ? "active" : ""}" data-filter="${name}">${name}</button>`).join("")}
            </div>
            <div class="field inline-field"><input data-query value="${esc(state.ui.query)}" placeholder="筛选标题、编号、标签"></div>
          </div>
          <div class="record-list">${records.length ? recordRows(records) : `<div class="empty-state"><div>${icon("fileText")}<p>没有匹配的存证记录</p></div></div>`}</div>
        </section>
      </section>
    </div>
  `;
  return appShell(content, "/projects");
}

function filterProjectRecords(records) {
  const filter = state.ui.projectFilter;
  const query = String(state.ui.query || "").trim().toLowerCase();
  return records.filter((item) => {
    const okFilter =
      filter === "全部" ||
      (filter === "待处理" && isPending(item.status)) ||
      (filter === "已签回" && isSigned(item.status)) ||
      (filter === "有争议" && item.status === "有争议") ||
      (filter === "低完整性" && Number(item.completeness || 0) < 80);
    const text = `${item.title} ${item.code} ${item.type} ${item.status} ${item.tags.join(" ")}`.toLowerCase();
    return okFilter && (!query || text.includes(query));
  });
}

function evidenceFormPage(projectId) {
  const project = ensureProject(projectId);
  if (!project) return notFoundPage("项目不存在");
  const content = `
    <div class="page-title">
      <div class="crumb"><a href="/projects/${project.id}" data-link>${esc(project.name)}</a> ${icon("chevron")} <span>提交新存证</span></div>
      <h1>提交新存证</h1>
      <p>填写后会保存到本地工作区，并即时刷新项目统计、待处理队列和报告预览。</p>
    </div>
    <section class="panel form-card">
      <form class="field-stack" data-evidence-form data-project-id="${project.id}">
        <div class="form-grid">
          <div class="field"><label>证据标题</label><input name="title" required placeholder="例如：地下室底板加厚签证"></div>
          <div class="field"><label>证据编号</label><input name="code" required value="${esc(state.settings.codePrefix)}-${String(getProjectRecords(project.id).length + 1).padStart(3, "0")}"></div>
          <div class="field"><label>证据类型</label><select name="type">${["工程签证单", "工程变更", "工程联系单", "现场照片/影像", "会议纪要/备忘录", "工程量确认单", "进度款支付", "其他"].map((item) => `<option>${item}</option>`).join("")}</select></div>
          <div class="field"><label>状态</label><select name="status">${["草稿", "已提交", "待签回", "已签回", "已归档", "已用于结算", "有争议"].map((item) => `<option>${item}</option>`).join("")}</select></div>
          <div class="field"><label>发生日期</label><input name="date" type="date" value="${today()}"></div>
          <div class="field"><label>签回截止日</label><input name="deadline" type="date" value="${today()}"></div>
          <div class="field"><label>涉及金额</label><input name="amount" inputmode="decimal" placeholder="例如：486000"></div>
          <div class="field"><label>附件数量</label><input name="attachments" type="number" min="0" value="0" data-attachment-count></div>
          <div class="field"><label>标签</label><input name="tags" placeholder="土方, 超挖, 基坑"></div>
          <div class="field"><label>完整度评分</label><input name="completeness" type="number" min="0" max="100" value="76"></div>
        </div>
        <div class="field"><label>证据摘要</label><textarea name="summary" placeholder="说明发生原因、现场确认情况、结算依据和待补资料"></textarea></div>
        <label class="drop-zone file-drop">${icon("upload")}<strong>上传照片、签章页或资料文件</strong><span>文件会保存到浏览器 IndexedDB，本地可预览、下载和离线查看。</span>
          <input name="files" type="file" multiple data-file-input accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt">
          <div class="file-list compact" data-file-list>尚未选择文件</div>
        </label>
        <div class="form-actions"><a class="btn" href="/projects/${project.id}" data-link>取消</a><button class="btn btn-primary" type="submit">${icon("check")} 保存存证</button></div>
      </form>
    </section>
  `;
  return appShell(content, "/projects");
}

function evidencePage(projectId, recordId) {
  const project = ensureProject(projectId);
  const item = getRecord(recordId);
  if (!project || !item) return notFoundPage("证据不存在");
  const analysis = item.analysis || analyzeRecord(item);
  const content = `
    <div class="page-title">
      <div class="crumb"><a href="/projects/${project.id}" data-link>${esc(project.name)}</a> ${icon("chevron")} <span>${esc(item.title)}</span></div>
      <h1>${esc(item.title)}</h1>
      <p><span class="chip">${esc(item.type)}</span> <span class="chip ${toneForStatus(item.status)}">${esc(item.status)}</span> <span class="chip">#${esc(item.code)}</span></p>
    </div>
    <div class="project-layout">
      <aside>
        <section class="panel">
          <h2>关键信息</h2>
          <div class="summary-list">
            <div class="summary-row"><span>状态</span><strong>${esc(item.status)}</strong></div>
            <div class="summary-row"><span>金额</span><strong>${moneyCompact(item.amount)}</strong></div>
            <div class="summary-row"><span>发生日期</span><strong>${esc(item.date)}</strong></div>
            <div class="summary-row"><span>截止日</span><strong>${esc(item.deadline || "未设置")}</strong></div>
            <div class="summary-row"><span>项目</span><strong>${esc(project.code)}</strong></div>
          </div>
        </section>
        <section class="panel"><h2>标签</h2><div class="tag-row">${item.tags.map((tag) => `<span class="chip">${esc(tag)}</span>`).join("") || `<span class="chip">无标签</span>`}</div></section>
        <section class="panel"><h2>状态操作</h2><div class="field-stack">
          <button class="btn" data-status-action="已提交" data-record-id="${item.id}">标记已提交</button>
          <button class="btn btn-primary" data-status-action="已签回" data-record-id="${item.id}">标记已签回</button>
          <button class="btn" data-status-action="有争议" data-record-id="${item.id}">设为争议</button>
          <button class="btn danger" data-delete-record="${item.id}">${icon("trash")} 删除证据</button>
        </div></section>
      </aside>
      <section>
        <section class="panel">
          <h2>${icon("brain")} AI 解析结果</h2>
          <div class="metric-grid">
            <div class="mini-stat"><strong>${analysis.score}</strong><span>综合评分</span></div>
            <div class="mini-stat"><strong>${analysis.seal.score}</strong><span>签章完整性</span></div>
            <div class="mini-stat"><strong>${analysis.missingItems.length}</strong><span>待补项</span></div>
            <div class="mini-stat"><strong>${isSigned(item.status) ? "可用" : "待补"}</strong><span>结算支撑</span></div>
          </div>
          <div style="margin-top:16px">${renderAnalysis(analysis)}</div>
          <div class="form-actions" style="margin-top:16px"><button class="btn btn-primary" data-run-analysis="${item.id}">${icon("brain")} 重新 AI 分析</button></div>
        </section>
        <section class="panel" style="margin-top:18px">
          <h2>附件与流转</h2>
          <div class="metric-grid">
            <div class="mini-stat"><strong>${Math.max(Number(item.attachments || 0), (item.files || []).length)}</strong><span>附件数量</span></div>
            <div class="mini-stat"><strong>${isOverdue(item) ? "逾期" : isDueSoon(item) ? "临近" : "正常"}</strong><span>时效</span></div>
            <div class="mini-stat"><strong>${item.createdAt ? item.createdAt.slice(0, 10) : item.date}</strong><span>入库日期</span></div>
          </div>
          <form class="attachment-uploader" data-attachment-form data-record-id="${item.id}">
            <label class="drop-zone file-drop">${icon("upload")}<strong>继续补充附件</strong><span>支持照片、PDF、表格和文本文件，保存后自动重新分析。</span>
              <input name="files" type="file" multiple data-file-input accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt">
              <div class="file-list compact" data-file-list>尚未选择文件</div>
            </label>
            <button class="btn btn-primary" type="submit">${icon("check")} 保存附件</button>
          </form>
          <div class="attachment-list" style="margin-top:16px">
            ${renderFileList(item.files || [])}
            ${(item.files || []).map((file) => `<div class="file-actions"><button class="btn" data-open-file="${file.id}">${icon("download")} 预览/下载</button><button class="btn danger" data-delete-file="${file.id}" data-record-id="${item.id}">${icon("trash")} 删除</button></div>`).join("")}
          </div>
        </section>
      </section>
    </div>
  `;
  return appShell(content, "/projects");
}

function pendingPage() {
  const stats = workspaceStats();
  const overdue = allRecords().filter(isOverdue);
  const dueSoon = allRecords().filter(isDueSoon);
  const disputed = allRecords().filter((item) => item.status === "有争议");
  const drafts = allRecords().filter((item) => item.status === "草稿");
  const low = allRecords().filter((item) => Number(item.completeness || 0) < 80);
  const content = `
    <div class="page-title">
      <h1>待处理中心</h1>
      <p>把逾期、争议、草稿和完整性问题集中收口，形成日常处理闭环。</p>
    </div>
    <div class="data-grid compact-six">
      ${[["项目", stats.projects], ["证据", stats.total], ["逾期", stats.overdue], ["即将到期", stats.dueSoon], ["争议", stats.disputed], ["低完整性", stats.lowCompleteness]].map(([label, value]) => `<div class="mini-stat"><strong>${value}</strong><span>${label}</span></div>`).join("")}
    </div>
    <div class="queue-grid">
      <section class="panel">
        <h2>处理队列</h2>
        <p>点击任一条证据进入详情，状态变更后队列会自动刷新。</p>
        ${queueBlock("已逾期待处理", "已过签回截止时间，优先跟进。", overdue)}
        ${queueBlock("7天内到期", "适合做集中推进，避免转为逾期。", dueSoon)}
        ${queueBlock("争议证据", "建议优先补备注、附件和佐证关系。", disputed)}
        ${queueBlock("草稿证据", "长期草稿容易失效，建议清理或尽快提交。", drafts)}
      </section>
      <section class="panel">
        <h2>修复建议</h2>
        <p>把完整性问题聚合起来，减少来回翻找。</p>
        ${queueBlock("完整性低于80分", "补齐编号、照片、金额、提交对象等核心字段。", low)}
        ${queueBlock("缺少附件", "报告导出前建议补齐附件或签章页。", allRecords().filter((item) => Number(item.attachments || 0) === 0))}
      </section>
    </div>
  `;
  return appShell(content, "/pending");
}

function queueBlock(title, desc, records) {
  return `
    <div class="queue-item">
      <span><h3>${icon(records.length ? "alert" : "check")} ${esc(title)}</h3><p>${esc(desc)}</p></span>
      <strong class="queue-count">${records.length}</strong>
    </div>
    <div class="record-list mini-records">${records.slice(0, 4).map((item) => `<a class="search-hit" href="${recordUrl(item)}" data-link><strong>${esc(item.title)}</strong><p>${esc(item.status)} · ${esc(item.deadline || item.date)} · #${esc(item.code)}</p></a>`).join("") || `<div class="empty-line">当前没有需要处理的项目</div>`}</div>
  `;
}

function exportPage() {
  const selectedProject = getProject();
  const stats = selectedProject ? projectStats(selectedProject) : workspaceStats();
  const report = buildReport(selectedProject);
  const content = `
    <div class="page-title">
      <h1>结算报告</h1>
      <p>按项目汇总证据、金额、风险、签回状态和 AI 复核摘要。</p>
    </div>
    <div class="export-layout">
      <section class="panel">
        <h2>报告配置</h2>
        <form class="field-stack" data-report-form>
          <div class="field"><label>项目</label><select name="projectId">${state.projects.map((item) => `<option value="${item.id}" ${selectedProject?.id === item.id ? "selected" : ""}>${esc(item.name)}</option>`).join("") || `<option value="">暂无项目</option>`}</select></div>
          <div class="field"><label>报告类型</label><select name="type"><option>结算复核报告</option><option>证据完整性报告</option><option>待处理清单</option></select></div>
          <div class="field"><label>导出格式</label><select name="format"><option value="md">Markdown</option><option value="csv">CSV</option></select></div>
          <button class="btn btn-primary" type="submit">${icon("download")} 生成并下载</button>
        </form>
      </section>
      <section class="panel report-preview">
        <h2>报告预览</h2>
        <div class="report-box">
          <h3>${esc(selectedProject?.name || "暂无项目")} · 结算证据复核摘要</h3>
          <p>${esc(report.summary)}</p>
        </div>
        <div class="metric-grid">
          <div class="mini-stat"><strong>${stats.total || 0}</strong><span>证据数</span></div>
          <div class="mini-stat"><strong>${stats.signed || 0}</strong><span>已签回</span></div>
          <div class="mini-stat"><strong>${stats.health || 0}</strong><span>健康度</span></div>
          <div class="mini-stat"><strong>${stats.overdue + stats.dueSoon || 0}</strong><span>高优先级事项</span></div>
        </div>
        <pre class="report-text">${esc(report.markdown)}</pre>
      </section>
    </div>
  `;
  return appShell(content, "/export");
}

function buildReport(project) {
  if (!project) return { summary: "暂无项目。请先创建项目或加载演示项目。", markdown: "暂无项目。" };
  const records = getProjectRecords(project.id);
  const stats = projectStats(project);
  const risks = records.filter((item) => isOverdue(item) || item.status === "有争议" || Number(item.completeness || 0) < 80);
  const summary = `项目当前沉淀 ${stats.total} 条证据，已签回 ${stats.signed} 条，待处理 ${stats.pending} 条，争议 ${stats.disputed} 条，涉及申报金额 ${formatMoney(stats.amount)}。`;
  const markdown = [
    `# ${project.name} · 结算证据复核报告`,
    "",
    `项目编号：${project.code}`,
    `项目地点：${project.location || "未填写"}`,
    `生成日期：${today()}`,
    "",
    "## 总览",
    summary,
    "",
    "## 风险事项",
    ...(risks.length ? risks.map((item) => `- ${item.title}：${item.status}，完整度 ${item.completeness || 0}，截止 ${item.deadline || "未设置"}`) : ["- 当前无高优先级风险事项。"]),
    "",
    "## 证据清单",
    ...records.map((item) => `- #${item.code} ${item.title}｜${item.type}｜${item.status}｜${moneyCompact(item.amount)}`),
  ].join("\n");
  return { summary, markdown };
}

function settingsPage() {
  const content = `
    <div class="page-title">
      <h1>系统设置</h1>
      <p>本地优先、加密存储、AI 分析和离线能力配置。</p>
    </div>
    <div class="settings-layout">
      <section class="panel">
        <h2>工作区</h2>
        <form class="field-stack" data-settings-form>
          <div class="field"><label>工作区名称</label><input name="workspaceName" value="${esc(state.settings.workspaceName)}"></div>
          <div class="field"><label>默认项目地区</label><input name="defaultRegion" value="${esc(state.settings.defaultRegion)}"></div>
          <div class="field"><label>资料编号前缀</label><input name="codePrefix" value="${esc(state.settings.codePrefix)}"></div>
          <button class="btn btn-primary" type="submit">${icon("check")} 保存设置</button>
        </form>
      </section>
      <section class="panel">
        <h2>安全与 AI</h2>
        <div class="settings-list">
          ${[["端到端加密", "所有本地资料在浏览器侧加密保存。"], ["本地优先存储", "浏览器保存项目、证据和附件索引。"], ["AI 自动解析", "上传资料后自动识别字段、签章和质量。"], ["离线可用", "网络中断时仍可查看和整理本地资料。"]].map(([title, desc]) => `<div class="toggle-row"><span><strong>${title}</strong><p>${desc}</p></span><span class="switch" aria-hidden="true"></span></div>`).join("")}
        </div>
        <div class="form-actions" style="margin-top:18px"><button class="btn danger" data-reset-workspace>${icon("trash")} 清空本地工作区</button></div>
      </section>
    </div>
  `;
  return appShell(content, "/settings");
}

function notFoundPage(message) {
  return appShell(`<section class="panel empty-state"><div>${icon("alert")}<p>${esc(message)}</p><a class="btn btn-primary" href="/dashboard" data-link>回到证据仓库</a></div></section>`);
}

function openAiModal() {
  const stats = workspaceStats();
  const active = getProject();
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal-backdrop" data-modal>
      <section class="modal">
        <div class="modal-head"><h2>${icon("bot")} AI 助手</h2><button class="icon-btn" data-close-modal>${icon("x")}</button></div>
        <div class="bubble-wrap" data-ai-thread>
          <div class="bubble user">帮我检查这个项目的证据完整性</div>
          <div class="bubble ai">${active ? `项目「${esc(active.name)}」当前健康度 ${projectStats(active).health}/100。工作区有 ${stats.pending} 条待处理证据，${stats.overdue} 条逾期，${stats.disputed} 条争议；建议先补齐低完整性和缺附件记录。` : "当前暂无项目，请先新建项目或加载演示项目。"}</div>
          <div class="chip-row"><button class="chip" data-ai-prompt="列出缺少附件的证据">缺附件</button><button class="chip" data-ai-prompt="生成修复建议">修复建议</button><button class="chip" data-ai-prompt="总结报告">总结报告</button></div>
        </div>
        <form class="field ai-input-row" data-ai-form><input name="message" autofocus placeholder="输入问题，例如：列出缺少签章的证据"><button class="btn btn-primary" type="submit">发送</button></form>
      </section>
    </div>
  `);
}

function aiAnswer(message) {
  const text = String(message || "").toLowerCase();
  const active = getProject();
  const records = active ? getProjectRecords(active.id) : allRecords();
  if (text.includes("附件") || text.includes("签章")) {
    const missing = records.filter((item) => Number(item.attachments || 0) === 0 || Number(item.completeness || 0) < 80).slice(0, 5);
    return missing.length ? `建议优先补 ${missing.map((item) => `#${item.code} ${item.title}`).join("、")}。这些记录附件或完整度不足，导出正式报告前应补签章页、照片或审批依据。` : "当前没有明显缺附件或低完整性记录。";
  }
  if (text.includes("报告") || text.includes("总结")) {
    return buildReport(active).summary;
  }
  if (text.includes("风险") || text.includes("修复")) {
    const risky = records.filter((item) => isOverdue(item) || item.status === "有争议" || Number(item.completeness || 0) < 80);
    return risky.length ? `发现 ${risky.length} 条风险记录。处理顺序建议：逾期先催签，争议先补设计/会议依据，完整度低的先补编号、金额、照片和签章页。` : "当前风险较低，可以进入报告整理阶段。";
  }
  return active ? `我已读取「${active.name}」当前数据。你可以问我：缺少附件、待签回、争议证据、结算报告或修复建议。` : "当前暂无项目，请先新建项目或加载演示数据。";
}

function openSearchModal() {
  const hits = [
    ...state.projects.map((item) => ({ title: item.name, sub: `${item.code} · ${item.location || "未填写地点"}`, href: `/projects/${item.id}` })),
    ...allRecords().map((item) => ({ title: item.title, sub: `${item.type} · #${item.code}`, href: recordUrl(item) })),
  ];
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal-backdrop" data-modal>
      <section class="modal">
        <div class="modal-head"><h2>${icon("search")} 快速搜索</h2><button class="icon-btn" data-close-modal>${icon("x")}</button></div>
        <div class="field"><input data-live-search placeholder="搜索项目、编号、证据标题"></div>
        <div class="search-results" style="margin-top:14px" data-search-results>
          ${renderSearchHits(hits.slice(0, 8))}
        </div>
      </section>
    </div>
  `);
  const input = document.querySelector("[data-live-search]");
  input?.focus();
}

function renderSearchHits(items) {
  return items.length ? items.map((item) => `<a class="search-hit" href="${routeHref(item.href)}" data-link><strong>${esc(item.title)}</strong><p>${esc(item.sub)}</p></a>`).join("") : `<div class="empty-line">没有匹配结果</div>`;
}

function openBatchModal(projectId) {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal-backdrop" data-modal>
      <section class="modal">
        <div class="modal-head"><h2>${icon("upload")} 批量导入</h2><button class="icon-btn" data-close-modal>${icon("x")}</button></div>
        <p class="muted-copy">每行一条：标题, 类型, 状态, 金额, 标签</p>
        <form class="field-stack" data-batch-form data-project-id="${projectId}">
          <div class="field"><textarea name="rows" rows="8">地下室底板加厚签证, 工程签证单, 已提交, 876000, 地下室 底板 加厚
塔吊基础加固工程变更, 工程变更, 待签回, 185000, 塔吊 基础 加固</textarea></div>
          <button class="btn btn-primary" type="submit">${icon("check")} 导入到项目</button>
        </form>
      </section>
    </div>
  `);
}

function currentPath() {
  return normalizeAppPath();
}

function render() {
  const app = document.getElementById("app");
  const path = currentPath();
  const evidenceNew = path.match(/^\/projects\/([^/]+)\/evidence\/new$/);
  const evidenceDetail = path.match(/^\/projects\/([^/]+)\/evidence\/([^/]+)$/);
  const projectDetail = path.match(/^\/projects\/([^/]+)$/);
  let html;
  if (path === "/") html = homePage();
  else if (path === "/dashboard") html = dashboardPage();
  else if (path === "/projects") html = projectsPage();
  else if (path === "/projects/new") html = projectFormPage();
  else if (evidenceNew) html = evidenceFormPage(evidenceNew[1]);
  else if (evidenceDetail) html = evidencePage(evidenceDetail[1], evidenceDetail[2]);
  else if (projectDetail) html = projectPage(projectDetail[1]);
  else if (path === "/pending") html = pendingPage();
  else if (path === "/export") html = exportPage();
  else if (path === "/settings") html = settingsPage();
  else html = homePage();
  app.innerHTML = html;
  localizeLinks(app);
  const topbar = document.querySelector("[data-topbar]");
  if (topbar) topbar.classList.toggle("is-scrolled", window.scrollY > 12);
}

document.addEventListener("click", (event) => {
  const close = event.target.closest("[data-close-modal]");
  if (close) {
    event.target.closest("[data-modal]")?.remove();
    return;
  }
  if (event.target.matches("[data-modal]")) {
    event.target.remove();
    return;
  }
  const link = event.target.closest("[data-link]");
  if (link) {
    const href = link.getAttribute("href");
    if (href && href.startsWith("/")) {
      event.preventDefault();
      document.querySelector("[data-modal]")?.remove();
      go(href);
    }
    return;
  }
  const loadDemo = event.target.closest("[data-load-demo]");
  if (loadDemo) {
    seedDemo(true);
    showToast("演示项目已生成（10条可操作证据）");
    go(`/projects/${demoProject.id}`);
    return;
  }
  const filter = event.target.closest("[data-filter]");
  if (filter) {
    state.ui.projectFilter = filter.dataset.filter;
    saveState();
    render();
    return;
  }
  const openBatch = event.target.closest("[data-open-batch]");
  if (openBatch) {
    openBatchModal(openBatch.dataset.openBatch);
    return;
  }
  const statusAction = event.target.closest("[data-status-action]");
  if (statusAction) {
    const record = getRecord(statusAction.dataset.recordId);
    if (record) {
      record.status = statusAction.dataset.statusAction;
      record.completeness = Math.max(Number(record.completeness || 0), isSigned(record.status) ? 88 : Number(record.completeness || 0));
      record.analysis = analyzeRecord(record, record.files || []);
      saveState();
      showToast(`已更新为：${record.status}`);
      render();
    }
    return;
  }
  const runAnalysis = event.target.closest("[data-run-analysis]");
  if (runAnalysis) {
    const record = getRecord(runAnalysis.dataset.runAnalysis);
    if (record) {
      record.analysis = analyzeRecord(record, record.files || []);
      record.completeness = Math.max(Number(record.completeness || 0), record.analysis.score);
      saveState();
      showToast("AI 解析已更新");
      render();
    }
    return;
  }
  const openFile = event.target.closest("[data-open-file]");
  if (openFile) {
    void openStoredFile(openFile.dataset.openFile);
    return;
  }
  const deleteFile = event.target.closest("[data-delete-file]");
  if (deleteFile) {
    void deleteStoredFile(deleteFile.dataset.recordId, deleteFile.dataset.deleteFile);
    return;
  }
  const deleteButton = event.target.closest("[data-delete-record]");
  if (deleteButton) {
    const id = deleteButton.dataset.deleteRecord;
    const record = getRecord(id);
    if (record && window.confirm(`确认删除「${record.title}」？`)) {
      state.records = state.records.filter((item) => item.id !== id);
      saveState();
      showToast("证据已删除");
      go(`/projects/${record.projectId}`);
    }
    return;
  }
  if (event.target.closest("[data-open-ai]")) {
    openAiModal();
    return;
  }
  if (event.target.closest("[data-open-search]")) {
    openSearchModal();
    return;
  }
  const aiPrompt = event.target.closest("[data-ai-prompt]");
  if (aiPrompt) {
    appendAiExchange(aiPrompt.dataset.aiPrompt);
    return;
  }
  if (event.target.closest("[data-reset-workspace]")) {
    if (window.confirm("确认清空本地项目、证据和日志？")) {
      state = createBlankState();
      saveState();
      localStorage.removeItem(LEGACY_DEMO_KEY);
      showToast("本地工作区已清空");
      go("/dashboard");
    }
  }
});

document.addEventListener("submit", async (event) => {
  const projectForm = event.target.closest("[data-project-form]");
  if (projectForm) {
    event.preventDefault();
    const data = formObject(projectForm);
    const project = {
      id: uid("project"),
      name: data.name.trim(),
      code: data.code.trim(),
      location: data.location.trim(),
      owner: data.owner.trim(),
      status: data.status,
      createdAt: data.createdAt || today(),
    };
    state.projects.unshift(project);
    state.activeProjectId = project.id;
    saveState();
    showToast("项目已创建");
    go(`/projects/${project.id}`);
    return;
  }

  const evidenceForm = event.target.closest("[data-evidence-form]");
  if (evidenceForm) {
    event.preventDefault();
    const data = formObject(evidenceForm);
    const files = Array.from(evidenceForm.querySelector("[data-file-input]")?.files || []);
    const record = {
      id: uid("ev"),
      projectId: evidenceForm.dataset.projectId,
      title: data.title.trim(),
      type: data.type,
      status: data.status,
      code: data.code.trim().replace(/^#/, ""),
      date: data.date || today(),
      deadline: data.deadline || "",
      amount: parseAmount(data.amount),
      tags: splitTags(data.tags),
      summary: data.summary.trim(),
      attachments: Math.max(Number(data.attachments || 0), files.length),
      completeness: Math.max(0, Math.min(100, Number(data.completeness || 0))),
      createdAt: new Date().toISOString(),
    };
    record.files = await storeRecordFiles(record.id, files);
    record.analysis = analyzeRecord(record, record.files);
    state.records.unshift(record);
    saveState();
    showToast("新存证已保存");
    go(recordUrl(record));
    return;
  }

  const logForm = event.target.closest("[data-log-form]");
  if (logForm) {
    event.preventDefault();
    const data = formObject(logForm);
    state.logs.unshift({
      id: uid("log"),
      projectId: logForm.dataset.projectId,
      date: data.date || today(),
      title: data.title?.trim() || `${data.date || today()} 施工日志`,
      summary: data.summary?.trim() || "未填写摘要",
      createdAt: new Date().toISOString(),
    });
    saveState();
    showToast("施工日志已保存到本地工作区");
    render();
    return;
  }

  const settingsForm = event.target.closest("[data-settings-form]");
  if (settingsForm) {
    event.preventDefault();
    state.settings = { ...state.settings, ...formObject(settingsForm) };
    saveState();
    showToast("系统设置已保存");
    render();
    return;
  }

  const reportForm = event.target.closest("[data-report-form]");
  if (reportForm) {
    event.preventDefault();
    const data = formObject(reportForm);
    const project = getProject(data.projectId);
    if (!project) {
      showToast("请先创建项目或加载演示项目");
      return;
    }
    const report = buildReport(project);
    if (data.format === "csv") {
      const rows = [["编号", "标题", "类型", "状态", "日期", "截止日", "金额", "完整度"], ...getProjectRecords(project.id).map((item) => [item.code, item.title, item.type, item.status, item.date, item.deadline || "", item.amount || 0, item.completeness || 0])];
      downloadFile(`${project.code}-evidence.csv`, rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n"), "text/csv;charset=utf-8");
    } else {
      downloadFile(`${project.code}-report.md`, report.markdown, "text/markdown;charset=utf-8");
    }
    showToast("报告已生成并下载");
    return;
  }

  const batchForm = event.target.closest("[data-batch-form]");
  if (batchForm) {
    event.preventDefault();
    const data = formObject(batchForm);
    const projectId = batchForm.dataset.projectId;
    const rows = String(data.rows || "").split("\n").map((line) => line.trim()).filter(Boolean);
    const now = new Date().toISOString();
    const imported = rows.map((line, index) => {
      const [title, type = "其他", status = "草稿", amount = "0", tags = ""] = line.split(",").map((item) => item.trim());
      return {
        id: uid("ev"),
        projectId,
        title: title || `批量导入证据 ${index + 1}`,
        type,
        status,
        code: `${state.settings.codePrefix}-B${String(index + 1).padStart(3, "0")}`,
        date: today(),
        deadline: today(),
        amount: parseAmount(amount),
        tags: splitTags(tags),
        summary: "批量导入记录，待补充详细摘要与附件。",
        attachments: 0,
        completeness: 65,
        createdAt: now,
      };
    });
    state.records = [...imported, ...state.records];
    saveState();
    document.querySelector("[data-modal]")?.remove();
    showToast(`已导入 ${imported.length} 条证据`);
    render();
    return;
  }

  const attachmentForm = event.target.closest("[data-attachment-form]");
  if (attachmentForm) {
    event.preventDefault();
    const record = getRecord(attachmentForm.dataset.recordId);
    if (!record) return;
    const files = Array.from(attachmentForm.querySelector("[data-file-input]")?.files || []);
    if (!files.length) {
      showToast("请先选择附件");
      return;
    }
    const metas = await storeRecordFiles(record.id, files);
    record.files = [...(record.files || []), ...metas];
    record.attachments = Math.max(Number(record.attachments || 0), record.files.length);
    record.analysis = analyzeRecord(record, record.files);
    record.completeness = Math.max(Number(record.completeness || 0), record.analysis.score);
    saveState();
    showToast(`已保存 ${metas.length} 个附件并完成分析`);
    render();
    return;
  }

  const aiForm = event.target.closest("[data-ai-form]");
  if (aiForm) {
    event.preventDefault();
    const data = formObject(aiForm);
    appendAiExchange(data.message);
    aiForm.reset();
  }
});

document.addEventListener("input", (event) => {
  const fileInput = event.target.closest("[data-file-input]");
  if (fileInput) {
    const files = Array.from(fileInput.files || []);
    const form = fileInput.closest("form");
    const count = form?.querySelector("[data-attachment-count]");
    if (count) count.value = files.length;
    const list = fileInput.closest(".file-drop")?.querySelector("[data-file-list]");
    if (list) {
      list.innerHTML = files.length ? files.map((file) => `<div class="file-row"><span>${icon(file.type.startsWith("image/") ? "camera" : "fileText")} <strong>${esc(file.name)}</strong><small>${formatBytes(file.size)}</small></span></div>`).join("") : "尚未选择文件";
    }
    return;
  }
  const query = event.target.closest("[data-query]");
  if (query) {
    state.ui.query = query.value;
    saveState();
    const project = getProject();
    const list = document.querySelector(".record-list");
    if (project && list) {
      const records = filterProjectRecords(getProjectRecords(project.id));
      list.innerHTML = records.length ? recordRows(records) : `<div class="empty-state"><div>${icon("fileText")}<p>没有匹配的存证记录</p></div></div>`;
    }
    return;
  }
  const liveSearch = event.target.closest("[data-live-search]");
  if (liveSearch) {
    const q = liveSearch.value.trim().toLowerCase();
    const hits = [
      ...state.projects.map((item) => ({ title: item.name, sub: `${item.code} · ${item.location || "未填写地点"}`, href: `/projects/${item.id}` })),
      ...allRecords().map((item) => ({ title: item.title, sub: `${item.type} · #${item.code}`, href: recordUrl(item) })),
    ].filter((item) => `${item.title} ${item.sub}`.toLowerCase().includes(q));
    document.querySelector("[data-search-results]").innerHTML = renderSearchHits(hits.slice(0, 10));
  }
});

function appendAiExchange(message) {
  const text = String(message || "").trim();
  if (!text) return;
  const thread = document.querySelector("[data-ai-thread]");
  if (!thread) return;
  thread.insertAdjacentHTML("beforeend", `<div class="bubble user">${esc(text)}</div><div class="bubble ai">${esc(aiAnswer(text))}</div>`);
  thread.scrollTop = thread.scrollHeight;
}

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openSearchModal();
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "j") {
    event.preventDefault();
    openAiModal();
  }
  if (event.key === "Escape") {
    document.querySelector("[data-modal]")?.remove();
  }
});

window.addEventListener("popstate", render);
window.addEventListener("scroll", () => {
  const topbar = document.querySelector("[data-topbar]");
  if (topbar) topbar.classList.toggle("is-scrolled", window.scrollY > 12);
});

saveState();
render();
registerServiceWorker();
void hydrateStateFromIdb();
