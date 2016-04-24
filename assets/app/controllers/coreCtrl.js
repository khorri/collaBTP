// CORE CONTROLLER

app.controller('coreCtrl', ['$scope', 'navService', '$sails', 'notificationService', 'userService', 'messageService', 'ngDialog','$window', function ($scope, navService, $sails, notificationService, userService, messageService, ngDialog,$window) {
	$scope.ready = false;
	$scope.showChatBox = false;
	$scope.usersHidden = true;
	userService.getLoggedUser();
	messageService.getAll();
	$scope.lastmessages = messageService.messages;

	angular.element(document).ready(function () {
		$scope.ready = true;
	});

	$scope.$watch(function () {
		return navService.page;
	}, function (newValue) {
		$scope.page = newValue;
	});

	$scope.usersNavClicked = function () {
		if ($scope.usersHidden) {
			$scope.usersHidden = false
		} else {
			$scope.usersHidden = true
		}
	}

	$scope.friendClicked = function (user) {
		$scope.chatUser = user;
		$scope.showChatBox = true;
	}

	$scope.closeChatBoxClicked = function () {
		$scope.showChatBox = false;
	}

	$scope.isLogged = function (elm) {
		return userService.loggedUser.id == elm.id;
	}

	$scope.sendMsg = function () {
		messageService.create($scope.msgToSend, userService.loggedUser, $scope.chatUser);
		$scope.msgToSend = '';
	}

	$scope.openMsg = function () {

	}

	$sails.on('user', function (m) {
		if (m.verb == 'messaged') {
			messageService.getAll();
			notificationService.notify({
				title: 'New message',
				text: m.data.from.name + ': ' + m.data.content,
				icon: 'fa fa-envelope',
				type: 'info',
				animate_speed: 'fast'
			});
		}
	});


	$sails.on('disconnect', function () {
		$scope.disconnected = true;

		notificationService.notify({
			title: 'Deconnection',
			text: 'La connection avec le serveur a été perdu',
			icon: 'fa fa-power-off',
			type: 'error',
			hide: true,
			buttons: {
				closer: false,
				sticker: false
			}
		});

       /* ngDialog.open({
            template: 'appNotFoundModal',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: false,
            className: 'ngdialog-theme-default ngdialog-small'
        });*/

	});

	$sails.on('connect', function () {
		if ($scope.disconnected) {
			notificationService.notify({
				title: 'Connection',
				text: 'Vous êtes connecté au serveur',
				icon: 'fa fa-power-off',
				type: 'info',
				hide: true,
				buttons: {
					closer: true,
					sticker: false
				}
			});
			$scope.disconnected = false;
		}
	});

    $scope.closeModal = function () {
        ngDialog.closeAll();
        $window.location.href='/login';
    }

}]);