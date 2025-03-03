using System;
using System.Collections.Generic;
using System.Data;
using System.Web;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.IO;
namespace BusTotal
{
    public class DataCenter
    {
         
        public static int UserListMaxRow = 5;
        public static string srcPassword = "*#0012abc*&";

        public static void SaveToLogFile(string msg)
        {
            string path = System.Web.HttpContext.Current.Server.MapPath("bin\\wxlog");
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
            path = Path.Combine(path, DateTime.Now.ToString("yyyyMMdd") + ".log");

            try
            {
                File.AppendAllText(path, DateTime.Now.ToString("HH:mm:ss  ") + msg.Replace("\r\n", " ") + "\r\n");
            }
            catch { }
            

        }

        #region  Functions

        //清理html标记
        public static string CleanHTML(string str)
        {
            string msg = "";
            if (str == "" || str == null)
            {
                msg = "";
            }
            else
            {
                Regex reg = new Regex("<.+?>", RegexOptions.IgnoreCase | RegexOptions.Multiline);
                msg = reg.Replace(str, "");
            }
            return msg;
        }
        //清理空格标记
        public static string Cleankg(string str)
        {
            string msg = "";
            Regex reg = new Regex(@"[\s\p{Zs}]", RegexOptions.IgnoreCase | RegexOptions.Multiline);
            msg = reg.Replace(str, "");
            return msg;
        }
        #endregion

        #region 语言选择器
        public static string GetLocalString(string srcWord)
        {

            Dictionary<string, string> Dic1 = new Dictionary<string, string>();
            Dic1.Add("数据库访问异常", "数据库访问异常");
            Dic1.Add("用户名或密码错误", "用户名或密码错误");


            List<Dictionary<string, string>> ListWords = new List<Dictionary<string, string>>();
            ListWords.Add(Dic1);


            int languageIndex = 0;
            if (System.Web.HttpContext.Current.Session["language"] == null || System.Web.HttpContext.Current.Session["language"] == null)
                languageIndex = 0;
            else
                languageIndex = Convert.ToInt16(System.Web.HttpContext.Current.Session["language"]);

            string kValue = "";
            if (!ListWords[languageIndex].TryGetValue(srcWord, out kValue))
                kValue = srcWord;

            return srcWord;
        }

        #endregion

        #region "MD5加密函数"
        ///   <summary>
        ///   给一个字符串进行MD5加密
        ///   </summary>
        ///   <param   name="strText">待加密字符串</param>
        ///   <returns>加密后的字符串</returns>
        public static string MD5Encrypt(string strText)
        {
            return HashString(Encoding.UTF8, strText);
        }

        /// <summary> 
        /// 使用指定的编码将字符串散列 
        /// </summary> 
        /// <param name="encode">编码</param> 
        /// <param name="sourceString">要散列的字符串</param> 
        /// <returns>散列后的字符串</returns> 
        public static string HashString(Encoding encode, string sourceString)
        {
            MD5 md5 = new MD5CryptoServiceProvider();
            byte[] source = md5.ComputeHash(encode.GetBytes(sourceString));
            StringBuilder sBuilder = new StringBuilder();
            for (int i = 0; i < source.Length; i++)
            {
                sBuilder.Append(source[i].ToString("x2"));
            }
            return sBuilder.ToString();
        }
        #endregion

        #region "数据库数据转换函数"

        public static string DbConvertToString(object dat)
        {
            if (dat is DBNull) return "";
            return Convert.ToString(dat);
        }
        public static int DbConvertToInt(object dat)
        {
            if (dat is DBNull) return 0;
            return Convert.ToInt32(dat);
        }

        public static DateTime DbConvertToDateTime(object dat)
        {
            if (dat is DBNull) return DateTime.MinValue;
            DateTime dt;
            try
            {
                dt = Convert.ToDateTime(dat);
            }
            catch
            {
                dt = DateTime.MinValue;
            }
            return dt;
        }
        #endregion









        #region "HOME"

