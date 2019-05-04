//预览效果
var preview = function () {
    console.log(document.getElementById('layout'));
}


//--------------------------------------通用属性--------------------------------------

//修改x坐标
var modify_X = function (that) {
    if(that.value <= 0 || that.value == ''){
        cur_selected_control.style.left = 0 + 'px';
    }
    else{
        cur_selected_control.style.left = that.value + 'px';
    }
}

//修改Y坐标
var modify_Y = function (that) {
    if(that.value <= 0 || that.value == ''){
        cur_selected_control.style.top = 0 + 'px';
    }
    else{
        cur_selected_control.style.top = that.value + 'px';
    }
}

//修改宽度
var modify_width = function (that) {
   cur_selected_control.style.width = that.value + 'px';
}

//修改高度
var modify_height = function (that) {
   cur_selected_control.style.height = that.value + 'px';
}

//修改颜色
var modify_color = function (that) {
   cur_selected_control.style.color = '#' + that.value;
}

//修改字体大小
var modify_font_size = function (that) {
   cur_selected_control.style['font-size'] = that.value + 'px';
}

//--------------------------------------通用属性--------------------------------------


//-----------------------------------特殊属性-----------------------------------------

//-----------文本属性面板 START-------------
var fillWithElement_textarea = function (element) {

    //下拉列表
    var list_status = element.name.substring(1,element.name.length);
    for(var i = 0; i < list.length; i++){
        if(list[i].value == list_status){
            list[i].selected = true;
        }
    }
    if(list_status == "不绑定"){
        document.getElementById('textarea_content').style.display = ''
    }
    else{
        document.getElementById('textarea_content').style.display = 'none'
    }

    //文本位置
    document.getElementById('textarea_x').value = cutLastChars(cur_selected_control.style.left, 2);
    document.getElementById('textarea_y').value = cutLastChars(cur_selected_control.style.top, 2);

    //文本颜色
    document.getElementById('textarea_color').value = cur_selected_control.style.color;

    //字体大小
    document.getElementById('textarea_font').value = cutLastChars(cur_selected_control.style['font-size'], 2);

    //文本宽度
    document.getElementById('textarea_width').value = cutLastChars(cur_selected_control.style.width, 2);

    //文本内容
    document.getElementById('textarea_content').value = cur_selected_control.innerHTML;


}

var listSelected_textarea = function (that) {
    if(that.value == "不绑定"){//需要自己填写文本
        document.getElementById('textarea_content').style.display = ''
    }
    else{
        //文本内容填写框隐藏
        document.getElementById('textarea_content').style.display = 'none'

        cur_selected_control.innerHTML = data_set[0][that.value]
    }
    cur_selected_control.name = '$' + that.value;
}

var modify_content_textarea = function (that) {
    if(that.value == '')
    {
        cur_selected_control.innerHTML = '这是一个文本';
    }
    else{
        cur_selected_control.innerHTML = that.value;
    }
}
//----------- 文本属性面板 END ---------------


// -----------输入框属性面板 START-------------
var fillWithElement_input = function (element) {

    //输入框位置
    document.getElementById('input_x').value = cutLastChars(cur_selected_control.style.left, 2);
    document.getElementById('input_y').value = cutLastChars(cur_selected_control.style.top, 2);

    //输入框文本颜色
    document.getElementById('input_color').value = cur_selected_control.style.color;

    //输入框字体大小
    document.getElementById('input_font').value = cutLastChars(cur_selected_control.style['font-size'], 2);

    //输入框宽度
    document.getElementById('input_width').value = cutLastChars(cur_selected_control.style.width, 2);

    //输入框高度
    document.getElementById('input_height').value = cutLastChars(cur_selected_control.style.height, 2);

    //提示语
    document.getElementById('input_placeholder').value = cur_selected_control.placeholder;


}

var modify_content_placeholder = function (that) {
    cur_selected_control.placeholder = that.value;
}
//----------- 输入框属性面板 END ---------------


// -----------按钮属性面板 START-------------
var addEvent_button = function (that) {

    if(that.value == "delete_parent_node"){//删除父节点
        cur_selected_control.onclick = function () {
            console.log('删除父节点')
        }
    }
    else if(that.value == "clone_parent_node"){//克隆父节点
        cur_selected_control.onclick = function () {
            console.log('克隆父节点')
        }
    }
}

var fillWithElement_button = function (element) {

    //按钮位置
    document.getElementById('button_x').value = cutLastChars(cur_selected_control.style.left, 2);
    document.getElementById('button_y').value = cutLastChars(cur_selected_control.style.top, 2);

    //按钮颜色
    document.getElementById('button_color').value = cur_selected_control.style['background-color'];

    //按钮文本颜色
    document.getElementById('button_font_color').value = cur_selected_control.style.color;

    //按钮字体大小
    document.getElementById('button_font').value = cutLastChars(cur_selected_control.style['font-size'], 2);

    //按钮宽度
    document.getElementById('button_width').value = cutLastChars(cur_selected_control.style.width, 2);

    //按钮高度
    document.getElementById('button_height').value = cutLastChars(cur_selected_control.style.height, 2);

    //按钮内容
    document.getElementById('button_content').value = cur_selected_control.innerHTML;


}

var modify_bg_color_button = function (that) {
   cur_selected_control.style['background-color'] = '#' + that.value;
}

var modify_title_button = function (that) {
   cur_selected_control.innerHTML = that.value;
}

//----------- 按钮属性面板 END --------------


// -----------实虚线属性面板 START-------------

var fillWithElement_line = function (element) {

    //line位置
    document.getElementById('line_x').value = cutLastChars(cur_selected_control.style.left, 2);
    document.getElementById('line_y').value = cutLastChars(cur_selected_control.style.top, 2);

    //line颜色
    document.getElementById('line_color').value = cur_selected_control.style['background-color'];

    //line宽度
    document.getElementById('line_width').value = cutLastChars(cur_selected_control.style.width, 2);

    //line高度
    document.getElementById('line_height').value = cutLastChars(cur_selected_control.style.height, 2);

}

//----------- 实虚线属性面板 END ---------------


// -----------基础容器属性面板 START-------------
var fillWithElement_basepanel = function (element) {

    //基础容器位置
    document.getElementById('basepanel_x').value = cutLastChars(cur_selected_control.style.left, 2);
    document.getElementById('basepanel_y').value = cutLastChars(cur_selected_control.style.top, 2);

    //基础容器颜色
    document.getElementById('basepanel_color').value = cur_selected_control.style['background-color'];

    //基础容器宽度
    document.getElementById('basepanel_width').value = cutLastChars(cur_selected_control.style.width, 2);

    //基础容器高度
    document.getElementById('basepanel_height').value = cutLastChars(cur_selected_control.style.height, 2);

}

var modify_bg_color_basepanel = function (that) {
   cur_selected_control.style['background-color'] = '#' + that.value;
}
//----------- 基础容器属性面板 END ---------------


//--------------------元素鼠标事件------------------

