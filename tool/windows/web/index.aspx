<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="BusTotal.index" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>数据报表</title>
    <!-- 新 Bootstrap 核心 CSS 文件 -->
    <link rel="stylesheet" href="bootstrap-3.3.5-dist/css/bootstrap.min.css"  />
    <!-- 可选的Bootstrap主题文件（一般不用引入） -->
   <%-- <link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap-theme.min.css"/>--%>
    <!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
    <script src="bootstrap-3.3.5-dist/js/jquery.min.1.11.3.js"></script>
    <!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
    <script src="bootstrap-3.3.5-dist/js/bootstrap.min.js"></script>
       
    <script src="Highcharts-4.1.9/js/highcharts.js" type="text/javascript"></script> 
    
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <link rel="stylesheet" href="datetime/css/normalize3.0.2.min.css" />
    <link rel="stylesheet" href="datetime/css/style.css?v=7" />
    <link href="datetime/css/mobiscroll.css" rel="stylesheet" />
    <link href="datetime/css/mobiscroll_date.css" rel="stylesheet" />
   <%-- <script src="datetime/js/jquery.min.js"></script>--%>
    <script src="datetime/js/mobiscroll_date.js" charset="gb2312"></script>
    <script src="datetime/js/mobiscroll.js"></script>

     <%--对话框控件 --%>   
    <%--<script src="artDialog/lib/jquery-1.10.2.js"></script>--%>
    <link rel="stylesheet" href="artDialog/css/ui-dialog.css"/>
    <script src="artDialog/dist/dialog-min.js"></script>

<%--公共函数--%>
    <script src="js/common.js"></script>

    <link rel="stylesheet" type="text/css" href="css/mystyle.css"/>
    


<%--表格控件 --%>    
    <link rel="stylesheet" href="jTable/css/bootstrap-table.min.css"/>
    <script src="jTable/js/tableExport.js"></script>
    <script src="jTable/js/jquery.base64.js"></script>
    <script src="jTable/js/bootstrap-table.js"></script>
    <script src="jTable/js/bootstrap-table-export.js"></script>

    <style>
        input {
            max-width:100px;
        }
        select {
            min-width:80px;
        }
    </style>
</head>
<body class="theme-blue">

    <!--# inc lude virtual="文件所在目录/文件名.asp"-->
     
        <div class="navbar navbar-default navbar-fixed-top  " role="navigation">

        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
             <a class="" href="#" style="text-shadow: black 5px 3px 3px;"><span class="navbar-brand" style="color:white;"><img  class="glyphicon" src="images/bus46.png" style= "float :left ; width:40px;height:40px;" /> 客流统计系统</span></a>
        </div>
        <div class="navbar-collapse collapse" style="height: 1px;">
            <!-- Nav tabs -->
            <ul id="main-menu" class="nav navbar-nav navbar-right ">
                <li  class="active"><a href="Index.aspx"><span class="glyphicon glyphicon-home" style="position: relative; top: 3px;"></span> 当前信息 </a></li>
                <% if (BusTotal.DataCenter.IsAdmin()) {%>
                <li><a href="sys_BusPark.aspx"><span class="glyphicon glyphicon-unchecked" style="position: relative; top: 3px;"></span> 停车场管理</a></li>
                <li><a href="sys_Line.aspx"><span class="glyphicon glyphicon-minus" style="position: relative; top: 3px;"></span> 线路管理</a></li>
                <li><a href="sys_NumberOfBus.aspx"><span class="glyphicon glyphicon-road" style="position: relative; top: 3px;"></span> 车牌管理</a></li>
                <li><a href="sys_Users.aspx"><span class="glyphicon glyphicon-user" style="position: relative; top: 3px;"></span> 用户管理</a></li>
                <%} %>
                <li><a href="javascript:outlogin();"><span class="glyphicon glyphicon-log-out" style="position: relative; top: 3px;"></span> 退出[<b style="color:yellow"> <% =System.Web.HttpContext.Current.Session["login"]%> </b>]</a></li>
                <li><a href="#">  </a></li>
            </ul>
        </div>
    </div>
    <div class="container-fluid   dialog ">
        <div class="row" style="min-height:30px;">

        </div>
        <div class="row">
   
            <div class="panel panel-default">
                <div class=" panel-heading">
                    <h5><b>此页面只用于数据传输及设备计数精度验证，选择您的设备SN号，默认密码1</b>，选择合适的时间条件，点击“查询”按钮</h5>
                </div>
                <div class="panel-body">
                    <form class="form-inline" role="form">
                        <div class="form-group">
                            <label for="plantname" class="control-label" >设备SN </label>
                           <%-- <input type="text" class="form-control" id="module_no" value="<%=BusTotal.DataCenter.GetLastModule_no() %>"  placeholder="车站编号" />--%>
                          <%--   <select class="form-control" id="sn">--%>
                             <input type="sn" class="form-control" id="sn" value="" />                                   
                           <%--  </select>--%>
                        </div>
                         <div class="form-group">
                            <label for="plantname" class="control-label">密码 </label>
                            <input type="password" class="form-control" id="password" value="1" />
                        </div>
                        <div class="form-group">
                            <label for="plantname" class="control-label" >开始日期 </label>
                            <input type="text" class="form-control" id="dts"  style="background-color: white;" placeholder="开始日期" />
                        </div>
                        <div class="form-group">
                            <label for="plantname" class="control-label">结束日期 </label>
                            <input type="text" class="form-control" id="dte"  style="background-color: white;" placeholder="日期束" />
                        </div>
                        <div class="form-group">

                        </div>
                        
                        <a class="btn btn-primary " data-dismiss="modal" id="btQuery"><i class="glyphicon glyphicon-search"></i><b> 查询 </b></a>


                    </form>


                </div>
            </div>
        </div>

        <div class="row">
            <div class="panel panel-default">
                <div class=" panel-heading">
                    <h5><b>列表</b><small id="total"></small></h5>
                </div>
                <div class="panel-body   " style="overflow:auto;height:490px;" >

                    <table id="table2" class="table table-condensed" >
                        <thead>
                            
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>



    

