## custom element
`wc-demo.js`
```javascript
  var proto = Object.create(HTMLElement.prototype);
  
  proto.createdCallback = function() { this.innerHTML = '<div>Custom element</div>'; };

  document.registerElement('mj-block', {prototype: proto});
```

`wc-demo.html`
```html
  <html>
  <head>
    <style>
      body > div { margin: 40px; }
    </style>
    <script src="wc-demo.js"></script>
  </head>
  <body>
    <div>
      <div>DOM element</div>
      <mj-block></mj-block>
    </div>
  </body>
  </html>
```

## html imports
`wc-import.html`
```html
  <style>
    div {
      color: blue;
    }
  </style>
  <script>
    console.log('imported js');
  </script>
  <div>
    Some imported content.
  </div>
```

`wc-demo.html`
```html
    <link rel="import" href="wc-import.html">
```

`wc-demo.js`
```javascript
  proto.createdCallback = function() { 
    var imported = document.querySelector('link[href="wc-import.html"]').import;
    var content = imported.querySelector('div').innerHTML;
    this.innerHTML = content; 
  };
```

## templates
`wc-import.html`
```html
  <script>
    console.log('imported js');
  </script>
  <template>
    <style>
      div {
        color: blue;
      }
    </style>
    <script>
      console.log('executed when cloned');
    </script>
    <div>
      Some imported content.
    </div>
  </template>
```

`wc-demo.js`
```javascript
  proto.createdCallback = function() { 
    var imported = document.querySelector('link[href="wc-import.html"]').import;
    var template = imported.querySelector('template');
    this.innerHTML = '<div>Custom element</div>';
    this.addEventListener('click', function() {
      var clone = document.importNode(template.content, true); // deep is true
      this.appendChild(clone);
    });
  };
```

## shadow dom
`wc-demo.js`
```javascript
  proto.createdCallback = function() { 
    var imported = document.querySelector('link[href="wc-import.html"]').import;
    var template = imported.querySelector('template');
    var shadow = this.createShadowRoot();
    shadow.innerHTML = '<div>Custom element</div>';
    this.addEventListener('click', function() {
      var clone = document.importNode(template.content, true);
      shadow.appendChild(clone);
    });
  };
```
