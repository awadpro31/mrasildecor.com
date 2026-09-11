#!/usr/bin/env node
// scripts/seed.js — one-time seed of the 8 real service categories from
// the client's brief, so the site isn't empty after first deploy. Safe
// to run more than once: skips entirely if any service already exists.
// No photos/videos are seeded (nothing real to seed) — add those
// through the admin panel after deploying.

require("dotenv").config();
const db = require("../db/database");

const existing = db.prepare("SELECT id FROM services LIMIT 1").get();
if (existing) {
  console.log("Services already exist — seed skipped (safe to re-run any time; it will not duplicate).");
  process.exit(0);
}

const services = [
  { en: "Interior Design & Execution", ar: "تصميم داخلي وتنفيذ", desc_en: "From the initial idea through to final on-site execution.", desc_ar: "من الفكرة الأولى وحتى التنفيذ النهائي على أرض الواقع." },
  { en: "Gypsum Board & Painting", ar: "جبسنبورد واصباغ", desc_en: "Gypsum board ceiling and wall finishing, plus painting and decorative work.", desc_ar: "تشطيبات أسقف وحوائط الجبسنبورد، مع أعمال الدهانات والديكورات." },
  { en: "Carpentry", ar: "منجرة", desc_en: "Custom carpentry and joinery, manufactured and installed to order.", desc_ar: "تصنيع وتركيب أعمال الخشب والمنجرة حسب الطلب." },
  { en: "Ceramic & Marble", ar: "السيراميك والرخام", desc_en: "Ceramic and marble supply and installation for floors and walls.", desc_ar: "توريد وتركيب السيراميك والرخام للأرضيات والحوائط." },
  { en: "Aluminum Kitchens", ar: "مطابخ الالمونيوم", desc_en: "Aluminum kitchens designed and manufactured to custom sizes.", desc_ar: "تصميم وتصنيع مطابخ الالمونيوم بمقاسات مخصصة." },
  { en: "Tempered / Security Glass", ar: "الزجاج السيكوريت", desc_en: "Tempered / security glass supply and installation for all applications.", desc_ar: "توريد وتركيب الزجاج السيكوريت لكافة الاستخدامات." },
  { en: "Exterior Stone (GRC, GRV, Fiberglass, Natural Stone)", ar: "الحجر الخارجي (GRC, GRV، فايبرقلاس، حجر طبيعي)", desc_en: "Exterior facades and stonework across all material types.", desc_ar: "واجهات وأعمال الحجر الخارجي بجميع أنواعه." },
  { en: "Electrical & Plumbing", ar: "الكهرباء والصحي", desc_en: "Complete electrical and plumbing installation works.", desc_ar: "أعمال التمديدات الكهربائية والصحية الكاملة." },
];

const insert = db.prepare(
  "INSERT INTO services (title_en, title_ar, description_en, description_ar, sort_order, visible) VALUES (?, ?, ?, ?, ?, 1)"
);
const tx = db.transaction((rows) => {
  rows.forEach((s, i) => insert.run(s.en, s.ar, s.desc_en, s.desc_ar, i + 1));
});
tx(services);

console.log(`Seeded ${services.length} service categories.`);
