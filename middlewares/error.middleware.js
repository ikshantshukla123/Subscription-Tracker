const errorMiddleware = (err,req,res,next)=>{
try{
 
    let error = {...err};

    error.message = err.message;


    console.error(err);

//mongoose bad objectId
if(err.name === 'CastError'){
    const message = 'Resource not found';
    error = new Error(message);
    error.statuseCode = 404;
}

//mongoose validatoion error;

if(err.name === 'ValidationError'){
    const message = Object.values(err.errors).map(val => val.message);
    error = new Error(message.join(','));
    error.statusCode = 400;
}

res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server error",
  });
  
}

catch(error)
{
    next(error);
}


}


export default  errorMiddleware;