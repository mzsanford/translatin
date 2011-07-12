provide(function(exports) {
  var dialogHTML = '<div id="translatin-output"><div class="trans-cont">';
  dialogHTML += '  <div id="translatin-context">';
  dialogHTML += '    <span class="context" id="translatin-context_pre"></span>';
  dialogHTML += '    <span id="translatin-current"></span>';
  dialogHTML += '    <span class="context" id="translatin-context_post"></span>';
  dialogHTML += '  </div>';
  dialogHTML += '  <textarea id="translatin-translation"></textarea>';
  dialogHTML += '  <div class="stats">';
  dialogHTML += '    Segments: <span id="stat_segments">0</span>';
  dialogHTML += '    &middot; Words: <span id="stat_words">0</span>';
  dialogHTML += '    &middot; Dirty: <span id="stat_dirty">No</span>';
  dialogHTML += '    <div class="progress"><span class="progress-inner">&nbsp;</span></div>';
  dialogHTML += '  </div>';
  dialogHTML += '  <div class="actions">';
  dialogHTML += '    <a href="#" class="prev">« Back</a>';
  dialogHTML += '    <a href="#" class="next">Next »</a>';
  dialogHTML += '  </div>';
  dialogHTML += '</div></div>';

  var $element = $(dialogHTML);

  exports({
    html: dialogHTML,
    element: $element,
    stats: $element.find('.stats')
  });
});