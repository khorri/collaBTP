var app = angular.module('app', ['dependencies']);

app.constant('angularMomentConfig', {
	preprocess: 'utc', // optional
	timezone: 'Africa/Casablanca' // optional
});

app.run(['amMoment','editableOptions', function (amMoment,editableOptions) {
	amMoment.changeLocale('fr');
    editableOptions.theme = 'bs3';
}]);


app.config(['notificationServiceProvider', 'uiSelectConfig', function (notificationServiceProvider, uiSelectConfig) {

	uiSelectConfig.theme = 'select2';

	notificationServiceProvider.setDefaults({
		history: false,
		delay: 3000,
		closer: false,
		closer_hover: false,
		animate_speed: 'fast'
	});

}]);

//app.config(['$provide', function ($provide) {
//	$provide.decorator('$state', function ($delegate) {
//		var originalTransitionTo = $delegate.transitionTo;
//		$delegate.transitionTo = function (to, toParams, options) {
//			return originalTransitionTo(to, toParams, angular.extend({
//				reload: true
//			}, options));
//		};
//		return $delegate;
//	});
//}]);