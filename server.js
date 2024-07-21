var express=require("express");
var fileuploader=require("express-fileupload")
var app=express();
var mysql=require("mysql2");
var nodemailer = require('nodemailer');
app.listen(2013,function(){
    console.log("server started successfully wooowww!!!!!!");
});
app.use(express.static("public"));
app.use(fileuploader());

app.use(express.urlencoded({ extended: true }));
app.get("/profile",function(req,resp){
  resp.sendFile(process.cwd()+"/public/profilepage.html");
});
app.get("/admindashboard",function(req,resp){
  resp.sendFile(process.cwd()+"/public/admin-dash.html")
})
var datacon={
  host:"127.0.0.1",
  user:"root",
  password:"adhm@TIET22",
  database:"PROFILE",
  dateStrings:true
}
var dbconn=mysql.createConnection(datacon);
dbconn.connect(function(err){
  if(err==null)
  console.log("connected successfully with db");
  else
  console.log(err);
})
 app.post("/profileform",function(req,resp){
   var filenames="nopic.jpg";
     if(req.files!=null)
     {filenames=req.files.npic.name;
    var path=process.cwd()+"/public/uploads/"+filenames;
     req.files.npic.mv(path);
     }
     var email=req.body.nemail;
     var contact=req.body.ncont;
    
     var name=req.body.nname;
     var address=req.body.naddr;
     var city=req.body.ncity;
     var gender=req.body.ngen;
     var idproof=req.body.nproof;
     var ftime=req.body.nfhr;
     var ttime=req.body.nthr;
     var availtime=ftime+"-"+ttime;
     
     dbconn.query("insert into donorprofile(emailid,nameofp,contnum,address,city,gender,idproof,filename,availhrs) values(?,?,?,?,?,?,?,?,?)",[email,name,contact,address,city,gender,idproof,filenames,availtime],function(err)
     {
           if(err==null)
            resp.send("Saved");
           else
             resp.send(err);
     })
 })
  
app.get("/chk-submit",function(req,resp){
      
    dbconn.query("insert into users(email,pwd,ttype,dos,stat) values(?,?,?,current_date(),1)",[req.query.kuchemail,req.query.kuchpwd,req.query.kuchtype],function(err){
      if(err==null){
        resp.send("Record Saved successfully")
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
      else{
        resp.send(err);
      }})
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'akankshagarg5298@gmail.com',
          pass: 'fodfcibilmgahtzz'
        }
      });
      
      var mailOptions = {
        from: 'akankshagarg5298@gmail.com',
        to: req.query.kuchemail,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };


})

