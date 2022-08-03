const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Bookdata = require('./src/model/BookModel');
const Userdata = require('./src/model/UserModel');

const PORT = process.env.PORT || 5465;
const app = new express;
const path = require('path');

app.use(express.static('./dist/frontend'));


app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json())

username='test@mail.com';
password='12345678';


function verifyToken(req, res, next){
    // console.log(`verifyToken fn:  ${req.headers.authorization.split(' ')[1]}`)
    if(!req.headers.authorization){
        return res.status(401).send()
    }
    let token=req.headers.authorization.split(' ')[1]
    if(token=='null'){
        return res.status(401).send()
    }
    let payload=jwt.verify(token,'secrectkey')
    console.log(payload)
    if(!payload){
        return res.status(401).send()
    }
    req.userId=payload.subject
    console.log(`req.userId : ${req.userId}`)
    next()
}

// Login
app.post('/api/login', (req,res)=>{
    // console.log('backend/login:')  //------
    let user = req.body;
    var flag=false;
    Userdata.find().then((newt)=>{
        for(let i=0;i<newt.length;i++){
            // console.log(`testing: ${newt[i].email} / ${newt[i].pwd} - ${user.email} / ${user.pwd}`);
            if(newt[i].email==user.email && newt[i].pwd==user.pwd){
                // console.log('user found')   //----
                flag=true;
                break;
            }else if(i==newt.length-1){
                // console.log('user not found');   //----
                flag=false;
            }
        }
        // console.log('--------------')   //----
        // console.log('end of for loop')  //----
        if(flag!=false){
            // console.log('flag true');    //----
            let payload = {subject: user.email+user.pwd}
            let token = jwt.sign(payload,'secrectkey')
            res.status(200).send({token});
        }else{
            // console.log('flag false');    //----
            res.status(404).send('User name not found')
        }
        
    })
})

// signup
app.post('/api/signup', (req,res)=>{
    // console.log('backend/signup :');    //------
    var newUser={
        name:req.body.name,
        email:req.body.email,
        pwd:req.body.pwd
    }
    console.log(newUser)  ;
    const user = new Userdata(newUser);
    user.save();
    res.status(200).send()
})

// Books page 
app.get('/api/view', (req,res)=>{
    Bookdata.find().sort({title:1})
    .then((books) => {
        res.status(200).send(books);
    })
})

// Single Book view
app.get('/api/:id',  (req, res) => {
    const id = req.params.id;
    Bookdata.findOne({"_id":id})
    .then((product)=>{
        res.send(product);
    });
})

// Update book
app.put("/api/updateBook", (req, res) => {
    // console.log(req.body);
    (id = req.body._id),
      (title = req.body.title),
      (author = req.body.author),
      (image = req.body.image),
      (about = req.body.about),
      Bookdata
        .findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              title: title,
              author: author,
              image: image,
              about: about,
            },
          }
        )
        .then(function () {
          res.send();
        });
  });

//  Delete Book
app.delete('/api/deleteBook/:id',verifyToken, (req,res)=>{
    id = req.params.id;
    console.log(`backend : ${id}`)
    Bookdata.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log(`${id} deleted`)
        res.send();
    })
})

// Add new book
app.post('/api/addbook',verifyToken, (req,res)=>{
    var newBook={
        title:req.body.title,
        author:req.body.author,
        image:req.body.image,
        about:req.body.about
    }
    console.log(newBook)  ;
    const book = new Bookdata(newBook);
    book.save();
    res.status(200).send()
})

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/frontend/index.html'))
});

app.listen(PORT, function () {
  console.log(`listening to port ${PORT}`);
});