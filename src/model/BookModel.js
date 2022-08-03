const mongoose = require('mongoose');
const uri ="mongodb+srv://admin:szebLWflCje95WAi@cluster.ibfzgkq.mongodb.net/test";
mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log('data base connected   : Books');  //------DB connection check
})
.catch(()=>{
    console.log('error  : Books');  //------DB connection error
})
const Schema = mongoose.Schema;

var NewBookSchema = new Schema({
    title : String,
    image : String,
    author : String,
    about : String,
});

var Bookdata = new mongoose.model('book', NewBookSchema);

module.exports = Bookdata;