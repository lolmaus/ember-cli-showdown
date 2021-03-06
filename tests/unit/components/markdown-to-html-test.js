/* globals showdown */
import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('markdown-to-html', 'Unit | Component | markdown to html', {
  unit: true
});

test('it renders', function(assert) {
  assert.expect(1);
  this.render();
  assert.equal(this.$().text().trim(), '');
});

test('it produces markdown', function(assert) {
  assert.expect(2);

  let component = this.subject();
  this.render();

  Ember.run(function() {
    component.set('markdown', '##Hello, [world](#)');
  });

  let expectedHtml = '<h2 id="helloworld">Hello, <a href="#">world</a></h2>';

  assert.equal(component.get('html').toString(), expectedHtml);
  assert.equal(component.$().html().toString().trim(), expectedHtml);
});

test('it inserts <br> tag', function(assert) {
  assert.expect(1);

  let component = this.subject();
  this.render();

  Ember.run(function() {
    component.set('markdown', 'foo  \nbar');
  });

  let expectedHtml = '<p>foo <br />\nbar</p>';

  assert.equal(component.get('html').toString(), expectedHtml);
});

test('supports setting showdown options', function(assert) {
  assert.expect(1);

  let component = this.subject();
  this.append();

  Ember.run(function() {
    component.set('markdown', '# title\nI ~~dislike~~ enjoy visiting http://www.google.com');
    component.set('simplifiedAutoLink', true);
    component.set('headerLevelStart', 3);
    component.set('strikethrough', true);
  });

  let expectedHtml = '<h3 id="title">title</h3>\n\n<p>I <del>dislike</del> enjoy visiting <a href="http://www.google.com">http://www.google.com</a></p>';

  assert.equal(component.get('html').toString(), expectedHtml);
});

test('it supports loading showdown extensions', function(assert) {
  assert.expect(1);

  showdown.extension("demo", function() {
    return [{
      type: "lang",
      regex: "this is an ember showdown!",
      replace() {
        return "no it isn't!";
      }
    }];
  });

  let component = this.subject({ extensions: ['demo'] });
  this.append();

  Ember.run(function() {
    component.set("markdown", "this is an ember showdown!");
  });

  let expectedHtml = "<p>no it isn't!</p>";
  assert.equal(component.get('html').toString(), expectedHtml);
});

test('it supports loading showdown extensions', function(assert) {
  assert.expect(1);

  showdown.extension("demo", function() {
    return [{
      type: "lang",
      regex: /\sa\s/,
      replace() {
        return " an ember ";
      }
    }];
  });

  showdown.extension("excited", function() {
    return [{
      type: "lang",
      regex: /showdown/,
      replace() {
        return "showdown!";
      }
    }];
  });

  let component = this.subject({ extensions: 'demo excited' });
  this.append();

  Ember.run(function() {
    component.set("markdown", "this is a showdown");
  });

  let expectedHtml = "<p>this is an ember showdown!</p>";
  assert.equal(component.get('html').toString(), expectedHtml);
});


test('it does not munge code fences', function(assert) {
  assert.expect(1);

  let component = this.subject();
  this.append();

  Ember.run(function() {
    component.set("markdown", "```html" +
     "<strong>hello</strong>\n" +
     "<em>world</em>\n" +
     "```");
  });

  let expectedHtml = "<p><code>html&lt;strong&gt;hello&lt;/strong&gt;\n" +
        "&lt;em&gt;world&lt;/em&gt;\n" +
        "</code></p>";
  assert.equal(component.get('html').toString(), expectedHtml);
});
