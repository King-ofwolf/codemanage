$(function(){

    renderMDViewLayer()
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
            renderCommentLayer(html, wrap)
        })
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
            var display = show_comment ? 'style="display: block;"' : ''
            var style = show_comment ? 'text-danger' : ''

            var html = ''
            html += '<div class="md-comment-bar '+style+'" data-line="'+line+'" ' + display + ' title="添加批注"><i class="fa fa-commenting-o fa-lg" aria-hidden="true"></i></div>'
            html += '<div class="md-numbers-bar" data-line="'+line+'">'+line+'</div>'

            $(el).before(html)
        });
    }

    function renderCommentLayer(html, wrap) {
        layer.open({
            type: 1,
            title: '文章批注',
            skin: 'layui-layer-rim', //加上边框
            area: ['640px', '420px'], //宽高
            content: html,
        });

        $('.btn-comment-post').on('click', function(event) {
            var url = $(this).data('url')
            var content = $(this).parents('.input-group').find('input').val()

            if (!content) {
                layer.msg('请输入内容');
                return;
            }

            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: {body: content},
            })
            .done(function(response) {
                if (response.status=='success') {
                    layer.msg('successfully');
                    setTimeout(function(){
                        wrap.find('.md-comment-bar').addClass('text-danger').show()
                        layer.closeAll()
                    }, 500);
                } else {
                    layer.msg('sorry');
                }
            })

        });
    }


})
