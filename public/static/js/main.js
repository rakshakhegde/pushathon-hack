registerSW();

(function () {
	var app = angular.module('channelFeed', ['firebase']);

	app.controller('AppController', function ($scope, $firebaseObject, $firebaseAuth) {
		rootRef = new Firebase('https://sbscrb.firebaseio.com/');
		$scope.loggedIn = rootRef.getAuth();
		$scope.errorText = '';
		$scope.channelTypes = $firebaseObject(rootRef.child('channelTypes'));
		if ($scope.loggedIn) {
			$scope.following = $firebaseObject(rootRef.child('following/' + rootRef.getAuth().uid));
		}

		var auth = $firebaseAuth(rootRef);
		console.log(auth);
		$scope.login = function () {
			auth.$authWithOAuthPopup('twitter').then(function (authData) {
				$scope.loggedIn = true;
				$scope.errorText = '';
				$scope.following = $firebaseObject(rootRef.child('following/' + rootRef.getAuth().uid));
			}).catch(function (error) {
				$scope.errorText += '\nAuthentication failed';
			});
		};

		$scope.follow = function (channelName) {
			rootRef.child('following/' + rootRef.getAuth().uid + '/' + channelName).set(true);
		};
		$scope.unfollow = function (channelName) {
			rootRef.child('following/' + rootRef.getAuth().uid + '/' + channelName).remove();
		};
	});
})();

function registerSW() {
	if ('serviceWorker' in navigator) {
		console.log('Service Worker is supported');
		navigator.serviceWorker.register('sw.js').then(function (reg) {
			console.log(':^)', reg);
		}).catch(function (err) {
			console.log(':^(', err);
		});
	}
}

function invalidTokens() {
	showError('Invalid tokens provided in URL!');
}

function showError(errorMsg) {
	$('#error-text').show();
	$('#error-text').append('</br>' + errorMsg);
}

function updateLocation2() {
	navigator.geolocation.getCurrentPosition(function (pos) {
		rootRef.child('trucker/' + rootRef.getAuth().uid).update({
			lat: pos.coords.latitude,
			lng: pos.coords.longitude
		});
		console.log(pos);
	});
	console.log('updating Loc');
	setTimeout(updateLocation2, 5000);
}

// TODO updateLocation2();