</body>
</html>


<script>
    $(function () {
        $('#btQuery').click(Query);//.trigger('click');
       // $('#module_no').val("88");
        
       
    });
    function build() {
        var cells = 6,
            rows = 1,
            i, j, row,
            columns = [],
            data = [];

        var field = new Array("序号", "日期", "序列号", "车牌号","乘客数" );//

        for (i = 0; i < field.length; i++) {
            columns.push({
                field: 'field' + i,
                title: field[i]
            });
        }





        for (i = 0; i < rows; i++) {
            row = {};
            for (j = 0; j < cells; j++) {
                row['field' + j] = 'Row-' + i + '-' + j;
            }
            data.push(row);
        }
        $('#table').bootstrapTable('destroy').bootstrapTable({
            columns: columns,
            data: data
        });

        //1、指定数据源，这里有两种方式

        // 1）通过data属性标签

        // 在一个普通的表格中设置data-toggle="table"可以在不写JavaScript的情况下启用Bootstrap Table。

        //<table data-toggle="table" data-url="data.json">
        //            <thead>
        //                ...    
        //            </thead>
        //        </table>
        // 2）通过JavaScript设置数据源

        // 通过JavaScript来启用带有id属性的Table。

        // $('#table').bootstrapTable({
        //     url: 'data.json' 
        // }); 
    }
  
     
</script>

<script>
    $(function () {
        var currYear = (new Date()).getFullYear();
        var opt = {};
        opt.date = { preset: 'date' };
        opt.datetime = { preset: 'datetime' };
        opt.time = { preset: 'time' };
        opt.default = {
            theme: 'android-ics light', //皮肤样式
            display: 'modal', //显示方式 
            mode: 'scroller', //日期选择模式
            dateOrder: 'yymmdd',
            lang: 'zh',
            dateFormat: 'yy-mm-dd',
            showNow: true,
            nowText: "今天",
            startYear: currYear - 50, //开始年份
            endYear: currYear + 10 //结束年份
        };

        $("#dts").mobiscroll($.extend(opt['date'], opt['default']));
        
        var tdate = new Date();
        var m = 1;
        m += tdate.getMonth();

        //if (m == 1) {
        //    tdate.setYear(tdate.getFullYear() - 1);
        //    m = 12;
        //}
        //else
        //    m--;

        $("#dts").val(tdate.getFullYear() + "-" + m+"-"+tdate.getDate());

         

    });

    $(function () {
        var currYear = (new Date()).getFullYear();
        var opt = {};
        opt.date = { preset: 'date' };
        opt.datetime = { preset: 'datetime' };
        opt.time = { preset: 'time' };
        opt.default = {
            theme: 'android-ics light', //皮肤样式
            display: 'modal', //显示方式 
            mode: 'scroller', //日期选择模式
            dateOrder: 'yymmdd',
            lang: 'zh',
            dateFormat: 'yy-mm-dd',
            showNow: true,
            nowText: "今天",
            startYear: currYear - 50, //开始年份
            endYear: currYear + 10 //结束年份
        };

        $("#dte").mobiscroll($.extend(opt['date'], opt['default']));

        var tdate = new Date();
        var m = 1;
        m += tdate.getMonth();
         
        $("#dte").val(tdate.getFullYear() + "-" + m+"-"+tdate.getDate());

    });
