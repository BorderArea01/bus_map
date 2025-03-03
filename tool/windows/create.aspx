<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="create.aspx.cs" Inherits="DataInterFace.create" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>初如化数据库</title>
</head>
<body>
<div>初如化数据库</div>
    <form id="form1" method="post"  action="">  
        <div style="margin:5px 10px 10px 10px;">数据库名称: <input type="text" value="testdatabase2013" name="dbname" /> </div> 
        <div style="margin:5px 10px 10px 10px;"> 登录 帐号: <input type="text" value="sa" name="userid" /> </div> 
        <div style="margin:5px 10px 10px 10px;"> 登录 密码: <input type="password" value="" name="userpwd" /> </div> 
        <input type="hidden" value="init" name="type" />
        <input type="hidden" value="createtable" name="cmd" />
        <input id="Submit1" type="submit" value="创建数据库" />      
    </form>
    
</body>
</html>
