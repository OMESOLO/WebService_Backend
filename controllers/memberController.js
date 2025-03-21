import database from "../service/database.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import multer from "multer"
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'img_mem')
    },
    // กำหนดชื่อ file
    filename: function (req, file, cb) {
        const filename = `${req.body.memEmail}.jpg`
        cb(null, filename)
    }
})
// จำกัดประเภทของไฟล์ที่อัปโหลด
const upload = multer({
    storage: storage,
}).single('file');

export async function uploadMember(req, res) {
    console.log("Upload Member Image")
     upload(req, res, (err) => {
         if (err) {
             return res.status(400).json({ message: err.message });
         }
         res.status(200).json({ message: 'File uploaded successfully!' });
     });
 }
 

export async function postMember(req, res){
    console.log(`POST /Member is requested`)
        try {
            if(req.body.memEmail == null || req.body.memName == null)
            {
                res.json({ login: false })
            }
    
            const existsResult = await database.query({
                text: 'SELECT EXISTS (SELECT * FROM members WHERE "memEmail" = $1)',
                values: [req.body   .memEmail]
            })
            if(existsResult.rows[0].exists)
            {
                return res.json({
                    regist:false,
                    message: `memEmail ${req.body.memEmail} is Exists!!`
                })
            }

            const pwd = req.body.password
            const saltround = 11
            const pwdhash = await bcrypt.hash(pwd,saltround)
    
    
            const result = await database.query({
                text: `INSERT INTO members ("memEmail", "memName", "memHash")
                VALUES ($1, $2, $3)`,
                values: [req.body.memEmail, req.body.memName, pwdhash]
            })
           
            return res.json({
                regist: true,
                message: "Registration successful",
                memEmail: req.body.memEmail,
                memName: req.body.memName
            });
    
        } catch (err) {
            console.error("Error:", err);
            return res.json({ regist: false, message: err.message });
        }
}

export async function loginMember(req, res){
    console.log(`POST /loginMembers is requested`)
        try {
            if(req.body.loginname == null || req.body.password == null)
            {
                // return res.status(422).json({
                //     error: 'Login and Password is required.'
                // })
                return res.json({ login: false })
            }

            const existsResult = await database.query({
                text: 'SELECT EXISTS (SELECT * FROM members WHERE "memEmail" = $1)',
                values: [req.body.loginname]
            })
            if(!existsResult.rows[0].exists)
            {
                // return res.status(409).json({
                //     messagelogin:`Login Fail!!`
                // })
                return res.json({ login: false })
            }


            const result = await database.query({
                text: `SELECT * FROM members m WHERE m."memEmail" = $1`,
                values: [req.body.loginname
                ]
            })

            const loginok = await bcrypt.compare(req.body.password,result.rows[0].memHash)

            if(loginok){
                // res.status(201).json({messagelogin: 'Login Success'})
                // res.json({ login: true })
                const theuser={
                    memEmail:result.rows[0].memEmail,
                    memName:result.rows[0].memName,
                    dutyId:result.rows[0].dutyId
                }
                const secret_key=process.env.SECRET_KEY //อ่านค่าจากfile .env
                const token = jwt.sign(theuser,secret_key,{expiresIn:'1h'})
                // สร้าง Cookie
                res.cookie('token',token,{
                    maxAge:3600000, //กำหนดอายุของ Cookie เป็น ms 3600000->60minute
                    secure:true, //กำหนด Security
                    sameSite:"none" //บังคับให้ส่งใน Site เดียวกันหรือไม่
                })
                res.json({login:true})
            }
            else{

                res.clearCookie('token',{
                    secure:true,
                    sameSite: "none"
                })
                res.json({login:false})
            }
                // res.status(400).json({messagelogin:`Login Fail!!`})
                
        } catch (err) {
            // return res.status(500).json({
            //     error: err.message
            // })
            return res.json({ login: false })
        }
}

export async function logoutMember(req, res){
    console.log(`GET /logoutMembers is requested`)
        try{
            res.clearCookie('token', {
                secure: true,
                sameSite: "none"
            })
            return res.json({login:false})
        }catch (err)
        {
            return res.json({login:true})
        }
}
export async function updateMember(req, res) {
    console.log("POST /members/updateProfile is requested");

    try {
        const { memEmail, newEmail, memName } = req.body;

        if (!memEmail || !newEmail || !memName) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const existsResult = await database.query({
            text: 'SELECT EXISTS (SELECT * FROM members WHERE "memEmail" = $1)',
            values: [memEmail]
        });

        if (!existsResult.rows[0].exists) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (newEmail !== memEmail) {
            const emailExists = await database.query({
                text: 'SELECT EXISTS (SELECT * FROM members WHERE "memEmail" = $1)',
                values: [newEmail]
            });

            if (emailExists.rows[0].exists) {
                return res.status(409).json({ success: false, message: "New email is already in use" });
            }
        }

        await database.query({
            text: `UPDATE members SET "memEmail" = $1, "memName" = $2 WHERE "memEmail" = $3`,
            values: [newEmail, memName, memEmail]
        });

        await database.query({
            text: `UPDATE carts SET "cusId" = $1 WHERE "cusId" = $2`,
            values: [newEmail, memEmail]
        });

        const oldImagePath = path.join('img_mem', `${memEmail}.jpg`);
        const newImagePath = path.join('img_mem', `${newEmail}.jpg`);

        if (fs.existsSync(oldImagePath)) {
            fs.renameSync(oldImagePath, newImagePath);
        }

        const secret_key = process.env.SECRET_KEY;
        const newToken = jwt.sign(
            { memEmail: newEmail, memName: memName },
            secret_key,
            { expiresIn: '1h' }
        );

        res.json({ success: true, message: "Profile updated successfully", newToken });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}