</script>
<script>
    function DevsList(dataObj)
    {
        var   i, j, row,
            columns = [],
            cells=5,
            data = [];

        var field = new Array("序号",  "SN", "数据时间", "上传时间","进客数", "出客数","电压","对焦","T");//;"上车数", "下车数"
        var tbStr = "<thead>";
        tbStr+="<tr>";
        for(i=0;i<field.length;i++)
        {
            tbStr+="<th>"+field[i]+"</th>";
        }
        tbStr+="</tr>";
        tbStr+="</thead>";
        tbStr+="<tbody>";
        var IsLoseFocus = 0;
        var sumIn = 0, sumOut = 0, Total = 0;
        for (i = 0; i < dataObj.datas.length; i++) {
             
                tbStr += "<tr>";
                tbStr += "<td>" + (i<9?("0"+(i+1)):(i+1)) + "</td>";
                tbStr += "<td>" + dataObj.datas[i].sn + "</td>";
                tbStr += "<td>" + dataObj.datas[i].dt_data + "</td>";
                tbStr += "<td>" + dataObj.datas[i].dt_upload + "</td>";
                tbStr += "<td>" + dataObj.datas[i].up + "</td>";
                tbStr += "<td>" + dataObj.datas[i].down + "</td>";
                var charge = "";
                if (dataObj.datas[i].charge !=0)
                    charge = "<b style='color:green'> [充电]</b>";
                tbStr += "<td>" + dataObj.datas[i].bat+charge + "</td>";
                if(dataObj.datas[i].focus==0)
                    tbStr += "<td><span style='color:green'>" + "正常" + "</span></td>";
                else
                    tbStr += "<td><b style='color:red'>" + "失焦" + "</b></td>";
                tbStr += "<td>" + dataObj.datas[i].temp/100 + "</td>";
                tbStr += "</tr>";
       
                sumIn += parseInt(dataObj.datas[i].up, 10);
                sumOut += parseInt(dataObj.datas[i].down, 10);  

        }
        tbStr += "</tbody>";
        Total = sumIn + sumOut;
        $("#table2").html(tbStr);
        $("#total").text("sumIn:" + sumIn + ",sumOut:" + sumOut + ",total:" + Total);
      
        //for (i = 0; i < field.length; i++) {
        //    columns.push({
        //        field: 'field' + i,
        //        title: field[i]
        //    });
        //}

       

        //    row = {};
            

        //    row['field' + 0] = i + 1;
        //    row['field' + 1] = dataObj.datas[i].sn;
        //    row['field' + 2] = dataObj.datas[i].dt_data;
        //    row['field' + 3] = dataObj.datas[i].dt_upload;
        //    row['field' + 4] = dataObj.datas[i].up;
        //    row['field' + 5] = dataObj.datas[i].down;
        //    row['field' + 6] = dataObj.datas[i].bat;
          
            
            //data.push(row);
        //}
        //$('#table').bootstrapTable('destroy').bootstrapTable({
        //    columns: columns,
        //    search: false,
        //    showRefresh: false,
        //    showToggle: false,
        //    showColumns:false,
        //    data: data
        //});

    }

    
     
    function Query() {

        if (!ckEmpty("module_no")) return false;

        //autoload();
        var uri = "Common/ajaxCenter.aspx?dtflg=" + getdtflag() + "&cmd=getdatalist";
        var dat="module_no=" + URLencode($("#module_no").val()) + "&keyword=" + URLencode($("#keyword").val()) + "&line=" + URLencode($("#line").val()) + "&dts=" + URLencode($("#dts").val()) + "&dte=" + URLencode($("#dte").val());
        var tbStr = "";
        tbStr = "<b>正在查询...</b>";
        $("#table2").html(tbStr);

        jQuery.ajax({
            url: "Common/ajaxCenter.aspx?dtflg=" + getdtflag() + "&cmd=getdatalist" ,
            type: 'get',
            dataType: 'text',
            //contentType: "application/json;charset=gb2312", 
            //data: strjson,
            data: "password=" + URLencode($("#password").val()) + "&sn=" + URLencode($("#sn").val()) + "&keyword=" + URLencode($("#keyword").val()) + "&linename=" + URLencode($("#linename").val()) + "&dts=" + URLencode($("#dts").val()) + "&dte=" + URLencode($("#dte").val()),
            success: function (msg) {
                
                if (msg == "")
                {
                    var d = dialog({
                        title: '提示',
                        width: 200,
                        content: "<h4><b><span style='color:red;'>查询失败</span></b></h4>",
                    });
                    d.showModal();
                    setTimeout(function () {
                        d.close().remove();
                    }, 1000);
                    return false;
                }

                var dataObj = eval("(" + msg + ")");
                if (dataObj.result == "0") //成功
                {
                    DevsList(dataObj);
                    
                }
                else if(dataObj.result == "2")
                {
                    var d = dialog({
                        title: '提示',                         
                        content: "<h4><b><span style='color:red;'>" + dataObj.msg + "</span></b></h4>",
                        quickClose: true,// 点击空白处快速关闭,
                        onclose: function () { location.href = "login.aspx"; }
                    });
                    d.showModal();
                    setTimeout(function () {
                        d.close().remove();
                    }, 1000);
                }
                else {//失败                    
                    var d = dialog({
                        title: '提示',
                        width: 200,
                        content: "<h4><b><span style='color:green;'>"+dataObj.msg+"</span></b></h4>",
                    });
                    d.showModal();
                    setTimeout(function () {
                        d.close().remove();
                    }, 1000);
                }
                
                
            }

        });
    }
    var lastModule= "<%=BusTotal.DataCenter.GetLastModule_no() %>" ; 
    function GetBusPark()
    {
      
        $("#module_no").append("<option value=\"" + lastModule + "\">" + lastModule + "</option>");
        jQuery.ajax({
            url: "Common/ajaxCenter.aspx?dtflg=" + getdtflag() + "&cmd=getbusparklist",
            type: 'get',
            dataType: 'text',
            //contentType: "application/json;charset=gb2312", 
            //data: strjson,
            data: "&line=" + URLencode($("#line").val()),
            success: function (msg) {
               
                if (msg == "") {
                    var d = dialog({
                        title: '添加失败',
                        width: 200,
                        ok: function () { },
                        content: "<b><span style='color:red; '>返回空数据！</span></b>",
                    });
                    d.showModal();

                    return false;
                }

                var dataObj = eval("(" + msg + ")");
                if (dataObj.result != "0") //失败
                {                    
                    return;
                }
                else {//成功
                   
                    mGetBusPark(dataObj);
                }
            }
        });

    }
    function mGetBusPark(dataObj) {

        for (i = 0; i < dataObj.datas.length; i++) {
            if (lastModule != dataObj.datas[i].module_no)
                $("#sn").append("<option value=\"" + dataObj.datas[i].sn + "\">" + dataObj.datas[i].sn + "</option>");
        }
       　
    }

    function GetLines() {
        jQuery.ajax({
            url: "Common/ajaxCenter.aspx?dtflg=" + getdtflag() + "&cmd=getlinelist",
            type: 'get',
            dataType: 'text',
            //contentType: "application/json;charset=gb2312", 
            //data: strjson,
            data: "&line=" + URLencode($("#line").val()),
            success: function (msg) {
                var dataObj = eval("(" + msg + ")");
                if (dataObj.result != "0") //失败
                {
                    alert(dataObj.msg);
                    return;
                }
                else {//成功

                    mShowLines(dataObj);
                    Query();
                }
            }
        });
    }
    function mShowLines(dataObj) {

        var i = 0;


        var temp = "";
        temp+="<label for=\"name\" class=\" control-label\">线路 </label>";
        temp += "<select class=\"form-control\"  onchange=\"Query()\"  id=\"linename\">";
        temp+="<option value=\"\">全部</option>";
        for (i = 0; i < dataObj.datas.length; i++) {
            temp += "<option value=\"" + dataObj.datas[i].name + "\">" + dataObj.datas[i].name + "</option>";

        }
        temp += "</select>";

        $("#divline").html(temp);
    }
    var dtm = 5;
    var tms;
    function autoload()
    {
       clearTimeout(tms);
       tms= setTimeout( Query ,60000);
    }
</script>
<script >

    $(function () {
        GetBusPark();
        GetLines();
        //build();
        
       
    });

   
    function loadXMLDoc(url)
    {
        var xmlhttp;
        xmlhttp=null;
        if (window.XMLHttpRequest)
        {// code for IE7, Firefox, Opera, etc.             
            xmlhttp=new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {// code for IE6, IE5
           
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (xmlhttp!=null)
        {
            xmlhttp.onreadystatechange=state_Change;
            xmlhttp.open("GET",url,true);
            xmlhttp.send(null);
        }        
    }

    function state_Change() {
        if (xmlhttp.readyState == 4) {// 4 = "loaded"
            if (xmlhttp.status == 200) {// 200 = "OK"
                document.getElementById('A1').innerHTML = xmlhttp.status;
                document.getElementById('A2').innerHTML = xmlhttp.statusText;
                document.getElementById('A3').innerHTML = xmlhttp.responseText;
            }
            else {
                alert("Problem retrieving XML data:" + xmlhttp.statusText);
            }
        }
    }
   
   
</script>