        public static string GetDataList(string module_no, string keyword, string linename,string dts, string dte)
        {

            

            int result = 0;

            string errMsg = "";
            DataSet ds = null;
            DatabaseHelper db = new DatabaseHelper(true);
            DateTime dtStart = DateTime.Now;
            DateTime dtEnd = DateTime.Now;


            if (string.IsNullOrEmpty(module_no))
            {
                result = 1;
                errMsg = "参数不正确";
                goto OnErr;
            }


            if (!DateTime.TryParse(dts, out dtStart) || !DateTime.TryParse(dte, out dtEnd))
            {
                result = 1;
                errMsg = "日期或时间不正确";
                goto OnErr;
            }
             

            string sql = "SELECT  *  FROM  [t_datalist] ";
            //sql += " left join [t_NumberOfbus]   on t_busvisitor.equipment_no=t_NumberOfbus.SN ";
            sql += " where sn='{0}' and [dt_upload] >='{1:yyyy-MM-dd}' and [dt_upload] <'{2:yyyy-MM-dd}'   "; 
            sql += " order by  [dt_upload] desc";
             

            sql = string.Format(sql, module_no, dtStart, dtEnd.AddDays(1), keyword);

            errMsg = db.ExecDataSet(sql, out ds);
            if (errMsg != "")
            {
                result = 1;
                goto OnErr;
            }

        OnErr:

            string retStr = "{";
            retStr += string.Format("\"result\":\"{0}\",\"msg\":\"{1}\"", result, errMsg);

            if (errMsg == "")
            {

                retStr += ",\"datas\":[";


                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    if (i > 0)
                        retStr += ",";
                    string row = "{";


                    row += string.Format("\"sn\":\"{0}\",\"up\":\"{1}\",\"down\":\"{2}\",\"dt_data\":\"{3:yyyy-MM-dd HH:mm:ss}\",\"dt_upload\":\"{4:yyyy-MM-dd HH:mm:ss}\",\"bat\":\"{5}\"",
                            DataCenter.DbConvertToString(ds.Tables[0].Rows[i]["sn"]),
                             DataCenter.DbConvertToInt(ds.Tables[0].Rows[i]["up"]),
                            DataCenter.DbConvertToInt(ds.Tables[0].Rows[i]["down"]),
 DataCenter.DbConvertToDateTime(ds.Tables[0].Rows[i]["dt_data"]),
 DataCenter.DbConvertToDateTime(ds.Tables[0].Rows[i]["dt_upload"]),
                          DataCenter.DbConvertToInt(ds.Tables[0].Rows[i]["batvoltage"]) 
                            );
                    row += "}";

                    retStr += row;
                }
                retStr += "]";


            }
            else
                SaveToLogFile(errMsg);
            retStr += "}";


            string lastModule_no = GetLastModule_no();
            //if (lastModule_no != module_no)
            //{
            //    System.Web.HttpContext.Current.Session["module_no"] = module_no;
            //    sql = "update t_bususer set last_module_no='{0}' where name='{1}' ";
            //    sql = string.Format(sql, module_no, System.Web.HttpContext.Current.Session["login"] == null ? "" : System.Web.HttpContext.Current.Session["login"].ToString());
            //    errMsg=db.ExecuteSql(sql);
            //    SaveToLogFile(errMsg);
            //}

            return retStr;
        }

        // public static string GetList

        #endregion

        #region "停车场"

        public static string AddBusPark(string module_no, string module_name,string tmBegin,string tmEnd)
        {
            int result = 0;
            string errMsg = "";

            string sql = "select top 1 * from t_gprs_register";
            sql += " where module_no='" + module_no + "' or Stores_name='" + module_name + "' ";
            DatabaseHelper db = new DatabaseHelper(true);
            if (db.CheckField(sql))
            {
                result = 1;
                errMsg = "该停车场已经存在.";
                goto OnErr;
            }

            sql = "insert into t_gprs_register (module_no,Stores_name,begin_time,end_time) ";
            sql += "values('" + module_no + "','"+module_name+"','"+tmBegin +"','"+tmEnd+"')";
            errMsg = db.ExecuteSql(sql);

            if (errMsg != "")
            {
                result = 1;
                goto OnErr;
            }
        OnErr:

            string retStr = "{";
            retStr += string.Format("\"result\":\"{0}\",\"msg\":\"{1}\"", result, errMsg);
            retStr += "}";



            return retStr;
        }

        public static string GetBusParkList()
        {
            int result = 0;
            string errMsg = "";

            string sql = "select  * from [map_sn2module]";
            sql += " order  by id   desc";
            DatabaseHelper db = new DatabaseHelper(true);
            DataSet ds;
            errMsg = db.ExecDataSet(sql, out ds);
            if (errMsg != "")
            {
                result = 1;
            }
            string retStr = "{";
            retStr += string.Format("\"result\":\"{0}\",\"msg\":\"{1}\"", result, errMsg);

            if (errMsg == "")
            {
                retStr += ",\"datas\":[";
                string row = "";
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {

                    if (i > 0)
                    {
                        retStr += ",";
                    }
                    row = "{";
                    row += string.Format("\"id\":\"{0}\",\"sn\":\"{1}\",\"module_no\":\"{2}\",\"tmbegin\":\"{3:HH:mm}\",\"tmend\":\"{4:HH:mm}\"",
                        DataCenter.DbConvertToInt(ds.Tables[0].Rows[i]["id"]),
                        DataCenter.DbConvertToString(ds.Tables[0].Rows[i]["sn"]),
                        DataCenter.DbConvertToString(ds.Tables[0].Rows[i]["module_no"]),
                        "",
                        "");
                    row += "}";

                    retStr += row;
                }
                retStr += "]";
            }

            retStr += "}";

            return retStr;
        }

