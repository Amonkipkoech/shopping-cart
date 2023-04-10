const express = require('express')
const app = express()
const fs = require('fs')
const stripe = require ('stripe')(stripeSecretKey)

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())


app.get('/store', function( req, res){
     fs.readFile('item.json', function(error, data){
          if(error){
               res.status(500).end()
          } 
          else{
                    res.render('store.ejs',{
                         stripePublicKey : stripePublicKey,
                         Items: JSON.parse(data)                         
                    })
          }
     })
})

app.post('/purchase', function( req, res){
     fs.readFile('item.json', function(error, data){
          if(error){
               res.status(500).end()
          } 
          else{
                //console.log('purchase') 
              const  itemsJson=   JSON.parse(data)
              const  itemsArray = itemsJson.music.concat(itemsJson.MERCH)  
              let total = 0
              req.body.items.forEach(function(item){
               const itemJson = itemsArray.find(function(i){
                    return i.id == item.id
               })
               total = total + itemJson.price * item.quantity
              })  
              stripe.charges.create({
                 amount: total,
                 source : req.body.stripeTokenId,
                 currency : 'usd'

              }).then(function(){
                     console.log('charge succesful')
                     res.json({message:'Successfully purchased items'}).catch(function(){
                         console.log('Charge Fail')
                         res.status(500).end()
                     })
              })       
          } 
     })
})

app.listen(3000) 
   