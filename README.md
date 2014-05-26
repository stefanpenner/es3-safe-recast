es3-safe-recast
===============


from:
```js
ajax('/asdf/1').catch(function() {

}).finally(function() {

});
```

to:
```js
ajax('/asdf/1')['catch'](function(reason) {

})['finally'](function() {

});
```
