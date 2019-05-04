/**
 * @file 项目详情页
 */

var markId = parseInt($('#hide_mark_id').val(), 10);

/**
 * -------------
 * 页面公共操作js
 * -------------
 */

$(document).ready(function () {
    // 公会推荐入口
    var eruOption = {dom: '#detail_intro_div'};
    seajs.use('/crowdtest/js/union/evaRecommendUnion', function (widget) {
        widget.init(eruOption);
    });

    seajs.use("/crowdtest/js/survey/tip", function (widget) {
        widget.init({
            enter: ".mark-score-info-icon",
            leave: ".mark-score-info",
            html: $('#mark-score-info-detail').val(),
            top: "20px"
        })
    });

    seajs.use("/crowdtest/js/survey/tip", function (widget) {
        widget.init({
            enter: ".mark-exp-info-icon",
            leave: ".mark-exp-info",
            html: $('#mark-exp-info-detail').val(),
            top: "20px"
        })
    });
    
    seajs.use('/crowdtest/js/survey/tip', function (widget) {
        widget.init({
            enter: '.mark-right-rate-info-icon',
            leave: '.mark-right-rate-info-icon',
            html: $('#mark-right-rate-info-detail').val(),
            top: '20px'
        });
    });
});

// 标注任务反馈页
$(document).on('click', '#js_mark_feedback_btn', function () {
    window.location.href = '/mark/task/feedback/mark_id/' + markId;
});

// 切换tab页
$(document).on('click', '.js-mark-tab-item', function () {
    var tabId = $(this).attr('id');
    tabSwitch(tabId);
});

function tabSwitch(tabId) {
    var preObjectId = $('.mark-tab-active-item').attr('id');
    if (preObjectId === tabId) {
        return;
    }

    var eventId = tabId.slice(0, -11);
    var tabBlock = eventId + '-block';
    $('.mark-detail-div').addClass('hide');
    $('#' + tabBlock).removeClass('hide');

    switch (eventId) {
        case 'rank':
            getUserRankList();
            break;
        case 'report':
            getQuestionList();
            break;
        case 'user-stat':
            getUnionUserList();
            break;
        case 'test-record':
            showTestRecord();
            break;
        case 'practice-stat':
            showPracticeStat();
            break;
        default :
            break;
    }

    $('#' + tabId).closest('.mark-tab-wrap').find('ul').children('li').removeClass('mark-tab-active-item');
    $('#' + tabId).addClass('mark-tab-active-item');

}

// 展示项目详情页-标注标准
function showStandards() {
    var hideStandards = $('#hide_standards').val();
    if (typeof hideStandards === 'string' && hideStandards.length) {
        var description = JSON.parse(hideStandards);
        var standards = description['standards'];
        var len = standards.length;
        var standardHtml = '';
        if (len !== 0) {
            standardHtml += '<div class="bar-name">答题标准</div>';
        }

        for (var i = 0; i < len; i++) {
            standardHtml += '<p>' + standards[i]['content'] + '</p>';
        }
        $('#information-block .standards').html(standardHtml);
    }
}

// 展现当前项目剩余时间
function showLeftTimeInfo() {
    var hideLeftTime = parseInt($('#hide_left_time').val(), 10);
    showLeftTime(hideLeftTime);
}


/**
 * -----------------
 * 一般标注项目相关js
 * -----------------
 */

var markEnterEnable = true;
// 标注项目入口
$(document).on('click', '#js_mark_enter_btn', function () {

    window.location.href = '/worker_do_task_00'

    //enterTask();
});

$(document).on('click', '#js_mark_claim_btn', function () {
    claimTask();
});

//检查是否参与练习任务
var practiceCheck = function (practiceId) {
    var content = '<div><span>你还未练习，请先参加练习</span></div>';
    var button = '';
    seajs.use('gift/baseAlertPop', function (pop) {
        var tipPop = pop.init(button, content, '参与练习');
        $('.gift-exchange-alert-module-title-close').hide();
        $('.gift-exchange-alert-module-button').hide();
        setTimeout(function () {
            var params = {mark_id: practiceId, refer_mark_id: markId};
            var dao = task.dao.saveTaskStep;
            dao(params, function (data) {
                window.location.href = '/mark/practice/enterDo/id/' + practiceId;
            });
        }, 3000);
    });
};

