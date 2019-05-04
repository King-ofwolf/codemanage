function getRootPath(){
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath=window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht=curWwwPath.substring(0,pos);
    //console.log(localhostPaht)
    //获取带"/"的项目名，如：/uimcardprj
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    return(localhostPaht);
}
$(document).ready(function(){
        $.ajax({
        timeout:1000,
        async: false,
        type: "GET",
        json:{"1":"123"},
        url: getRootPath()+"/category/categorylist",
        dataType: "json",
        success: function (data) {
            var tree = listToTree(data['list'], 0);//调用函数，传入要转换的list数组，和树中顶级元素的pid
            //console.log(tree);
            var selectbox = document.getElementById("category1");
            //调用函数，并将结构出入到下拉框容器中
            selectbox.innerHTML = creatSelectTree(tree);
        }

    })
     $("#category1").change(function(){
         var label_id=($(this).val());
         window.location.href = getRootPath()+"/codemg/list/"+label_id+"/?page=1";
     })
})
//list 转成树形json
function listToTree(list,pid) {
    var ret = [];//一个存放结果的临时数组
    for(var i in list) {
        if(list[i].pid == pid) {//如果当前项的父id等于要查找的父id，进行递归
         list[i].children = listToTree(list, list[i].id);
         ret.push(list[i]);//把当前项保存到临时数组中
        }
    }
    return ret;//递归结束后返回结果
}
var j="——";//前缀符号，用于显示父子关系，这里可以使用其它符号
function creatSelectTree(d){
    //生成树下拉菜单
     var option="";
     option += "<option selected=\"selected\" disabled=\"disabled\"  style=\'display: none\' value=\'\'>选择类别</option> "
     for(var i=0;i<d.length;i++){
         if(d[i].children.length){//如果有子集
              option+="<option value='"+d[i].id+"'>"+j+d[i].name+"</option>";
              j+="——";//前缀符号加一个符号
              option+=creatSelectTree(d[i].children);//递归调用子集
              j=j.slice(0,j.length-1);//每次递归结束返回上级时，前缀符号需要减一个符号
          }else{//没有子集直接显示
              option+="<option value='"+d[i].id+"'>"+j+d[i].name+"</option>";
          }
      }
     return option;//返回最终html结果
 }


$(document).ready(function(){
     $(".version").change(function(){
     var label_id=($(this).val());
         var item = $(this);
     $.ajax({
        timeout:1000,
        async: false,
        type: "GET",
        json:{"1":"123"},
        url: getRootPath()+"/codemg/codeversion_single/"+label_id+"/"+$(this).parent().next().next().next().next().next().text()+"/",
        dataType: "json",
        success: function (data) {
            $(function() {
                        $("[data-toggle='popover']").popover();
            });
            var author = item.parent().next().text();
            var category = item.parent().prev().prev().prev().prev().text();
            data = data['list']
            data = JSON.parse(data);
            var wenku = data.wenku.replace(/\"/g,"\'")
            item.parent().prevAll().remove();
            item.parent().nextAll().remove();
            item.parent().before("<td>"+data.title+"</td>");
            item.parent().before("<td>"+category+"</td>");
            item.parent().before("<td>"+data.size+"</td>");
            item.parent().before("<td>"+data.type+"</td>");
            item.parent().before("<td>"+data.created+"</td>");
            item.parent().after("<td onclick=\"codedownload();\"><img src=\""+getRootPath()+"/static/image/xz.jpg\"  width=\"25px\" height=\"25px\"></td>");
            item.parent().after("<td class=\"hidden\">"+data.id+"</td>");
            item.parent().after("<td onclick=\"updatestar();\"><img src=\""+getRootPath()+"/static/image/dz.jpg\"  width=\"25px\" height=\"25px\"></td>");
            item.parent().after("<td><button  class=\"popover-hide\" data-container=\"body\"   data-toggle=\"popover\"  data-placement=\"bottom\"  data-content=\""+wenku+"\" style=\"border:0;\"><img src=\""+getRootPath()+"/static/image/yl.jpg\"  width=\"25px\" height=\"25px\"></button></td>");
            //item.parent().after("<td><button  class=\"popover-hide\" data-container=\"body\"   data-toggle=\"popover\"  data-placement=\"bottom\"  style=\"border:0;\"><img src=\"../static/image/yl.jpg\"  width=\"25px\" height=\"25px\"></button></td>");
            item.parent().after("<td><button  class=\"comments_body popover-hide btn btn-primary\" title=\"介绍内容\" data-container=\"body\"  data-toggle=\"popover\"  data-placement=\"left\"  data-content=\""+data.intro+"\">介绍内容</button></td>");
            item.parent().after("<td>"+author+"</td>");

        }
    })
 })

})


function updatestar(){
   aa = $(event.target);
   $.ajax({
    timeout:1000,
    async: false,
    type: "GET",
    json:{"id":"id"},
    url: getRootPath()+"/codemg/update/"+$(event.target).parent().next().text(),
    dataType: "json",
    success: function (data) {
        aa.next().text(data.stars);
    }
    })
}

function codedownload(){
    window.location.href = getRootPath()+"/codemg/download/"+$(event.target).parent().prev().text();
}

$(function () { $('.popover-hide').popover();});
$(function () { $('.popover-hide').on('hide.bs.popover', function () {    event.stopPropagation();})});
$(function () { $('.popover-hide').on('show.bs.popover', function () {    event.stopPropagation();})});


function yulan(){
    //console.log($(event.target));
    window.location.href = getRootPath()+"/blog/post/"+$(event.target).parent().next().next().text();
}
