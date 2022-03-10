const jwt = require("jsonwebtoken");

module.exports=(req,res,next)=>{
  console.log("uso")
  try{
    const token=req.headers.authorization.split(" ")[1];

    jwt.verify(token,"token");
    next();
  }catch(err){
    res.status(401).send("Nemate prava pristupa!");
  }
}
