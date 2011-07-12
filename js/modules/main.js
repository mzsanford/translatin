provide(function(exports) {
  // Base libs which don't export via loadrunner. Load order is also important.
  using(['js/lib/jquery-1.6.1.min.js', 'js/lib/jquery.storage-1.0.0.js'], function() {

    // App components
    using('segmenter', 'dialog', 'store', function(segmenter, dialog, store) {
      var segmentIndex = -1;
      var segments = new Array();
      var $textBox = dialog.element.find('#translatin-translation');

      dialog.element.find('.actions a.prev').click(function(e) {
        previousSegment();
        e.preventDefault();
      });
      dialog.element.find('.actions a.next').click(function(e) {
        nextSegment();
        e.preventDefault();
      });

      $textBox.keypress(function(evt) {
        // Pressed 'Enter'
        if (evt.which == 13) {
          if (evt.shiftKey) {
            previousSegment();
          } else {
            nextSegment();
          }
          evt.preventDefault();
        }
      });

      function translate(elems) {
        $('body').append(dialog.element);
        var $src = $(elems);

        var segCount = 0;
        $src.each(function() {
          stats = segmenter.segments($(this), function(seg) {
            return "<span class=\"segment\">" + seg + "</span>";
          });
          dialog.stats.find('#stat_segments').html(stats.segments);
          dialog.stats.find('#stat_words').html(stats.words);
          updateStats();
        });

        var $segments = $src.find('span.segment');
        $segments.each(function(idx, seg) {
          segments.push({
            $elem: $(seg),
            text: $('<div/>').text($(seg).html()).html()
          });
        });

        // Start me up.
        nextSegment();
      }

      function storeIfNeeded() {
        if (segmentIndex >= 0 && segments[segmentIndex] && segments[segmentIndex].text && $textBox.val().length > 0) {
          store.set(segments[segmentIndex].text, $textBox.val());
        }
      }

      function updateStats() {
        dialog.stats.find('#stat_dirty').html( (store.isDirty() ? '<em>Yes</em>' : 'No') );
        if (segments.length > 0) {
          var percentComplete = (store.size() / segments.length)*100;
          if (percentComplete < 1) {
            // Always show a small bar
            percentComplete = 2;
          }

          var $progressBar = dialog.stats.find('.progress-inner');
          $progressBar.css({
            width: percentComplete + '%'
          });
          if (percentComplete > 60) {
            $progressBar.removeClass('low').addClass('high');
          } else {
            $progressBar.removeClass('high').addClass('low');
          }
        }
      }

      function nextSegment() {
        storeIfNeeded();
        updateStats();
        segmentIndex++;

        $('.current-segment').removeClass('current-segment');
        if (segments[segmentIndex]) {
          if (segmentIndex > 0) {
            $('#translatin-context_pre').html(segments[segmentIndex-1].text);
          } else {
            $('#translatin-context_pre').html('');
          }

          $('#translatin-current').html(segments[segmentIndex].text);
          segments[segmentIndex].$elem.addClass('current-segment');

          var existingTranslation = store.get(segments[segmentIndex].text);
          if (existingTranslation) {
            $textBox.val(existingTranslation);
          } else {
            $textBox.val('');
          }

          if (segmentIndex < (segments.length-1)) {
            $('#translatin-context_post').html(segments[segmentIndex+1].text);
          } else {
            $('#translatin-context_post').html('');
          }
        }
      }

      function previousSegment() {
        segmentIndex = segmentIndex-2;
        if (segmentIndex < -1) {
          // Back up to -1 so nextSegment can bump to 0, the starting point
          segmentIndex = -1;
        }
        nextSegment();
      }

      function uploadApi(url, interval) {
        if (typeof interval == "undefined") {
          // Default is to upload once every ~5 seconds.
          interval = 5000;
        }

        return window.setInterval(function() {
          if (store.isDirty()) {
            store.upload(url, function() {
              updateStats();
            });
          } else {
            // Debbugging. Remove me.
            console.log("No new translations to save");
          }
        }, interval);
      }

      exports({
        translate: translate,
        next: nextSegment,
        prev: previousSegment,
        upload: function(url) {
          if (store.isDirty()) {
            store.upload(url);
          }
        },
        uploadApi: uploadApi
      });
    });
  });
});