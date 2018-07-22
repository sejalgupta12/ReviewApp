var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

  var blogSchema = new Schema({
  
   username:{type:String,require:true},
   email:{type:String,require:true},
   password:{type:String,require:true},
   creation_dt:{type:Date,require:true}
  });

  schema.statics.hashPassword=function hashPassword(password)
  {
      return bcrypt.hashSync(password,10);
  }

  schema.methods.isValid = function(hashedPassword)
  {
      return bcrypt.compareSync(hashedPassword,this.password);
  }

    module.exports=mongoose.model('User',schema);