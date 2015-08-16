var webaudio = angular.module( "webaudio", [])

.controller( "readout", function ( $scope ) {
  $scope.sample = "kick_1.wav";
  $scope.sound  = new Wad({
    source: $scope.sample,
    volume: 0.0
  });

  $scope.setupOscilloscope = function ( element ) {
    this.oscilloscope = new Oscilloscope({element: element, sound: this.sound});
    this.oscilloscope.draw();
  };

  $scope.setupBufferOscilloscope = function ( element ) {
    console.log("setting up buffer oscilloscope");
    this.bufferOscilloscope = new BufferOscilloscope({element: element, sound: this.sound});
    this.bufferOscilloscope.draw();
  };

  $scope.playSound = function () {
    var callback = function ( sound ) {
      if ( sound.soundSource ) {
        this.oscilloscope.connectStream( sound.soundSource );
        this.bufferOscilloscope.connectStream( sound.soundSource );
      }
    };

    this.sound.play({volume: 1, callback: _.bind(callback, this)});
  };
})

.directive( "oscilloscope", function ( $controller ) {
  return {
    restrict: "A",
    link: function ( scope, element ) {
      scope.setupOscilloscope( element );
    }
  };
})

.directive( "bufferOscilloscope", function ( $controller ) {
  return {
    restrict: "A",
    link: function ( scope, element ) {
      scope.setupBufferOscilloscope( element );
    }
  };
});
