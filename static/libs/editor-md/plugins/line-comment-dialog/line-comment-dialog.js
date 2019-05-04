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
        var pluginName   = "line-comment-dialog";

		exports.fn.lineCommentDialog = function() {
            var _this       = this;
            var cm          = this.cm;
            var lang        = this.lang;
            var settings    = this.settings;
            var editor      = this.editor;
            var cursor      = cm.getCursor();
            var selection   = cm.getSelection();
            var classPrefix = this.classPrefix;
            var dialogName  = classPrefix + pluginName, dialog;


            var currLine = cursor.line + 1;

            if (editor.find("." + dialogName).length > 0) {
                dialog = editor.find("." + dialogName);
                dialog.find(".curr-line").html(currLine);
                dialog.find("textarea").val('');

                this.dialogShowMask(dialog);
                this.dialogLockScreen();
                dialog.show();
            } else {
                var dialogHTML = '<div class="' + classPrefix + 'code-toolbar">' +
                                    '当前行数：<span class="curr-line">' + currLine + '</span>' + 
                                    '</div><textarea placeholder="请输入评论...." style="display:none;"></textarea>'

                dialog = this.createDialog({
                    name    : dialogName,
                    title   : '添加评论',
                    width   : 780,
                    height  : 565,
                    mask    : settings.dialogShowMask,
                    drag    : settings.dialogDraggable,
                    content : dialogHTML,
                    lockScreen : settings.dialogLockScreen,
                    maskStyle  : {
                        opacity         : settings.dialogMaskOpacity,
                        backgroundColor : settings.dialogMaskBgColor
                    },
                    buttons : {
                        enter  : [lang.buttons.enter, function() {
                        }],
                        cancel : [lang.buttons.cancel, function() {                                   
                            this.hide().lockScreen(false).hideMask();

                            return false;
                        }]
                    },
                })
            }

            var cmConfig = {
                theme                     : settings.theme,
                tabSize                   : 4,
                autofocus                 : true,
                autoCloseTags             : true,
                indentUnit                : 4,
                lineNumbers               : true,
                lineWrapping              : true,
                extraKeys                 : {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
                foldGutter                : true,
                gutters                   : ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                matchBrackets             : true,
                indentWithTabs            : true,
                styleActiveLine           : true,
                styleSelectedText         : true,
                autoCloseBrackets         : true,
                showTrailingSpace         : true,
                highlightSelectionMatches : true
            };

            var textarea = dialog.find("textarea");
            var cmObj    = dialog.find(".CodeMirror");

            if (dialog.find(".CodeMirror").length < 1) {
                cmEditor = exports.$CodeMirror.fromTextArea(textarea[0], cmConfig);
                cmObj    = dialog.find(".CodeMirror");

                cmObj.css({
                    "float"   : "none", 
                    margin    : "8px 0",
                    border    : "1px solid #ddd",
                    fontSize  : settings.fontSize,
                    width     : "100%",
                    height    : "390px"
                });

                cmEditor.on("change", function(cm) {
                    textarea.val(cm.getValue());
                });
            } else {
                cmEditor.setValue('');
            }

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
