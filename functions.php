<?php
/**
 * MRASIL theme functions.
 *
 * Loads the pieces from /inc/ so this file stays a table of contents,
 * not a 2000-line dumping ground.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

define( 'MRASIL_THEME_VERSION', '1.0.0' );
define( 'MRASIL_THEME_DIR', get_template_directory() );
define( 'MRASIL_THEME_URI', get_template_directory_uri() );

require_once MRASIL_THEME_DIR . '/inc/i18n.php';
require_once MRASIL_THEME_DIR . '/inc/cpt-services.php';
require_once MRASIL_THEME_DIR . '/inc/cpt-projects.php';
require_once MRASIL_THEME_DIR . '/inc/cpt-gallery.php';
require_once MRASIL_THEME_DIR . '/inc/cpt-reviews.php';
require_once MRASIL_THEME_DIR . '/inc/acf-json.php';
require_once MRASIL_THEME_DIR . '/inc/options-page.php';
require_once MRASIL_THEME_DIR . '/inc/enqueue.php';
require_once MRASIL_THEME_DIR . '/inc/forms.php';
require_once MRASIL_THEME_DIR . '/inc/theme-setup.php';
require_once MRASIL_THEME_DIR . '/inc/activation.php';
