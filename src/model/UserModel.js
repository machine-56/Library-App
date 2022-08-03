const mongoose = require('mongoose');
const uri ="mongodb+srv://admin:szebLWflCje95WAi@cluster.ibfzgkq.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log('data base connected  : User');  //------DB connection check
})
.catch(()=>{
    console.log('error : User');  //------DB connection error
})
const Schema = mongoose.Schema;

var NewUserSchema = new Schema({
    name: String,
    email: String,
    pwd: String
});

var Userdata = new mongoose.model('user', NewUserSchema);

module.exports = Userdata
