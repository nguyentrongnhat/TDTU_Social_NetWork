const mongoose = require('mongoose');

async function connect() {

    try {
        await mongoose.connect('mongodb+srv://nhatnguyen:openmongodb652143@cluster0.ajp2w.mongodb.net/AdvanceWeb?retryWrites=true&w=majority', {
            useNameUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connect successfully!!!')
    } catch (error){
        console.log('Connect failure!!!')
    }
}

module.exports = { connect };