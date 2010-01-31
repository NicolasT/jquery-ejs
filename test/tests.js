/*
 * Testcases for jquery-ejs
 *
 * Copyright (C) 2010 Nicolas Trangez  <eikke eikke com>
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation, version 2.1
 * of the License.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA  02110-1301  USA
 */

;(function($) {
    $(document).ready(function() {
        module('Plugin Registration');
        test('$.ejs is registered', function() {
            expect(1);
            ok($.ejs, '$.ejs is ' + $.ejs);
        });

        test('$.ejs.defaults exists', function() {
            expect(1);
            ok($.ejs.defaults, '$.ejs.defaults is ' + $.ejs.defaults);
        });

        test('$.fn.ejs is registered', function() {
            expect(1);
            ok($.fn.ejs, '$.fn.ejs is ' + $.fn.ejs);
        });

        module('Template Rendering');
        test('Basic $.ejs call', function() {
            expect(3);

            var rendered = $.ejs('simple_template.html');

            equals(rendered.length, 1);
            equals(rendered[0].nodeName.toUpperCase(), 'SPAN');
            equals(rendered.text(), 'Hello, world!');
        });

        test('Basic $.fn.ejs call', function() {
            expect(4);

            var container = $(
                '<div><span class="hello">Nothing here</span></div>');
            equals(container.length, 1);
            equals($('span.hello', container).text(), 'Nothing here');

            container.ejs('simple_template.html');

            equals($('span.hello', container).text(), 'Hello, world!');
            equals(container.children().length, 1);
        });

        test('$.fn.ejs call to multiple matches', function() {
            expect(6);

            var container = $(
                '<div>' +
                '    <div class="c">&nbsp;</div>' +
                '    <div class="c">&nbsp;</div>' +
                '</div>');
            equals(container.length, 1);
            equals(container.children().length, 2);

            $('div.c', container).ejs('simple_template.html');

            $('div.c', container).each(function() {
                var $this = $(this);

                equals($this.children().length, 1);

                $this.children().each(function() {
                    equals($(this).text(), 'Hello, world!');
                });
            });
        });

        test('Passing basic data', function() {
            var container = $('<div>');

            container.ejs('data_template.html', {name: 'test'});

            equals($('span', container).text(), 'This is a test');
        });

        module('Options');
        test('Use a custom template extension per call', function() {
            expect(1);

            var container = $('<div>');

            container.ejs('html_template.html', {}, {ext: '.html'});

            equals($('span', container).text(), 'I got a different extension');
        });

        test('Use a global custom template extension', function() {
            expect(2);

            var orig = $.ejs.defaults['ext'];
            equals(orig, '.ejs');

            $.ejs.defaults['ext'] = '.html';

            var container = $('<div>');
            container.ejs('html_template.html');
            equals($('span', container).text(), 'I got a different extension');

            // Teardown
            $.ejs.defaults['ext'] = orig;
        });

        test('Use a custom template prefix', function() {
            expect(2);

            var orig = $.ejs.defaults['templatePrefix'];
            equals(orig, undefined);

            $.ejs.defaults['templatePrefix'] = 'templates/';

            var container = $('<div>');
            container.ejs('simple_template.html');
            equals($('span', container).text(), 'In templates/');

            // Teardown
            $.ejs.defaults['templatePrefix'] = orig;
        });
    });
}(jQuery));
