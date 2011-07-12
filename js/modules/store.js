provide(function(exports) {
  using('local_store', function(localStorage) {
    var storeClean = true;

    exports({
      set: function(source, translation) {
        storeClean = false;
        return localStorage.set(source, translation);
      },
      get: function(source) {
        return localStorage.get(source);
      },
      size: function() {
        return localStorage.size();
      },
      upload: function(url, cb) {
        $.ajax({
          type: 'POST',
          url: url,
          data: localStorage.data(),
          success: function() {
            // All changes have been saved.
            // TODO: Race condition if set() is called during the POST operation. Need to check the
            // state here.
            storeClean = true;
            console.log("POST of translation data sucessful");
            if (cb) {
              cb();
            }
          },
          error: function() { console.log("POST of translation data failed"); }
        });
      },
      isClean: function() { return storeClean; },
      isDirty: function() { return !storeClean; }
    });
  });

});