$(function() {
  var canvas = $("canvas");
  var $msg = $("#msg");
  var bounds = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  canvas.resize(function() {
    bounds.width = window.innerWidth;
    bounds.height = window.innerHeight;
    canvas.attr(bounds);
  }).resize();
  var clock = {
    start: 0,
    time: 0,
    delta: 0,
    fpsc: 0,
    fps: 0
  };
  setInterval(function() {
    clock.fps = clock.fpsc;
    clock.fpsc = 0;
    $msg.text('FPS: ' + clock.fps);
  }, 1000);

  function animate() {
    if (!clock.time) clock.time = Date.now();
    clock.delta = (Date.now() - clock.time) / 1000.0;
    clock.delta = Math.min(0.1, Math.max(0.001, clock.delta));
    clock.time = Date.now();
    if (!clock.start) {
      clock.start = clock.time;
    }
    draw(clock);
    clock.fpsc++;
    requestAnimationFrame(animate);
  }

  var QCONS = 0.001;

  function Star(galaxy) {
    var that = {
      pos: new Array(3),
      vel: new Array(3),
      size: 0
    };

    var w = 2.0 * Math.PI * Math.random(),
      sinw = Math.sin(w),
      cosw = Math.cos(w),
      d = Math.random() * galaxy.size,
      h = Math.random() * Math.exp(-2.0 * (d / galaxy.size)) / 5.0 * galaxy.size;

    if (Math.random() < 0.5) {
      h = -h;
    }

    that.pos[0] = galaxy.mat[0][0] * d * cosw + galaxy.mat[1][0] * d * sinw +
      galaxy.mat[2][0] * h + galaxy.pos[0];
    that.pos[1] = galaxy.mat[0][1] * d * cosw + galaxy.mat[1][1] * d * sinw +
      galaxy.mat[2][1] * h + galaxy.pos[1];
    that.pos[2] = galaxy.mat[0][2] * d * cosw + galaxy.mat[1][2] * d * sinw +
      galaxy.mat[2][2] * h + galaxy.pos[2];

    var v = Math.sqrt(galaxy.mass * QCONS / Math.sqrt(d * d + h * h));

    that.vel[0] = -galaxy.mat[0][0] * v * sinw + galaxy.mat[1][0] * v * cosw +
      galaxy.vel[0];
    that.vel[1] = -galaxy.mat[0][1] * v * sinw + galaxy.mat[1][1] * v * cosw +
      galaxy.vel[1];
    that.vel[2] = -galaxy.mat[0][2] * v * sinw + galaxy.mat[1][2] * v * cosw +
      galaxy.vel[2];

    that.size = Math.floor((Math.random() * 7.0));
    return that;
  }

  var MAXSTARS = 700,
    GALAXYRANGESIZE = 0.1,
    GALAXYMINSIZE = 0.1,
    ZOFFSET = 1.5;

  function Galaxy(universe) {
    var that = {
      pos: new Array(3),
      vel: new Array(3),
      mat: new Array(3),
      nstars: MAXSTARS,
      mass: 0,
      size: 0,
      color: '#' + Math.floor(Math.random() * 255).toString(16) + Math.floor(Math.random() * 255).toString(16) + Math.floor(Math.random() * 255).toString(16)
    };
    for (var i = 0; i < 3; ++i) {
      that.mat[i] = new Array(3);
    }

    that.vel[0] = Math.random() * 2.0 - 1.0;
    that.vel[1] = Math.random() * 2.0 - 1.0;
    that.vel[2] = Math.random() * 2.0 - 1.0;

    that.pos[0] = -that.vel[0] * universe.f_deltat *
      universe.f_hititerations + Math.random() - 0.5;
    that.pos[1] = -that.vel[1] * universe.f_deltat *
      universe.f_hititerations + Math.random() - 0.5;
    that.pos[2] = (-that.vel[2] * universe.f_deltat *
      universe.f_hititerations + Math.random() - 0.5) + ZOFFSET;

    that.mass = that.nstars;

    that.size = GALAXYRANGESIZE * Math.random() + GALAXYMINSIZE;

    /* initialize galaxy disk */
    var w1 = 2.0 * Math.PI * Math.random(),
      w2 = 2.0 * Math.PI * Math.random(),
      sinw1 = Math.sin(w1),
      sinw2 = Math.sin(w2),
      cosw1 = Math.cos(w1),
      cosw2 = Math.cos(w2);
    that.mat[0][0] = cosw2;
    that.mat[0][1] = -sinw1 * sinw2;
    that.mat[0][2] = cosw1 * sinw2;
    that.mat[1][0] = 0.0;
    that.mat[1][1] = cosw1;
    that.mat[1][2] = sinw1;
    that.mat[2][0] = -sinw2;
    that.mat[2][1] = -sinw1 * cosw2;
    that.mat[2][2] = cosw1 * cosw2;

    /* create stars */
    that.stars = new Array(that.nstars);
    for (i = 0; i < that.nstars; ++i) {
      that.stars[i] = Star(that);
    }
    return that;
  }

  var MINITERATIONS = 500,
    MAX_IDELTAT = 50;

  function Universe(ngalaxies) {
    var that = {
      f_hititerations: MINITERATIONS,
      f_deltat: MAX_IDELTAT / 10000.0,
      /* quality of calculation */
      galaxies: new Array(ngalaxies)
    };
    /* create galaxies */

    for (var i = 0; i < ngalaxies; ++i) {
      that.galaxies[i] = Galaxy(that);
    }
    return that;
  }

  var ngalaxies = 5,
    steps = 0,
    universe;

  function init() {
    steps = 0;
    universe = Universe(ngalaxies);
  }

  function draw(clock) {
    var ctx = canvas[0].getContext("2d"),
      xf = bounds.width,
      yf = bounds.height,
      xf2 = bounds.width / 2,
      yf2 = bounds.height / 2,
      f_deltat = universe.f_deltat,
      delta = 0.000005,
      d, gt, gtk, i, j, k, d0, d1, d2, x, y, z, st, v0, v1, v2;

    ctx.clearRect(0, 0, xf, yf);
    ctx.fillStyle = '#FFF';

    for (i = 0; i < ngalaxies; ++i) {
      gt = universe.galaxies[i];
      for (j = 0; j < gt.nstars; ++j) {
        ctx.fillStyle = gt.color;
        st = gt.stars[j];
        v0 = st.vel[0];
        v1 = st.vel[1];
        v2 = st.vel[2];
        for (k = 0; k < ngalaxies; ++k) {
          gtk = universe.galaxies[k];
          d0 = gtk.pos[0] - st.pos[0];
          d1 = gtk.pos[1] - st.pos[1];
          d2 = gtk.pos[2] - st.pos[2];

          d = d0 * d0 + d1 * d1 + d2 * d2;
          d = gt.mass / (d * Math.sqrt(d)) * delta;

          v0 += d0 * d;
          v1 += d1 * d;
          v2 += d2 * d;
        } // for k
        st.vel[0] = v0;
        st.vel[1] = v1;
        st.vel[2] = v2;

        st.pos[0] += v0 * f_deltat;
        st.pos[1] += v1 * f_deltat;
        st.pos[2] += v2 * f_deltat;

        if (st.pos[2] > 0.0) {
          x = Math.floor(((250.0 * st.pos[0] / st.pos[2]) + xf2));
          y = Math.floor(((250.0 * st.pos[1] / st.pos[2]) + yf2));
          z = Math.floor((2.0 / (st.pos[2] + st.size)) + 1);

          if (z > 10) z = 10;
          ctx.fillRect(x, y, z, z);
        }
      } // j
      for (k = i + 1; k < ngalaxies; ++k) {
        gtk = universe.galaxies[k];
        d0 = gtk.pos[0] - gt.pos[0];
        d1 = gtk.pos[1] - gt.pos[1];
        d2 = gtk.pos[2] - gt.pos[2];

        d = d0 * d0 + d1 * d1 + d2 * d2;
        d = gt.mass * gt.mass / (d * Math.sqrt(d)) * delta;

        d0 *= d;
        d1 *= d;
        d2 *= d;
        gt.vel[0] += d0 / gt.mass;
        gt.vel[1] += d1 / gt.mass;
        gt.vel[2] += d2 / gt.mass;
        gtk.vel[0] -= d0 / gtk.mass;
        gtk.vel[1] -= d1 / gtk.mass;
        gtk.vel[2] -= d2 / gtk.mass;
      }

      gt.pos[0] += gt.vel[0] * f_deltat;
      gt.pos[1] += gt.vel[1] * f_deltat;
      gt.pos[2] += gt.vel[2] * f_deltat;

    } // for i    
    if (steps++ > 800) {
      init();
    }
  } // draw
  init();

  requestAnimationFrame(animate);
});