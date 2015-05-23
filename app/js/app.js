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

  $scope.getImageUrl = function(preferredSize, imagesArray) {
    var image;
    var i;
    for (i = 0; i < imagesArray.length; i++) {
      image = imagesArray[i];
      if (image.size === preferredSize) {
        return image["#text"];
      }
    }
    return imagesArray[0];
  };

  $scope.getArtistUrl = function(artistObject) {
    return "http://www.last.fm/music/" + artistObject.url;
  };

  $scope.getTrackUrl = function(trackObject) {
    return trackObject.url;
  };

  this.getPersonalInfo = function(userInfo) {
    var sex = '';
    switch(userInfo.gender) {
      case 'm':
        sex = 'Male';
        break;
      case 'f':
        sex = 'Female';
        break;
    }
    var personalInfo = [
      userInfo.realname,
      sex,
      userInfo.age,
      userInfo.country
    ].filter(function(val) { return val });
    return personalInfo;
  };

  lastFm.get({
    method: 'user.info',
    success: function(data) {
      var userInfo = data.user;
      $scope.userInfo = userInfo;
      $scope.personalInfo = lastFm.getPersonalInfo(userInfo).join(', ');
      $scope.userImageUrl = $scope.getImageUrl('large', userInfo.image);
    }
  });

  lastFm.get({
    method: 'user.getrecenttracks',
    limit: 50,
    extended: 1,
    success: function(data) { $scope.recentTracks = data.recenttracks.track }
  });
});
