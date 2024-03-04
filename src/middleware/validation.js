
const createError = require('http-errors');

module.exports = async (req, res, next) => {
    if (req && req.headers) {
        const token = req.headers.token;
        console.log("token:",token);

        if (token) {
            try {
                if (process.env.TOKEN === token) {
                    next();
                } else { 
                    console.log('token1:', token);
                    console.log('token2:', process.env.TOKEN)
                    return res.status(401).json({
                    message: "auth failed1"
                });
                }
            } catch (error) {
                return res.status(401).json({
                    message: "auth failed2"
                });
            }
        } else {
            return next(createError(401));
        }
    } else {
        return next(createError(401));
    }

}