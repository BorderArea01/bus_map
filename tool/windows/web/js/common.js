 

function URLencode(sStr) {
    return escape(sStr).replace(/\+/g, '%2B').replace(/\"/g, '%22').replace(/\'/g, '%27').replace(/\//g, '%2F');
}

function getdtflag()
{
    var mydate = new Date();
    return mydate.getHours() + "_" + mydate.getMinutes() + "_" + mydate.getSeconds();
}
 

function ckEmpty(id) {
    if ($("#" + id).val() != "") {
        return true;
    }
    else {
        var d = dialog({
            content: "<b><span style='color:red;'>未填写</span></b>",
            quickClose: true// 点击空白处快速关闭
        });
        d.show(document.getElementById(id));

        document.getElementById(id).focus();
        return false;
    }
}

function outlogin() {
    var d = dialog({
        title: '确认退出',
        width: 200,
        content: "<b><span style='color:red; '>确定要退出登录项吗？</span></b>",
        okValue: '是',
        ok: function () {
            location.href = "LoginOut.aspx";
        },
        cancelValue: '否',
        cancel: function () {

        }

    });
    d.showModal();
}