 if (document.readyState == "loading"){
    document.addEventListener('DOMContentLoaded', ready)
 }
 else {
    ready()
 }
  function ready(){
    let removeCartItemsButton = document.getElementsByClassName('cart-quantity-btn')
    console.log(removeCartItemsButton)
    for (let i=0; i<removeCartItemsButton.length; i++){
        let button = removeCartItemsButton[i]
         button.addEventListener('click', removeCartItem)  
   
       }

    let quantityInputs = document.getElementsByClassName('cart-quantity-input') 
    for (let i=0; i<quantityInputs.length; i++){
        let input = quantityInputs[i]
         input.addEventListener('change', quantityChange)    
       }
       
    let addToCartButtons=  document.getElementsByClassName('shop-item-btn');
   
     for (let i=0; i<addToCartButtons.length; i++)  {
         let AddButton = addToCartButtons[i]
         AddButton.addEventListener('click', addToCartClicked)
     } 

     document.getElementsByClassName('btn-purchase')[0].addEventListener('click',purchaseclicked)
  }
    let stripeHandler = StripeCheckout.configure({
        key: stripePublicKey,
        locale: 'en',
        token: function(token){
               let items = [] 
               let  cartItemContainer =  document.getElementsByClassName('cart-items') [0] 
               let  cartRows = cartItemContainer.getElementsByClassName('cart-row')
 
               for  ( let i =0;  i<cartRows.length; i++ ){
                         let cartRow = cartRows[i]
                         let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')
                         let quantity =quantityElement.value
                         let id = cartRow.dataset.itemid 

                         items.push({
                           id: id,
                           quantity : quantity
                         })
               }
               fetch('/purchase',{
                   method : 'POST',
                   headers: {
                     'content-Type': 'application/json',
                     'Accept': 'application/json'
                   },
                   body: JSON.stringify({
                    stripeTokenId : token.id,
                    items : items
                   })
               }) .then(function(res){
                     return res.json()
               }) .then(function(data){
                      alert(data.message)
                      let cartItemsList = document.getElementsByClassName('cart-items')[0]
                        while (cartItemsList.hasChildNodes()){
                                      cartItemsList.removeChild(cartItemsList.firstChild)
                                  }
                             updateCartTotal()
                          }).catch(function(error){
                              console.error(error)
                          })           
               
        }
     })
     
    function purchaseclicked(){
         // alert('Thank you for your purchase')
         
         var priceElement = document.getElementsByClassName('cart-total-price')[0] 
         var  price = parseFloat (priceElement.innerText.replace('ksh','')) * 100
          
         stripeHandler.open({
             amount: price
         })
    }
 
    
  function addToCartClicked (event) {
            let AddButton = event.target
            
            let shopitem = AddButton.parentElement.parentElement
            console.log(shopitem)
            let title =  shopitem.getElementsByClassName('shop-item-title')[0].innerText
            let price =  shopitem.getElementsByClassName('shop-item-price')[0].innerText
            let imagesrc = shopitem.getElementsByClassName('shop-item-img')[0].src 
            let  id =  shopitem.dataset.itemid
            console.log(title,price,imagesrc,id)
            
              addItemToCart(title,price,imagesrc)
              
        }
  function addItemToCart(title,price,imagesrc,id){
                let cartRows = document.createElement ( 'div')
                cartRows.classList.add('cart-row')
                cartRows.dataset.itemid = id 
                let  cartItems = document.getElementsByClassName('cart-items')[0]
               
                let cartItemNames = cartItems.getElementsByClassName('cart-item-title')
                console.log(cartItemNames)  
                for ( let i=0; i<cartItemNames.length ; i++){
                   if (cartItemNames[i].innerText == title){ 
                   alert (' This item is already added to the cart just adjust the quantity    ') 
                   return                                   
                 }
           }    
                let cartRowContent =` <div class="cart-column cart-item" >
                <img  class="cart-item-img" src="${imagesrc}" alt="">
                <span class="cart-item-title" > ${title}</span>
              </div>
              <span  class="cart-price cart-column"   >${price}</span>
              <div class="cart-column cart-quantity"  >
                  <input class="cart-quantity-input"  type="number" value="1">
                  <button class="btn btn-danger cart-quantity-btn"   type="role"> REMOVE </button>
              </div> `       
                                                
                cartRows.innerHTML = cartRowContent
                cartItems.append(cartRows)

                cartRows.getElementsByClassName ('btn-danger')[0].addEventListener('click',removeCartItem)
                updateCartTotal() 
                cartRows.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChange)    
     }  


  function removeCartItem( event){
     let buttonClicked = event.target
     console.log(buttonClicked)
     buttonClicked.parentElement.parentElement.remove()
     updateCartTotal()      
     }


  function quantityChange(event){
    let input =  event.target
     if (isNaN(input.value) || input.value <= 0)
              {
                input.value = 1
              }
      updateCartTotal()         
  }


  function updateCartTotal(){
      let cartItems = document.getElementsByClassName('cart-items')[0]
       let cartrows = cartItems.getElementsByClassName('cart-row')
      var  total= 0; 
       for (let i=0; i<cartrows.length; i++) {
            let cartrow =  cartrows[i]
            let priceElement= cartrow.getElementsByClassName('cart-price')[0]
             let quantityElement = cartrow.getElementsByClassName('cart-quantity-input')[0]                                 
             
          let price = parseFloat(priceElement.innerText.replace('ksh' , '')) 
          console.log(price) 
          let  quantity =  quantityElement.value
          console.log(quantity)
          var total = total + (price * quantity)
            console.log(total)              
         } 
          total = Math.round(total * 100)/100
         
         document.getElementsByClassName('cart-total-price')[0].innerText = 'Ksh  ' + total
}
    
