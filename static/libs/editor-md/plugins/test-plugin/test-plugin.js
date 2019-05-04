/*!
 * Test plugin for Editor.md
 *
 * @file        test-plugin.js
 * @author      pandao
 * @version     1.2.0
 * @updateTime  2015-03-07
 * {@link       https://github.com/pandao/editor.md}
 * @license     MIT
 */

(function() {

    var factory = function (exports) {

		var $            = jQuery;           // if using module loader(Require.js/Sea.js).
        var pluginName   = "goto-line-dialog";

		exports.testPlugin = function(){
			alert("testPlugin");
		};

		exports.fn.testPluginMethodA = function() {
			/*
			cm.focus();
			*/
			//....
            var _this       = this;
            var cm          = this.cm;
            var lang        = this.lang;
            var settings    = this.settings;
            var editor      = this.editor;
            var cursor      = cm.getCursor();
            var selection   = cm.getSelection();
            var classPrefix = this.classPrefix;
            var dialogName  = classPrefix + pluginName, dialog;

            var warp = editor.find('.CodeMirror-gutter-wrapper')
            warp.each(function(index, el) {
                var $el = $(el)
                var line = $el.text()
                if (!$el.find('.comments-bar').length) {
                    $el.append('<div class="comments-bar">' + line + '</div>')
                    $el.find('.CodeMirror-linenumber').hide()
                }
            });
            

		};

	};
    
	// CommonJS/Node.js
	if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
    { 
        module.exports = factory;
    }
	else if (typeof define === "function")  // AMD/CMD/Sea.js
    {
		if (define.amd) { // for Require.js

			define(["editormd"], function(editormd) {
                factory(editormd);
            });

		} else { // for Sea.js
			define(function(require) {
                var editormd = require("./../../editormd");
                factory(editormd);
            });
		}
	} 
	else
	{
        factory(window.editormd);
	}

})();
