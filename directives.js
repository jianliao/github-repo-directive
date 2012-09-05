'use strict';

var myApp = angular.module('myApp', []);

/* Directives */

myApp.directive('appVersion', ['version', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}]);

myApp.directive('githubRepo', ['$http', '$document', function($http, $document) {
	return {
		restrict: 'A',
		link: function(scope, elm, attrs) {
			var address = attrs.href.slice(attrs.href.indexOf('github.com/') + 11);
			// Create jsonp to call github web api
			$http.jsonp('https://api.github.com/repos/' + address + '?callback=JSON_CALLBACK').success(function(data, status) {
				var repoInfo = data.data;
				var formattedRepoName = repoInfo.full_name.replace('/', '_');
				var container = angular.element('<div/>');

				var repoContent;
				if (repoInfo.description && repoInfo.homepage) {
					repoContent = '<p>' + repoInfo.description + '</p><p class="homepage"><strong><a href="' + repoInfo.homepage + '">' + repoInfo.homepage + '</a></strong></p>';
				} else if (repoInfo.description) {
					repoContent = '<p>' + repoInfo.description + '</p>';
				} else if (repoInfo.homepage) {
					repoContent = '<p class="homepage"><strong><a href="' + repoInfo.homepage + '">' + repoInfo.homepage + '</a></strong></p>';
				} else {
					repoContent = '<p class="none">No description or homepage.</p>';
				}

				container.addClass('reposidget');
				container.html('<div class="reposidget-header"><h2><a href="https://github.com/' + repoInfo.owner.login + '">' + repoInfo.owner.login + '</a>&nbsp;/&nbsp;<strong><a href="' + repoInfo.html_url + '">' + repoInfo.name + '</a></strong></h2></div><div class="reposidget-content">' + repoContent + '</div><div class="reposidget-footer"><span class="social"><span class="star">' + repoInfo.watchers_count + '</span><span class="fork">' + repoInfo.forks_count + '</span></span><a href="' + repoInfo.html_url + '/zipball/' + repoInfo.master_branch + '">Download as zip</a></div>');
				elm.after(container);
				elm.css('display', 'none');
			});
		}
	};
}]);