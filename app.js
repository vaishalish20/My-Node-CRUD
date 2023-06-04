const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
// var request = require('request');
const app = express();
const port = 3000;
// parse JSON data sent in requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');


//create connection with sql
var mysqlConnection = mysql.createConnection({
  host:'localhost',
  user : 'root',
  password:'Student@2009',
  database:'db2',
  multipleStatements:true
});
//check if connecion is ok or not
mysqlConnection.connect((err) =>{
  if(!err)
  console.log('DB connected!');
  // mysqlConnection.query("select * from busschedule",function(error,result){
  //   if(error) console.log(error);
  //   console.log(result);
  // })
  else
  console.log('DB connection failed' + JSON.stringify(err,undefined,2));
});

app.get('/',function(req ,res){
  res.sendFile(__dirname + '/add.html');
})
app.post('/',function(req ,res){
    var bus_no = req.body.bus_no;
    var src = req.body.src;
    var arrival_time = req.body.arrival_time;
    var dest = req.body.dest;
    var mot = req.body.mot;

    mysqlConnection.connect(function(error){
      if(error)  console.log(error);

      // var sql = "insert into busschedule values('"+bus_no+"','"+src+"','"+arrival_time+"','"+dest+"','"+mot+"')";
      // var sql = "insert into busschedule values(?,?,?,?,?)";
      var sql = "insert into busschedule values ?";

      var values = [
        [bus_no,src,arrival_time,dest,mot]
    ];

      mysqlConnection.query(sql,[values],function(error,result){
        if(error) console.log(error)
        res.send("one more record added successfully");
      })
    })

})
app.get('/display',function(req ,res){
  mysqlConnection.connect(function(error){
    if(error)  console.log(error);

    var sql = "select * from busschedule";

    mysqlConnection.query(sql,function(error,result){
      if(error) console.log(error)
      // console.log(result);
      res.render(__dirname+'/timetable',{busschedule:result})
    })
  })
})

app.get('/delete-busschedule',function(req ,res){
  mysqlConnection.connect(function(error){
    if(error)  console.log(error);

    var sql = "delete from busschedule where Bus_No = ?";
    var Bus_no = req.query.Bus_no;

    mysqlConnection.query(sql,[Bus_no],function(error,result){
      if(error) console.log(error)
      // console.log(result);
      res.redirect('/display');
      // console.log(Bus_no);
     
    })
  })
})
app.get('/update-busschedule',function(req ,res){
  mysqlConnection.connect(function(error){
    if(error)  console.log(error);

    var sql = "select * from busschedule where Bus_no=?";
    var Bus_no = req.query.Bus_no;

    mysqlConnection.query(sql,[Bus_no],function(error,result){
      if(error) console.log(error)
      // console.log(result);
      res.render(__dirname+'/update',{busschedule:result});
      // console.log(result);
     
    })
  })
})

app.post('/update-busschedule',function(req ,res){

    var bus_no = req.body.bus_no;
    var src = req.body.src;
    var arrival_time = req.body.arrival_time;
    var dest = req.body.dest;
    var mot = req.body.mot;

  mysqlConnection.connect(function(error){
    if(error)  console.log(error);

    var sql = "update busschedule set Src=?,Arrival_time=?,Dest=?,MOT=? where Bus_no=?";
    

    mysqlConnection.query(sql,[src,arrival_time,dest,mot,bus_no],function(error,result){
      if(error) console.log(error)
      res.redirect('/display');
     
    })
  })
})
app.get('/search-bus',function(req,res){
  mysqlConnection.connect(function(error){
      if(error) console.log(error);

      var sql = "SELECT * FROM busschedule";

      mysqlConnection.query(sql, function(error, result){
          if(error) console.log(error)
          res.render(__dirname+'/search',{busschedule:result});
      });  
          
  });
})
app.get('/search',function(req,res){

    var bus_no = req.query.bus_no;
    var src = req.query.src;
    var arrival_time = req.query.arrival_time;
    var dest = req.query.dest;
    var mot = req.query.mot;


  mysqlConnection.connect(function(error){
    if(error)  console.log(error);

    var sql = "SELECT * FROM busschedule where Src LIKE '%"+src+"%' AND Dest LIKE  '%"+dest+"%' AND Arrival_time LIKE '%"+arrival_time+"%'AND MOT LIKE '%"+mot+"%' AND Bus_no LIKE  '%"+bus_no+"%' ";

    mysqlConnection.query(sql,function(error,result){
      if(error) console.log(error)
      res.render(__dirname+'/search',{busschedule:result});
    })
  })
})

// start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
