const mongoose = require('mongoose')

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://mydb:Vietnam123456@cluster0.qvyai.mongodb.net/mydb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        })
        console.log('Connect DB successfully')
    } catch (error) {
        console.log('Connect failure')
    }
}

module.exports = {connect}
