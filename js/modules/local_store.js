provide(function(exports) {
  exports({
    set: function(source, translation) {
      return $.Storage.saveItem(source, translation);
    },
    get: function(source) {
      return $.Storage.loadItem(source);
    },
    size: function() {
      return $.Storage.size();
    },
    data: function() {
      var obj = {};
      $.Storage.iterateWith(function(key, val) {
        obj[key] = val;
      });
      return obj;
    }
  });
});