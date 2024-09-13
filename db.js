const mongoose = require('mongoose');

const connectDB=async()=>{
    // Connect to MongoDB
// const uri ="mongodb://localhost:27017/criminalDB";
const uri ="mongodb+srv://Dimpleusername:Dimple9@cluster0.l6frpvy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/criminalDB";


mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
}

module.exports=connectDB;