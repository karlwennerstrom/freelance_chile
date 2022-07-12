const express= require('express')
const mysql = require('mysql')
const { signed } = require('xpress/lib/string')
const cors = require('cors');

const app = express()
const bcrypt = require('bcrypt')


app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(cors())




var conexion;
//aveces el servidor se desconecta, por lo tanto hay que estar atento y renovar la conección cuando pase
function handleDisconnect() {

    //nos conectamos a la base de datos creada en heroku
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

app.set('view-engine','ejs')
app.use(express.urlencoded({extended:false}))

app.get('/',function(req,res){
    res.render('index.ejs',{name:'Karl'})
    res.send('Ruta Inicio');
})

app.get('/login',(req,res)=>{

    res.render('login.ejs')

})

app.get('/register',(req,res)=>{

    res.render('register.ejs')

})
app.get('/boletas',(req,res)=>{

    res.render('boletas.ejs')

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

app.post('/api/boletas/user/registro',async (req,res)=>{

    try{
        const hasehdPass = await bcrypt.hash(req.body.password,10)
        let data = {
            nombre_usuario:req.body.nombre_usuario,
            email:req.body.email,
            password:hasehdPass
        };
        let sql="INSERT INTO usuarios SET ?";
        conexion.query(sql,data,function(error,results){
            if(error){
                throw error;
            }else{
                res.send(results);
            }
        })

    }catch{
        throw error;
    }

})


//login en construcción
app.post('/api/boletas/login',(req,res)=>{
    // try{
    //     const hasehdPass = await bcrypt.compare()
    //     let data = {
    //         nombre_usuario:req.body.nombre_usuario,
    //         email:req.body.email,
    //         password:hasehdPass
    //     };
    //     let sql="INSERT INTO usuarios SET ?";
    //     conexion.query(sql,data,function(error,results){
    //         if(error){
    //             throw error;
    //         }else{
    //             res.send(results);
    //         }
    //     })

    // }catch{
    //     throw error;
    // }

})




const puerto = 3000;
app.listen(process.env.PORT || puerto,function(){

    console.log("Servidor Ok en puerto:"+puerto);

})