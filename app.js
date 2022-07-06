var express= require('express');
var mysql = require('mysql');
const { signed } = require('xpress/lib/string');

var app = express();
app.use(express.json());

var conexion= mysql.createConnection({
    host:'us-cdbr-east-06.cleardb.net',
    user:'b39bb4d3711279',
    password:'e4124551',
    database:'heroku_e127056c9502aab'
})


//Testing Conection
conexion.connect(function(error){

    if(error){
        throw error;
    }
    else{
        console.log("Conexión exitosa");
    }
})


app.get('/',function(req,res){
    res.send('Ruta Inicio');
})

// //obtener todas las boletas

// app.get('/api/boletas',(req,res)=>{

//     conexion.query('SELECT * FROM boletas', (error,filas)=>{

//         if(error){
//             throw error;
//         }else{
//             res.send(filas);
//         }

//     })

// })
// process.on('uncaughtException', function(err) {
//     console.log(err);
//   });
// //crear boleta

// app.post('/api/boletas',(req,res)=>{
//     let data = {
//         titulo:req.body.titulo,
//         descripcion:req.body.descripcion,
//         valor:req.body.valor
//     };
//     let sql="INSERT INTO boletas SET ?";
//     conexion.query(sql,data,function(error,results){
//         if(error){
//             throw error;
//         }else{
//             res.send(results);
//         }
//     })

// });

// app.get('/api/boletas/:id',(req,res)=>{

//     conexion.query('SELECT * FROM boletas WHERE id=?',[req.params.id], (error,fila)=>{

//         if(error){
//             throw error;
//         }else{
//             res.send(fila);
//         }

//     })

// })

const puerto = 3000;
app.listen(process.env.PORT || puerto,function(){

    console.log("Servidor Ok en puerto:"+puerto);

})