//未获得认证，进入考试获得认证
var markDoTest = function (testId) {
    var content = '<div><span>你还未获得认证，请先参加认证任务解锁</span></div>';
    var button = '';

    seajs.use('gift/baseAlertPop', function (pop) {
        var tipPop = pop.init(button, content, '获取认证');
        $('.gift-exchange-alert-module-title-close').hide();
        $('.gift-exchange-alert-module-button').hide();

        setTimeout(function () {
            var params = {mark_id: testId, refer_mark_id: markId};
            var dao = task.dao.saveTaskStep;
            dao(params, function (data) {
                window.location.href = '/mark/test/enterDo/id/' + testId;
            });
        }, 3000);
    });
};

//进入任务检查
var markEnter = function () {
    var options = {async: false};

    var params = {id: markId};
    task.dao.enterTask(params, function (data) {
        markEnterEnable = true;

        if (data['valid'] === true) {
            if (parseInt($('#is_task_box').val(), 10) === 1) {
                window.location.href = '/mark/taskBox/do/id/' + parseInt($('#hide_tpl_id').val(), 10);
            } else {
                window.location.href = '/mark/task/do/id/' + markId;
            }
        } else if (data['valid'] === false) {
            var testId = parseInt(data['test_id'], 10);
            if (data['log'] == 'not login') {
                $('.j-login-popup').click();
            } else if (data['log'] == '认证未通过' && testId > 0) {
                markDoTest(testId);
            } else {
                seajs.use('/mark/static/js/popup/notice', function (notice) {
                    notice.init({
                        content: data['log'],
                        time: 2000
                    });
                });
            }
        } else {
            seajs.use('/mark/static/js/popup/notice', function (notice) {
                notice.init({
                    content: '任务现在还不能答，过会再来看吧~',
                    time: 2000
                });
            });
        }
    }, function (data) {

    }, options);
};

var enterTask = function () {
    if (!markEnterEnable) {
        return;
    }
    markEnterEnable = false;
    var params = {id: markId};
    var popData = {};
    popData.confirm = '同意协议';
    popData.content_html = getAgreement();
    agreement.dao.getAgreementRecord(params, function (data) {
        if (data.status === 0) {
            window.seajs.use('/mark/static/js/popup/agreementPop', function (pop) {
                pop.show(popData).promise.then(
                    function (msg) {
                        afterAcceptAgreement(params);
                        // 保存接受协议的记录
                        agreement.dao.saveAgreementRecord(params, function (data) {
                        });
                    },
                    function (msg) {
                        markEnterEnable = true;
                        return;
                    });
            });
        } else {
            afterAcceptAgreement(params);
        }

    });

    function afterAcceptAgreement(params) {
        task.dao.practiceCheck(params, function (data) {
            if (data['log'] === 'not login') {
                $('.j-login-popup').click();
            } else if (data['valid'] === true) {
                markEnter();
            } else {
                var practiceId = parseInt(data['practice_id'], 10);
                // 强制练习
                if ((!!data['practice_force']) === true) {
                    practiceCheck(practiceId);
                } else {
                    markEnter();
                }
            }
        }, null);
    }
};

var claimTask = function () {
    if (!markEnterEnable) {
        return;
    }
    markEnterEnable = false;
    task.dao.claimTask({mark_id: markId}, function (result) {
        if (result.status === 1) {
            window.location.reload();
        } else {
            markEnterEnable = true;
            window.seajs.use('/mark/static/js/popup/alert', function (alert) {
                alert.init({
                    title: '提示',
                    content: result.msg
                });
            });
        }
    });
};

//标注任务进入练习
$(document).on('click', '#js_mark_practice_btn', function () {
    var practiceId = $('#js_mark_practice_btn').attr('practice_id');
    var params = {mark_id: practiceId, refer_mark_id: markId};
    var dao = task.dao.saveTaskStep;
    dao(params, function (data) {
        window.location.href = '/mark/practice/enterDo/id/' + practiceId + '/page_id/1';
    });
});

// 获取项目风云榜列表
function getUserRankList() {
    var params = {id: markId};
    var dao = task.dao.userRankList;
    dao(params, function (data) {
        var users = {users: data};
        var bt = baidu.template;
        bt.ESCAPE = false;
        var userListTpl = bt('user_rank_list_tpl', users);
        $('#user_rank_list .table-content').html(userListTpl);
    });
}


/**
 * -------------
 * 认证项目相关js
 * -------------
 */

// 认证项目入口
$(document).on('click', '.js_test_enter_btn', function () {
    enterTest();
});

