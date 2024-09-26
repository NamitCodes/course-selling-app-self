const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId; // mongodb's way to generate random ids

const UserSchema = new Schema({
    email: {type: String, unique: true}, 
    password: String,
    firstName: String,
    lastName: String,
    purchasedCourses: [{
        type: ObjectId,
        ref: "Course",
        timestamp: Date,
        payment_ref: String
    }]
})

const CreatorSchema = new Schema({
    email: {type: String, unique: true}, 
    password: String,
    firstName: String,
    lastName: String,
    createdCourses: [{
        type: ObjectId,
        ref: "Course",
        created_timestamp: Date
    }]
})

const CourseSchema = new Schema({
    title: String,
    description: String,
    imageUrl: String,
    price: Number,
    lastUpdated: Date
})

// const PurchaseSchema = new Schema({
    
// })

// const myModel = mongoose.model('ModelName in database', mySchema)
const UserModel = mongoose.model("User", UserSchema);
const CreatorModel = mongoose.model("Creator", CreatorSchema);
const CourseModel = mongoose.model("Course", CourseSchema);
// const PurchaseModel = mongoose.model("Purchase", PurchaseSchema);

module.exports = {
    UserModel: UserModel,
    CreatorModel: CreatorModel,
    CourseModel: CourseModel,
    // PurchaseModel: PurchaseModel
}