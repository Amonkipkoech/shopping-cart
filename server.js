const express = require('express')
const app = express()
const fs = require('fs')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/store', function( req, res){
     fs.readFile('item.json', function(error, data){
          if(error){
               res.status(500).end()
          } 
          else{
                    res.render('store.ejs',{
                         Items: JSON.parse(data)
                    })
          }
     })
})

app.listen(3000)    