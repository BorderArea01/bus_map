using System;
using System.Collections.Generic;
using System.Text;
using System.Data ;
using System.Data.SqlClient;
using System.Data.OleDb;

namespace System.Data
{ 
    class DatabaseHelper
    {
        private    bool isSql =true  ;
        private string mConnstring = "";
        public static string Connstring
        {
            get
            {
                // System.Configuration.ConnectionStringsSection css = new ConnectionStringsSection();
                string myConn = System.Configuration.ConfigurationManager.ConnectionStrings["sqlConnectionString"].ConnectionString;
                return myConn;
            }
        }
         public DatabaseHelper(bool dbSql, string connstring)
        {
            isSql = dbSql;
            mConnstring = connstring;
        }       
        public DatabaseHelper(bool dbSql)
        {
            isSql = dbSql;
            mConnstring = Connstring;
        }

        public   int GetLastID(string tabel, string id )
        {
            int lastId = 0;
            if (isSql)
            {
                try
                {
                    SqlConnection conn = new SqlConnection(mConnstring);
                    conn.Open();


                    string sql = "";
                    sql = "select " + id + " from " + tabel + " order by " + id + " desc";

                    SqlCommand cmd = new SqlCommand(sql, conn);
                    SqlDataReader rd = null;

                    rd = cmd.ExecuteReader();
                    if (rd.HasRows)
                    {
                        rd.Read();
                        lastId = (int)rd[id];
                    }

                    rd.Close();
                    conn.Close();
                }
                catch (SqlException  err)
                {
                    lastId = -1;
                }
            }
            else
            {
                try
                {


                    string sql = "";
                    sql = "select " + id + " from " + tabel + " order by " + id + " desc";

                    OleDbConnection conn = new OleDbConnection(mConnstring);
                    conn.Open();
                    OleDbCommand cmd = new OleDbCommand(sql, conn);
                    OleDbDataReader rd = null;

                    rd = cmd.ExecuteReader();
                    if (rd.HasRows)
                    {
                        rd.Read();
                        lastId = (int)rd[id];
                    }

                    rd.Close();
                    conn.Close();
                }
                catch (OleDbException err)
                {
                    lastId = -1;
                }

            }
            return lastId;
        }

        #region "检查sql 是否有记录"
        /// <summary>
        /// 检查sql 是否有记录
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        public  bool  CheckField(string sql)
        { 
            bool result = false  ;

            if (isSql)
            {
                try
                {
                    SqlConnection conn = new SqlConnection(mConnstring);
                    conn.Open();

                    SqlCommand cmd = new SqlCommand(sql, conn);
                    SqlDataReader rd = cmd.ExecuteReader();
                    if (rd.HasRows)
                    {
                        result = true;
                    }

                    rd.Close();
                    conn.Close();
                }
                catch (SqlException err)
                {
                    string a = err.Message;
                }
                catch (Exception err)
                {
                    string a = err.Message;
                }

            }
            else//ＡＣＳＳＣＥ数据库
            {
                try
                {
                    OleDbConnection conn = new OleDbConnection(mConnstring);
                    conn.Open();
                    OleDbCommand cmd = new OleDbCommand(sql, conn);
                    OleDbDataReader rd = cmd.ExecuteReader();

                    if (rd.HasRows)
                    {
                        result = true;
                    }

                    rd.Close();
                    conn.Close();
                }
                catch (Exception err)
                {
                    string a = err.Message;
                }
            }
            return result;

        }
        #endregion
        public  bool CanConnect()
        {
            bool result = false;

            if (isSql)
            {
                try
                {
                    SqlConnection conn = new SqlConnection(mConnstring);
                    conn.Open();

                    conn.Close();
                    result = true;
                }
                catch (Exception err)
                {

                }
            }
            else
            {
                try
                {
                    OleDbConnection conn = new OleDbConnection(mConnstring);
                    conn.Open();                     

                    conn.Close();
                    result = true;
                }
                catch (Exception err)
                {

                }
            }
            return result;

        }
        public string ExecuteSql(string sql)
        {
            string result = "";
            if (isSql)
            {
                try
                {
                    SqlConnection conn = new SqlConnection(mConnstring);
                    conn.Open();
                    SqlCommand cmd = new SqlCommand(sql, conn);
                    cmd.ExecuteNonQuery();
                    conn.Close();
                }
                catch (SqlException err)
                {
                    if (10061 == err.Number)
                        result = "连接数据库失败!";
                    else
                        result = err.Message;
                }
            }
            else
            {
                try
                {
                    OleDbConnection conn = new OleDbConnection(mConnstring);
                    conn.Open();
                    OleDbCommand cmd = new OleDbCommand(sql, conn);

                    cmd.ExecuteNonQuery();
                    conn.Close();
                }
                catch (OleDbException err)
                {
                    if (10061 == err.ErrorCode )
                        result = "连接数据库失败!";
                    else
                        result = err.Message;
                }
            }

            return result;
        }

        public string ExecuteSql(string sql, SqlParameter [] sqlParames)
        { 
            string result = "";            
                try
                {
                    SqlConnection conn = new SqlConnection(mConnstring);
                    conn.Open();
                    SqlCommand cmd = new SqlCommand(sql, conn);
                    cmd.Parameters.AddRange(sqlParames);

                    cmd.ExecuteNonQuery();
                }
                catch (SqlException err)
                {
                    if (10061 == err.Number)
                        result = "连接数据库失败! 请检查数据库参数是否设置正确.";
                    else
                        result = err.Message;
                }
            
           
            return result;
        }//ExecuteSql
        public string ExecuteSql(string sql, OleDbParameter [] sqlParames)
        { 
            string result = "";
            try
            {
                OleDbConnection conn = new OleDbConnection(mConnstring);
                conn.Open();
                OleDbCommand cmd = new OleDbCommand(sql, conn);
                cmd.Parameters.AddRange(sqlParames);

                cmd.ExecuteNonQuery();
            }
            catch (OleDbException  err)
            {               
                if (10061 == err.ErrorCode )
                    result = "连接数据库失败! 请检查数据库参数是否设置正确.";
                else
                    result = err.Message;
            }
            
           
            return result;
        }

