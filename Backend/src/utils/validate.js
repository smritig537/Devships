const { error } = require('console');
const validator = require('validator');

validateSignupDate = (req) =>{
    const {name, email, password, about, age, gender} = req.body;

    if(!name || !email || !password  || !age || !gender){
        throw error('All the fields are required');
    }
    else if(!validator.isEmail(email)){
        throw error('Invalid Email');
    }
    console.log(req.body);

}
const validateProfileEditData = (req) => {
    const allowedEditFields = ["name", "about", "age", "gender"];
    const keys = Object.keys(req.body);

    if (keys.length === 0) {
        throw new Error("No fields provided");
    }

    const isUpdateAllowed = keys.every((k) => allowedEditFields.includes(k));

    if (!isUpdateAllowed) {
        throw new Error("Update not allowed");
    }
    return true;
};


module.exports = { validateSignupDate,validateProfileEditData};
