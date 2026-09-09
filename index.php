<?php
/**
 * The ultimate fallback WordPress falls back to when nothing more
 * specific matches (front-page.php, the page-templates/, page.php,
 * single.php, etc.). Every theme is required to have this file.
 *
 * MRASIL is a business site, not a blog, so this deliberately stays
 * minimal rather than building out a full posts loop/archive design —
 * if blog functionality is wanted later, this is the file to expand.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>
<section class="section">
  <div class="container" style="max-width:760px;">
    <?php if ( have_posts() ) : ?>
      <?php while ( have_posts() ) : the_post(); ?>
        <article <?php post_class(); ?>>
          <h1 style="margin-bottom:.4em;"><?php the_title(); ?></h1>
          <div class="entry-content" style="color:var(--ink-2); line-height:1.8;">
            <?php the_content(); ?>
          </div>
        </article>
        <hr class="divider-fade" style="margin:40px 0;">
      <?php endwhile; ?>
    <?php else : ?>
      <p><?php echo mrasil_is_rtl() ? 'لا يوجد محتوى هنا بعد.' : 'Nothing here yet.'; ?></p>
    <?php endif; ?>
  </div>
</section>
<?php get_footer(); ?>