var enterTest = function () {
    $(document).off('click', '.js_test_enter_btn');
    var params = {id: markId};
    var options = {async: false};
    var dao = exam.dao.enterPage;
    dao(params, function (data) {
        $(document).on('click', '.js_test_enter_btn', function () {
            enterTest();
        });
        if (data['valid'] === true) {
            window.location.href = '/mark/test/do/id/' + markId;
        } else if (data['valid'] === false) {
            seajs.use('/mark/static/js/popup/notice', function (notice) {
                notice.init({
                    content: data['log'],
                    time: 2000
                });
            });
        } else {
            seajs.use('/mark/static/js/popup/notice', function (notice) {
                notice.init({
                    content: '项目现在还不能答，过会再来看吧~',
                    time: 2000
                });
            });
        }
    }, function (data) {

    }, options);
};

// 放弃认证项目
$(document).on('click', '#js_test_abandon_btn', function () {
    seajs.use('/mark/static/js/popup/confirm', function (confirm) {
        confirm.show({
            title: '放弃上次认证',
            content_html: '确定要放弃上次的认证吗？这也会计入你的答题次数中哦~'
        }).defer.then(
            function (msg) {
                var params = {id: markId};
                var dao = exam.dao.abandonPage;
                dao(params, function (data) {
                    if (data['valid'] === false) {
                        seajs.use('/mark/static/js/popup/notice', function (notice) {
                            notice.init({
                                content: data['log'],
                                time: 2000
                            });
                        });
                    } else {
                        window.location.href = '/mark/test/view/id/' + markId;
                    }
                });

            },
            function (msg) {
                // DO NOTHING
            }
        );
    });
});


// 用户在认证项目中的认证记录
function showTestRecord() {
    var params = {id: markId};
    var dao = exam.dao.pageStat;
    dao(params, function (data) {
        var testRecord = {testRecord: data};
        var bt = baidu.template;
        bt.ESCAPE = false;
        var testRecordListTpl = bt('test_record_list_tpl', testRecord);
        $('#test_record_list .table-content').html(testRecordListTpl);
    });
}

/**
 * -------------
 * 练习项目相关js
 * -------------
 */

// 练习项目入口
$(document).on('click', '#js_practice_enter_btn', function () {
    enterPractice();
});

var enterPractice = function () {
    $(document).off('click', '#js_practice_enter_btn');
    var params = {id: markId};
    var options = {async: false};
    var dao = practice.dao.enterPage;
    dao(params, function (data) {
        $(document).on('click', '#js_practice_enter_btn', function () {
            enterPractice();
        });
        if (data['valid'] === true) {
            var pageId = parseInt($('#practice_user_finish_count').val(), 10);
            if (isNaN(pageId) || pageId <= 0) {
                pageId = 1;
            }
            window.location.href = '/mark/practice/show/id/' + markId + '/page_id/' + pageId;
        } else if (data['valid'] === false) {
            seajs.use('/mark/static/js/popup/notice', function (notice) {
                notice.init({
                    content: data['log'],
                    time: 2000
                });
            });
        } else {
            seajs.use('/mark/static/js/popup/notice', function (notice) {
                notice.init({
                    content: '项目现在还不能答，过会再来看吧~',
                    time: 2000
                });
            });
        }
    }, function (data) {

    }, options);
};


// 用户在练习项目中的练习情况
function showPracticeStat() {
    var params = {id: markId};
    var dao = practice.dao.pageStat;
    dao(params, function (data) {
        var practiceStat = {practiceStat: data};
        var bt = baidu.template;
        bt.ESCAPE = false;
        var practiceStatListTpl = bt('practice_stat_list_tpl', practiceStat);
        $('#practice_stat_list .table-content').html(practiceStatListTpl);
    });
}

// 查看练习记录中对应page列表
$('#practice-stat-block').on('click', '.js_view_page_list', function () {
    var currentObj = $(this);
    var responseId = $(this).attr('id');
    var params = {id: markId, responseId: responseId};
    var dao = practice.dao.getPages;
    dao(params, function (data) {
        var practicePages = {responseId: responseId, pages: data};
        currentObj.html('收起');
        currentObj.removeClass('js_view_page_list');
        currentObj.addClass('js_hide_page_list');
        var bt = baidu.template;
        bt.ESCAPE = false;
        var practicePageListTpl = bt('practice_page_list_tpl', practicePages);
        currentObj.closest('table').after(practicePageListTpl);
    });
});

