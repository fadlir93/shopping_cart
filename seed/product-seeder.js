var Product = require('../models/product');

var mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/shopping", { useNewUrlParser: true });

var products = [
    new Product({
        imagePath:'https://upload.wikimedia.org/wikipedia/en/5/57/Naruto_Shippuden_UNS_3_box_art.png',
        title: 'Naruto Shippuden UNS 3',
        description: 'This is a good game',
        price: 150000
}),
    new Product({
        imagePath:'https://upload.wikimedia.org/wikipedia/en/5/5e/FFX-X-2_HD_Remaster_NA_Cover.png',
        title: 'Final Fantasy X-2',
        description: 'This is a best game adventure',
        price: 280000
    }),
    new Product({
        imagePath:'https://upload.wikimedia.org/wikipedia/en/6/6e/Demon_Gaze_video_game_cover.png',
        title: 'Demon Gaze ',
        description: 'Game Evil',
        price: 350000
    }),
    new Product({
        imagePath:'https://upload.wikimedia.org/wikipedia/en/0/0e/GravityRushPSVitaCover.png',
        title: 'Gravity Rush',
        description: 'The best Game 2017',
        price: 400000
    }),
    new Product({
        imagePath:'https://upload.wikimedia.org/wikipedia/en/b/bc/KZMercenaries.jpg',
        title: 'Killzone Mercenary',
        description: 'Game FPS with the enemy is zombie',
        price: 260000
    }),
    new Product({
        imagePath:'https://upload.wikimedia.org/wikipedia/en/a/a0/J_Stars_Victory_VS.jpg',
        title: 'J Stars Victory ',
        description: 'Battle All The Best Anime',
        price: 500000
    })
]


var done = 0;
for (var i = 0; i < products.length; i++){
    products[i].save(function(err, result){
        done++;
        if (done === products.length){
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}