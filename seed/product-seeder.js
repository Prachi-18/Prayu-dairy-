
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Prachi:ModiShopping@modidairy.9hpcs.mongodb.net/modiDairy?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology:true});
var Product = require('../models/product');

var products = [
    new Product({
    imagePath: '/images/modiGhee.png',
    title: 'Modi\'s A2 Bilona Ghee' ,
    description: 'Light, golden, and Rich',
    price:'2300'
}) ,
  
new Product({
    imagePath: '/images/modiGhee.png',
    title: 'Modi\'s A2 Bilona Ghee' ,
    description: 'Light, golden, and Rich',
    price:'2300'
}), 

new Product({
    imagePath: '/images/modiGhee.png',
    title: 'Modi\'s A2 Bilona Ghee' ,
    description: 'Light, golden, and Rich',
    price:'2300'
}), 

new Product({
    imagePath: '/images/modiGhee.png',
    title: 'Modi\'s A2 Bilona Ghee' ,
    description: 'Light, golden, and Rich',
    price:'2300'
})
];

var finish = 0;
for(var i =0; i < products.length; i++){
    products[i].save(function(err,result){
        finish++;
        if(finish === products.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
} 

