/*
 * jquery.Storage
 * A jQuery plugin to make localStorage easy and managable to use
 *
 * Copyright (c) Brandon Hicks (Tarellel)
 *
 * Version: 1.0.0a (12/6/10)
 * Requires: jQuery 1.4
 *
 * Modified by Matt Sanford:
 *  - Change the keyMeta value
 *  - Add key hashing option
 *  - Add size method
 */
(function(jQuery) {
  // validate if the visiting browser supports localStorage
  var supported = true;
  // Enabled hashed keys
  var hashing = false;
  var keyMeta = 'trans_';

  //var localStorage === window.localStorage
  if (typeof localStorage == 'undefined' || typeof JSON == 'undefined'){
      supported = false;
  }

  this.hashKey = function(key) {
    if (!hashing) {
      return key;
    }

    var hash = 0;
    if (key.length == 0) return hash;
    for (i = 0; i < key.length; i++) {
      char = key.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  // errors produced by localStorage
  this.storageError = function(error){
    switch(error){
      // current browser/device is not supported
      case 'SUPPORTED':
        alert("Your browser does not support localStorage!");
        break;

      // browsers database quota is full
      case 'QUOTA':
        alert("Your storage quota is currently full!");
        console.log("Browser database quote exceeded.");
        break;

      // Any other error that may have occurred
      default:
        alert('An unknown error has occurred!');
        break;
    }
    return true;
  };

  // saves specified item using ("key","value")
  this.saveItem = function(itemKey, itemValue, lifetime){
    if (typeof lifetime == 'undefined'){
       lifetime = 60000;
    }

    if (!supported){
      // set future expiration for cookie
      dt = new Date();
      // 1 = 1day can use days variable
      //dt.setTime(dt.getTime() + (1*24*60*60*1000));
      dt.setTime(dt.getTime() + lifetime);
      expires = "expires= " + dt.toGMTString();

      document.cookie = hashKey(keyMeta + itemKey) + "=" + itemValue + "; " + expires + "; path=/";
      return true;
    }

    // set specified item
    try{
      localStorage.setItem(hashKey(keyMeta + itemKey), JSON.stringify(itemValue));
    } catch (e){
      // if the browsers database is full produce error
      if (e == QUOTA_EXCEEDED_ERR) {
        this.storageError('QUOTA');
        return false;
      }
    }
    return true;
  };

  // load value of a specified database item
  this.loadItem = function(itemKey){
    if(itemKey===null){ return null; }
    if (!supported){
      var cooKey = hashKey(keyMeta + itemKey) + "=";
      // go through cookies looking for one that matchs the specified key
      var cookArr = document.cookie.split(';');
      for(var i=0, cookCount = cookArr; i < cookCount; i++){
        var current_cookie = cookArr[i];
        while(current_cookie.charAt(0) == ''){
          current_cookie = current_cookie.substring(1, current_cookie.length);
          // if keys match return cookie
          if (current_cookie.indexOf(cooKey) == 0) {
            return current_cookie.substring(cooKey.length, current_cookie.length);
          }
        }
      }
      return null;
    }

    var data = localStorage.getItem(hashKey(keyMeta + itemKey));
    if (data){
      return JSON.parse(data);
    }else{
      return false;
    }
  };

  // removes specified item
  this.deleteItem = function (itemKey){
    if (!supported){
      document.cookie = hashKey(keyMeta + itemKey) + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      return true;
    }

    localStorage.removeItem(hashKey(keyMeta + itemKey));
    return true;
  };

  // WARNING!!! this clears entire localStorage Database
  this.deleteAll = function(){
    if (!supported){
      // process each and every cookie through a delete funtion
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        this.deleteItem(cookies[i].split("=")[0]);
      }
      return true;
    }

    localStorage.clear();
    return true;
  };

  this.size = function(){
    if (!supported) {
      var cookies = document.cookie.split(";");
      // TODO: Only ones starting with the keyMeta
      return cookies.length;
    }

    // TODO: Only ones starting with the keyMeta?
    return localStorage.length;
  };

  this.iterateWith = function(callback) {
    if (!supported) {
      // What now? Do we want to support these?
      return null;
    }

    var reKeyMeta = new RegExp("^" + keyMeta);
    for (var i=0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key.indexOf(keyMeta) == 0) {
        callback(key.replace(reKeyMeta, ''), JSON.parse(localStorage.getItem(key)));
      }
    }
  };

  // jquery namespace for the function set
  jQuery.Storage = this;
})(jQuery);

