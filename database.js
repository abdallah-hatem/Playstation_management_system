const { default: mongoose } = require('mongoose');

const uri = "mongodb+srv://abdallah:abdallah2020@nodeexpressprojects.wnuke.mongodb.net/cyber_management_system?retryWrites=true&w=majority";
mongoose.set('strictQuery', false)

async function dbConnect() {
    mongoose.connect(uri)
        .then(() => console.log("connected to db"))
        .catch((err) => console.log(err))
}


module.exports = { dbConnect }