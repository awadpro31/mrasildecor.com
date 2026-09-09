<?php
/**
 * Fallback template for any page that hasn't been assigned one of the
 * templates in /page-templates/ (About Us, Interior Designs, Projects,
 * Contact). Renders the page's native WordPress title + content inside
 * the same visual shell as the rest of the site, so a new page never
 * looks broken or unstyled — it just won't have the custom sections
 * those specific templates build.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>
<section class="section">
  <div class="container" style="max-width:760px;">
    <?php while ( have_posts() ) : the_post(); ?>
      <h1 style="margin-bottom:.6em;"><?php the_title(); ?></h1>
      <div class="entry-content" style="color:var(--ink-2); line-height:1.8;">
        <?php the_content(); ?>
      </div>
    <?php endwhile; ?>
  </div>
</section>
<?php get_footer(); ?>
