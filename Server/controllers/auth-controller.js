const jwt = require("jsonwebtoken")
// const cookieParser = require("cookie-parser")


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
        console.error("Error in authenticate:", err);
        res.status(500).json({ error: "Failed to authenticate" });        
    }
};

const checkToken = async (req,res) => {
    try{
        // console.log("token ",req.cookies)
        const {token} = req.cookies

        const isVerified = jwt.verify(token, process.env.JWT_SECRET_KEY)
        
        //find the user w/o password who is verified (token) using its email 

        if(isVerified){
            return res.status(200).json({status: true})
        }else{
            return res.status(200).json({status:false, msg:"Who tf r u!"})
        }

    }
    catch(err){
        console.error("Error in check token:", err);
        res.status(500).json({ error: "Failed to check token" });    }
}

module.exports = { login , checkToken}