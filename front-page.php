<?php
/**
 * Home page. WordPress uses this automatically for the site root URL.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$is_rtl   = mrasil_is_rtl();
$services = mrasil_get_services();
$projects = mrasil_get_projects();
$reviews  = mrasil_get_approved_reviews( 2 );

get_header();
?>

<section class="hero">
  <div class="hero-media">
    <img src="https://images.unsplash.com/photo-1541194577687-8c63bf9e7ee3?auto=format&fit=crop&w=1920&q=80" alt="<?php echo $is_rtl ? 'مساحة معيشة دافئة اللون من تصميم مراسيل' : 'Dark, warm-toned living room interior by MRASIL'; ?>">
  </div>
  <div class="hero-content">
    <div class="inner">
      <p class="eyebrow hero-eyebrow reveal-up"><?php echo $is_rtl ? 'شركة ديكور وتصميم داخلي' : 'Decor & Interior Design Company'; ?></p>
      <?php if ( $is_rtl ) : ?>
        <h1 class="reveal-up">تصاميم داخلية تُنسج<br>من <em>الضوء</em> والظل.</h1>
      <?php else : ?>
        <h1 class="reveal-up">Interiors, composed<br>in <em>light</em> and shadow.</h1>
      <?php endif; ?>
      <p class="lede reveal-up"><?php echo $is_rtl
        ? 'تصمم مراسيل وتنفّذ التصاميم الداخلية المخصصة — من الفكرة الأولى والنجارة وحتى التشطيب النهائي — للمساحات السكنية والتجارية في المنطقة.'
        : 'MRASIL designs and builds bespoke interiors — from concept and joinery through to the final finish — for residences and businesses across the region.'; ?></p>
      <div class="hero-actions reveal-up">
        <a href="<?php echo esc_url( get_page_link( get_page_by_path( 'projects' ) ) ); ?>" class="btn btn-primary"><?php echo $is_rtl ? 'عرض مشاريعنا' : 'View Our Projects'; ?></a>
        <a href="<?php echo esc_url( get_page_link( get_page_by_path( 'contact' ) ) ); ?>" class="btn btn-ghost"><?php echo $is_rtl ? 'ابدأ محادثة' : 'Start a Conversation'; ?></a>
      </div>
    </div>
  </div>
  <div class="scroll-cue"><span class="line"></span><?php echo $is_rtl ? 'مرر للأسفل' : 'Scroll'; ?></div>
</section>

<div class="marquee" aria-hidden="true">
  <div class="marquee-track">
    <?php
    $names = $services ? array_map( function ( $s ) use ( $is_rtl ) {
      return $is_rtl ? mrasil_field( 'title', $s->ID ) : get_the_title( $s );
    }, $services ) : array();
    $loop = array_merge( $names, $names );
    foreach ( $loop as $n ) : ?>
      <span><?php echo esc_html( $n ); ?></span>
    <?php endforeach; ?>
  </div>
</div>

<section class="section">
  <div class="container split">
    <div class="split-media reveal-mask">
      <img src="https://images.unsplash.com/photo-1615147342761-9238e15d8b96?auto=format&fit=crop&w=1200&q=80" alt="">
      <div class="frame" aria-hidden="true"></div>
    </div>
    <div class="split-copy reveal">
      <p class="eyebrow"><?php echo $is_rtl ? 'فلسفتنا' : 'Our Philosophy'; ?></p>
      <?php if ( $is_rtl ) : ?>
        <h2 style="margin-top:.6em;">دقة في الحرفة.<br>رصانة في التصميم.</h2>
      <?php else : ?>
        <h2 style="margin-top:.6em;">Precision in craft.<br>Restraint in design.</h2>
      <?php endif; ?>
      <p><?php echo $is_rtl
        ? 'تبدأ كل تجربة تصميم في مراسيل بفهم عمارة المساحة نفسها — إضاءتها، نسبها، وصدق موادها — قبل اختيار أي تشطيب. نعمل عبر التصميم الداخلي، العمارة الداخلية، النجارة، التشطيب، الأثاث المخصص والديكور، بحيث تنتقل نفس الرؤية من أول رسم تخطيطي إلى التركيب النهائي.'
        : 'Every MRASIL interior begins with the architecture of the space itself — its light, its proportions, its material honesty — before a single finish is chosen. We work across interior design, interior architecture, joinery, fit-out, custom furniture and decoration, so the same hand carries a project from first sketch to final install.'; ?></p>
      <a href="<?php echo esc_url( get_page_link( get_page_by_path( 'about' ) ) ); ?>" class="btn btn-ghost"><?php echo $is_rtl ? 'نهجنا في العمل' : 'Our Approach'; ?></a>
    </div>
  </div>
</section>

<section class="section section--near-black">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow"><?php echo $is_rtl ? 'ماذا نقدم' : 'What We Do'; ?></p>
      <h2><?php echo $is_rtl ? 'شركة واحدة، وكل تخصص يحتاجه المكان الداخلي.' : 'One company, every discipline an interior needs.'; ?></h2>
      <p><?php echo $is_rtl
        ? 'من أول رسم تخطيطي للمخطط وحتى آخر مفصلة في الخزانة، كل خدمة أدناه تُنفَّذ داخل الشركة — وهذا ما يجعل المساحة النهائية تبدو كفكرة واحدة متصلة.'
        : 'From the first layout sketch to the last cabinet hinge, each service below is delivered in-house — which is what lets the finished space feel like one continuous idea.'; ?></p>
    </div>
    <div class="grid grid-3">
      <?php foreach ( $services as $i => $svc ) :
        $img = get_the_post_thumbnail_url( $svc->ID, 'large' );
      ?>
      <div class="service-card tilt-card reveal" style="--i:<?php echo esc_attr( $i % 6 ); ?>">
        <span class="service-num"><?php echo esc_html( sprintf( '%02d', $i + 1 ) ); ?></span>
        <h3><?php echo esc_html( mrasil_t( mrasil_field( 'title', $svc->ID ), get_the_title( $svc ) ) ); ?></h3>
        <p><?php echo esc_html( mrasil_field( 'description', $svc->ID ) ); ?></p>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow"><?php echo $is_rtl ? 'أعمال مختارة' : 'Selected Work'; ?></p>
      <h2><?php echo $is_rtl ? 'معرض أعمال يُبنى غرفة بغرفة.' : 'A portfolio built room by room.'; ?></h2>
      <p><?php echo $is_rtl
        ? 'مجموعة مختصرة من المشاريع الحديثة. المعرض الكامل القابل للتصفية موجود في صفحة المشاريع.'
        : 'A short selection of recent projects. The full, filterable portfolio lives on the Projects page.'; ?></p>
    </div>
    <div class="grid grid-3">
      <?php foreach ( array_slice( $projects, 0, 3 ) as $p ) :
        $cover = has_post_thumbnail( $p->ID ) ? get_the_post_thumbnail_url( $p->ID, 'large' ) : '';
        $svc   = get_field( 'related_service', $p->ID );
      ?>
      <a href="<?php echo esc_url( get_page_link( get_page_by_path( 'projects' ) ) ); ?>" class="reveal">
        <div class="proj-card tilt-card">
          <div class="thumb"><img src="<?php echo esc_url( $cover ); ?>" alt="<?php echo esc_attr( get_the_title( $p ) ); ?>" loading="lazy"></div>
          <span class="view" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M7 17 17 7M9 7h8v8"/></svg></span>
          <div class="info">
            <span class="cat"><?php echo esc_html( $svc ? mrasil_t( mrasil_field( 'title', $svc->ID ), get_the_title( $svc ) ) : '' ); ?></span>
            <h3><?php echo esc_html( mrasil_t( mrasil_field( 'title', $p->ID ), get_the_title( $p ) ) ); ?></h3>
            <div class="meta"><?php echo esc_html( mrasil_field( 'location', $p->ID ) ); ?></div>
          </div>
        </div>
      </a>
      <?php endforeach; ?>
    </div>
    <div class="center-row mt-lg">
      <a href="<?php echo esc_url( get_page_link( get_page_by_path( 'projects' ) ) ); ?>" class="btn btn-ghost"><?php echo $is_rtl ? 'عرض جميع المشاريع' : 'View All Projects'; ?></a>
    </div>
  </div>
</section>

<section class="section--tight section section--surface">
  <div class="container">
    <div class="section-head center reveal" style="margin-inline:auto;">
      <p class="eyebrow" style="justify-content:center;"><?php echo $is_rtl ? 'موقعنا' : 'Find Us'; ?></p>
      <h2 style="font-size:clamp(1.7rem,3vw,2.3rem);"><?php echo $is_rtl ? 'زر مكتبنا.' : 'Visit our office.'; ?></h2>
    </div>
    <div class="map-embed reveal">
      <iframe src="https://www.google.com/maps?q=<?php echo esc_attr( mrasil_setting( 'maps_lat', '25.578957' ) ); ?>,<?php echo esc_attr( mrasil_setting( 'maps_lng', '56.2606205' ) ); ?>&output=embed" title="MRASIL office location on Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
    <div class="center-row mt-lg">
      <a href="<?php echo esc_url( mrasil_setting( 'maps_url' ) ); ?>" target="_blank" rel="noopener" class="btn btn-primary"><?php echo $is_rtl ? 'عرض الموقع على خرائط جوجل' : 'View Location on Google Maps'; ?></a>
    </div>
  </div>
</section>

<?php if ( $reviews ) : ?>
<section class="section section--near-black">
  <div class="container">
    <div class="section-head center reveal" style="margin-inline:auto;">
      <p class="eyebrow" style="justify-content:center;"><?php echo $is_rtl ? 'تقييمات العملاء' : 'Client Reviews'; ?></p>
      <h2><?php echo $is_rtl ? 'كيف تكون تجربة العمل معنا.' : "What it's like to work with us."; ?></h2>
    </div>
    <div class="grid grid-2">
      <?php foreach ( $reviews as $r ) : $rd = mrasil_review_to_array( $r ); ?>
      <div class="testi-card reveal">
        <div class="testi-quote-mark">&ldquo;</div>
        <p class="quote"><?php echo esc_html( $rd['quote'] ); ?></p>
        <div class="testi-foot">
          <div class="testi-avatar"><?php echo esc_html( mb_substr( $rd['name'], 0, 1 ) ); ?></div>
          <div>
            <div class="name"><?php echo esc_html( $rd['name'] ); ?></div>
            <div class="role"><?php echo esc_html( $rd['project'] ); ?></div>
          </div>
        </div>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<section class="section section--surface">
  <div class="container" style="text-align:center;">
    <p class="eyebrow" style="justify-content:center;"><?php echo $is_rtl ? 'ابدأ مشروعًا' : 'Start a Project'; ?></p>
    <h2 class="reveal" style="font-size:clamp(2rem,4.4vw,3.4rem); margin-top:.5em; max-width:16ch; margin-inline:auto;">
      <?php if ( $is_rtl ) : ?>لنصنع معًا شيئًا <em class="italic-accent">استثنائيًا</em>.<?php else : ?>Let's create something <em class="italic-accent">exceptional</em>.<?php endif; ?>
    </h2>
    <div class="center-row mt-lg">
      <a href="<?php echo esc_url( get_page_link( get_page_by_path( 'contact' ) ) ); ?>" class="btn btn-primary"><?php echo $is_rtl ? 'تواصل معنا' : 'Get In Touch'; ?></a>
    </div>
  </div>
</section>

<?php get_footer(); ?>
