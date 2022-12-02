const express = require("express");
const db = require("../database/database");
const {getVisits, getDownloads, getGraphA, getGraphB, getGraphC, getGraphD, getAllPageViewed} = require("../Analytics/querys")
const router = express.Router();
const async = require('async')
const {ftpConnect, c} = require('../FTP/ftp');
const { games } = require("googleapis/build/src/apis/games");


/////////////////////////////////////   Index Dashboard
router.get("/", function (req, res, next) {
  let query1 = "SELECT count(*) AS pedidosCount FROM pedidos;";
  let query2 = "SELECT count(*) AS juegos FROM juegos;";
  let query3 = "SELECT count(*) AS ultimo FROM `juegos` WHERE MONTH(date) = MONTH(CURRENT_DATE);";
  let Pathing = req.path.replace(/\//g, "_");

  function runInParallel() {
    async.parallel([
      getVisits,
      getGraphA,
      getGraphB,
      getGraphC,
      getGraphD,
      getDownloads,
      getAllPageViewed,
    ], function(err, results) {
      //This callback runs when all the functions complete
      if(err) throw err;
      
      db.query(query1+ query2 + query3, function (err, resultados){
        res.render("home",{
        count: resultados[0],
        juegos: resultados[1],
        ultimoJuego: resultados[2],
        total_visitas: results[0], 
        row2: results[1], 
        row3: results[2], 
        row4: results[3],
        row5: results[4],
        downloads: results[5],
        visits: results[6], 
        page_active: Pathing
        })
       })
    });
  }
  runInParallel()
});

/////////////////////////////////////   Mensajes
router.get("/mensajes", function (req, res, next) {
  let Pathing = req.path.replace(/\//g, "_");
  var sql = "SELECT id, SUBSTRING(ped, 1,200) AS ped FROM pedidos LIMIT 5";
  db.query(sql, function (err, data) {
    if (err) throw err;
    res.render("mensajes", { data: data, page_active: Pathing });
    next();
  });
});

router.get("/mensajes/delete/:id", (req, res) => {
  console.log(req.params);
  db.query("DELETE FROM pedidos WHERE id = ?", [req.params.id], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows) {
      res.redirect("/mensajes");
    }
  });
});

/////////////////////////////////////   Juegos
router.get("/games", function (req, res, next) {
  let Pathing = req.path.replace(/\//g, "_");
  const order = req.query.order;
  const query1 = `SELECT * from juegos ORDER BY id ${order ? order: 'DESC'} LIMIT 10;`
  const query2 = "SELECT count(*) AS juegos FROM juegos;"
  db.query(query1  + query2   , function (err, rows) {
    if (err) throw err;
    res.render("games", { data: rows[0], conteo: rows[1], page_active: Pathing });
    next();
  });
});

router.get("/games/delete/:titulo", function (req, res, next){
  query1 = `DELETE FROM juegos WHERE titulo = '${req.params.titulo}';`
  query2 = `DELETE FROM content WHERE title_content = '${req.params.titulo}';`
  query3 = `DELETE FROM info WHERE title_info = '${req.params.titulo}';`
  db.query( query1 + query2 + query3, (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows) {
      res.redirect("/games");
    }
  });
} )