$('#practice-stat-block').on('click', '.js_hide_page_list', function () {
    $(this).html('查看');
    $(this).removeClass('js_hide_page_list');
    $(this).addClass('js_view_page_list');
    $(this).closest('table').next('.practice-page-list').remove();
});

/**
 * --------------
 * 团队项目相关js
 * --------------
 */

var pageSize = 10;
var currentPage = 1;
var pageNum = 1;

// 获取团队项目题目列表
function getQuestionList() {
    var params = currentParams();
    var dao = task.dao.questionList;
    dao(params, function (data) {
        var paramString = buildParam(params);
        var questions = {questions: data['pages'], params: paramString};
        var questionNum = data['page_num'];
        pageNum = Math.ceil(questionNum / pageSize);
        var bt = baidu.template;
        bt.ESCAPE = false;
        var questionListTpl = bt('question_list_tpl', questions);
        $('#union_question_list .table-content').html(questionListTpl);
        constructPagination(pageNum);
    });
}

// 切换不同页
$(document).on('click', '#pagination_div a', function () {
    var page = parseInt($(this).attr('page_id'), 10);
    switch (page) {
        case -3:
            currentPage = 1;
            break;
        case -2:
            if (currentPage > 1) {
                currentPage -= 1;
            }
            break;
        case -1:
            if (currentPage < pageNum) {
                currentPage += 1;
            }
            break;
        case 0:
            currentPage = pageNum;
            break;
        default:
            currentPage = page;
            break;
    }

    var params = currentParams();
    getQuestionList(params);
});

//点击查询按钮
$(document).on('click', '.project-user-detail-page-info-filter #page-filter', function () {
    currentPage = 1;
    var params = currentParams();
    getQuestionList(params);
});


function constructPagination(pageNum) {
    $('#pagination_div ul').empty();
    if (pageNum !== 0) {
        var paginationStr = '<li><a id="first" class="pagination-page" page_id="-3">第一页</a></li>'
            + '<li><a id="previous" class="pagination-page" page_id="-2">上一页</a></li>';
        var page = currentPage;
        var startPage = page - 2
            - ((page + 2 > pageNum) ? page + 2 - pageNum : 0);
        if (startPage < 1) {
            startPage = 1;
        }
        var endPage = startPage + 4;
        if (endPage >= pageNum) {
            endPage = pageNum;
        }
        for (var i = startPage; i <= endPage; i += 1) {
            paginationStr += '<li><a class="pagination-page" page_id="' + i + '">' + i + '</a></li>';
        }

        paginationStr += '<li><a id="next" class="pagination-page" page_id="-1">下一页</a></li>'
            + '<li><a id="last" class="pagination-page" page_id="0">最后一页</a></li>';
        $('#pagination_div ul').append(paginationStr);
        $('.pagination-page').removeClass('active');
        $('.pagination-page').each(function () {
            if (parseInt($(this).attr('page_id'), 10) === currentPage) {
                $(this).addClass('active');
            }
        });
    }
}

function currentLimit() {
    return {location: pageSize * (currentPage - 1), limit: pageSize};
}

//构造跳转
function buildParam(params) {
    var ret = '?';
    var keyArr = ['userName', 'checkStatus', 'finishStatus', 'content'];
    var filterArr = [];
    var len = keyArr.length;
    for (var i = 0; i < len; i++) {
        var value = params[keyArr[i]];
        if (value !== undefined) {
            filterArr.push(keyArr[i] + '=' + value);
        }
    }
    ret += filterArr.join('&');
    return ret;
}

function currentParams() {
    var limit = currentLimit();
    var userName = $('.project-user-detail-page-info-filter .user-name-filter').val();
    var checkStatus = $('.project-user-detail-page-info-filter .check-status-selector').val();
    var finishStatus = $('.project-user-detail-page-info-filter .finish-status-selector').val();
    var content = $('.project-user-detail-page-info-filter .content-input').val();
    return {
        id: markId,
        userName: userName,
        checkStatus: checkStatus,
        finishStatus: finishStatus,
        limit: limit,
        content: content
    };
}

//获取用户列表
function getUnionUserList() {
    var dao = task.dao.unionUserList;
    dao({id: markId}, function (data) {
        var users = {users: data};
        var bt = baidu.template;
        bt.ESCAPE = false;
        var userListTpl = bt('user_stat_list_tpl', users);
        $('#user_stat_list .table-content').html(userListTpl);
    });
}


function getAgreement() {
    var agreement = '百度众测保密协议'
        + '<br/>' + '<p>'
    return agreement;
}