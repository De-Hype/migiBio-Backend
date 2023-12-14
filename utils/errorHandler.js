import AppError from "./AppError.js";


const handleCastErrorDB =err=>{
    const message = `Invalid ${err.path} : ${err.value}.`;
    return new AppError(message, 400);
}

const handleExpiredKey =err=>{
    return new AppError('Request to ChatGpt failed due to expired key', 429)
}
const handleNoAiConnection = err=>{
    console.log(err.code)
    return new AppError("Error connecting to OpenAi's ChatGPT", 503)
}

const SendErrorDev = (err, req, res)=>{
    return res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message:err.message,
        stack:err.stack,
    });
}

const SendErrorProd =(err, req, res)=>{
    if (err.isOperational){
        return res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        });
    }
    return res.status(500).json({
        status:'error',
        message:'something went very wrong',
    });
}

export default  (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    console.log(process.env.NODE_ENV)
    // console.log('Error wahala')
    if (process.env.NODE_ENV === 'development'){
        SendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production'){
        let error = {...err};
        error.message = err.message;
        console.log('error')
        if (error.status == 429)error = handleExpiredKey(error);
        if (error.code === 'ENOTFOUND') error=  handleNoAiConnection(error)
        //We will handle different errors here tho
        SendErrorProd(error, req, res);
    } 
    else{
        return res.status(200).json({
            status:'error',
            message:'We are neither in dev nor in production',
        });
    }
}