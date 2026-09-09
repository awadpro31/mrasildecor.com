<?php
/**
 * Site header: <html> opening through the nav + mobile menu.
 * Language is resolved server-side (inc/i18n.php) before anything is
 * echoed, so dir="rtl"/"ltr" and lang="ar"/"en" are correct on the very
 * first byte — no client-side flash like the static build had.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$lang    = mrasil_current_lang();
$is_rtl  = mrasil_is_rtl();
$wa      = preg_replace( '/\D/', '', mrasil_setting( 'whatsapp', '971545448945' ) );
?><!DOCTYPE html>
<html lang="<?php echo esc_attr( $lang ); ?>" dir="<?php echo $is_rtl ? 'rtl' : 'ltr'; ?>">
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<?php wp_head(); ?>
</head>
<body <?php body_class( $is_rtl ? 'lang-ar' : 'lang-en' ); ?>>
<a class="skip-link" href="#main"><?php echo $is_rtl ? 'تخطَّ إلى المحتوى' : 'Skip to content'; ?></a>

<div id="loader" aria-hidden="true">
  <div class="loader-mark">
    <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47"/></svg>
    <?php if ( has_custom_logo() ) : the_custom_logo(); else : ?>
      <img src="<?php echo esc_url( MRASIL_THEME_URI . '/assets/img/mrasil-icon.png' ); ?>" alt="">
    <?php endif; ?>
  </div>
  <div class="loader-line"></div>
  <span class="loader-word">Mrasil</span>
</div>

<audio id="ambient-audio" src="<?php echo esc_url( MRASIL_THEME_URI . '/assets/audio/ambient.mp3' ); ?>" loop preload="none"></audio>

<header class="site-header">
  <div class="container nav-row">
    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="brand" aria-label="MRASIL — <?php echo $is_rtl ? 'الرئيسية' : 'home'; ?>">
      <?php if ( has_custom_logo() ) : the_custom_logo(); else : ?>
        <img src="<?php echo esc_url( MRASIL_THEME_URI . '/assets/img/mrasil-logo-web.png' ); ?>" alt="MRASIL" style="height:46px;width:auto;">
      <?php endif; ?>
    </a>
    <nav class="nav-links" aria-label="Primary">
      <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="<?php echo is_front_page() ? 'is-active' : ''; ?>"><?php echo $is_rtl ? 'الرئيسية' : 'Home'; ?></a>
      <a href="<?php echo esc_url( get_page_link( get_page_by_path( 'about' ) ) ); ?>"><?php echo $is_rtl ? 'من نحن' : 'About Us'; ?></a>
      <a href="<?php echo esc_url( get_page_link( get_page_by_path( 'interior-designs' ) ) ); ?>"><?php echo $is_rtl ? 'التصاميم الداخلية' : 'Interior Designs'; ?></a>
      <a href="<?php echo esc_url( get_page_link( get_page_by_path( 'projects' ) ) ); ?>"><?php echo $is_rtl ? 'المشاريع' : 'Projects'; ?></a>
      <a href="<?php echo esc_url( get_page_link( get_page_by_path( 'contact' ) ) ); ?>"><?php echo $is_rtl ? 'تواصل معنا' : 'Contact'; ?></a>
    </nav>
    <div class="nav-actions">
      <div class="lang-switch" role="group" aria-label="Language">
        <a href="<?php echo mrasil_lang_switch_url( 'ar' ); ?>" data-lang-switch="ar" class="<?php echo $is_rtl ? 'is-active' : ''; ?>">AR</a>
        <a href="<?php echo mrasil_lang_switch_url( 'en' ); ?>" data-lang-switch="en" class="<?php echo ! $is_rtl ? 'is-active' : ''; ?>">EN</a>
      </div>
      <button class="icon-btn" data-music-toggle type="button" aria-label="<?php echo $is_rtl ? 'تشغيل الصوت المحيطي' : 'Play ambient sound'; ?>" aria-pressed="false" title="Ambient sound">
        <span class="eq"><i></i><i></i><i></i></span>
      </button>
      <a href="<?php echo esc_url( get_page_link( get_page_by_path( 'contact' ) ) ); ?>" class="btn btn-primary btn-sm"><?php echo $is_rtl ? 'استفسار' : 'Enquire'; ?></a>
      <button class="menu-toggle" aria-label="<?php echo $is_rtl ? 'فتح القائمة' : 'Open menu'; ?>" aria-expanded="false" aria-controls="mobile-menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>

<nav id="mobile-menu" class="mobile-menu" aria-label="Mobile">
  <a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php echo $is_rtl ? 'الرئيسية' : 'Home'; ?></a>
  <a href="<?php echo esc_url( get_page_link( get_page_by_path( 'about' ) ) ); ?>"><?php echo $is_rtl ? 'من نحن' : 'About Us'; ?></a>
  <a href="<?php echo esc_url( get_page_link( get_page_by_path( 'interior-designs' ) ) ); ?>"><?php echo $is_rtl ? 'التصاميم الداخلية' : 'Interior Designs'; ?></a>
  <a href="<?php echo esc_url( get_page_link( get_page_by_path( 'projects' ) ) ); ?>"><?php echo $is_rtl ? 'المشاريع' : 'Projects'; ?></a>
  <a href="<?php echo esc_url( get_page_link( get_page_by_path( 'contact' ) ) ); ?>"><?php echo $is_rtl ? 'تواصل معنا' : 'Contact'; ?></a>
  <div class="mm-foot">
    <span class="socials">Instagram · LinkedIn · Pinterest</span>
    <div class="lang-switch" role="group" aria-label="Language">
      <a href="<?php echo mrasil_lang_switch_url( 'ar' ); ?>" class="<?php echo $is_rtl ? 'is-active' : ''; ?>">AR</a>
      <a href="<?php echo mrasil_lang_switch_url( 'en' ); ?>" class="<?php echo ! $is_rtl ? 'is-active' : ''; ?>">EN</a>
    </div>
  </div>
</nav>

<main id="main">
