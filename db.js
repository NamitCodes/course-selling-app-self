const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({

})

const CreatorSchema = new Schema({
    
})

const CourseSchema = new Schema({
    
})

const PurchaseSchema = new Schema({
    
})

// const myModel = mongoose.model('ModelName in database', mySchema)
const UserModel = mongoose.model("User", UserSchema);
const CreatorModel = mongoose.model("Creator", CreatorSchema);
const CourseModel = mongoose.model("Course", CourseSchema);
const PurchaseModel = mongoose.model("Purchase", PurchaseSchema);

module.exports = {
    UserModel: UserModel,
    CreatorModel: CreatorModel,
    CourseModel: CourseModel,
    PurchaseModel: PurchaseModel
}