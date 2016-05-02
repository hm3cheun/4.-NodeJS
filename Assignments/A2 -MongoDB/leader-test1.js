var mongoose = require('mongoose'),
    assert = require('assert');

var Leaders = require('./models/leaders');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");

    // create a new dish
    Leaders.create({
        name: 'Peter Pan',
        image: 'images/alberto.png',
        designation: 'Chief Epicurious Officer',
        abbr: 'CEO',
        description: 'A unique . . .'
    }, function (err, leader) {
        if (err) throw err;
        console.log('Leader created!');
        console.log(leader);

        var id = leader._id;

        // get all the leaders
        setTimeout(function () {
            Leaders.findByIdAndUpdate(id, {
                    $set: {
                        description: 'Updated Test'
                    }
                }, {
                    new: true
                })
                .exec(function (err, leader) {
                    if (err) throw err;
                    console.log('Updated Leader!');
                    console.log(leader);



                    leader.save(function (err, leader) {
                        console.log('Updated Leader!');
                        console.log(leader);

                        db.collection('leaders').drop(function () {
                            db.close();
                        });
                    });
                });
        }, 3000);
    });
});
