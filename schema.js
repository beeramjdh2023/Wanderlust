const Joi = require("joi");

const listingSchema=Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),
        location:Joi.string().required(),
        country:Joi.string().required(),
    })
})

const reviewSchema=Joi.object({
    review:Joi.object({
        review:Joi.number().min(1).max(5).required(),
        comment:Joi.string().required(),
    }).required(),
}).required();

const obj={
    reviewSchema:reviewSchema,
    listingSchema:listingSchema,
}
module.exports=obj;