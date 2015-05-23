'use strict';

var app = angular.module('scrobbled', ['ngRoute'], function($routeProvider) {
  $routeProvider.
    when("/", {
      controller: "ScrobbledController",
      templateUrl: "partials/lastfm-user-form.html"
    }).
    when("/:username", {
      controller: "LastFmUserController",
      templateUrl: "partials/lastfm-user.html"
    })
    .otherwise({ redirectTo: "/" });
});

app.controller("ScrobbledController", function($scope, $location) {
  $scope.gotoUser = function() {
    $location.path($scope.username);
  };
});

app.controller("LastFmUserController", function($scope, $routeParams, $http) {
  var lastFm = this;
  this.username = $routeParams.username;

  this.get = function(params) {
    var allParams = angular.extend(params, {
      api_key: "6b39d29302ef1b81f606123a16b901dc",
      format: "json",
      user: lastFm.username
    });

    $http.get("http://ws.audioscrobbler.com/2.0/", {params: allParams}).
      success(function(data, status, headers, config) {
        params.success(data);
      }).
      error(function(data, status, headers, config) {
        alert("Could not contact last.fm :-(");
      });
  };

  lastFm.get({
    method: 'user.info',
    success: function(data) { $scope.userInfo = data.user }
  });

  lastFm.get({
    method: 'user.getrecenttracks',
    extended: 1,
    success: function(data) { $scope.recentTracks = data.recenttracks.track }
  });
});
