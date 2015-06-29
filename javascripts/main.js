$( document ).ready(function() {
    
    function tagButtons(){
      $( ".btn" ).click(function(event) {
        event.preventDefault();
        var classSearch = $(this).text();

        $(".hiddenUL").children().remove();

        var html = '<h3>' + classSearch + '</h3>';
        html += '<ul class="item_box"></ul>';
        $(".hiddenUL").append(html);

        $( ".item_box li" ).each(function() {
          if ( $( this ).hasClass(classSearch) ) {
            $(window).scrollTop(525);
            $(this).clone().appendTo( $(".hiddenUL ul") );
          } 
        });
        tooltipDisplay();
      });  
      tooltipDisplay();
    }
    
    function clearTagButton(){
      $( ".clearBtn" ).click(function(event) {
        event.preventDefault();
        $(".hiddenUL").children().remove();
      });
    }

    function getRepoCount() {
      var responseObj = JSON.parse(this.responseText);
      $("#publicRepoCount").text(responseObj.public_repos);
    }

    function getMemberCount() {
      var responseObj = JSON.parse(this.responseText);
      $("#publicMemberCount").text(responseObj.length);     
    }

    function stickSideBar() {
      if ($(window).width() < 600) {
         $("#sidebar").unstick;
      }
      else {
         $("#sidebar").sticky({topSpacing:0});
      }
    }

    function tooltipDisplay() {
      $(".tooltip").tooltipster({
        animation: 'fade',
        delay: 100,
        speed: 500,
        theme: 'tooltipster-shadow',
        touchDevices: false,
        trigger: 'hover',
        position: 'right',
        interactive: true,
        maxWidth: '250',
        minWidth: '250',
        content: 'Loading...',
        functionBefore: function(origin, continueTooltip) {

            // we'll make this function asynchronous and allow the tooltip to go ahead and show the loading notification while fetching our data
            continueTooltip();

            var repoTitle = $(this).find('h2').text();
            repoUrl = $(this).find('a').attr('href');
            repoApi = "https://api.github.com/repos" + repoUrl.substr(repoUrl.indexOf("m") + 1);
            //console.log(contributorsUrl);
            // next, we want to check if our data has already been cached
            if (origin.data('ajax') !== 'cached') {
                $.ajax({
                    type: 'GET',
                    url: repoApi,
                    success: function(data) {
                        // update our tooltip content with our returned data and cache it
                        var tooltipHtml = '<div class="tooltipHeader"><h4>' + repoTitle + '</h4></div>';
                        tooltipHtml += '<p>' + data.description + ' <a href="' + repoUrl + '" class="tooltipHref">More Info...</a></p>';
                        tooltipHtml += '<table style="width:100%">';
                        tooltipHtml += '<tr><td><img src="images/tooltip/star.png" class="tooltipImage"><strong>Stars:</strong></td><td>' + data.stargazers_count + '</td><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>';
                        tooltipHtml += '<tr><td><img src="images/tooltip/fork.png" class="tooltipImage"><strong>Forks:</strong></td><td>' + data.forks + '</td><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>';
                        tooltipHtml += '<tr><td><img src="images/tooltip/glasses.png" class="tooltipImage"><strong>Watchers:</strong></td><td>' + data.subscribers_count + '</td><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>';
                        tooltipHtml += '<tr><td><img src="images/tooltip/issue.png" class="tooltipImage"><strong>Open Issues:</strong></td><td>' + data.open_issues_count + '</td><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>';
                        tooltipHtml += '<tr><td><img src="images/tooltip/lang.png" class="tooltipImage"><strong>Language:</strong></td><td>' + data.language + '</td><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>';
                        tooltipHtml += '<tr><td><img src="images/tooltip/contributors.png" class="tooltipImage"><strong>Contributors:</strong></td><td><span class="contributors">';
                        //console.log(data);
                        $.ajax({
                          async: false,
                          type: 'GET',
                          url: repoApi + "/contributors",
                          success: function(contributorData) {
                            $.each(contributorData, function() {
                              tooltipHtml += '<a href="' + this.html_url + '" title="' + this.login + ' has ' + this.contributions + ' contributions"><img src="' + this.avatar_url + '" class="contributorAvatar avatarTooltip"></a>';
                            })
                          }
                        });

                        tooltipHtml += '</span></td><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>';
                        tooltipHtml += '</table>';

                        origin.tooltipster('content', tooltipHtml).data('ajax', 'cached');
                    }
                });
            }
        },
        contentAsHTML: true,
      });
    }

    function mobileNavEC(){
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
    }

    function twitterFollows(){
      $.getJSON( "http://dashboard.emccode.com/widgets/twitter_user_followers.json", function( data ) {
        $("#twitterFollowerCount").text(data.current);
      });
    }

    function newsletterSubscribers(){
      $.getJSON( "http://dashboard.emccode.com/widgets/constant_contact_subscribers.json", function( data ) {
        $("#newsletterSubscriberCount").text(data.current);
      });
    }

    var repoRequest = new XMLHttpRequest();
    repoRequest.onload = getRepoCount;
    repoRequest.open('get', 'https://api.github.com/orgs/emccode', true)
    repoRequest.send()

    var memberCountRequest = new XMLHttpRequest();
    memberCountRequest.onload = getMemberCount;
    memberCountRequest.open('get', 'https://api.github.com/orgs/emccode/members', true)
    memberCountRequest.send()

    tagButtons();
    clearTagButton();
    stickSideBar();
    mobileNavEC();
    twitterFollows();
    newsletterSubscribers();

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
    });

});

