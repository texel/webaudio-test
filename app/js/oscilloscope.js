var Oscilloscope = function ( attributes ) {
  this.element = attributes.element;
  this.sound   = attributes.sound;

  this.setup();
};

_.extend( Oscilloscope.prototype, {
    setup: function () {
      this.canvas       = this.element[0].getContext('2d');
      this.audioContext = this.sound.destination.context;
      this.analyser     = this.audioContext.createAnalyser();

      this.analyser.fftSize = 2048;
      this.bufferLength     = this.analyser.frequencyBinCount;
      this.dataArray        = new Uint8Array(this.bufferLength);
    },

    connectStream: function ( stream ) {
      if ( this.currentStream ) {
        this.currentStream.disconnect();
      }

      this.currentStream = stream;

      this.currentStream.connect( this.analyser );
    },

    draw: function () {
      // For now...
      var WIDTH = 100;
      var HEIGHT = 100;

      requestAnimationFrame( _.bind( this.draw, this ) );

      this.analyser.getByteTimeDomainData( this.dataArray );

      this.canvas.fillStyle = 'rgb(200, 200, 200)';
      this.canvas.fillRect(0, 0, WIDTH, HEIGHT);
      this.canvas.lineWidth = 1;
      this.canvas.strokeStyle = 'rgb(0, 0, 0)';
      this.canvas.beginPath();

      var sliceWidth = WIDTH * 1.0 / this.bufferLength;
      var x = 0;

      for( var i = 0; i < this.bufferLength; i++ ) {
        var v = this.dataArray[i] / 128.0;
        var y = v * HEIGHT / 2;

        if ( i === 0 ) {
          this.canvas.moveTo(x, y);
        }
        else {
          this.canvas.lineTo(x, y);
        }

        x += sliceWidth;
      }

      this.canvas.lineTo(this.canvas.width, this.canvas.height / 2);
      this.canvas.stroke();
    }
});
