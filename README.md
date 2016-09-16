# web-component-demo

## the basics

The Web Component spec encompasses 4 parts:
- Custom Elements
- HTML Imports
- Templates
- Shadow DOM

Let's tackle each.

## custom elements

Custom elements allow you to create new elements and reference them with a new custom tag.

Let's make one.  Create a `wc-demo.js` file:
```javascript
  var proto = Object.create(HTMLElement.prototype);

  document.registerElement('mj-block', {prototype: proto});
```

And reference it in html.  Create a `wc-demo.html` file:
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

So that could have worked. Let's add some features to see if it really worked.

Add a lifecycle callback to the prototype and set the elements inner HTML. Update `wc-demo.js` to look like this:
```javascript
  var proto = Object.create(HTMLElement.prototype);

  proto.createdCallback = function() { this.innerHTML = '<div>Custom element</div>'; };

  document.registerElement('mj-block', {prototype: proto});
```
Now when we view `wc-demo.html` in our favorite, custom-element-supporting browser, we can see the `Custom element` text.

Congrats! We've created our first custom element.

## html imports

Anything that can go in an html file can go in an imported file.

Create a `wc-import.html` file:
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

Add a link tag right after `<my-block>` to pull it in:
```html
  <mj-block></mj-block>
  <link rel="import" href="wc-import.html">
```

Notice the styles are applied and the script is executed but no html is inserted.

You can reference the imports content with something like this:
```javascript
  document.querySelector('link[href="wc-import.html"]').import;
```

Move the `<link rel="import" href="wc-import.html">` up to the top of the `head` declaration. (It was weird not having it there in the first place.)  And change the prototype's `createdCallback` to use the imported html:
```javascript
  proto.createdCallback = function() { 
    var imported = document.querySelector('link[href="wc-import.html"]').import;
    var content = imported.querySelector('div').innerHTML;
    this.innerHTML = content; 
  };
```

Now the styles are applied, the JavaScript runs, and the content is displayed.

## templates

What if we don't want imported styles to be applied or the JavaScript to run? Modern browsers support the `template` tag.  Markup inside of a template tag will not be rendered or executed until it is cloned and added to the dom.

Update `wc-import.html` to use a template tag:
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

Update `createdCallback` to query for `template` instead of `div` and set up a click listener:
```javascript
  proto.createdCallback = function() { 
    var imported = document.querySelector('link[href="wc-import.html"]').import;
    var template = imported.querySelector('template');
    this.innerHTML = '<div>Custom element</div>';
    this.addEventListener('click', function() {
      var clone = document.importNode(template.content, true);
      this.appendChild(clone);
    });
  };
```
Now when we initally view `wc-demo.html` we see black text.  When we click on the black text it changes to blue and an element is appended below it.  Also notice that the script inside the `template` tag is executed each time the cloned node is appended.

## shadow dom

The CSS still applies to the entire page.  That might not be what we want.  Shadow DOM encapsulates styles and hides sub-elements from the rest of the DOM.

Let's change `createdCallback` just a bit to take advantage of Shadow DOM:
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
Notice we create a `shadow` variable from `createShadowRoot` then we set the `innerHTML` of `shadow`.  In the click listener we append to `shadow` instead of directly to the element.

Now when we click on the custom element only the elements color changes and not the plain old DOM element.

That's a quick rundown of Web Components.  Have some fun creating your own.
