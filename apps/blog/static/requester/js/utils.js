//----工具函数-----

//切除第一个字符
var cutLastChars = function (str, num) {
    return str.substring(0, str.length - num);
}

//获取控件类型
var getControlType = function (control_name) {
     var button_patt = /button_/;
     var check_box_patt = /check_box_/;
     var radio_button_patt = /radio_button_/;
     var textarea_patt = /textarea_/;
     var inputarea_patt = /inputarea_/;
     var panel_patt = /panel_/;
     var line_patt = /line_/;
     var switch_patt = /switch_/;
     var interactive_text_patt = /interactive_text_/;
     if(button_patt.test(control_name))return 'button'
     if(check_box_patt.test(control_name))return 'check_box'
     if(radio_button_patt.test(control_name))return 'radio_button'
     if(textarea_patt.test(control_name))return 'textarea'
     if(inputarea_patt.test(control_name))return 'inputarea'
     if(panel_patt.test(control_name))return 'panel'
     if(line_patt.test(control_name))return 'line'
     if(switch_patt.test(control_name))return 'switch'
     if(interactive_text_patt.test(control_name))return 'interactive_text'
     return ''
}



//-------------------------添加元素----------------------------------------
//添加按钮
var addButton = function (x, y, parent) {
   var button = document.createElement('button');
   button.id = 'button_' + _index;
   _index++;

   button.style.width = '100px';
   button.style.height = '40px';

   button.style['font-size'] = '20px';

   button.style.position = 'absolute';
   button.style.left = x + 'px';
   button.style.top = y + 'px';
   button.innerHTML = '按钮';

   addMouseEvent(button);

   parent.appendChild(button)
}

//添加复选框
var addCheckbox = function (x, y, parent) {
   var parentDiv = document.createElement('div');
   var checkbox = document.createElement('input');
   var label = document.createElement('label');

   parentDiv.id = 'check_box_' + _index;
   _index++;

   checkbox.type = 'checkbox';
   parentDiv.style.position = 'absolute';
   checkbox.style.position = 'absolute';
   label.style.position = 'absolute';
   parentDiv.style.left = x + 'px';
   parentDiv.style.top = y + 'px';
   label.for = 'fuck'
   label.innerHTML = '复选框'

   parentDiv.appendChild(checkbox)
   parentDiv.appendChild(label)

   addMouseEvent(parentDiv)

   parent.appendChild(parentDiv)
}

//添加单选框
var addRadioButton = function (x, y, parent) {
   var parentDiv = document.createElement('div');
   var radioButton = document.createElement('input');
   var label = document.createElement('label');

   parentDiv.id = 'radio_button_' + _index;
   _index++;

   radioButton.type = 'radio';
   parentDiv.style.position = 'absolute';
   radioButton.style.position = 'absolute';
   label.style.position = 'absolute';
   parentDiv.style.left = x + 'px';
   parentDiv.style.top = y + 'px';
   label.for = 'fuck'
   label.innerHTML = '单选框'

   parentDiv.appendChild(radioButton)
   parentDiv.appendChild(label)

   addMouseEvent(parentDiv)

   parent.appendChild(parentDiv)
}

//添加文本
var addTextArea = function (x, y, parent) {
   var textarea  = document.createElement('p');

   textarea.id = 'textarea_' + _index;
   _index++;

   //默认该文本控件不绑定变量
   textarea.name = '不绑定';
   textarea.style['font-size'] = '18px';

   textarea.style.color = '#000000';

   textarea.style.width = '800px';

   textarea.style.position = 'absolute';
   textarea.style.left = x + 'px';
   textarea.style.top = y + 'px';
   textarea.innerHTML = '一个文本'

   addMouseEvent(textarea)

   parent.appendChild(textarea)
}

//添加文本编辑框
var addInputArea = function (x, y, parent) {
   var inputarea  = document.createElement('input');

   inputarea.id = 'inputarea_' + _index;
   _index++;

   inputarea.style.width = '250px';
   inputarea.style.height = '25px';
   inputarea.style['font-size'] = '15px';

   inputarea.placeholder = '提示语';

   inputarea.type = 'text';
   inputarea.style.position = 'absolute';
   inputarea.style.left = x + 'px';
   inputarea.style.top = y + 'px';
   inputarea.innerHTML = '这是一段文本'

   addMouseEvent(inputarea)

   parent.appendChild(inputarea)
}

