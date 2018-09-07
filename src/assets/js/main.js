$(document).ready(function () {
  // Header Scroll
  $(window).on('scroll', function () {
    var scroll = $(window).scrollTop();

    if (scroll >= 50) {
      $('#header').addClass('fixed');
    } else {
      $('#header').removeClass('fixed');
    }
  });

  // Waypoints
  $('.work').waypoint(function () {
    $('.work').addClass('animated fadeIn');
  }, {
    offset: '75%'
  });
  $('.download').waypoint(function () {
    $('.download .btn').addClass('animated tada');
  }, {
    offset: '75%'
  });

  // Fancybox
  $('.work-box').fancybox();

  // Flexslider
  $('.flexslider').flexslider({
    animation: "fade",
    directionNav: false,
  });

  // Page Scroll
  var sections = $('section')
  nav = $('nav[role="navigation"]');

  $(window).on('scroll', function () {
    var cur_pos = $(this).scrollTop();
    sections.each(function () {
      var top = $(this).offset().top - 76
      bottom = top + $(this).outerHeight();
      if (cur_pos >= top && cur_pos <= bottom) {
        nav.find('a').removeClass('active');
        nav.find('a[href="#' + $(this).attr('id') + '"]').addClass('active');
      }
    });
  });
  nav.find('a').on('click', function () {
    var $el = $(this)
    id = $el.attr('href');
    $('html, body').animate({
      scrollTop: $(id).offset().top - 75
    }, 500);
    return false;
  });

  // Mobile Navigation
  $('.nav-toggle').on('click', function () {
    $(this).toggleClass('close-nav');
    nav.toggleClass('open');
    return false;
  });
  nav.find('a').on('click', function () {
    $('.nav-toggle').toggleClass('close-nav');
    nav.toggleClass('open');
  });

  $('.tabs li').on('click', function () {
    var currentEl = $(this);
    var parentEl = $(this.parentElement);
    var width = $(this).outerWidth();
    var thisLeft = $(this).offset().left;
    var currentLeft = (thisLeft - $(this.parentElement).offset().left + width);
    var parentWidth = $(this.parentElement).width();
    var scrollvalue = 0;
    if (parentWidth < currentLeft) {
      scrollvalue = currentLeft - parentWidth + width / 2;
      $(this.parentElement).animate({
        scrollLeft: currentLeft
      }, 50)
    }
    if (currentLeft < width) {
      scrollvalue = 0;
      $(this.parentElement).animate({
        scrollLeft: 0
      }, 50)
    }
    $('.tabs li.active').removeClass('active');
    currentEl.addClass('active');
    setTimeout(function () {

      // $('.slider')[0].style.left = (currentEl.offset().left - parentEl.offset().left) + "px";
    }, 100);
  })


  // $('.cover-photos').slick({
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   autoplay: true,
  //   arrows: false,
  //   autoplaySpeed: 3000,
  //   fade: true,
  //   cssEase: 'linear',
  //   appendDots: $('.dot-slider')
  // });
});
