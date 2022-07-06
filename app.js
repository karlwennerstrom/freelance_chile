var express= require('express');
var mysql = require('mysql');
const { signed } = require('xpress/lib/string');

var app = express();
app.use(express.json());




//Testing Conection
// conexion.connect(function(error){
//     if(error){
//         throw error;
//     }
//     else{
//         console.log("Conexión exitosa");
//     }
// })

var conexion;
function handleDisconnect() {

    conexion= mysql.createConnection({
        host:'us-cdbr-east-06.cleardb.net',
        user:'b39bb4d3711279',
        password:'e4124551',
        database:'heroku_e127056c9502aab'
    })

  conexion.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  conexion.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

app.get('/',function(req,res){
    res.send('Ruta Inicio');
})

// //obtener todas las boletas

app.get('/api/boletas',(req,res)=>{

    conexion.query('SELECT * FROM boletas', (error,filas)=>{

        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
 })
// process.on('uncaughtException', function(err) {
//     console.log(err);
//   });
// //crear boleta

app.post('/api/boletas',(req,res)=>{
    let data = {
        titulo:req.body.titulo,
        descripcion:req.body.descripcion,
        valor:req.body.valor
    };
    let sql="INSERT INTO boletas SET ?";
    conexion.query(sql,data,function(error,results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    })
});

app.get('/api/boletas/:id',(req,res)=>{

    conexion.query('SELECT * FROM boletas WHERE id=?',[req.params.id], (error,fila)=>{

        if(error){
            throw error;
        }else{
            res.send(fila);
        }

    })

})

const puerto = 3000;
app.listen(process.env.PORT || puerto,function(){

    console.log("Servidor Ok en puerto:"+puerto);

})