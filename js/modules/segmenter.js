provide(function(exports) {
  var RE_SEGMENTS = /.*?(\.|\?|!)(\s|$)/mg;
  var RE_NOT_A_BREAK = /\s(Dr|Mr|Mrs)(\.|\?|!)(\s|$)/img;
  var RE_WORDS = /(\S+)/mg; // Very dumb

  exports({
    segments: function(element, callback) {
      var $element = $(element),
          segments = new Array(),
          newHtml = "",
          stats = {
            segments: 0,
            words: 0
          };
      if (null == element) {
        return segments;
      }

      var matched = $element.html().replace(/\n\s*/mg, ' ').match(RE_SEGMENTS);
      if (matched) {
        var spanSegment = false;
        var soFar = "";

        for (var i=0; i < matched.length; i++) {
          var thisSegment = matched[i];
          if (thisSegment.match(RE_NOT_A_BREAK)) {
            soFar += thisSegment;
            spanSegment = true;
            continue;
          } else {
            if (spanSegment) {
              thisSegment = soFar + thisSegment;
              spanSegment = false;
            }
            segments.push(thisSegment);
          }

          stats.segments++;
          stats.words += thisSegment.match(RE_WORDS).length;
          if (callback) {
            newHtml += callback(thisSegment);
          }
        }
      }

      if (newHtml.length > 0) {
        $element.html(newHtml);
      }

      return stats;
    }
  });
});