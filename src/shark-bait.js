colorCode = function(username, wins) {
  var color = "";

  if (wins >= 1000) {
    color = "#f2dede";
  } else if (wins >= 100) {
    color = "#fcf8e3";
  } else {
    color = "#dff0d8";
  }

  var $row = $("span:contains('" + username + "')");

  $row.parents(".lobbyitem").css("background-color", color);
  $row.parents("a").attr("data-shark", "true");
  
  var $userRows = $row.parents(".user").each(function() {
    var $row = $(this);
    var $details = $row.find(".sharkdetails");
    
    if(!$details.length) {
      $details = $("<small class='sharkdetails'></small>").appendTo($row);
    }

    $details.text(" (" + wins + ")");
  });
};

lookupWins = function(username) {
  return localStorage.getItem("wins:" + username);
};

extractWins = function(username) {
  $.ajax("https://www.fanduel.com/users/" + username).done(function(data) {
    var winCount = Number($(data).find("table td").first().text());
    localStorage.setItem("wins:" + username, winCount);
    colorCode(username, winCount);
  });
};

checkMatchups = function() {
  $("tr.lobbyitem div.user a")
    .filter(function() {
      return $(this).attr("data-shark") != "true";
    })
    .each(function() {
      var username = $(this).text(); 

      var wins = lookupWins(username);
      if (wins != null) { colorCode(username, wins); }
    });
};

$(document).ready(function() {
  checkMatchups();

  var lazilyCheckMatchups = _.throttle(checkMatchups, 250);
  $(".body .inner").scroll(lazilyCheckMatchups);
});

$(document).on("mouseenter", "tr.lobbyitem div.user a", function() {
    var username = $(this).text();

    var wins = lookupWins(username);

    if (wins === null) {
      extractWins(username);
    } else {
      colorCode(username, wins);
    }
});