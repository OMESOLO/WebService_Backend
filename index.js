import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import productRoute from "./routes/productRoute.js"
import memberRoute from "./routes/memberRoute.js"
import cartRoute from "./routes/cartRoute.js"
import cors from "cors"

dotenv.config()

const app=express()
const port=process.env.PORT

app.use(bodyParser.json())
app.use(cors({
    origin:['http://localhost:5173','http://127.0.0.1:5173'], //Domain ของ Frontend
    methods:['GET','POST','PUT','DELETE'], //Method ที่อนุญาต
    credentials:true  //ให้ส่งข้อมูล Header+Cookie ได้
}))

// app.use(cors())
app.use("/img_pd",express.static("img_pd"))
app.use("/img_mem",express.static("img_mem"))
app.use(productRoute)
app.use(memberRoute)
app.use(cartRoute)

app.get('/',(req,res)=>{
    console.log(`GET / Requested`)
    res.status(200).json({
        message:"Request OK"
    })
})


app.listen(port,()=>{
    console.log(`Server is running on port :${port}`)
})