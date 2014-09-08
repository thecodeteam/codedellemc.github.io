$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });

  $("#nav-mobile").html($("#nav-main").html());
  $("#nav-trigger span").click(function(){
    if ($("nav#nav-mobile ul").hasClass("expanded")) {
        $("nav#nav-mobile ul.expanded").removeClass("expanded").slideUp(250);
        $(this).removeClass("open");
    } else {
        $("nav#nav-mobile ul").addClass("expanded").slideDown(250);
        $(this).addClass("open");
    }
  });
  
});