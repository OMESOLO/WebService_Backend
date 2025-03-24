import database from "../service/database.js"
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'img_pd') // โฟลเดอร์ที่ใช้เก็บรูป
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname
        cb(null, uniqueName)
    }
})
export const upload = multer({ storage: storage })

export async function getProductByBrandId(req, res){
    console.log(`GET / productsByBrandId brand_id=${req.params.id} is Requested`)
        
        try {
            // const strQry='SELECT * FROM products'
            const result =  await database.query({
                text: `
                        SELECT p.*, 
                                (
                                    SELECT row_to_json(pdt_obj)
                                    FROM (
                                        SELECT * FROM "pdTypes" WHERE "pdTypeId" = p."pdTypeId"
                                    )
                                    pdt_obj
                                )AS pdt

                                FROM products p
                                WHERE p."brandId" ILIKE $1
                        `,
                values: [req.params.id]
            })

            if(result.rowCount == 0)
                return res.status(404).json({error: `brand id ${req.params.id} not found` })
            
            return res.status(200).json(result.rows)
        }
        catch(err)
        {
            return res.status(500).json({
                error:err.message
            })
        }
}

export async function deleteProduct(req, res){
    console.log(`DELETE / products id=${req.params.id} is Requested`)
        
        try {
            // const strQry='SELECT * FROM products'
            const result =  await database.query({
                text: `
                       DELETE FROM products
                       WHERE "pdId" = $1;
                        `,
                values: [
                   req.params.id
                ]
            })

            if(result.rowCount == 0)
                return res.status(404).json({error: `id ${req.params.id} not found` })
            
            res.status(204).end()
        }
        catch(err)
        {
            return res.status(500).json({
                error:err.message
            })
        }
}

export async function putProduct(req, res){
    console.log(`PUT / products id=${req.params.id} is Requested`)
        
        try {
            // const strQry='SELECT * FROM products'
            const result =  await database.query({
                text: `
                       UPDATE "products"
                       SET "pdId" = $1,
                           "pdName" = $2,
                           "pdPrice" = $3,
                           "pdRemark" = $4,
                           "pdTypeId" = $5,
                           "brandId" = $6
                        WHERE "pdId" = $7
                        `,
                values: [
                    req.body.pdId,
                    req.body.pdName,
                    req.body.pdPrice,
                    req.body.pdRemark,
                    req.body.pdTypeId,
                    req.body.brandId,
                    req.params.id
                ]
            })

            if(result.rowCount == 0)
                return res.status(404).json({error: `id ${req.params.id} not found` })
            
            const bodyData = req.body
            const datetime = new Date()
            bodyData.updateDate = datetime
            res.status(201).json(bodyData)
        }
        catch(err)
        {
            return res.status(500).json({
                error:err.message
            })
        }
}

export async function getProductById(req, res){
    console.log(`GET / productsById id=${req.params.id} is Requested`)
        
        try {
            // const strQry='SELECT * FROM products'
            const result =  await database.query({
                text: `
                        SELECT p.*, (
                                    SELECT row_to_json(brand_obj)
                                    FROM (
                                        SELECT * FROM brands WHERE "brandId" = p."brandId"
                                    )
                                    brand_obj
                                )AS brand,

                                (
                                    SELECT row_to_json(pdt_obj)
                                    FROM (
                                        SELECT * FROM "pdTypes" WHERE "pdTypeId" = p."pdTypeId"
                                    )
                                    pdt_obj
                                )AS pdt

                                FROM products p
                                WHERE p."pdId" = $1
                        `,
                values: [req.params.id]
            })

            if(result.rowCount == 0)
                return res.status(404).json({error: `id ${req.params.id} not found` })
            
            return res.status(200).json(result.rows)
        }
        catch(err)
        {
            return res.status(500).json({
                error:err.message
            })
        }
}

export async function getAllProduct(req, res){
    console.log(`GET / products is Requested`)
        
        try {
            // const strQry='SELECT * FROM products'
            const result= await database.query(`
                SELECT p.*, (
                            SELECT row_to_json(brand_obj)
                            FROM (
                                SELECT * FROM brands WHERE "brandId" = p."brandId"
                            )
                            brand_obj
                        )AS brand,

                        (
                            SELECT row_to_json(pdt_obj)
                            FROM (
                                SELECT * FROM "pdTypes" WHERE "pdTypeId" = p."pdTypeId"
                            )
                            pdt_obj
                        )AS pdt

                        FROM products p
                `)
            return res.status(200).json(result.rows)
        }
        catch(err)
        {
            return res.status(500).json({
                error:err.message
            })
        }
}

export async function postProduct(req, res){
    console.log(`POST /products is requested`)
    try {
        const { pdName, pdPrice, pdRemark, pdTypeId, brandId } = req.body;
        const image = req.file?.filename; // ชื่อไฟล์

        if (!pdName || !pdPrice) {
            return res.status(422).json({ error: 'pdName and pdPrice are required.' });
        }

        // สร้าง pdId ใหม่แบบ timestamp (หรือใช้ uuid ก็ได้)
        const pdId = 'pd_' + Date.now();

        await database.query({
            text: `INSERT INTO products ("pdId", "pdName", "pdPrice", "pdRemark", "pdTypeId", "brandId", "pdImage")
                   VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            values: [pdId, pdName, pdPrice, pdRemark, pdTypeId, brandId, image]
        });

        res.status(201).json({ pdId, pdName, pdPrice, pdRemark, pdTypeId, brandId, image });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}

export async function getTenProduct(req,res){
    console.log(`GET / TEN products is Requested`)
        
        try {
            // const strQry='SELECT * FROM products'
            const result= await database.query(`
                SELECT p.*, (
                            SELECT row_to_json(brand_obj)
                            FROM (
                                SELECT * FROM brands WHERE "brandId" = p."brandId"
                            )
                            brand_obj
                        )AS brand,

                        (
                            SELECT row_to_json(pdt_obj)
                            FROM (
                                SELECT * FROM "pdTypes" WHERE "pdTypeId" = p."pdTypeId"
                            )
                            pdt_obj
                        )AS pdt

                        FROM products p LIMIT 10
                `)
            return res.status(200).json(result.rows)
        }
        catch(err)
        {
            return res.status(500).json({
                error:err.message
            })
        }
}

export async function getSearchProduct(req, res) {
    console.log(`GET /searchProduct id=${req.params.id} is Requested`)
    try {
        const result = await database.query({
            text: `SELECT p.*, (
                                SELECT row_to_json(brand_obj)
                                FROM (
                                    SELECT * FROM brands WHERE "brandId" = p."brandId"
                                    )
                                brand_obj
                                )AS brand,
 
                                (
                                    SELECT row_to_json(pdt_obj)
                                    FROM (
                                        SELECT * FROM "pdTypes" WHERE "pdTypeId" = p."pdTypeId"
                                        )
                                    pdt_obj
                                )AS pdt
 
                                FROM products p
                                WHERE (
                                        p."pdId" ILIKE $1
                                    OR  p."pdName" ILIKE $1
                                    OR  p."pdRemark" ILIKE $1
                                )
                    `,
                    values:[`%${req.params.id}%`]
        })
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }    
}

export async function getAllBrands(req, res) {
    console.log(`GET /brands is requested`);
    try {
        const result = await database.query(`SELECT * FROM brands`);
        return res.status(200).json(result.rows);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export async function getAllPdTypes(req, res) {
    console.log(`GET /pdTypes is requested`);
    try {
        const result = await database.query(`SELECT * FROM "pdTypes"`);
        return res.status(200).json(result.rows);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

