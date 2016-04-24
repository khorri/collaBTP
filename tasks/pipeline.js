/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */



// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
	'styles/dependencies/bootstrap.min.css',
	'styles/dependencies/font-awesome.min.css',
	'styles/dependencies/animate.css',
	'styles/dependencies/pnotify.custom.css',
	'styles/dependencies/ngDialog.css',
	'styles/dependencies/ngDialog-theme-default.css',
	'styles/dependencies/jquery.dataTables.css',
	'styles/dependencies/dataTables.bootstrap.css',
	'styles/dependencies/dataTables.responsive.css',
	'styles/dependencies/select2.css',
	'styles/dependencies/datetimepicker.css',
	'styles/dependencies/angular-ui-switch.css',
	'styles/dependencies/angular-select.css',
	'styles/dependencies/selectize.default.css',
    'styles/dependencies/angular-timeline.css',
    'styles/dependencies/angular-timeline-bootstrap.css',
    'styles/dependencies/angular-timeline-animations.css',
	'styles/dependencies/**/*.css',
	//Main CSS
    'styles/main.css',


];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [
  // Load sails.io before everything else	
	'js/dependencies/sails.io.js',
	// Dependencies like jQuery, or Angular are brought in here
	'js/dependencies/jquery.js',
	'js/dependencies/jquery.dataTables.js',
	'js/dependencies/bootstrap.min.js',
	'js/dependencies/select2.min.js',
	'js/dependencies/angular.js',
	'js/dependencies/angular-sails.js',
    'js/dependencies/angular-sanitize.js',
	'js/dependencies/angular-ui-router.js',
    'js/dependencies/angular-scroll-animate.js',
    'js/dependencies/angular-timeline.js',
	'js/dependencies/textAngular-rangy.min.js',
	'js/dependencies/textAngular-sanitize.min.js',
	'js/dependencies/angular-resource.js',
	'js/dependencies/angular-filter.js',
	'js/dependencies/angular-ui.js',
	'js/dependencies/angular-select2.js',
	'js/dependencies/angular-animate.js',
	'js/dependencies/moment-with-locales.min.js',
	'js/dependencies/angular-moment.js',
	'js/dependencies/pnotify.custom.js',
	'js/dependencies/angular-pnotify.js',
	'js/dependencies/ngDialog.js',
	'js/dependencies/angular-datatables.js',
	'js/dependencies/dataTables.responsive.js',
	'js/dependencies/datetimepicker.js',
	'js/dependencies/angular-ui-switch.js',
	'js/dependencies/angular-file-upload-all.js',
	'js/dependencies/angular-busy.js',
	'js/dependencies/smart-table.js',
	'js/dependencies/angular-select.js',
	'js/dependencies/ui-router-tabs.js',
	'js/dependencies/**/*.js',

	//angularjs App
	'app/**/*.js'

  // All of the rest of your client-side js files
  // will be injected here in no particular order. 
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];



// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function (path) {
	return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function (path) {
	return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function (path) {
	return 'assets/' + path;
});