router.get("/games/add", function (req, res, next) {
  let Pathing = req.path.replace(/\//g, "_");
  res.render("addGame", { page_active: Pathing });
});

router.post("/game/publish", function(req,res,next){
  const img = req.body.image
  const query = "INSERT INTO `content`(`id`,`title_content`, `gameplay`, `link1`, `link2`, `link3`) VALUES ('','"+req.body.tittle+"','"+req.body.gameplay+"', '"+req.body.link1+"', '"+req.body.link2+"', '"+req.body.link3+"');";
  const query2 = "INSERT INTO `info`(`id`,`title_info`,`descripcion`,`req`, `instrucciones`)  VALUES  ('', '"+req.body.tittle+"','"+req.body.desc+"','"+req.body.requisitos+"','"+req.body.inst+"');";
  db.query(query + query2  , function(err, results){
    if(err) throw err;
    const query3 = "INSERT INTO `juegos` (`id`, `id_info`, `id_content`, `titulo`, `img`, `genero1`, `genero2`, `genero3`, `date`) VALUES ('','"+results[1].insertId+",'"+results[0].insertId+"','"+req.body.tittle+"','img/"+req.body.image+"','"+req.body.genre1+"','"+req.body.genre2+"','"+req.body.genre3+"', CURRENT_DATE)";
    const query4 = `INSERT INTO juegos (id, id_info, id_content, titulo, img, genero1, genero2, genero3, date ) VALUES ('', '${results[1].insertId}', '${results[0].insertId}', '${req.body.tittle}', 'img/${req.body.image}', '${req.body.genre1}',  '${req.body.genre2}',  '${req.body.genre3}', CURRENT_DATE )`
    db.query(query4, function(err){
      if(err) throw err;
        const upload = `./FTP/img/${img ? img:'foo.txt'}`
        const dir =  `/domains/ajuegados.com/public_html/img/${img ? img:'foo.txt'}`
        c.on('ready', function() {
          c.put(upload, dir, function(err) {
          if (err) throw err;
          c.end();
          });
       })
    ftpConnect()
    res.redirect("/games")
    }) 
    })
})


router.get("/games/edit/:id", function (req, res) {
let Pathing = req.path.replace(/\//g, "_");
const query = "SELECT j.id, j.titulo, j.img, j.genero1, j.genero2, j.genero3, inf.descripcion, inf.req, inf.instrucciones,cont.gameplay, cont.link1, cont.link2, cont.link3 FROM juegos j INNER JOIN info inf ON j.id_info = inf.id INNER JOIN content cont ON  j.id_content = cont.id WHERE j.id = ?"
db.query(query, [req.params.id], function(err, result){
if (err) throw err;
res.render('editGame', {page_active: Pathing, query:result[0]})
})

})

router.post('/games/edit/:id', function(req,res){
 const id = req.params.id 
 const placeholder = req.body.image
 const titulo = req.body.tittle, gameplay = req.body.gameplay , img  = 'img/'+placeholder, genero1 = req.body.genre1, genero2 = req.body.genre2, genero3 = req.body.genre3, descripcion = req.body.desc, requisitos = req.body.requisitos, instrucciones = req.body.inst, link1 = req.body.link1, link2 = req.body.link2, link3 = req.body.link3
 console.log(placeholder)
 if(placeholder){
  const query = `UPDATE juegos, info, content SET juegos.titulo = '${titulo ? titulo:'test'}', juegos.img = '${img}', juegos.genero1 = '${genero1}', juegos.genero2 = '${genero2}', juegos.genero3 = '${genero3}', info.descripcion = '${descripcion}', info.req = '${requisitos}', info.instrucciones = '${instrucciones}',content.gameplay = '${gameplay}', content.link1 = '${link1}', content.link2 = '${link2}', content.link3 = '${link3}' WHERE juegos.id = ${id} AND info.id =${id} AND content.id = ${id};`
  db.query(query , function(err, rows){
    if (err) throw err;
      const upload = `./FTP/${img ? img:'foo.txt'}`
      const dir =  `/domains/ajuegados.com/public_html/${img ? img:'foo.txt'}`
      c.on('ready', function() {
        c.put(upload, dir, function(err) {
        if (err) throw err;
        c.end();
        });
     })
     ftpConnect()
     res.redirect('/games')
   })
}else{
  const query = `UPDATE juegos, info, content SET juegos.titulo = '${titulo ? titulo:'test'}', juegos.genero1 = '${genero1}', juegos.genero2 = '${genero2}', juegos.genero3 = '${genero3}', info.descripcion = '${descripcion}', info.req = '${requisitos}', info.instrucciones = '${instrucciones}',content.gameplay = '${gameplay}', content.link1 = '${link1}', content.link2 = '${link2}', content.link3 = '${link3}' WHERE juegos.id = ${id} AND info.id =${id} AND content.id = ${id};`
  db.query(query , function(err, rows){
    if (err) throw err;
    console.log("No se subieron imagenes.")
    console.log(query)
     res.redirect('/games')
   })
}

})

router.get("/test", async (req, res, next) => {
  let months=["January","February","March","April","June", "July", "August", "September", "October", "November", "December"];
  let currentMonth=new Date().getMonth()+1
  let meses = months.slice(currentMonth-4).concat(months.slice(0,currentMonth))
  let finish = meses.slice(0,4)
 console.log(currentMonth)
  res.send(finish)
});


module.exports = router;
