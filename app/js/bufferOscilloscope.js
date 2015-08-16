var BufferOscilloscope = function ( attributes ) {
  this.element = attributes.element;
  this.sound   = attributes.sound;

  this.setup();
};

_.extend( BufferOscilloscope.prototype, {
    setup: function () {
      this.canvas       = this.element[0].getContext('2d');
      this.width        = 600;
      this.height       = 100;
      this.audioContext = this.sound.destination.context;
      this.analyser     = this.audioContext.createAnalyser();

      this.analyser.fftSize = 2048;
      this.bufferLength     = this.analyser.frequencyBinCount;

      this.tickWidth        = this.width / 24;
      this.pixelBuffer      = new Uint8Array(this.width);
      this.dataArray        = new Uint8Array(this.bufferLength);

      for ( var i = 0; i < this.pixelBuffer.length; i += 1 ) {
        this.pixelBuffer[i] = 128;
      }
    },

    connectStream: function ( stream ) {
      if ( this.currentStream ) {
        this.currentStream.disconnect();
      }

      this.currentStream = stream;

      this.currentStream.connect( this.analyser );
    },

    preparePixelBuffer: function () {
      // Move all the existing values left by one tick
      this.pixelBuffer.copyWithin(0, this.tickWidth);

      // Copy this window's values to a buffer
      this.analyser.getByteTimeDomainData( this.dataArray );

      var sliceWidth = this.bufferLength * 1.0 / this.tickWidth;

      var x = 0;
      var d = false;

      for ( var i = this.width - this.tickWidth; i < this.width; i += 1 ) {
        // debugger;
        this.pixelBuffer[i] = this.dataArray[x];

        x = Math.round(x + sliceWidth);
      }
    },

    draw: function () {
      requestAnimationFrame( _.bind( this.draw, this ) );

      this.preparePixelBuffer();

      this.canvas.fillStyle = 'rgb(200, 200, 200)';
      this.canvas.fillRect(0, 0, this.width, this.height);
      this.canvas.lineWidth = 1;
      this.canvas.strokeStyle = 'rgb(0, 0, 0)';
      this.canvas.beginPath();

      var sliceWidth = 1;
      var x = 0;

      for( var i = 0; i < this.pixelBuffer.length; i++ ) {
        var v = this.pixelBuffer[i] / 128.0;
        var y = v * this.height / 2;

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