        //ExecDataSet
        public string ExecDataSet(string sql, out  DataSet ds)
        {
            string result = "";
            ds = new DataSet();

            if (isSql)
            {
                try
                {
                    SqlConnection conn = new SqlConnection(mConnstring);
                    conn.Open();                  
                    SqlDataAdapter da = new SqlDataAdapter(sql, conn);
                    da.Fill(ds);
                    conn.Close();
                }
                catch (SqlException err)
                {                    
                    if (10061 == err.Number)
                        result = "连接数据库失败! 请检查数据库参数是否设置正确.";
                    else
                        result = err.Message;
                }
            }
            else
            {
                try
                {
                   // System.Windows.Forms.MessageBox.Show(Program.cfg.oledbconnstring);
                    OleDbConnection conn = new OleDbConnection(mConnstring);
                    conn.Open();
                    
                    OleDbDataAdapter da = new OleDbDataAdapter(sql, conn);                   
                    da.Fill(ds);
                    conn.Close();

                }
                catch (OleDbException  err)
                {                   
                    if (10061 == err.ErrorCode )
                        result = "连接数据库失败! 请检查数据库参数是否设置正确.";
                    else
                        result = err.Message;
                }

            }
            return result;
        }

        public string sqlGetSum(string sql, ref  int[] sumValue)
        {
            string result = "";
            if (isSql)
            {
                try
                {
                    SqlConnection conn = new SqlConnection(mConnstring);
                    conn.Open();
                    SqlCommand cmd = new SqlCommand(sql, conn);
                    SqlDataReader rd = cmd.ExecuteReader();
                    if (rd.HasRows)
                    {
                        rd.Read();
                        for (int i = 0; i < sumValue.Length; i++)
                        {
                            sumValue[i] = Convert .ToInt16 (rd[i] );
                        }
                    }
                    rd.Close();
                    conn.Close();

                }
                catch (SqlException err)
                {
                    if (10061 == err.Number)
                        result = "连接数据库失败! 请检查数据库参数是否设置正确.";
                    else
                        result = err.Message;
                }
            }
            else
            {
                try
                {

                    OleDbConnection conn = new OleDbConnection(mConnstring);
                    conn.Open();
                    OleDbCommand cmd = new OleDbCommand(sql, conn);
                    OleDbDataReader  rd = cmd.ExecuteReader();
                    if (rd.HasRows)
                    {
                        rd.Read();
                        for (int i = 0; i < sumValue.Length; i++)
                        {
                            sumValue[i] = Convert .ToInt16 (rd[i] );
                        }
                    }
                    rd.Close();
                    conn.Close();

                }
                catch (OleDbException  err)
                {
                    if (10061 == err.ErrorCode )
                        result = "连接数据库失败! 请检查数据库参数是否设置正确.";
                    else
                        result = err.Message;
                }
            }
            return result;
        }



        public  string sqlAddField(string tb, string field, string type)
        {  //ALTER TABLE distributors ADD address varchar(30); 
            string result = "";
            string sql = "ALTER TABLE " + tb + " ADD " + field + " " + type;

            if (isSql)
            {
                try
                {
                    SqlConnection conn = new SqlConnection(mConnstring);
                    conn.Open();
                    SqlCommand cmd = new SqlCommand(sql, conn);
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException err)
                {
                    if (10061 == err.Number)
                        result = "连接数据库失败! 请检查数据库参数是否设置正确.";
                    else
                        result = err.Message;
                }
            }
            else
            {
                try
                {
                    OleDbConnection conn = new OleDbConnection(mConnstring);
                    conn.Open();
                    OleDbCommand cmd = new OleDbCommand(sql, conn);
                    cmd.ExecuteNonQuery();
                }
                catch (OleDbException err)
                {
                    if (10061 == err.ErrorCode)
                        result = "连接数据库失败! 请检查数据库参数是否设置正确.";
                    else
                        result = err.Message;
                }
            }
            return result;
        }
        public  void CompactAccessDB(  string mdwfilename)
        {
            string connectionString = mConnstring;
            object[] oParams;

            //create an inctance of a Jet Replication Object
            object objJRO =
            Activator.CreateInstance(Type.GetTypeFromProgID("JRO.JetEngine"));

            //filling Parameters array
            //cnahge "Jet OLEDB:Engine Type=5" to an appropriate value
            // or leave it as is if you db is JET4X format (access 2000,2002)
            //(yes, jetengine5 is for JET4X, no misprint here)

            oParams = new object[] { 
            connectionString,         "Provider=Microsoft.Jet.OLEDB.4.0;Data" + 
            " Source=C:\\tempdb.mdb;Jet OLEDB:Engine Type=5"};

            //invoke a CompactDatabase method of a JRO object
            //pass Parameters array

            objJRO.GetType().InvokeMember("CompactDatabase",
            System.Reflection.BindingFlags.InvokeMethod,
            null,
            objJRO,
            oParams);

            //database is compacted now
            //to a new file C:\\tempdb.mdw
            //let's copy it over an old one and delete it

            System.IO.File.Delete(mdwfilename);
            System.IO.File.Move("C:\\tempdb.mdb", mdwfilename);
            //clean up (just in case)
            System.Runtime.InteropServices.Marshal.ReleaseComObject(objJRO);
            objJRO = null;
        } 

    }
}
