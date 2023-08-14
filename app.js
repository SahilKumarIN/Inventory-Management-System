const mongoose = require("mongoose")
const express = require("express")
const bodyParser = require("body-parser")

mongoose.connect("mongodb://127.0.0.1:27017/UserDB");

const app = express();

const itemSchema = mongoose.Schema({
    itemSlug: String,
    itemQty: Number,
    itemPrice: Number
});

const Item = mongoose.model("Item", itemSchema);

const userMessageSchema = mongoose.Schema({
    userName: String,
    userEmail: String,
    userMessage: String
});
const UserMessage = mongoose.model('UserMessage' , userMessageSchema);

const UserSchema = mongoose.Schema({
    userName : {
        type: String,
        required: true
    },
    businessName : {
        type: String,
        required: true
    },
    userEmail: String , 
    userPass: String,
    isAdmin: Boolean,
    items: [itemSchema]
});


const User = mongoose.model("User" , UserSchema);





app.set("view engine" , "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

var userLogin = 0;


app.get("/",(req,res)=>{
    if (userLogin === 0) {
        res.redirect("/login")
    } else {
         User.findOne({userEmail: emailUser})
            .then(foundUser=>{
                UserData = foundUser;
                // console.log(UserData.items[0]._id)
                res.render("home",{userLogin: JSON.stringify(userLogin)});
            })            
        // res.render("home",{userLogin: JSON.stringify(userLogin)});
    }
    
});

app.get("/login",(req,res)=>{
    res.render("login",{userLogin: JSON.stringify(userLogin)});
});

app.get("/signup",(req,res)=>{
    res.render("signup",{userLogin: JSON.stringify(userLogin)});
});

app.get("/add-inventory",(req,res)=>{
    if(userLogin === 0){
        res.redirect("/login");
    }else{
    res.render("add-inventory",{userLogin: JSON.stringify(userLogin)});
    }
})

// app.get("/update" , (req,res)=>{
//     if(userLogin === 0){
//         res.redirect("/");
//     }else{
//         res.render("update" , {userLogin: JSON.stringify(userLogin)});

//     }
// });

app.get("/contact_us" , (req,res)=>{
    if(userLogin === 0 ){
        res.redirect("/login");
    }else{
    res.render("contact_us" , {userLogin: JSON.stringify(userLogin)});
    }
})

app.get("/logout",(req,res)=>{
    userLogin = 0;
    res.redirect("/");
})
var emailUser = ""
app.post("/login",(req,res)=>{
    const userEmail = req.body.email;
    const password = req.body.password;

    User.findOne({userEmail: userEmail})
        .then(foundUser=>{
            if(foundUser.userPass === password) {
                res.redirect("/" );
                // UserData = foundUser ;
                emailUser = foundUser.userEmail;
                
                // console.log(foundUer.isAdmin)
                userLogin = 1;
            }else{
                res.send("Wrong Password!!!")
                // message = "Wrong Password!!!"
                // res.render("login", {message : message , userLogin: JSON.stringify(userLogin)});
            }
        })
        .catch(err=>{
            res.send("Wrong Credentials!!!")
            // message = 'Wrong Credentials!!!'
            // res.render("login", {message: message , userLogin: JSON.stringify(userLogin)});
        })
});
foundMessage = ""
app.get("/messages" , (req,res)=>{
    if(userLogin === 0){
        res.redirect("/login");
    }else{

    UserMessage.find()
        .then(foundMessages=>{
            foundMessage = foundMessages
            // console.log(foundMessages);
            res.render("messages" , {userLogin: JSON.stringify(userLogin)} );
        });
    }
});

app.post("/signup", (req,res)=>{
    const user = new User({
        userName: req.body.name,
        businessName: req.body.businessName,
        userEmail: req.body.email,
        userPass: req.body.password,
        isAdmin: false
    });
    user.save();
    res.redirect("/");
})

app.post("/add-inventory" , (req,res)=>{
    const item = new Item({
        itemSlug : req.body.itemslug ,
        itemQty : req.body.itemqty ,
        itemPrice : req.body.itemprice 
    });
    User.findOneAndUpdate({userEmail: emailUser}, {$addToSet: {items: item}})
        .then(()=>{
            // console.log('Success');
            // res.render("home" , {userLogin: JSON.stringify(userLogin)});
            res.redirect("/");
        })
        .catch((err)=>{
            console.log(err);
        })
})

app.post("/contact_us" , (req,res)=>{
    const userMessages = new UserMessage({
        userName : req.body.userName,
        userEmail: req.body.userEmail,
        userMessage: req.body.userMessage
    });
    userMessages.save();
    res.redirect("/");
});

app.post('/delete' , (req,res)=>{
    // console.log(req.body.delBtn);
    User.findOneAndUpdate({userEmail: emailUser} , {$pull: {items: {_id: req.body.delBtn}}})
        .then(( 
            res.redirect("/")
        ))
        .catch(err=>{
            console.log(err);
        })
});

app.post("/deleteMsg" , (req,res)=>{
    UserMessage.findOneAndDelete({_id: req.body.delMsg})
    .then(()=>{
        res.redirect("/messages");
    })

});

// app.post("/update" , (req,res)=>{
//     User.items.findOne({_id: req.body.updateBtn} )
//         .then(foundItem=>{
//             console.log(foundItem);
//         })
// })


app.listen(3000 , ()=>{
    console.log("Server started");
    
})