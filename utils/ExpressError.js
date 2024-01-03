class ExpressError extends Error{
    constructor(messeage,statusCode)
    {
        super();
        this.message=messeage;
        this.statusCode=statusCode;
    }
}

module.exports= ExpressError;