const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
    } 

    next(error)
}

const authExactor = (req,res,next)=>{
    // if(!req.session.name){
    //     return res.json({error:"You need to sign in"})
    // }
    next()
}

module.exports = {errorHandler,unknownEndpoint,authExactor}