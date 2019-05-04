$(function(){
    editor = editormd("editormd", {
        lineNumbers: true,
        autoHeight : false,
        height  : 600,
        tex  : true,
        syncScrolling : "single",
        // codeFold: true,
        path    : "/static/libs/editor-md/lib/",
        toolbarIcons : function() {
            // Or return editormd.toolbarModes[name]; // full, simple, mini
            return editormd.toolbarModes['simple'];
            // return ["undo", "redo", "|", "bold", "hr"]
        },
        onload: function(){
            renderMDViewLayer()
        },
    });

    $('.change-version').on('change', function(event) {
        event.preventDefault();
        renderMDViewLayer()
    });

    $('.markdown-comment-show').on('click', '.md-comment-bar', function(event) {
        var line = $(this).data('line')
        if (!line) return;

        var wrap = $(this).parents('.comment-wrap')
        var url = $('.markdown-comment-wrap').data('url')

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'html',
            data: {line: line},
        })
        .done(function(html) {
            renderCommentLayer(html)
        })
    });

    $('.btn-article-save').on('click', function(event) {
        event.preventDefault();
        var $form = $($(this).data('target'))
        var status = $(this).data('status')

        var msg = ''
        if (status=='publisher') {
            msg = '发布后不可编辑，确定要发布吗？'
        } else {
            msg = '确定要保存吗？'
        }

        layer.confirm(msg, {
          btn: ['确定','取消'] //按钮
        }, function(){
            $.ajax({
                url: $form.attr('action'),
                type: 'POST',
                dataType: 'json',
                data: $form.serialize() + "&status=" + status,
            })
            .done(function(response) {
                if (response.status=='success') {
                    layer.msg('successfully');
                    setTimeout(function(){
                        if (response.url) window.location.href = response.url
                    }, 500);
                } else {
                    layer.msg('sorry.');
                }
            })
            .fail(function() {
                layer.msg('sorry.');
            })

        }, function(){
        });
    });

    function renderMDViewLayer() {
        var url = $('.change-version').data('url')
        var vid = $('.change-version').val()

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            data:{vid:vid}
        })
        .done(function(response) {
            if (response.status=='success') {
                markdownToHTML(response)
                $('.markdown-comment-wrap').data('url', response.post_comment_url)
            } else {
                layer.msg('sorry.');
            }
        })
    }

    function markdownToHTML(data) {
        $('#editormd-view').html('')
        editormdView = editormd.markdownToHTML("editormd-view", {
            markdown        : data.body ,//+ "\r\n" + $("#append-test").text(),
            //htmlDecode      : true,       // 开启 HTML 标签解析，为了安全性，默认不开启
            htmlDecode      : "style,script,iframe",  // you can filter tags decode
            //toc             : false,
            tocm            : true,    // Using [TOCM]
            //tocContainer    : "#custom-toc-container", // 自定义 ToC 容器层
            //gfm             : false,
            //tocDropdown     : true,
            // markdownSourceCode : true, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
            emoji           : true,
            taskList        : true,
            tex             : true,  // 默认不解析
            flowChart       : true,  // 默认不解析
            sequenceDiagram : true,  // 默认不解析
        });

        var comments = data.comments
        editormdView.children().each(function(index, el) {
            var line = index + 1;
            $(el).wrap('<div id="comment_wrap_'+line+'" class="comment-wrap"></div>')

            var show_comment = comments && comments[line] && comments[line].total ? 1 : 0

            var html = ''
            if (show_comment) {
                html += '<div class="md-comment-bar text-danger" data-line="'+line+'" style="display: block;" title="添加批注"><i class="fa fa-commenting-o fa-lg" aria-hidden="true"></i></div>'
            }
            html += '<div class="md-numbers-bar" data-line="'+line+'">'+line+'</div>'

            $(el).before(html)
        });
    }

    function renderCommentLayer(html) {
        layer.open({
            type: 1,
            title: '文章批注',
            skin: 'layui-layer-rim', //加上边框
            area: ['640px', '420px'], //宽高
            content: html,
        });
    }


})