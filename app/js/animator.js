var Animator = function ( sound ) {

  this.sound = sound;

  this.animate = function () {
    window.requestAnimationFrame( _.bind(this.animate, this) );
  };
};
