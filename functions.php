<?php

add_theme_support( 'title-tag' );

function rest_theme_scripts() {
	wp_enqueue_style( 'normalize', get_template_directory_uri() . '/normalize.css', false, '3.0.3' );
	wp_enqueue_style( 'normalize', get_template_directory_uri() . '/normalize.css', array( 'normalize' ) );

    wp_enqueue_style( 'natixis-css', get_template_directory_uri() . '/frontend/build/static/css/main.css', false, '' );
    wp_enqueue_style( 'natixis-css', get_template_directory_uri() . '/frontend/build/static/css/main.css', array( '' ) );

	$base_url  = esc_url_raw( home_url() );
	$base_path = rtrim( parse_url( $base_url, PHP_URL_PATH ), '/' );

	wp_enqueue_script( 'natixis-js', get_template_directory_uri() . '/frontend/build/static/js/main.js', array(),null, true );
	wp_localize_script( 'natixis-js', 'wami_js', array(
		'root'      => esc_url_raw( rest_url() ),
		'base_url'  => $base_url,
		'base_path' => $base_path ? $base_path . '/' : '/',
		'nonce'     => wp_create_nonce( 'wp_rest' ),
		'site_name' => get_bloginfo( 'name' ),
		'routes'    => rest_theme_routes(),
	) );
}

add_action( 'wp_enqueue_scripts', 'rest_theme_scripts' );

function rest_theme_routes() {
	$routes = array();

	$query = new WP_Query( array(
		'post_type'      => 'any',
		'post_status'    => 'publish',
		'posts_per_page' => -1,
	) );
	if ( $query->have_posts() ) {
		while ( $query->have_posts() ) {
			$query->the_post();
			$routes[] = array(
				'id'   => get_the_ID(),
				'type' => get_post_type(),
				'slug' => basename( get_permalink() ),
			);
		}
	}
	wp_reset_postdata();

	return $routes;
}

function getRealIpAddr () {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) { //check ip from share internet
        $ip=$_SERVER['HTTP_CLIENT_IP'];
    }
    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) { //to check ip is pass from proxy
        $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    else {
        $ip=$_SERVER['REMOTE_ADDR'];
    }
    return $ip;
}

/**
 * Custom menu api route
 */
add_theme_support( 'menus' );

function get_menu() {
    echo json_encode($_SERVER['HTTP_X_WR_GEO_CC']);
}

add_action('rest_api_init', function() {
    register_rest_route('wp/v2', '/menu', array(
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'get_menu'
    ));
    register_rest_route('wp/v2', '/questions', array(
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'get_questions'
    ));
});

function get_questions() {
    $questions = array();
    $timers = array();
    $post = get_page_by_title('home');
    $postID = $post->ID;

    if(empty($post)) {
        return new \WP_REST_Response(array(
            'success' => false,
            'questions' => array()
        ), 404);
    }

    $timers['timer_general'] = get_field('timer_general', $postID);
    $timers['timer_question'] = get_field('timer_question', $postID);

    if(have_rows('questions', $postID)) {
        while(have_rows('questions', $postID)) {
            $i = get_row_index();
            the_row();
            $questions[$i]['question'] = get_sub_field('question');
            //$questions[$i]['bonne_reponse'] = get_sub_field('bonne_reponse');
            if(have_rows('reponses',$postID)) {
                while(have_rows('reponses', $postID)) {
                    the_row();
                    $questions[$i]['reponses'][] = get_sub_field('reponse');
                }
            }
        }
    }

    return new \WP_REST_Response(array(
        'success' => true,
        'questions' => $questions,
        'timers' => $timers
    ), 200);
}
