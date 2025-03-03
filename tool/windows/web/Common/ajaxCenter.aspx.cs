using System;
using System.Collections.Generic;

using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BusTotal
{
    public partial class ajaxCenter : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //ModuleDayData mdd = new ModuleDayData();
            //mdd.module_no = "m1";

            //mdd.StartTime = DateTime.Parse("12:30");
            //mdd.EndTime = DateTime.Parse("12:50");
            //mdd.operate_date = DateTime.Parse("2015-12-11");

            //Response.Write(mdd.GetJsonString());
            //Response.End();

            //Response.Write(DataCenter.GetFiveDataListOfDay("json", "1234", "2014-04-13"));

            //Response.End();

           
            
            string Cmd = Request["cmd"];
            if (string.IsNullOrEmpty(Cmd))
            {
                Response.Write("Cmd Is Empty ad!");
                Response.End();
            }
            string resultString = "";// DataCenter.ajaxCheckLogin();

            switch (Cmd)
            {

                case "getdatalist":
                    if (string.IsNullOrEmpty(resultString))
                        resultString = DataCenter.GetDataList(Request["sn"], Request["keyword"], Request["linename"], Request["dts"], Request["dte"]); //获取日报表数据

                    break;
                case "addbuspark":
                    if (string.IsNullOrEmpty(resultString))
                        resultString = DataCenter.AddBusPark(Request["module_no"], Request["module_name"], Request["tmBegin"], Request["tmEnd"]); //获取日报表数据
                    break;
                case "getbusparklist":
                    if (string.IsNullOrEmpty(resultString))
                        resultString = DataCenter.GetBusParkList(); //获取日报表数据
                    break;
                case "delbuspark":
                    if (string.IsNullOrEmpty(resultString))
                        resultString = DataCenter.DelBusPark(Request["id"]); //获取日报表数据
                    break;

                case "addline":
                    if (string.IsNullOrEmpty(resultString))
                        resultString = DataCenter.AddLine(Request["line"]); //获取日报表数据
                    break;
                case "getlinelist":
                    if (string.IsNullOrEmpty(resultString))
                        resultString = DataCenter.GetLineList(); //获取日报表数据
                    break;
                case "delline":
                    if (string.IsNullOrEmpty(resultString))
                        resultString = DataCenter.DelLine(Request["id"]); //获取日报表数据
                    break;


                case "addnumber":
                    if (string.IsNullOrEmpty(resultString))
                        resultString = DataCenter.AddNumberOfBus(Request["sn"], Request["number"], Request["linename"], Request["direction"]); //获取日报表数据
                    break;
                case "getnumberlist":
                    if (string.IsNullOrEmpty(resultString))
                        resultString = DataCenter.GetNumberList(Request["linename"]); //获取日报表数据
                    break;
                case "delnumber":
                    if (string.IsNullOrEmpty(resultString))
                        resultString = DataCenter.DelNumber(Request["id"]); //删除
                    break;
                case "adduser":
                    if (string.IsNullOrEmpty(resultString))
                        resultString = DataCenter.AddUser(Request["name"], Request["password"], Request["group"]); //获取日报表数据
                    break;
                case "getuserlist":
                    if (string.IsNullOrEmpty(resultString))
                        resultString = DataCenter.GetUserList(Request["group"]); //获取日报表数据
                    break;
                case "deluser":
                    if (string.IsNullOrEmpty(resultString))
                        resultString = DataCenter.DelUser(Request["id"]); //删除
                    break;
                case "login":
                    resultString = DataCenter.LoginUser(Request["name"], Request["password"]); //删除  
                    break;
                case "delalldata":
                    resultString = DataCenter.DelAllData(Request["delpwd"]); //删除  
                    break;

            }
            DataCenter.SaveToLogFile(Cmd);
            Response.Write(resultString);
            Response.End();
        }
    }
}