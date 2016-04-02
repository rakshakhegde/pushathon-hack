importScripts('https://cdn.firebase.com/js/client/2.4.0/firebase.js');
rootRef = new Firebase('https://sbscrb.firebaseio.com/');
rootRef.child('post').on('child_changed', function(snap) {
	console.log('New outer post:', snap.val());
	showNotif(snap);
});
var channelNames = []
rootRef.child('channelTypes').once('value', function(snap) {
	snap.val().forEach(function(channelType) {
		channelType.channels.forEach(function(channel) {
			channelNames.push(channel.name);
			rootRef.child('post/' + channel.name).on('child_changed', function(snap) {
				console.log('New post:', snap.key());
				showNotif(snap);
			});
		})
	});
	console.log(channelNames);
});

function showNotif(snap) {
	self.registration.showNotification("New #SBSCRBR Post", {
		body: "New " + snap.key() + ' post. Read it now!',
		tag: 'tag-post'
	});
}


self.addEventListener('notificationclick', function (event) {
	console.log('Notification click: tag ', event.notification.tag);
	event.notification.close();
	var url = 'https://sbscrb.firebaseapp.com';
	event.waitUntil(
		clients.matchAll({
			type: 'window'
		}).then(function (windowClients) {
			for (var i = 0; i < windowClients.length; i++) {
				var client = windowClients[i];
				if (client.url === url && 'focus' in client) {
					return client.focus();
				}
			}
			if (clients.openWindow) {
				return clients.openWindow(url);
			}
		})
	);
});
