/* ==========================================================================
   MRASIL — i18n engine.
   Arabic is the default language (per brief §5); English is selectable
   and persists via localStorage. Applies translations to every element
   carrying data-i18n / data-i18n-html / data-i18n-placeholder, flips
   <html dir>, and re-renders any JS-driven content (projects, gallery,
   testimonials) through a "mrasil:langchange" event other scripts listen to.
   ========================================================================== */

const I18N_LANG_KEY = "mrasil_lang";

/* Keys ending in "Html" may contain inline tags (<em>, <br>) and are
   applied via innerHTML; all other keys are applied via textContent. */
const I18N = {
  ar: {
    /* ---- nav / chrome (shared across all pages) ---- */
    "nav.home": "الرئيسية",
    "nav.about": "من نحن",
    "nav.interiors": "التصاميم الداخلية",
    "nav.projects": "المشاريع",
    "nav.contact": "تواصل معنا",
    "nav.enquire": "استفسار",
    "whatsapp.aria": "تواصل مع مراسيل عبر واتساب",
    "music.aria": "تشغيل الصوت المحيطي",
    "menu.aria": "فتح القائمة",

    "footer.statement": "شركة ديكور وتصميم داخلي تقدّم خدمات التصميم الداخلي، النجارة، التشطيب، الأثاث المخصص والديكور للمساحات السكنية والتجارية.",
    "footer.explore": "استكشف",
    "footer.services": "الخدمات",
    "footer.contact": "تواصل",
    "footer.sendMessage": "أرسل رسالة",
    "footer.credit": "الموقع من تصميم شركة مراسيل",
    "footer.rights": "© {year} مراسيل للديكور والتصميم الداخلي. جميع الحقوق محفوظة.",

    "common.getInTouch": "تواصل معنا",
    "common.viewProjects": "عرض جميع المشاريع",
    "common.locationHint": "اضغط لفتح الموقع في خرائط جوجل",

    /* ---- Home ---- */
    "hero.eyebrow": "شركة ديكور وتصميم داخلي",
    "hero.titleHtml": "تصاميم داخلية تُنسج<br>من <em>الضوء</em> والظل.",
    "hero.lede": "تصمم مراسيل وتنفّذ التصاميم الداخلية المخصصة — من الفكرة الأولى والنجارة وحتى التشطيب النهائي — للمساحات السكنية والتجارية في المنطقة.",
    "hero.cta1": "عرض مشاريعنا",
    "hero.cta2": "ابدأ محادثة",
    "hero.scroll": "مرر للأسفل",

    "philosophy.eyebrow": "فلسفتنا",
    "philosophy.titleHtml": "دقة في الحرفة.<br>رصانة في التصميم.",
    "philosophy.body": "تبدأ كل تجربة تصميم في مراسيل بفهم عمارة المساحة نفسها — إضاءتها، نسبها، وصدق موادها — قبل اختيار أي تشطيب. نعمل عبر التصميم الداخلي، العمارة الداخلية، النجارة، التشطيب، الأثاث المخصص والديكور، بحيث تنتقل نفس الرؤية من أول رسم تخطيطي إلى التركيب النهائي.",
    "philosophy.cta": "نهجنا في العمل",

    "services.eyebrow": "ماذا نقدم",
    "services.title": "شركة واحدة، وكل تخصص يحتاجه المكان الداخلي.",
    "services.lede": "من أول رسم تخطيطي للمخطط وحتى آخر مفصلة في الخزانة، كل خدمة أدناه تُنفَّذ داخل الشركة — وهذا ما يجعل المساحة النهائية تبدو كفكرة واحدة متصلة.",
    "service1.title": "التصميم الداخلي",
    "service1.desc": "استراتيجية للتوزيع والمواد والإضاءة مبنية على طريقة الاستخدام الفعلي للمكان — لا مجرد شكله في الصور.",
    "service2.title": "العمارة الداخلية",
    "service2.desc": "تعديلات إنشائية ومكانية — الجدران، الأسقف، تغييرات المستوى — بالتنسيق مع الهندسة والجهات المختصة.",
    "service3.title": "النجارة والتشطيب الخشبي",
    "service3.desc": "خزائن وألواح وأعمال خشبية تُصنَّع وتُشطَّب داخل ورشتنا، وتُقاس بدقة على واقع كل موقع.",
    "service4.title": "أثاث مخصص",
    "service4.desc": "قطع مصممة بالسنتيمتر لغرفة واحدة بعينها، حين لا يفي أي شيء جاهز بالغرض.",
    "service5.title": "التشطيب الكامل (فيت أوت)",
    "service5.desc": "أعمال التقسيم، تنسيق الأنظمة الكهروميكانيكية، والتشطيبات كبرنامج واحد متكامل، للمساحات السكنية والتجارية على حد سواء.",
    "service6.title": "الديكور",
    "service6.desc": "التنسيق، الأعمال الفنية، الأقمشة والإضاءة تُضاف فوق هيكل قائم — أسرع طريقة لتحويل مساحة دون المساس بجدارها.",

    "featured.eyebrow": "أعمال مختارة",
    "featured.title": "معرض أعمال يُبنى غرفة بغرفة.",
    "featured.lede": "مجموعة مختصرة من المشاريع الحديثة. المعرض الكامل القابل للتصفية — عبر الأعمال السكنية والتجارية — موجود في صفحة المشاريع.",

    "lookbook.eyebrow": "دفتر الإلهام",
    "lookbook.titleHtml": "مجلة تصميم داخلي، مبنية من غرفنا الخاصة.",
    "lookbook.body": "مساحات معيشة، غرف نوم، مطابخ، حمامات، مكاتب ومساحات ضيافة، منظمة كما تنظمها مجلة تصميم — الصور الكبيرة أولًا، ثم التصنيفات.",
    "lookbook.cta": "تصفح التصاميم الداخلية",

    "why.eyebrow": "لماذا مراسيل",
    "why.title": "نُقيَّم بتفاصيل لا يتحقق منها أحد غيرنا.",
    "stat.projects": "مشروع مكتمل",
    "stat.years": "سنوات خبرة",
    "stat.disciplines": "تخصصات تصميم داخل الشركة",
    "stat.clients": "عميل راضٍ",
    "why.note": "الأرقام المشار إليها بـ«—» أعلاه عناصر نائبة — استبدلها بعدد المشاريع الفعلي لمراسيل، وسنة التأسيس، وعدد العملاء قبل نشر الموقع. الرقم «٦» هو عدد حقيقي للتخصصات المذكورة في هذه الصفحة.",

    "reviews.eyebrow": "تقييمات العملاء",
    "reviews.title": "كيف تكون تجربة العمل معنا.",
    "reviews.note": "هذه عناصر نائبة هيكلية وليست تقييمات حقيقية — راجع صفحة التواصل لجمع ونشر تقييمات فعلية من العملاء.",

    "cta.eyebrow": "ابدأ مشروعًا",
    "cta.titleHtml": "لنصنع معًا شيئًا <em>استثنائيًا</em>.",
    "cta.button": "تواصل معنا",

    /* ---- About ---- */
    "about.breadcrumb": "من نحن",
    "about.hero.titleHtml": "الشركة وراء<br>التصاميم الداخلية.",

    "intro.eyebrow": "مقدمة",
    "intro.title": "تصاميم داخلية تُصمَّم لتُعاش، ابتداءً من الفكرة وانتهاءً بالتنفيذ.",
    "intro.p1": "مراسيل شركة ديكور وتصميم داخلي تعمل عبر المساحات السكنية والتجارية — تصميم داخلي، عمارة داخلية، نجارة وتشطيب خشبي، أثاث مخصص، تشطيب كامل، وديكور. نتعامل مع هذه الخدمات كتخصص واحد متصل بدلًا من مراحل منفصلة، وهذا ما يجعل المشروع متماسكًا ابتداءً من أول مخطط أرضي وانتهاءً بآخر تفصيلة تنفيذية.",
    "intro.p2": "نقطة انطلاقنا دائمًا هي المكان نفسه: كيف تتحرك الإضاءة فيه خلال اليوم، وكيف يتحرك فيه من سيستخدمه فعليًا، وما المواد التي ستظل تبدو مدروسة بعد عشر سنوات لا عشرة أسابيع.",

    "approach.eyebrow": "نهجنا",
    "approach.title": "عملية مبنية لهدف واحد: لا مفاجآت في الموقع.",
    "approach.lede": "أربع مراحل، بنفس الترتيب دائمًا — لأن تكلفة تغيير الرأي ترتفع في كل مرحلة منها.",
    "approach.step1.title": "الاستكشاف",
    "approach.step1.desc": "معاينة الموقع، تحديد المتطلبات، الميزانية والجدول الزمني — القيود التي ستشكّل كل قرار لاحق.",
    "approach.step2.title": "التصميم",
    "approach.step2.desc": "التوزيع، اختيار المواد، الإضاءة ومخططات النجارة، تُراجَع مع العميل قبل أي طلب شراء.",
    "approach.step3.title": "التفصيل",
    "approach.step3.desc": "مخططات التنفيذ التفصيلية، عينات التشطيب، وتنسيق الموقع — المرحلة الدقيقة التي تمنع الأخطاء المكلفة.",
    "approach.step4.title": "التنفيذ",
    "approach.step4.desc": "التشطيب، تركيب النجارة، الديكور، ثم جولة معاينة نهائية قبل تسليم المكان.",

    "expertise.eyebrow": "الخبرات",
    "expertise.title": "ستة تخصصات. شركة واحدة.",
    "expertise.item1.title": "التصميم الداخلي",
    "expertise.item1.desc": "استراتيجية التوزيع والمواد والإضاءة",
    "expertise.item2.title": "العمارة الداخلية",
    "expertise.item2.desc": "تعديلات إنشائية ومكانية",
    "expertise.item3.title": "النجارة",
    "expertise.item3.desc": "خزائن وألواح وأعمال خشبية",
    "expertise.item4.title": "أثاث مخصص",
    "expertise.item4.desc": "قطع مصنوعة لغرفة واحدة فقط",
    "expertise.item5.title": "التشطيب الكامل",
    "expertise.item5.desc": "التقسيم، الأنظمة، التشطيبات",
    "expertise.item6.title": "الديكور",
    "expertise.item6.desc": "التنسيق، الأعمال الفنية، الأقمشة، الإضاءة",

    "craft.eyebrow": "الحرفية",
    "craft.title": "يُصنع داخل الشركة، ويُركَّب على مقاس المكان.",
    "craft.p1": "معظم ما يؤثث مساحة مراسيل — الخزائن، الألواح، الأثاث المخصص — يُصمَّم ويُصنَّع داخل فريق النجارة الخاص بنا بدلًا من شرائه جاهزًا. هذا يعني أن كل لوح يُقاس على الهندسة الفعلية وغير المنتظمة قليلًا للجدار الحقيقي، لا على وحدة عامة تُحشر لتناسبه.",
    "craft.p2": "كما يعني أن عينات التشطيب والتجهيزات والنسب تُعتمَد مع العميل قبل قطع أي لوح — فلا شيء في الموقع يكون مفاجأة.",

    "why2.eyebrow": "لماذا تختارنا",
    "why2.title": "ما نودّ معرفته لو كنا مكانك.",
    "why2.note": "الأرقام المشار إليها بـ«—» عناصر نائبة — أضف أرقام مراسيل الحقيقية قبل النشر. «٦» عدد حقيقي للتخصصات في هذه الصفحة.",

    "about.cta.eyebrow": "ابدأ مشروعًا",
    "about.cta.title": "أخبرنا عن المساحة التي تتخيلها.",

    /* ---- Interior Designs (look-book) ---- */
    "interiors.breadcrumb": "التصاميم الداخلية",
    "interiors.hero.titleHtml": "دفتر إلهام<br>من غرفنا الخاصة.",

    "gallery.eyebrow": "تصفح حسب المساحة",
    "gallery.title": "مساحات معيشة، غرف نوم، مطابخ وأكثر.",
    "gallery.lede": "تصوير بمقاس كبير من أعمالنا السكنية والتجارية، منظّم كما تنظّمه مجلة تصميم داخلي. صفّ حسب المساحة، أو تصفح الجدار كاملًا.",

    "gallery.cta.eyebrow": "شاهد العمل خلف الصور",
    "gallery.cta.title": "كل صورة هنا تنتمي إلى موجز مشروع حقيقي.",
    "gallery.cta.note": "زر صفحة المشاريع للاطلاع على دراسات الحالة — التصنيفات، المواقع والمعارض الكاملة — خلف دفتر الإلهام هذا.",
    "gallery.cta.button": "عرض المشاريع",

    /* ---- Projects ---- */
    "projects.breadcrumb": "المشاريع",
    "projects.hero.titleHtml": "معرض أعمال، مصنّف<br>حسب التخصص.",

    "portfolio.eyebrow": "المعرض الكامل",
    "portfolio.title": "أعمال سكنية وتجارية، حسب التصنيف.",
    "portfolio.lede": "استخدم الفلتر للتنقل بين التخصصات — التصميم الداخلي، الديكور، النجارة، التشطيب الخشبي، التشطيب الكامل، الأثاث المخصص، التجاري والسكني. اختر أي مشروع لفتح معرضه الكامل.",

    "projects.cta.eyebrow": "لم تجد ما تبحث عنه؟",
    "projects.cta.titleHtml": "كل مشروع يبدأ بمحادثة، لا بكتالوج.",
    "projects.cta.button": "ابدأ مشروعك",

    "lightbox.prev": "المشروع السابق",
    "lightbox.next": "المشروع التالي",
    "lightbox.location": "الموقع",
    "lightbox.year": "السنة",
    "lightbox.close": "إغلاق المعرض",
    "lightbox.prevImg": "الصورة السابقة",
    "lightbox.nextImg": "الصورة التالية",

    /* ---- Contact ---- */
    "contact.breadcrumb": "تواصل معنا",
    "contact.hero.titleHtml": "لنصنع معًا شيئًا<br><em>استثنائيًا</em>.",

    "contact.getInTouch.eyebrow": "تواصل معنا",
    "contact.getInTouch.title": "نودّ أن نسمع عن مساحتك.",
    "contact.getInTouch.lede": "أخبرنا بما تخطط له وسنعود إليك بالخطوات التالية — عادةً خلال يوم إلى يومي عمل.",

    "info.phone": "الهاتف",
    "info.whatsapp": "واتساب",
    "info.email": "البريد الإلكتروني",
    "info.office": "المكتب",
    "info.hours": "ساعات العمل",
    "info.hours.value": "الأحد – الخميس، ٩:٠٠ – ١٨:٠٠",
    "info.hours.note": "عنصر نائب — يُحدَّث بساعات العمل الفعلية",
    "info.address.placeholderAr": "— لم يُضف بعد —",
    "info.address.placeholderEn": "— لم يُضف بعد —",

    "form.name": "الاسم",
    "form.email": "البريد الإلكتروني",
    "form.phone": "الهاتف",
    "form.projectType": "نوع المشروع",
    "form.projectType.select": "اختر نوعًا",
    "form.projectType.opt1": "سكني — بناء جديد",
    "form.projectType.opt2": "سكني — تجديد",
    "form.projectType.opt3": "تشطيب تجاري",
    "form.projectType.opt4": "نجارة / أثاث مخصص",
    "form.projectType.opt5": "ديكور فقط",
    "form.projectType.opt6": "أخرى",
    "form.budget": "الميزانية التقريبية",
    "form.budget.select": "اختر نطاقًا",
    "form.budget.opt1": "أقل من ١٠٠،٠٠٠ درهم",
    "form.budget.opt2": "١٠٠،٠٠٠ – ٣٠٠،٠٠٠ درهم",
    "form.budget.opt3": "٣٠٠،٠٠٠ – ٧٥٠،٠٠٠ درهم",
    "form.budget.opt4": "أكثر من ٧٥٠،٠٠٠ درهم",
    "form.budget.opt5": "غير محدد بعد",
    "form.message": "الرسالة",
    "form.message.placeholder": "أخبرنا عن المساحة، الجدول الزمني، وأي تفاصيل أخرى مهمة.",
    "form.submit": "إرسال الرسالة",
    "form.note": "هذا نموذج تجريبي في الواجهة الأمامية — يتحقق من الحقول ويؤكد الاستلام، لكنه غير متصل ببريد أو نظام إدارة عملاء بعد. اربطه بذلك قبل الإطلاق.",
    "form.success": "شكرًا — تم تسجيل رسالتك. هذا النموذج التجريبي غير متصل ببريد إلكتروني بعد؛ اربطه ببريدك أو نظام إدارة العملاء قبل الإطلاق.",
    "form.err.name": "يرجى إدخال الاسم.",
    "form.err.email": "يرجى إدخال بريد إلكتروني صحيح.",
    "form.err.phone": "يرجى إدخال رقم هاتف.",
    "form.err.type": "يرجى اختيار نوع المشروع.",
    "form.err.budget": "يرجى اختيار نطاق الميزانية.",
    "form.err.message": "يرجى إضافة رسالة قصيرة.",

    "location.eyebrow": "موقعنا",
    "location.title": "زر مكتبنا.",
    "location.button": "عرض الموقع على خرائط جوجل",

    "reviews2.eyebrow": "تقييمات العملاء",
    "reviews2.title": "ماذا يقول عملاؤنا، بكلماتهم.",
    "reviews2.note": "البطاقات الثلاث أعلاه عناصر نائبة هيكلية جاهزة للتصميم — وليست تقييمات حقيقية. استبدل TESTIMONIALS في assets/js/data.js بتقييمات حقيقية تم جمعها فعليًا قبل نشر هذه الصفحة؛ لا يجب على مراسيل نشر تقييمات مختلقة كأنها حقيقية.",

    "reviewForm.eyebrow": "شاركنا تجربتك",
    "reviewForm.title": "أضف تقييمك",
    "reviewForm.lede": "عملت معنا في مشروع سابق؟ يسعدنا أن نسمع رأيك. يُراجع كل تقييم قبل نشره على الموقع.",
    "reviewForm.name": "اسمك",
    "reviewForm.project": "اسم المشروع",
    "reviewForm.rating": "التقييم",
    "reviewForm.review": "تقييمك",
    "reviewForm.review.placeholder": "أخبرنا عن تجربتك في العمل معنا…",
    "reviewForm.submit": "إرسال التقييم",
    "reviewForm.note": "هذا نموذج تجريبي في الواجهة الأمامية — يتحقق من الحقول ويؤكد الاستلام، لكنه غير متصل بعد بنظام مراجعة أو قاعدة بيانات. اربطه بذلك قبل الإطلاق.",
    "reviewForm.success": "شكرًا لك — تم استلام تقييمك وسيُراجَع قبل نشره. هذا نموذج تجريبي غير متصل بعد بنظام حقيقي؛ اربطه بذلك قبل الإطلاق.",
    "reviewForm.err.name": "يرجى إدخال اسمك.",
    "reviewForm.err.project": "يرجى إدخال اسم المشروع.",
    "reviewForm.err.rating": "يرجى اختيار تقييم.",
    "reviewForm.err.review": "يرجى إضافة تقييمك.",

    "admin.aria": "لوحة تحكم الشركة (للاستخدام الداخلي)",
  },

  en: {
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.interiors": "Interior Designs",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "nav.enquire": "Enquire",
    "whatsapp.aria": "Chat with MRASIL on WhatsApp",
    "music.aria": "Play ambient sound",
    "menu.aria": "Open menu",

    "footer.statement": "A decor and interior design company delivering interior design, joinery, fit-out, custom furniture and decoration for residential and commercial spaces.",
    "footer.explore": "Explore",
    "footer.services": "Services",
    "footer.contact": "Contact",
    "footer.sendMessage": "Send a Message",
    "footer.credit": "Site by MRASIL Company",
    "footer.rights": "© {year} MRASIL Decor & Interior Design. All rights reserved.",

    "common.getInTouch": "Get In Touch",
    "common.viewProjects": "View All Projects",
    "common.locationHint": "Tap to open in Google Maps",

    "hero.eyebrow": "Decor & Interior Design Company",
    "hero.titleHtml": "Interiors, composed<br>in <em>light</em> and shadow.",
    "hero.lede": "MRASIL designs and builds bespoke interiors — from concept and joinery through to the final finish — for residences and businesses across the region.",
    "hero.cta1": "View Our Projects",
    "hero.cta2": "Start a Conversation",
    "hero.scroll": "Scroll",

    "philosophy.eyebrow": "Our Philosophy",
    "philosophy.titleHtml": "Precision in craft.<br>Restraint in design.",
    "philosophy.body": "Every MRASIL interior begins with the architecture of the space itself — its light, its proportions, its material honesty — before a single finish is chosen. We work across interior design, interior architecture, joinery, fit-out, custom furniture and decoration, so the same hand carries a project from first sketch to final install.",
    "philosophy.cta": "Our Approach",

    "services.eyebrow": "What We Do",
    "services.title": "One company, every discipline an interior needs.",
    "services.lede": "From the first layout sketch to the last cabinet hinge, each service below is delivered in-house — which is what lets the finished space feel like one continuous idea.",
    "service1.title": "Interior Design",
    "service1.desc": "Layout, material and lighting strategy built around how a space is actually lived in or worked in — not just how it photographs.",
    "service2.title": "Interior Architecture",
    "service2.desc": "Structural and spatial changes — walls, ceilings, level changes — coordinated with engineering and authority approvals.",
    "service3.title": "Joinery & Carpentry",
    "service3.desc": "Cabinetry, panelling and millwork built and finished in our own workshop, scribed to the real geometry of each site.",
    "service4.title": "Custom Furniture",
    "service4.desc": "Pieces designed to the centimetre for one specific room, when nothing available off the shelf will do.",
    "service5.title": "Fit-Out",
    "service5.desc": "Partitioning, MEP coordination and finishes delivered as one programme, for residential and commercial floors alike.",
    "service6.title": "Decoration",
    "service6.desc": "Styling, art, textiles and lighting layered onto an existing shell — the fastest way to transform a space without touching a wall.",

    "featured.eyebrow": "Selected Work",
    "featured.title": "A portfolio built room by room.",
    "featured.lede": "A short selection of recent projects. The full, filterable portfolio — across residential and commercial work — lives on the Projects page.",

    "lookbook.eyebrow": "Look Book",
    "lookbook.titleHtml": "An interiors magazine, built around our own rooms.",
    "lookbook.body": "Living spaces, bedrooms, kitchens, bathrooms, offices and hospitality interiors, organised the way a design magazine would run them — large imagery first, categories second.",
    "lookbook.cta": "Browse Interior Designs",

    "why.eyebrow": "Why MRASIL",
    "why.title": "Judged on the details no one else checks.",
    "stat.projects": "Projects Completed",
    "stat.years": "Years of Experience",
    "stat.disciplines": "Design Disciplines In-House",
    "stat.clients": "Satisfied Clients",
    "why.note": "Figures above marked “—” are placeholders — replace them with MRASIL's real project count, founding year and client numbers before this site goes live. “6” is a true count of the disciplines listed on this page.",

    "reviews.eyebrow": "Client Reviews",
    "reviews.title": "What it's like to work with us.",
    "reviews.note": "These are structural placeholders, not real reviews — see the Contact page to collect and publish genuine client feedback.",

    "cta.eyebrow": "Start a Project",
    "cta.titleHtml": "Let's create something <em>exceptional</em>.",
    "cta.button": "Get In Touch",

    "about.breadcrumb": "About Us",
    "about.hero.titleHtml": "The company behind<br>the interiors.",

    "intro.eyebrow": "Introduction",
    "intro.title": "Interiors built the way they're meant to be lived in.",
    "intro.p1": "MRASIL is a decor and interior design company working across residential and commercial interiors — interior design, interior architecture, joinery and carpentry, custom furniture, fit-out, and decoration. We treat each of those as one continuous discipline rather than separate hand-offs, which is what lets a project stay coherent from the first floor plan to the last cushion.",
    "intro.p2": "Our starting point is always the space itself: how the light moves through it across a day, how the people who'll use it actually move through it, and what materials will still look considered in ten years rather than ten weeks.",

    "approach.eyebrow": "Our Approach",
    "approach.title": "A process built for one thing: no surprises on-site.",
    "approach.lede": "Four stages, always in the same order — because the cost of changing your mind goes up at every one of them.",
    "approach.step1.title": "Discover",
    "approach.step1.desc": "Site survey, brief, budget and timeline — the constraints that will shape every decision after this one.",
    "approach.step2.title": "Design",
    "approach.step2.desc": "Layout, material palette, lighting and joinery drawings, refined with the client before anything is ordered.",
    "approach.step3.title": "Detail",
    "approach.step3.desc": "Shop drawings, finish samples and site coordination — the unglamorous stage that prevents the expensive mistakes.",
    "approach.step4.title": "Deliver",
    "approach.step4.desc": "Fit-out, joinery installation, styling and a final snag walk-through before the space is handed back.",

    "expertise.eyebrow": "Expertise",
    "expertise.title": "Six disciplines. One company.",
    "expertise.item1.title": "Interior Design",
    "expertise.item1.desc": "Layout, material and lighting strategy",
    "expertise.item2.title": "Interior Architecture",
    "expertise.item2.desc": "Structural and spatial change",
    "expertise.item3.title": "Joinery",
    "expertise.item3.desc": "Cabinetry, panelling and millwork",
    "expertise.item4.title": "Custom Furniture",
    "expertise.item4.desc": "Pieces made for one room only",
    "expertise.item5.title": "Fit-Out",
    "expertise.item5.desc": "Partitioning, MEP, finishes",
    "expertise.item6.title": "Decoration",
    "expertise.item6.desc": "Styling, art, textiles, lighting",

    "craft.eyebrow": "Craftsmanship",
    "craft.title": "Made in-house, fitted to the room it's in.",
    "craft.p1": "Most of what furnishes a MRASIL interior — cabinetry, panelling, custom furniture — is designed and built by our own joinery team rather than sourced from a catalogue. That means every panel is scribed to the actual, slightly uneven geometry of a real wall, not a generic module boxed in to fit.",
    "craft.p2": "It also means finish samples, hardware and proportions are agreed with the client before a single board is cut — so nothing on-site is a surprise.",

    "why2.eyebrow": "Why Choose Us",
    "why2.title": "What we'd want to know, in your position.",
    "why2.note": "Figures marked “—” are editable placeholders — add MRASIL's real numbers before publishing. “6” is a true count of the disciplines on this page.",

    "about.cta.eyebrow": "Start a Project",
    "about.cta.title": "Tell us about the space you're imagining.",

    "interiors.breadcrumb": "Interior Designs",
    "interiors.hero.titleHtml": "A look-book of<br>our own rooms.",

    "gallery.eyebrow": "Browse by Space",
    "gallery.title": "Living spaces, bedrooms, kitchens and more.",
    "gallery.lede": "Large-format photography from across our residential and commercial work, organised the way an interiors magazine would run it. Filter by space, or scroll the full wall.",

    "gallery.cta.eyebrow": "See The Work Behind The Photos",
    "gallery.cta.title": "Every image here belongs to a real project brief.",
    "gallery.cta.note": "Visit the Projects page for the case studies — categories, locations and full galleries — behind this look-book.",
    "gallery.cta.button": "View Projects",

    "projects.breadcrumb": "Projects",
    "projects.hero.titleHtml": "A portfolio, filtered<br>by discipline.",

    "portfolio.eyebrow": "Full Portfolio",
    "portfolio.title": "Residential and commercial work, by category.",
    "portfolio.lede": "Use the filter to move between disciplines — interior design, decoration, joinery, carpentry, fit-out, custom furniture, commercial and residential. Select any project to open its full gallery.",

    "projects.cta.eyebrow": "Not Seeing What You Need?",
    "projects.cta.titleHtml": "Every project starts as a conversation, not a catalogue.",
    "projects.cta.button": "Start Your Project",

    "lightbox.prev": "Previous Project",
    "lightbox.next": "Next Project",
    "lightbox.location": "Location",
    "lightbox.year": "Year",
    "lightbox.close": "Close gallery",
    "lightbox.prevImg": "Previous image",
    "lightbox.nextImg": "Next image",

    "contact.breadcrumb": "Contact",
    "contact.hero.titleHtml": "Let's create something<br><em>exceptional</em>.",

    "contact.getInTouch.eyebrow": "Get In Touch",
    "contact.getInTouch.title": "We'd like to hear about your space.",
    "contact.getInTouch.lede": "Tell us what you're planning and we'll come back with next steps — usually within one to two business days.",

    "info.phone": "Phone",
    "info.whatsapp": "WhatsApp",
    "info.email": "Email",
    "info.office": "Office",
    "info.hours": "Working Hours",
    "info.hours.value": "Sun – Thu, 9:00 – 18:00",
    "info.hours.note": "Placeholder — confirm real hours",
    "info.address.placeholderAr": "— not added yet —",
    "info.address.placeholderEn": "— not added yet —",

    "form.name": "Name",
    "form.email": "Email",
    "form.phone": "Phone",
    "form.projectType": "Project Type",
    "form.projectType.select": "Select one",
    "form.projectType.opt1": "Residential — New Build",
    "form.projectType.opt2": "Residential — Renovation",
    "form.projectType.opt3": "Commercial Fit-Out",
    "form.projectType.opt4": "Joinery / Custom Furniture",
    "form.projectType.opt5": "Decoration Only",
    "form.projectType.opt6": "Other",
    "form.budget": "Budget Range",
    "form.budget.select": "Select a range",
    "form.budget.opt1": "Under AED 100,000",
    "form.budget.opt2": "AED 100,000 – 300,000",
    "form.budget.opt3": "AED 300,000 – 750,000",
    "form.budget.opt4": "AED 750,000+",
    "form.budget.opt5": "Not sure yet",
    "form.message": "Message",
    "form.message.placeholder": "Tell us about the space, the timeline, and anything else that matters.",
    "form.submit": "Send Message",
    "form.note": "This is a front-end demo form — it validates and confirms, but isn't yet wired to an inbox or CRM. Connect it before launch.",
    "form.success": "Thank you — your message has been noted. This demo form is not yet connected to an inbox; wire it up to your email or CRM before launch.",
    "form.err.name": "Please enter your name.",
    "form.err.email": "Please enter a valid email.",
    "form.err.phone": "Please enter a phone number.",
    "form.err.type": "Please select a project type.",
    "form.err.budget": "Please select a budget range.",
    "form.err.message": "Please add a short message.",

    "location.eyebrow": "Find Us",
    "location.title": "Visit our office.",
    "location.button": "View Location on Google Maps",

    "reviews2.eyebrow": "Client Reviews",
    "reviews2.title": "What clients say, in their own words.",
    "reviews2.note": "The three cards above are structural placeholders, styled and ready to go — not real reviews. Replace TESTIMONIALS in assets/js/data.js with genuine, collected client feedback before this page goes live; MRASIL should never publish invented testimonials as real.",

    "reviewForm.eyebrow": "Share Your Experience",
    "reviewForm.title": "Leave a Review",
    "reviewForm.lede": "Worked with us on a past project? We'd love to hear about it. Every review is checked before it's published on the site.",
    "reviewForm.name": "Your Name",
    "reviewForm.project": "Project Name",
    "reviewForm.rating": "Rating",
    "reviewForm.review": "Your Review",
    "reviewForm.review.placeholder": "Tell us about your experience working with us…",
    "reviewForm.submit": "Submit Review",
    "reviewForm.note": "This is a front-end demo form — it validates and confirms, but isn't yet connected to a moderation queue or database. Connect it before launch.",
    "reviewForm.success": "Thank you — your review has been received and will be checked before publishing. This demo form isn't connected to a real system yet; wire it up before launch.",
    "reviewForm.err.name": "Please enter your name.",
    "reviewForm.err.project": "Please enter the project name.",
    "reviewForm.err.rating": "Please select a rating.",
    "reviewForm.err.review": "Please add your review.",

    "admin.aria": "Company admin (internal use)",
  },
};

(function () {
  "use strict";

  function getLang() {
    return localStorage.getItem(I18N_LANG_KEY) || "ar";
  }

  function applyTranslations(lang) {
    const dict = I18N[lang] || I18N.ar;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("lang-ar", lang === "ar");
    document.body.classList.toggle("lang-en", lang === "en");

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] != null) el.setAttribute("placeholder", dict[key]);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (dict[key] != null) el.setAttribute("aria-label", dict[key]);
    });

    const rights = document.querySelector("[data-i18n-rights]");
    if (rights) {
      rights.textContent = (dict["footer.rights"] || "").replace("{year}", new Date().getFullYear());
    }

    document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.langSwitch === lang);
    });

    document.dispatchEvent(new CustomEvent("mrasil:langchange", { detail: { lang } }));
  }

  function setLang(lang) {
    localStorage.setItem(I18N_LANG_KEY, lang);
    applyTranslations(lang);
  }

  window.mrasilI18n = { getLang, setLang, dict: I18N };

  document.addEventListener("DOMContentLoaded", () => {
    applyTranslations(getLang());
    document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.dataset.langSwitch));
    });
  });
})();
