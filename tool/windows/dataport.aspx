<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="dataport.aspx.cs" Inherits="AspServer._dataport" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>提交数据系统</title>
 
    <style type="text/css">
        #TextArea1
        {
            height: 129px;
            width: 175px;
        }
    </style>
 
</head>
<body>
    <form   method="post" id="form1" >
        <div style="color:Green">   
        <strong>欢迎使用网页提交数据系统</strong>
            <input id="cmd" name="cmd" type="text"  value ="getsetting" /><input id="DType" name="DType" type="text"  value ="xml" /><input 
                id="Submit1" type="submit" value="submit" />
            <textarea 
                id="xmlData" name="xmlData"></textarea></div>
        <div></div>
    </form>
</body>
</html>