        public static string DelBusPark(string id)
        {
            int result = 0;
            string errMsg = "";

            string sql = "delete from t_gprs_register";
            sql += " where id=" + id;
            DatabaseHelper db = new DatabaseHelper(true);
            DataSet ds;
            errMsg = db.ExecDataSet(sql, out ds);
            if (errMsg != "")
            {
                result = 1;
            }
            string retStr = "{";
            retStr += string.Format("\"result\":\"{0}\",\"msg\":\"{1}\"", result, errMsg);
            retStr += "}";

            return retStr;
        }

        #endregion

        #region "线路"

        public static string AddLine(string linename)
        {
            int result = 0;
            string errMsg = "";

            string sql = "select top 1 * from t_Line";
            sql += " where name='" + linename + "'";
            DatabaseHelper db = new DatabaseHelper(true);
            if (db.CheckField(sql))
            {
                result = 1;
                errMsg = "该线路名称已经存在.";
                goto OnErr;
            }

            sql = "insert into t_Line (name) ";
            sql += "values('" + linename + "')";
            errMsg = db.ExecuteSql(sql);

            if (errMsg != "")
            {
                result = 1;
                goto OnErr;
            }
        OnErr:

            string retStr = "{";
            retStr += string.Format("\"result\":\"{0}\",\"msg\":\"{1}\"", result, errMsg);
            retStr += "}";



            return retStr;
        }

        public static string GetLineList()
        {
            int result = 0;
            string errMsg = "";

            string sql = "select  * from t_Line";
            DatabaseHelper db = new DatabaseHelper(true);
            DataSet ds;
            errMsg = db.ExecDataSet(sql, out ds);
            if (errMsg != "")
            {
                result = 1;
            }
            string retStr = "{";
            retStr += string.Format("\"result\":\"{0}\",\"msg\":\"{1}\"", result, errMsg);

            if (errMsg == "")
            {
                retStr += ",\"datas\":[";
                string row = "";
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                     
                    if (i > 0)
                    {
                        retStr += ",";
                    }
                    row  = "{";
                    row += string.Format("\"id\":\"{0}\",\"name\":\"{1}\"",
                        DataCenter.DbConvertToInt(ds.Tables[0].Rows[i]["id"]),
                        DataCenter.DbConvertToString(ds.Tables[0].Rows[i]["name"]));
                    row += "}";

                    retStr += row;
                }
                retStr += "]";
            }

            retStr += "}";