//添加基础容器
var addBasePanel = function (x, y, parent) {
   var div  = document.createElement('div');

   div.id = 'panel_' + _index;
   _index++;

   div.style.position = 'absolute';
   div.style.left = x + 'px';
   div.style.top = y + 'px';
   div.style.width = '200px';
   div.style.height = '200px';
   div.style.background = 'white';

   addMouseEvent(div);

   parent.appendChild(div)
}

//添加线
var addLine = function (x, y, parent) {
   var line  = document.createElement('hr');

   line.id = 'line_' + _index;
   _index++;

   line.style.position = 'absolute';
   line.style.left = x + 'px';
   line.style.top = y + 'px';
   line.style.width = '600px';
   line.style.height = '2px';
   line.style.background = 'black';

   addMouseEvent(line)

   parent.appendChild(line)
}

//--------------------右键菜单项--------------------

//删除节点
var deleteNode = function () {
      var control_type = getControlType(cur_selected_control.id);
      if(control_type == ''){
          console.log('底层画布不能删除！');
          return;
     }
      switch(control_type){
          case 'button':{document.getElementById('control_panel_button').style.display = 'none'}break;
          case 'textarea':{document.getElementById('control_panel_textarea').style.display = 'none'}break;
          case 'input':{document.getElementById('control_panel_input').style.display = 'none'}break;
          case 'line':{document.getElementById('control_panel_line').style.display = 'none'}break;
          case 'panel':{document.getElementById('control_panel_basepanel').style.display = 'none'}break;
      }
      cur_selected_control.parentNode.removeChild(cur_selected_control)
}

//复制节点
var copyNode = function () {
     if(getControlType(cur_selected_control.id) == ''){
          console.log('底层画布不能克隆！');
          return;
    }
    clipboard = cur_selected_control.cloneNode(true);
    console.log(clipboard);
}

//粘贴节点
var pasteNode = function () {
    if(clipboard == ''){
         console.log('剪贴板为空！');
         return;
    }
    if(getControlType(cur_selected_control.id) == 'panel'){
          var parentRect = cur_selected_control.getBoundingClientRect();
          clipboard.style.left = menu_x - parentRect.left + 'px';
          clipboard.style.top = menu_y - parentRect.top + 'px';
          addMouseEvent(clipboard);
          cur_selected_control.appendChild(clipboard)
          clipboard = clipboard.cloneNode(true)
    }
    else if(getControlType(cur_selected_control.id) == ''){
          var parentRect = document.getElementById('layout').getBoundingClientRect();
          clipboard.style.left = menu_x - parentRect.left + 'px';
          clipboard.style.top = menu_y - parentRect.top + 'px';
          addMouseEvent(clipboard);
          document.getElementById('layout').appendChild(clipboard)
          clipboard = clipboard.cloneNode(true)
    }
    else{
         console.log('普通控件无法添加新节点');
    }
}

//在鼠标位置添加子节点
var addNode = function () {
    var x = -1;
    var y = -1;
    var parent = null;
    if(getControlType(cur_selected_control.id) == 'panel'){
          parent = cur_selected_control;
          var parentRect = parent.getBoundingClientRect();
          x = menu_x - parentRect.left;
          y = menu_y - parentRect.top;
    }
    else if(getControlType(cur_selected_control.id) == ''){
          parent = document.getElementById('layout');
          var parentRect = parent.getBoundingClientRect();
          x = menu_x - parentRect.left;
          y = menu_y - parentRect.top;
          parent = undefined;
    }
    else{
         console.log('普通控件无法添加新节点');
         return ;
    }

    console.log(parent)
    switch(this.text){
        case '添加按钮':{
             addButton(x, y, parent);
        }break;
        case '添加复选框':{
             addCheckbox(x, y, parent);
        }break;
        case '添加单选框':{
             addRadioButton(x, y, parent);
        }break;
        case '添加开关':{
             //TODO
        }break;
        case '添加交互式文本':{
             //TODO
        }break;
        case '添加普通文本':{
             addTextArea(x, y, parent);
        }break;
        case '添加输入框':{
             addTextArea(x, y, parent);
        }break;
        case '添加虚实线':{
             addLine(x, y, parent);
        }break;
        case '添加基础容器':{
             addBasePanel(x, y, parent);
        }break;
    }
}

function StrToDom(innerHTML) {

　　 var objE = document.createElement("div");
　　 objE.innerHTML = innerHTML;
　　 return objE.childNodes[0];

};