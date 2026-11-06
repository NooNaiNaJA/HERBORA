const app = document.getElementById("app");
const toast = document.getElementById("toast");
let currentPage = "home";
let selectedHerbId = null;
let editingHerbId = null;
let toastTimer;

function getHerbs() {
  try {
    const saved = localStorage.getItem(HERB_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [...defaultHerbs];
  } catch (error) {
    console.error("อ่านข้อมูลไม่สำเร็จ:", error);
    return [...defaultHerbs];
  }
}
function saveHerbs(herbs) {
  localStorage.setItem(HERB_STORAGE_KEY, JSON.stringify(herbs));
}
function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}
function goTo(page) {
  currentPage = page;
  document.querySelectorAll(".nav-link").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });
  document.getElementById("mainNav").classList.remove("open");
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function herbCard(herb) {
  return `<article class="herb-card" data-herb="${herb.id}" tabindex="0" role="button" aria-label="ดูรายละเอียด ${escapeHTML(herb.name)}">
    <img src="${escapeHTML(herb.image)}" alt="${escapeHTML(herb.name)}" onerror="this.src='https://placehold.co/600x400/e8efdc/174d35?text=HERBORA'">
    <div class="herb-card-body"><h3>${escapeHTML(herb.name)}</h3>
    <p>${escapeHTML(herb.benefit)}</p><span class="tag">${escapeHTML(herb.category)}</span></div>
  </article>`;
}
function renderHome() {
  const herbs = getHerbs();
  return `<section class="hero">
    <div class="hero-content">
      <div class="eyebrow">HERBAL KNOWLEDGE • LOCAL WISDOM</div>
      <h1>ฐานข้อมูลสมุนไพร<br>และภูมิปัญญาท้องถิ่น</h1>
      <p>เชื่อมโยงความรู้จากชุมชน สู่การเรียนรู้เรื่องสมุนไพรอย่างปลอดภัยและมีแหล่งอ้างอิง</p>
      <form class="search-bar" id="heroSearch"><input id="heroSearchInput" type="search" placeholder="ค้นหาชื่อสมุนไพรหรือสรรพคุณ..." aria-label="ค้นหาสมุนไพร">
        <button type="submit">ค้นหา⌕</button></form>
    </div>
    <div class="hero-note"><div class="leaf">🌿</div><h3>เรียนรู้ • อนุรักษ์ • แบ่งปัน</h3><p>รวบรวมข้อมูลสมุนไพรเพื่อการศึกษาและการสืบสานภูมิปัญญาท้องถิ่น</p></div>
  </section>
  <div class="container">
    <section class="quick-links">
      <button class="quick-link" data-page="search"><span class="quick-icon">⌕</span><strong>ค้นหาสมุนไพร</strong><small>ค้นหาข้อมูล</small></button>
      <button class="quick-link" data-page="categories"><span class="quick-icon">▦</span><strong>ตามหมวดหมู่</strong><small>การใช้งาน</small></button>
      <button class="quick-link" data-page="local"><span class="quick-icon">♧</span><strong>สมุนไพรท้องถิ่น</strong><small>ภูมิปัญญาชุมชน</small></button>
      <button class="quick-link" data-page="articles"><span class="quick-icon">▤</span><strong>ความรู้และบทความ</strong><small>อ่านเพิ่มเติม</small></button>
      <button class="quick-link" data-page="about"><span class="quick-icon">⌂</span><strong>เกี่ยวกับโครงการ</strong><small>ที่มาและเป้าหมาย</small></button>
      <button class="quick-link" data-page="manage"><span class="quick-icon">✎</span><strong>จัดการข้อมูล</strong><small>เพิ่มและแก้ไข</small></button>
    </section>
    <section class="section">
      <div class="section-heading"><div><h2>สมุนไพรแนะนำ</h2><p>ตัวอย่างสมุนไพรที่รวบรวมไว้ในฐานข้อมูล</p></div><button class="text-button" data-page="search">ดูทั้งหมด →</button></div>
      <div class="herb-grid">${herbs.slice(0,4).map(herbCard).join("")}</div>
    </section>
    <section class="project-banner"><h2>รักษาสมุนไพรไทย สืบสานภูมิปัญญาสู่อนาคต</h2>
      <p>รวบรวมองค์ความรู้เกี่ยวกับสมุนไพรในชุมชน เพื่อเป็นแหล่งเรียนรู้และส่งเสริมการใช้ข้อมูลอย่างรอบคอบ</p>
      <button class="primary-button" data-page="about">เกี่ยวกับโครงการ →</button></section>
  </div>`;
}
function renderSearch() {
  return `<div class="container page-wrap"><div class="page-intro"><div class="eyebrow">HERBORA DATABASE</div><h1 class="page-title">ค้นหาสมุนไพร</h1><p>ค้นหาจากชื่อสมุนไพร ชื่อวิทยาศาสตร์ ชื่อท้องถิ่น หรือสรรพคุณ</p></div>
    <div class="toolbar"><input id="searchInput" type="search" placeholder="พิมพ์คำค้นหา เช่น ขมิ้นชัน, บำรุงผิว...">
    <select id="searchCategory"><option value="">ทุกหมวดหมู่</option>${getCategories().map(c=>`<option>${escapeHTML(c)}</option>`).join("")}</select></div>
    <div id="searchResults" class="herb-grid">${getHerbs().map(herbCard).join("")}</div></div>`;
}
function getCategories() { return [...new Set(getHerbs().map(h => h.category).filter(Boolean))]; }
function renderCategories() {
  const categories = getCategories();
  const icons = ["🌱","🍃","🌼","🌿","🪴","🍀"];
  return `<div class="container page-wrap"><div class="page-intro"><div class="eyebrow">EXPLORE HERBS</div><h1 class="page-title">หมวดหมู่การใช้งาน</h1><p>เลือกหมวดหมู่เพื่อดูรายชื่อสมุนไพรที่เกี่ยวข้อง</p></div>
  <div class="category-grid">${categories.map((c,i)=>`<button class="category-card" data-category="${escapeHTML(c)}"><span>${icons[i%icons.length]}</span><h3>${escapeHTML(c)}</h3><p>ดูสมุนไพรในหมวดหมู่นี้ →</p></button>`).join("")}</div></div>`;
}
function renderLocal() {
  const herbs = getHerbs();
  return `<div class="container page-wrap"><div class="page-intro"><div class="eyebrow">LOCAL WISDOM</div><h1 class="page-title">สมุนไพรในท้องถิ่น</h1><p>รวบรวมชื่อท้องถิ่น พื้นที่ที่พบ และภูมิปัญญาการใช้จากชุมชน</p></div>
  <div class="herb-grid">${herbs.map(herbCard).join("")}</div></div>`;
}
function renderArticles() {
  return `<div class="container page-wrap"><div class="page-intro"><div class="eyebrow">KNOWLEDGE & ARTICLES</div><h1 class="page-title">ความรู้และบทความ</h1><p>ความรู้พื้นฐานเกี่ยวกับการเรียนรู้สมุนไพรและการใช้ข้อมูลอย่างปลอดภัย</p></div>
  <div class="category-grid">
    <article class="panel"><span>📖</span><h3>รู้จักสมุนไพร</h3><p>เรียนรู้ชื่อ ลักษณะ และส่วนต่าง ๆ ของพืชสมุนไพร</p></article>
    <article class="panel"><span>💡</span><h3>วิธีใช้และข้อควรระวัง</h3><p>ตรวจสอบวิธีใช้ แหล่งที่มา และความเสี่ยงก่อนนำข้อมูลไปใช้</p></article>
    <article class="panel"><span>📚</span><h3>แหล่งข้อมูลอ้างอิง</h3><p>ควรอ้างอิงเอกสารวิชาการ หน่วยงานสาธารณสุข และผู้เชี่ยวชาญ</p></article>
  </div><p class="notice" style="margin-top:20px">เนื้อหาในเว็บไซต์ตัวอย่างนี้จัดทำเพื่อการศึกษา ไม่ใช้แทนคำแนะนำ การวินิจฉัย หรือการรักษาจากบุคลากรทางการแพทย์</p></div>`;
}
function renderAbout() {
  return `<div class="container page-wrap"><div class="page-intro"><div class="eyebrow">ABOUT HERBORA</div><h1 class="page-title">เกี่ยวกับโครงการ</h1><p>HERBORA: ฐานข้อมูลสมุนไพรและภูมิปัญญาท้องถิ่น</p></div>
  <div class="panel"><h3>ที่มาและความสำคัญ</h3><p>สมุนไพรเป็นส่วนหนึ่งขององค์ความรู้และวิถีชีวิตในชุมชน โครงการ HERBORA จัดทำขึ้นเพื่อรวบรวมและนำเสนอข้อมูลสมุนไพร ชื่อท้องถิ่น ลักษณะการใช้ และแหล่งข้อมูลอ้างอิงในรูปแบบเว็บไซต์ที่ค้นหาได้สะดวก</p>
  <h3>วัตถุประสงค์</h3><ul><li>รวบรวมข้อมูลสมุนไพรให้อยู่ในรูปแบบดิจิทัล</li><li>ส่งเสริมการเรียนรู้และการอนุรักษ์ภูมิปัญญาท้องถิ่น</li><li>ฝึกพัฒนาระบบเว็บไซต์และการจัดการข้อมูล</li></ul>
  <h3>ผู้จัดทำและหน่วยงาน</h3><p>สามารถแก้ไขส่วนนี้ให้เป็นชื่อผู้จัดทำ รายวิชา สาขา และอาจารย์ที่ปรึกษาของโครงการได้</p></div></div>`;
}
function renderDetail() {
  const herb = getHerbs().find(h => h.id === selectedHerbId);
  if (!herb) return `<div class="container page-wrap"><div class="empty-state">ไม่พบข้อมูลสมุนไพร <button class="text-button" data-page="search">กลับไปค้นหา</button></div></div>`;
  return `<div class="container page-wrap"><button class="text-button" data-page="search">← กลับไปหน้าค้นหา</button><div class="detail-layout" style="margin-top:15px">
    <img src="${escapeHTML(herb.image)}" alt="${escapeHTML(herb.name)}" onerror="this.src='https://placehold.co/700x500/e8efdc/174d35?text=HERBORA'">
    <div><span class="tag">${escapeHTML(herb.category)}</span><h1>${escapeHTML(herb.name)}</h1><p><strong>ชื่อวิทยาศาสตร์:</strong> ${escapeHTML(herb.scientific)}</p>
    <p><strong>ชื่อท้องถิ่น:</strong> ${escapeHTML(herb.localName)}</p><p><strong>ลักษณะ:</strong> ${escapeHTML(herb.description)}</p>
    <p><strong>ข้อมูลการใช้:</strong> ${escapeHTML(herb.benefit)}</p><p><strong>วิธีใช้:</strong> ${escapeHTML(herb.usage)}</p>
    <p><strong>พื้นที่ที่พบ:</strong> ${escapeHTML(herb.location)}</p><p><strong>ข้อควรระวัง:</strong> ${escapeHTML(herb.caution)}</p>
    <div class="notice">ข้อมูลเพื่อการศึกษา โปรดตรวจสอบกับแพทย์หรือเภสัชกรก่อนใช้สมุนไพรเพื่อวัตถุประสงค์ด้านสุขภาพ</div></div></div></div>`;
}
function renderManage() {
  const herbs = getHerbs();
  return `<div class="container page-wrap"><div class="page-intro"><div class="eyebrow">HERB MANAGEMENT</div><h1 class="page-title">จัดการข้อมูลสมุนไพร</h1><p>เพิ่ม แก้ไข หรือลบข้อมูลสมุนไพร ข้อมูลจะถูกบันทึกไว้ในเบราว์เซอร์เครื่องนี้</p></div>
  <div class="admin-layout"><form class="panel" id="herbForm"><h3 id="formTitle">เพิ่มสมุนไพรใหม่</h3>
    <div class="form-group"><label for="herbName">ชื่อสมุนไพร *</label><input class="form-control" id="herbName" required></div>
    <div class="form-group"><label for="herbScientific">ชื่อวิทยาศาสตร์</label><input class="form-control" id="herbScientific"></div>
    <div class="form-group"><label for="herbCategory">หมวดหมู่ *</label><input class="form-control" id="herbCategory" list="categoryOptions" required placeholder="เช่น บำรุงผิว"><datalist id="categoryOptions">${getCategories().map(c=>`<option value="${escapeHTML(c)}">`).join("")}</datalist></div>
    <div class="form-group"><label for="herbLocal">ชื่อท้องถิ่น</label><input class="form-control" id="herbLocal"></div>
    <div class="form-group"><label for="herbBenefit">ข้อมูลการใช้/สรรพคุณที่มีแหล่งอ้างอิง</label><textarea class="form-control" id="herbBenefit"></textarea></div>
    <div class="form-group"><label for="herbDescription">ลักษณะของพืช</label><textarea class="form-control" id="herbDescription"></textarea></div>
    <div class="form-group"><label for="herbUsage">วิธีใช้</label><textarea class="form-control" id="herbUsage"></textarea></div>
    <div class="form-group"><label for="herbCaution">ข้อควรระวัง</label><textarea class="form-control" id="herbCaution"></textarea></div>
    <div class="form-group"><label for="herbLocation">พื้นที่ที่พบ</label><input class="form-control" id="herbLocation"></div>
    <div class="form-group"><label for="herbImage">ลิงก์รูปภาพ</label><input class="form-control" id="herbImage" type="url" placeholder="https://..."></div>
    <div class="form-actions"><button class="primary-button" type="submit" id="saveHerbButton">บันทึกข้อมูล</button><button class="secondary-button" type="button" id="cancelEditButton">ล้างแบบฟอร์ม</button></div>
  </form>
  <section class="panel"><h3>รายการสมุนไพร (${herbs.length})</h3><div class="admin-list">${herbs.map(h=>`<div class="admin-row"><img src="${escapeHTML(h.image)}" alt="" onerror="this.src='https://placehold.co/100x100/e8efdc/174d35?text=Herb'"><div class="admin-row-info"><strong>${escapeHTML(h.name)}</strong><small>${escapeHTML(h.category)}</small></div><div class="admin-row-actions"><button type="button" data-edit="${h.id}" aria-label="แก้ไข">แก้ไข</button><button type="button" data-delete="${h.id}" aria-label="ลบ">ลบ</button></div></div>`).join("") || '<div class="empty-state">ยังไม่มีข้อมูล</div>'}</div>
  <p class="notice" style="margin-top:15px">คำแนะนำ: ควรใส่แหล่งอ้างอิงที่ตรวจสอบได้ และหลีกเลี่ยงการระบุว่าสมุนไพรรักษาโรคได้โดยไม่มีหลักฐานรองรับ</p></section></div></div>`;
}
function render() {
  const views = { home: renderHome, search: renderSearch, categories: renderCategories, local: renderLocal, articles: renderArticles, about: renderAbout, detail: renderDetail, manage: renderManage };
  app.innerHTML = (views[currentPage] || renderHome)();
  if (currentPage === "search") bindSearch();
}
function bindSearch() {
  const input = document.getElementById("searchInput");
  const category = document.getElementById("searchCategory");
  const results = document.getElementById("searchResults");
  function update() {
    const q = input.value.trim().toLowerCase();
    const c = category.value;
    const found = getHerbs().filter(h => {
      const searchable = [h.name,h.scientific,h.localName,h.benefit,h.category,h.description].join(" ").toLowerCase();
      return (!q || searchable.includes(q)) && (!c || h.category === c);
    });
    results.innerHTML = found.length ? found.map(herbCard).join("") : '<div class="empty-state" style="grid-column:1/-1">ไม่พบข้อมูลที่ค้นหา</div>';
  }
  input.addEventListener("input", update);
  category.addEventListener("change", update);
}
function resetHerbForm() {
  const form = document.getElementById("herbForm");
  if (!form) return;
  form.reset(); editingHerbId = null;
  document.getElementById("formTitle").textContent = "เพิ่มสมุนไพรใหม่";
  document.getElementById("saveHerbButton").textContent = "บันทึกข้อมูล";
}
function startEdit(id) {
  const herb = getHerbs().find(h => h.id === id);
  if (!herb) return;
  editingHerbId = id;
  const fields = { herbName:"name", herbScientific:"scientific", herbCategory:"category", herbLocal:"localName", herbBenefit:"benefit", herbDescription:"description", herbUsage:"usage", herbCaution:"caution", herbLocation:"location", herbImage:"image" };
  Object.entries(fields).forEach(([elementId,key]) => document.getElementById(elementId).value = herb[key] || "");
  document.getElementById("formTitle").textContent = "แก้ไขข้อมูล: " + herb.name;
  document.getElementById("saveHerbButton").textContent = "บันทึกการแก้ไข";
  document.getElementById("herbName").focus();
}
function bindEvents() {
  document.addEventListener("click", event => {
    const pageButton = event.target.closest("[data-page]");
    if (pageButton) { event.preventDefault(); goTo(pageButton.dataset.page); return; }
    const herbCardEl = event.target.closest("[data-herb]");
    if (herbCardEl) { selectedHerbId = Number(herbCardEl.dataset.herb); goTo("detail"); return; }
    const categoryButton = event.target.closest("[data-category]");
    if (categoryButton) {
      goTo("search");
      const select = document.getElementById("searchCategory");
      if (select) { select.value = categoryButton.dataset.category; select.dispatchEvent(new Event("change")); }
      return;
    }
    const editButton = event.target.closest("[data-edit]");
    if (editButton) { startEdit(Number(editButton.dataset.edit)); return; }
    const deleteButton = event.target.closest("[data-delete]");
    if (deleteButton) {
      const id = Number(deleteButton.dataset.delete);
      const herb = getHerbs().find(h => h.id === id);
      if (herb && confirm(`ต้องการลบข้อมูล "${herb.name}" ใช่หรือไม่?`)) {
        saveHerbs(getHerbs().filter(h => h.id !== id));
        render(); showToast("ลบข้อมูลเรียบร้อยแล้ว");
      }
    }
  });
  document.addEventListener("submit", event => {
    if (event.target.id === "heroSearch") {
      event.preventDefault();
      const q = document.getElementById("heroSearchInput").value;
      goTo("search");
      document.getElementById("searchInput").value = q;
      document.getElementById("searchInput").dispatchEvent(new Event("input"));
    }
    if (event.target.id === "herbForm") {
      event.preventDefault();
      const value = id => document.getElementById(id).value.trim();
      const name = value("herbName"), category = value("herbCategory");
      if (!name || !category) { showToast("กรุณากรอกชื่อและหมวดหมู่"); return; }
      const herbs = getHerbs();
      const old = editingHerbId ? herbs.find(h => h.id === editingHerbId) : null;
      const herb = {
        id: editingHerbId || Date.now(), name, category,
        scientific: value("herbScientific"), localName: value("herbLocal"),
        benefit: value("herbBenefit"), description: value("herbDescription"),
        usage: value("herbUsage"), caution: value("herbCaution"),
        location: value("herbLocation"),
        image: value("herbImage") || "https://placehold.co/700x500/e8efdc/174d35?text=HERBORA"
      };
      const updated = editingHerbId ? herbs.map(h => h.id === editingHerbId ? herb : h) : [...herbs, herb];
      saveHerbs(updated);
      render(); showToast(old ? "แก้ไขข้อมูลเรียบร้อยแล้ว" : "เพิ่มสมุนไพรเรียบร้อยแล้ว");
    }
  });
  document.addEventListener("click", event => {
    if (event.target.id === "cancelEditButton") resetHerbForm();
    if (event.target.id === "mobileMenuButton") document.getElementById("mainNav").classList.toggle("open");
  });
}
bindEvents();
render();
