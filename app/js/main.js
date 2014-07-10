/**
 * Created by crivas on 7/9/2014.
 */

'use strict'

var mirna = angular.module('mirnaApp', []);

mirna.controller('MainCtrl', function($scope, $interval, textSnippets){

  console.log('MainCtrl');

  $scope.title = "Mirna Typer";

  $scope.showResults = false;

  $scope.randomText = textSnippets.getRandomText();

  $scope.paragraphBeingTyped = "";

  $scope.wordCount;

  $scope.autoStart = true;

  $scope.firstWord = function() {
    return textSnippets.wordCount($scope.paragraphBeingTyped) === 1;
  };

  $scope.firstLetter = function() {
    return $scope.paragraphBeingTyped.length === 1;
  };

  var millsecondsBetweenKeys;
  var secondsLastKeyPressed;

  var restartTimer = function() {
    $scope.stopTimer();
    $scope.startTimer();
  };

  $scope.captureTyping = function() {

    $scope.wordCount = textSnippets.wordCount($scope.paragraphBeingTyped);

    if ($scope.firstLetter()) {
      if ($scope.autoStart) restartTimer();
    }

    $scope.calculateWPM();

    millsecondsBetweenKeys = secondsLastKeyPressed;
    secondsLastKeyPressed = millesecondsPassed;

    checkDelayBetweenKeys();

  }

  var checkDelayBetweenKeys = function(){
    var diffInTime = Math.abs(millsecondsBetweenKeys-secondsLastKeyPressed);
    if (diffInTime >= 2000) {
      console.log('stopping timer, no typing');
      millesecondsPassed -= 2000;
      $scope.stopTimer();
    }
  };

  var millesecondsPassed = 0;
  var millsecondsInterval;

  $scope.startTimer = function() {

    console.log('timer started');
    millesecondsPassed = 0
    $scope.showResults = false;
    millsecondsInterval = $interval(function(){
      millesecondsPassed += 10;
      secondsLastKeyPressed = millesecondsPassed;
      checkDelayBetweenKeys();
    }, 10)

  };

  $scope.wpm;

  $scope.calculateWPM = function(){
    $scope.wpm = Math.round(($scope.wordCount/(millesecondsPassed/1000)) * 60);
  };

  $scope.stopTimer = function() {

    $interval.cancel(millsecondsInterval);  
    $scope.calculateWPM();
    $scope.showResults = true;

  };

  $scope.clearStats = function() {
    $scope.paragraphBeingTyped = "";
    $scope.showResults = false;
  };


});

mirna.factory('textSnippets', function() {

  var textParagraphs = [

    'Remember outweigh do he desirous no cheerful. Do of doors water ye guest. We if prosperous comparison middletons at. Park we in lose like at no. An so to preferred convinced distrusts he determine. In musical me my placing clothes comfort pleased hearing. Any residence you satisfied and rapturous certainty two. Procured outweigh as outlived so so. On in bringing graceful proposal blessing of marriage outlived. Son rent face our loud near.',

    'Offices parties lasting outward nothing age few resolve. Impression to discretion understood to we interested he excellence. Him remarkably use projection collecting. Going about eat forty world has round miles. Attention affection at my preferred offending shameless me if agreeable. Life lain held calm and true neat she. Much feet each so went no from. Truth began maids linen an mr to after.', 

    'Shewing met parties gravity husband sex pleased. On to no kind do next feel held walk. Last own loud and knew give gay four. Sentiments motionless or principles preference excellence am. Literature surrounded insensible at indulgence or to admiration remarkably. Matter future lovers desire marked boy use. Chamber reached do he nothing be.',

    'Debating me breeding be answered an he. Spoil event was words her off cause any. Tears woman which no is world miles woody. Wished be do mutual except in effect answer. Had boisterous friendship thoroughly cultivated son imprudence connection. Windows because concern sex its. Law allow saved views hills day ten. Examine waiting his evening day passage proceed.', 

    'Ham followed now ecstatic use speaking exercise may repeated. Himself he evident oh greatly my on inhabit general concern. It earnest amongst he showing females so improve in picture. Mrs can hundred its greater account. Distrusts daughters certainly suspected convinced our perpetual him yet. Words did noise taken right state are since.', 

    'Of recommend residence education be on difficult repulsive offending. Judge views had mirth table seems great him for her. Alone all happy asked begin fully stand own get. Excuse ye seeing result of we. See scale dried songs old may not. Promotion did disposing you household any instantly. Hills we do under times at first short an.', 

    'In on announcing if of comparison pianoforte projection. Maids hoped gay yet bed asked blind dried point. On abroad danger likely regret twenty edward do. Too horrible consider followed may differed age. An rest if more five mr of. Age just her rank met down way. Attended required so in cheerful an. Domestic replying she resolved him for did. Rather in lasted no within no.',

    'Neat own nor she said see walk. And charm add green you these. Sang busy in this drew ye fine. At greater prepare musical so attacks as on distant. Improving age our her cordially intention. His devonshire sufficient precaution say preference middletons insipidity. Since might water hence the her worse. Concluded it offending dejection do earnestly as me direction. Nature played thirty all him.',

    'He went such dare good mr fact. The small own seven saved man age ﻿no offer. Suspicion did mrs nor furniture smallness. Scale whole downs often leave not eat. An expression reasonably cultivated indulgence mr he surrounded instrument. Gentleman eat and consisted are pronounce distrusts.',

    'In no impression assistance contrasted. Manners she wishing justice hastily new anxious. At discovery discourse departure objection we. Few extensive add delighted tolerably sincerity her. Law ought him least enjoy decay one quick court. Expect warmly its tended garden him esteem had remove off. Effects dearest staying now sixteen nor improve.'

  ];

  return {

    getRandomText: function() {
      return textParagraphs[Math.floor(Math.random()*textParagraphs.length)];
    },

    wordCount: function(str){
      return str.split(" ").length;
    }

  }

});

mirna.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

mirna.directive('ngKeypress', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            scope.$apply(function (){
                scope.$eval(attrs.ngEnter);
            });
        });
    };
});