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
            var selectbox = document.getElementById("category");
            //调用函数，并将结构出入到下拉框容器中
            selectbox.innerHTML = creatSelectTree(tree);
        }

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
