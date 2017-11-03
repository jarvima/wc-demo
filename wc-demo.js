  var proto = Object.create(HTMLElement.prototype);



  proto.createdCallback = function() {
    var imported = document.querySelector('link[href="wc-import.html"]').import;
    var template = imported.querySelector('template');
    this.innerHTML = '<div>Custom element</div>';
    this.addEventListener('click', function() {
      var clone = document.importNode(template.content, true); // deep is true
      this.appendChild(clone);
    });
  };

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

  document.registerElement('mj-block', {prototype: proto});