// app.get("/profileupdatejson",function(req,resp){
//     dbconn.query("update profilecred set nameofp=?,contnum=?,address=?,city=?,gender=?,idproof=?,filename=? where emailid=?",[req.query.kuchname,req.query.kuchcont,req.query.kuchaddr,req.query.kuchcity,req.query.kuchgen,req.query.kuchproof,req.query.kuchfile,req.query.kuchemail],function(err,resultTableJSON)
//     {
//           if(err==null)
//             resp.send(resultTableJSON);
//               else
//             resp.send(err);
//     })
// })
app.get("/get-json-record",function(req,resp){
    dbconn.query("select * from donorprofile where emailid=?",[req.query.kuchmail],function(err,resultTableJSONdata)
    {
          if(err==null)
            resp.send(resultTableJSONdata);
              else
            resp.send(err);
    })
})
app.get("/chk-login",function(req,resp){
  dbconn.query("select * from users where email=? and pwd=? ",[req.query.loginmail,req.query.loginpwd],function(err,resultTableJSONval){
    if(err==null)
    {
        if(resultTableJSONval.length==1)
        {
            if(resultTableJSONval[0].stat==1)
            {
               resp.send(resultTableJSONval[0].ttype);
            }
            else 
            {
               resp.send("user blocked");
            }
           
        }
        else
        {
           resp.send("invalid email/pwd");
        }
    }
            
              else
            resp.send(err);
  })

})
app.get("/mail-chk",function(req,resp){
  dbconn.query("select stat from users where email=?",[req.query.passmail],function(err,resultmail){
    if(err==null)
    {
      if(resultmail.length==1)
      {resp.send("found")  }
          else
          resp.send("available")

    }
    else
    resp.send(err.toString());
  })
})
app.post("/profileupdate",function(req,resp){
  var filenames;
    if(req.files!=null)
    {filenames=req.files.npic.name;
   var path=process.cwd()+"/public/uploads"+filenames;
    req.files.npic.mv(path);
    }
    else
    {
     filenames=req.body.hdn1;
    }
    var email=req.body.nemail;
    var contact=req.body.ncont;
   
    var name=req.body.nname;
    var address=req.body.naddr;
    var city=req.body.ncity;
    var gender=req.body.ngen;
    var idproof=req.body.nproof;
    var ftime=req.body.nfhr;
    var ttime=req.body.nthr;
    var availtime=ftime+"-"+ttime;
   
    dbconn.query("update donorprofile set nameofp=?,contnum=?,address=?,city=?,gender=?,idproof=?,filename=?,availhrs=? where emailid=?",[name,contact,address,city,gender,idproof,filenames,availtime,email],function(err)
    {
          if(err==null)
            resp.send("Record updated Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
          else
            resp.send(err);
    })

})
 app.get("/availajax",function(req,resp){
  dbconn.query("insert into availmeds(email,medname,medexp,medqty,medpck) values(?,?,?,?,?)",[req.query.kuchmmail,req.query.kuchmname,req.query.kuchmexp,req.query.kuchmqty,req.query.kuchmpckt],function(err){
    if(err==null)
    resp.send("Record Saved");
    else
    resp.send(err);
  })
 })
 app.get("/changepass",function(req,resp){
  if(req.query.kuchsopwd!=req.query.kuchsnpwd){
     if(req.query.kuchsnpwd==req.query.kuchscpwd)
     {
        dbconn.query("update users set pwd=? where email=? and pwd=?",[req.query.kuchscpwd,req.query.kuchsmail,req.query.kuchsopwd],function(err,result){
          if(err==null)
          {
            if(result.affectedRows==1)
            resp.send("Updated successfully");
            else
            resp.send("Invalid email/password");
          }
          
          else
          resp.send(err);
        })
     }  
     else
     {
      resp.send("New password and confirm password does not match");
     }  
  }
  else
  resp.send("Old and New Password cannot be same");
 })
 app.post("/needyprofileform",function(req,resp){
  var picfilenames="nopic.jpg";
    if(req.files!=null)
    {picfilenames=req.files.nnpic.name;
   var path=process.cwd()+"/public/uploads/"+picfilenames;
    req.files.nnpic.mv(path);
    }
    var email=req.body.nnemail;
    var contact=req.body.nncont;
   
    var name=req.body.nnname;
    var address=req.body.nnaddr;
    var city=req.body.nncity;
    var gender=req.body.nngen;
    var dob=req.body.nndob;
    
    dbconn.query("insert into needyprofile(email,nameofn,contneedy,addressofn,cityn,gendern,dobn,nfilename) values(?,?,?,?,?,?,?,?)",[email,name,contact,address,city,gender,dob,picfilenames],function(err)
    {
          if(err==null)
            resp.send("Record Saved Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
          else
            resp.send(err);
    })
})
app.post("/updateneedy",function(req,resp){
  var picfilenames;
    if(req.files!=null)
    {filenames=req.files.nnpic.name;
   var path=process.cwd()+"/public/uploads"+picfilenames;
    req.files.nnpic.mv(path);
    }
    else
    {
     picfilenames=req.body.hdn2;
    }
    var email=req.body.nnemail;
    var contact=req.body.nncont;
   
    var name=req.body.nnname;
    var address=req.body.nnaddr;
    var city=req.body.nncity;
    var gender=req.body.nngen;
    var dob=req.body.nndob;
    
   
    dbconn.query("update needyprofile set nameofn=?,contneedy=?,addressofn=?,cityn=?,gendern=?,dobn=?,nfilename=? where email=?",[name,contact,address,city,gender,dob,picfilenames,email],function(err)
    {
          if(err==null)
            resp.send("Record updated Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
          else
            resp.send(err);
    })
  })
  app.get("/getneedy-json-record",function(req,resp){
    dbconn.query("select * from needyprofile where email=?",[req.query.needymail],function(err,resultTableJSONdata)
    {
          if(err==null)
            resp.send(resultTableJSONdata);
              else
            resp.send(err);
    })
})
app.get("/get-all-users-angular",function(req,resp){
  dbconn.query("select * from users ",function(err,resultTableJSONdata)
  {
        if(err==null)
          resp.send(resultTableJSONdata);
            else
          resp.send(err);
  })
})
app.get("/do-angular-block",function(req,resp)
{
     //saving data in table
    var email=req.query.kuchemail;
    

         //fixed                             //same seq. as in table
    dbconn.query("update users set stat=0 where email=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Blocked");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})
app.get("/do-angular-resume",function(req,resp)
{
    var email=req.query.kuchemail;
    dbconn.query("update users set stat=1 where email=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Resumed");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})
app.get("/get-all-donors-angular",function(req,resp){
  dbconn.query("select * from donorprofile ",function(err,resultTableJSONdata)
  {
        if(err==null)
          resp.send(resultTableJSONdata);
            else
          resp.send(err);
  })
})
app.get("/get-all-needys-angular",function(req,resp){
  dbconn.query("select * from needyprofile ",function(err,resultTableJSONdata)
  {
        if(err==null)
          resp.send(resultTableJSONdata);
            else
          resp.send(err);
  })
})
app.get("/get-angular-managemeds",function(req,resp){
  dbconn.query("select * from availmeds where email=?",[req.query.email],function(err,resultTableJSONdata)
  {
        if(err==null)
          resp.send(resultTableJSONdata);
            else
          resp.send(err);
  })
})
app.get("/get-angular-city",function(req,resp){
  dbconn.query("select distinct city from donorprofile ",function(err,resultTableJSONdata)
  {
        if(err==null)
          resp.send(resultTableJSONdata);
            else
          resp.send(err);
  })
})
app.get("/get-angular-med",function(req,resp){
  dbconn.query("select distinct medname from availmeds ",function(err,resultTableJSONdata)
  {
        if(err==null)
          resp.send(resultTableJSONdata);
            else
          resp.send(err);
  })
})
app.get("/do-angular-deletemed",function(req,resp){
  dbconn.query("delete from availmeds where srno=?",[req.query.srno],function(err,resultTableJSONdata)
  {
        if(err==null)
          resp.send(resultTableJSONdata);
            else
          resp.send(err);
  })
})
app.get("/get-innerjoin",function(req,resp){
  var med=req.query.namemed;
  var city=req.query.namecity;
  var query="select donorprofile.*,availmeds.medname from donorprofile inner join availmeds on donorprofile.emailid=availmeds.email where donorprofile.city=? and availmeds.medname=?"
  dbconn.query(query,[city,med],function(err,resultTableJSONdata)
  {
        if(err==null)
          resp.send(resultTableJSONdata);
            else
          resp.send(err);
  })
})