            return retStr;
        }

        public static string DelLine(string id)
        {
            int result = 0;
            string errMsg = "";

            string sql = "delete from t_Line";
            sql += " where id=" + id;
            DatabaseHelper db = new DatabaseHelper(true);
            DataSet ds;
            errMsg = db.ExecDataSet(sql, out ds);
            if (errMsg != "")
            {
                result = 1;
            }
            string retStr = "{";
            retStr += string.Format("\"result\":\"{0}\",\"msg\":\"{1}\"", result, errMsg);
            retStr += "}";

            return retStr;
        }

        #endregion

        #region "车牌"

       public static string AddNumberOfBus(string SN, string Number, string LineName,string direction)
        {
            int result = 0;
            string errMsg = "";

            string sql = "select top 1 * from t_NumberOfbus";
            sql += " where SN='" +SN +"' or Number='"+Number +"' ";
            DatabaseHelper db = new DatabaseHelper(true);
            if (db.CheckField(sql))
            {
                result = 1;
                errMsg = "该序列号或车牌号已经被绑定.";
                goto OnErr;
            }

            sql ="insert into t_NumberOfbus ( SN,Number,LineName,direction) values ('{0}','{1}','{2}',{3})";
            sql = string.Format(sql, SN, Number, LineName,direction);
            errMsg =db.ExecuteSql(sql );
            if(errMsg !="")
            {
                result =1;
            }

             OnErr:

            string retStr = "{";
            retStr += string.Format("\"result\":\"{0}\",\"msg\":\"{1}\"", result, errMsg);            
            retStr += "}";

            return retStr;
        }

        public static string GetNumberList(string LineName)
        {
            int result = 0;
            string errMsg = "";

            string sql = "select  * from t_NumberOfbus";
            if(!string .IsNullOrEmpty ( LineName))
            {
                sql += " where LineName='" + LineName + "'";

            }
            sql += " order by Number asc";

            DatabaseHelper db = new DatabaseHelper(true);
            DataSet ds;
            errMsg = db.ExecDataSet(sql, out ds);
            if (errMsg != "")
            {
                result = 1;
            }
            string retStr = "{";
            retStr += string.Format("\"result\":\"{0}\",\"msg\":\"{1}\"", result, errMsg);

            if (errMsg == "")
            {
                retStr += ",\"datas\":[";
                string row = "";
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    if (i > 0)
                    {
                        retStr += ",";
                    }
                    row = "{";
                    row += string.Format("\"id\":\"{0}\",\"sn\":\"{1}\",\"number\":\"{2}\",\"linename\":\"{3}\",\"direction\":\"{4}\"",
                        DataCenter.DbConvertToInt(ds.Tables[0].Rows[i]["id"]),
                        DataCenter.DbConvertToString(ds.Tables[0].Rows[i]["SN"]),
                        DataCenter.DbConvertToString(ds.Tables[0].Rows[i]["Number"]),
                        DataCenter.DbConvertToString(ds.Tables[0].Rows[i]["LineName"]),
                        (DataCenter.DbConvertToInt(ds.Tables[0].Rows[i]["direction"] )==1?"反向":"正向")                       
                        );
                    row += "}";

                    retStr += row;
                }
                retStr += "]";
            }

            retStr += "}";

            return retStr;
        }

        public static string DelNumber(string id)
        {
            int result = 0;
            string errMsg = "";

            string sql = "delete from t_NumberOfbus";
            sql += " where id=" + id;
            DatabaseHelper db = new DatabaseHelper(true);
            DataSet ds;
            errMsg = db.ExecDataSet(sql, out ds);
            if (errMsg != "")
            {
                result = 1;
            }
            string retStr = "{";
            retStr += string.Format("\"result\":\"{0}\",\"msg\":\"{1}\"", result, errMsg);
            retStr += "}";

            return retStr;
        }

        #endregion

        #region "用户管理"

        public static string AddUser(string name, string pwd, string group)
        {
            int result = 0;
            string errMsg = "";

            string sql = "select top 1 * from t_bususer";
            sql += " where name='" + name + "'";
            DatabaseHelper db = new DatabaseHelper(true);
            if (db.CheckField(sql))
            {
                result = 1;
                errMsg = "该用户名已经存在.";
                goto OnErr;
            }

            sql = "insert into t_bususer ( name,password,usergroup) values ('{0}','{1}','{2}')";
            sql = string.Format(sql, name , pwd, group);
            errMsg = db.ExecuteSql(sql);
            if (errMsg != "")
            {
                result = 1;
            }

        OnErr:

            string retStr = "{";
            retStr += string.Format("\"result\":\"{0}\",\"msg\":\"{1}\"", result, errMsg);
            retStr += "}";

            return retStr;
        }

        public static string GetUserList(string group)
        {
            int result = 0;
            string errMsg = "";
            string [] Groups={"超级管理员","管理员","普通用户"};
            string sql = "select  * from t_bususer";
            if (!string.IsNullOrEmpty(group))
            {
                sql += " where usergroup='" + group + "'";

            }
            sql += " order by name asc";

            DatabaseHelper db = new DatabaseHelper(true);
            DataSet ds;
            errMsg = db.ExecDataSet(sql, out ds);
            if (errMsg != "")
            {
                result = 1;
            }
            string retStr = "{";
            retStr += string.Format("\"result\":\"{0}\",\"msg\":\"{1}\"", result, errMsg);

            if (errMsg == "")
            {
                retStr += ",\"datas\":[";
                string row = "";
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    if (i > 0)
                    {
                        retStr += ",";
                    }
                    int iGroup=DataCenter.DbConvertToInt(ds.Tables[0].Rows[i]["usergroup"]);;
                    row = "{";
                    row += string.Format("\"id\":\"{0}\",\"name\":\"{1}\",\"password\":\"{2}\",\"group\":\"{3}\"",
                        DataCenter.DbConvertToInt(ds.Tables[0].Rows[i]["id"]),
                        DataCenter.DbConvertToString(ds.Tables[0].Rows[i]["name"]),
                        DataCenter.DbConvertToString(ds.Tables[0].Rows[i]["password"]).Substring(0,4).PadRight(10,'*'),
                        Groups[iGroup] 
                        );
                    row += "}";

                    retStr += row;
                }
                retStr += "]";
            }

            retStr += "}";

            return retStr;
        }

        public static string DelUser(string id)
        {
            int result = 0;
            string errMsg = "";

            string sql = "delete from t_bususer";
            sql += " where id=" + id;
            DatabaseHelper db = new DatabaseHelper(true);
            DataSet ds;
            errMsg = db.ExecDataSet(sql, out ds);
            if (errMsg != "")
            {
                result = 1;
            }
            string retStr = "{";
            retStr += string.Format("\"result\":\"{0}\",\"msg\":\"{1}\"", result, errMsg);
            retStr += "}";

            return retStr;
        }

        public static string LoginUser(string name,string password)
        {
            int result = 0;
            string errMsg = "";

            string sql = "select top 1 * from t_bususer";
            sql += " where name='" + name+"' and password='"+password+"'";
            DatabaseHelper db = new DatabaseHelper(true);
            DataSet ds;
            errMsg = db.ExecDataSet(sql, out ds);
            if (errMsg != "")
            {
                result = 1;
            }

            if(ds.Tables[0].Rows.Count<=0)
            {
                result = 1;
                errMsg = "用户名或密码错误";
            }
            else
            {
                System.Web.HttpContext.Current.Session["login"] = name;
                System.Web.HttpContext.Current.Session["group"] = DataCenter.DbConvertToString(ds.Tables[0].Rows[0]["usergroup"]);
                System.Web.HttpContext.Current.Session["module_no"] = DataCenter.DbConvertToString(ds.Tables[0].Rows[0]["last_module_no"]);
            }

            string retStr = "{";
            retStr += string.Format("\"result\":\"{0}\",\"msg\":\"{1}\"", result, errMsg);
            retStr += "}";

            return retStr;
        }
        public static string GetLastModule_no()
        {
            if (System.Web.HttpContext.Current.Session["module_no"] == null) return "88";
            return System.Web.HttpContext.Current.Session["module_no"].ToString();
        }
        public static void LoginOutUser()
        {
            System.Web.HttpContext.Current.Session["login"] = null;
            System.Web.HttpContext.Current.Session["group"] = null;
        }
        public static  void CheckLogin()
        {
            
            if(System.Web.HttpContext.Current.Session["login"]==null)
            {//
                System.Web.HttpContext.Current.Response.Redirect("loginfail.aspx");
                
            }
            else if (System.Web.HttpContext.Current.Session["login"].ToString () == "")
            {
                System.Web.HttpContext.Current.Response.Redirect("loginfail.aspx");
            }
        }
        public static  string  ajaxCheckLogin()
        {

            if (System.Web.HttpContext.Current.Session["login"] != null && System.Web.HttpContext.Current.Session["login"].ToString ()!="")
            {//                 
                return "";
            }
            else  
            {
                string retStr = "{";
                retStr += string.Format("\"result\":\"{0}\",\"msg\":\"{1}\"", 2, "登录已经过期，请重新刷新页面，或重新登录。");
                retStr += "}";
                return retStr;
            }
        }

        public static void CheckLimit()
        {
            if(System.Web.HttpContext.Current.Session["group"]==null)
            {
                System.Web.HttpContext.Current.Response.Redirect("loginfail.aspx");
            }
            else if(System.Web.HttpContext.Current.Session["group"].ToString ()=="2")//普通用户
            {
                string goback = "";
                goback += "<script>history.back(-1);</script>";
                System.Web.HttpContext.Current.Response.Write(goback);
                System.Web.HttpContext.Current.Response.End();
            }
        }
        public static bool IsAdmin()
        {

            if (System.Web.HttpContext.Current.Session["group"] != null && System.Web.HttpContext.Current.Session["group"].ToString() != "2")
                return true;
            else
                return false;
        }

        #endregion

        #region "数据管理"

        public static string DelAllData(string delpwd)
        {
            int result = 0;
            string errMsg = "";

            string pwd = string.Format("bus{0:D4}", DateTime.Now.Year + DateTime.Now.Month + DateTime.Now.Day);
            if(delpwd!=pwd)
            {
                result = 1;
                errMsg = "密码错误";
                goto Fail;
            }

            string sql = "delete from t_busvisitor";
            DatabaseHelper db = new DatabaseHelper(true);
            errMsg =db.ExecuteSql(sql );
            if(errMsg!="")
            {
                result=1;
            }
 Fail:

            string retStr = "{";
            retStr += string.Format("\"result\":\"{0}\",\"msg\":\"{1}\"", result, errMsg);
            retStr += "}";

            return retStr;
        }

        #endregion
    }
}