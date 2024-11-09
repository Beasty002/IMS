const jwt = require("jsonwebtoken")

const login = async (req,res) => {

    try {
        const { username ,password } = req.body
        
        if(username === "ben dover" && password ==="no homo"){
        
            const token = jwt.sign(
                {
                    username : username,
                },
                process.env.JWT_SECRET_KEY,{
                    expiresIn : "30d",
                }
            );

            // Set cookie with token
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            });

            return res.status(200).json(token);


        }else{
            return res.status(401).json({msg: "Invalid Credentials"})
        }
        
    } catch (error) {
        res.status(500).json("Internal server error!!(login)")
        
    }
};

module.exports = { login }