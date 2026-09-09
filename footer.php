<?php
/**
 * Site footer: closes <main>, then the footer content, WhatsApp float
 * button, and wp_footer() (required for scripts/plugins to hook into).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$is_rtl = mrasil_is_rtl();
$wa     = preg_replace( '/\D/', '', mrasil_setting( 'whatsapp', '971545448945' ) );
$phone  = mrasil_setting( 'phone', '+971 56 399 5623' );
$email  = mrasil_setting( 'email', 'eng.mohamed@mrasildecor.com' );
?>
</main>

<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <div>
        <div class="footer-brand">
          <?php if ( has_custom_logo() ) : the_custom_logo(); else : ?>
            <img src="<?php echo esc_url( MRASIL_THEME_URI . '/assets/img/mrasil-logo-web.png' ); ?>" alt="MRASIL">
          <?php endif; ?>
        </div>
        <p class="footer-statement"><?php echo $is_rtl
          ? 'شركة ديكور وتصميم داخلي تقدّم خدمات التصميم الداخلي، النجارة، التشطيب، الأثاث المخصص والديكور للمساحات السكنية والتجارية.'
          : 'A decor and interior design company delivering interior design, joinery, fit-out, custom furniture and decoration for residential and commercial spaces.'; ?></p>
        <div class="social-row">
          <a href="<?php echo esc_url( mrasil_setting( 'instagram', '#' ) ); ?>" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
          <a href="<?php echo esc_url( mrasil_setting( 'linkedin', '#' ) ); ?>" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.25 8.5h3.4V21h-3.4V8.5Zm5.6 0h3.26v1.71h.05c.45-.86 1.56-1.77 3.21-1.77 3.43 0 4.07 2.26 4.07 5.2V21h-3.4v-5.45c0-1.3-.02-2.97-1.81-2.97-1.81 0-2.09 1.42-2.09 2.88V21h-3.39V8.5Z"/></svg></a>
        </div>
      </div>
      <div class="footer-col">
        <h4><?php echo $is_rtl ? 'استكشف' : 'Explore'; ?></h4>
        <ul>
          <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php echo $is_rtl ? 'الرئيسية' : 'Home'; ?></a></li>
          <li><a href="<?php echo esc_url( get_page_link( get_page_by_path( 'about' ) ) ); ?>"><?php echo $is_rtl ? 'من نحن' : 'About Us'; ?></a></li>
          <li><a href="<?php echo esc_url( get_page_link( get_page_by_path( 'interior-designs' ) ) ); ?>"><?php echo $is_rtl ? 'التصاميم الداخلية' : 'Interior Designs'; ?></a></li>
          <li><a href="<?php echo esc_url( get_page_link( get_page_by_path( 'projects' ) ) ); ?>"><?php echo $is_rtl ? 'المشاريع' : 'Projects'; ?></a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4><?php echo $is_rtl ? 'الخدمات' : 'Services'; ?></h4>
        <ul>
          <?php foreach ( array_slice( mrasil_get_services(), 0, 4 ) as $svc ) : ?>
            <li><a href="<?php echo esc_url( get_permalink( $svc ) ); ?>"><?php echo esc_html( mrasil_t( get_field( 'title_ar', $svc->ID ), get_the_title( $svc ) ) ); ?></a></li>
          <?php endforeach; ?>
        </ul>
      </div>
      <div class="footer-col">
        <h4><?php echo $is_rtl ? 'تواصل' : 'Contact'; ?></h4>
        <ul>
          <li><a href="tel:<?php echo esc_attr( preg_replace( '/\s+/', '', $phone ) ); ?>"><?php echo esc_html( $phone ); ?></a></li>
          <li><a href="mailto:<?php echo esc_attr( $email ); ?>"><?php echo esc_html( $email ); ?></a></li>
          <li><a href="<?php echo esc_url( get_page_link( get_page_by_path( 'contact' ) ) ); ?>"><?php echo $is_rtl ? 'أرسل رسالة' : 'Send a Message'; ?></a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php echo $is_rtl ? 'مراسيل للديكور والتصميم الداخلي. جميع الحقوق محفوظة.' : 'MRASIL Decor & Interior Design. All rights reserved.'; ?></span>
      <div style="display:flex; align-items:center; gap:10px;">
        <span><?php echo $is_rtl ? 'الموقع من تصميم شركة مراسيل' : 'Site by MRASIL Company'; ?></span>
        <a href="<?php echo esc_url( admin_url() ); ?>" class="footer-admin-link" aria-label="<?php echo $is_rtl ? 'لوحة تحكم الشركة' : 'Company admin'; ?>" title="Admin">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </a>
      </div>
    </div>
  </div>
</footer>

<a class="whatsapp-float" href="https://wa.me/<?php echo esc_attr( $wa ); ?>" target="_blank" rel="noopener" aria-label="<?php echo $is_rtl ? 'تواصل مع مراسيل عبر واتساب' : 'Chat with MRASIL on WhatsApp'; ?>">
  <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.02 3C9.4 3 4 8.38 4 15c0 2.31.65 4.47 1.77 6.31L4 29l7.86-1.75A11.9 11.9 0 0 0 16.02 27C22.63 27 28 21.62 28 15S22.63 3 16.02 3Zm0 21.7c-1.98 0-3.83-.55-5.41-1.5l-.39-.23-4.66 1.04 1.02-4.55-.25-.4A9.63 9.63 0 0 1 6.3 15c0-5.36 4.36-9.7 9.72-9.7 5.36 0 9.7 4.34 9.7 9.7 0 5.36-4.34 9.7-9.7 9.7Zm5.32-7.26c-.29-.15-1.72-.85-1.99-.94-.27-.1-.46-.15-.66.14-.19.29-.76.94-.93 1.13-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.66-1.59-.9-2.17-.24-.58-.48-.5-.66-.5-.17 0-.36-.02-.56-.02s-.51.07-.78.36c-.27.29-1.02 1-1.02 2.44 0 1.44 1.04 2.83 1.19 3.02.15.19 2.05 3.13 4.97 4.39.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.11.55-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.19-.56-.34Z"/></svg>
</a>

<?php wp_footer(); ?>
</body>
</html>
