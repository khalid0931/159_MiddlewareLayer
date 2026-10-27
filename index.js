import "dotenv/config";
import express from "express";
import pg from "pg";
import joi from "joi";

const app = express();
const port = process.env.PORT || 3000;
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Middleware logging
app.use((req, res, next) => {
    const start = Date.now()

    res.on("finish", () => {
        const duration = Date.now() - start
        console.log({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`
        })
    })
    next()
})

//response envelope
function successResponse(res, message, data, status = "200"){
    return res.status(status).json({
        status: true, message, data, error: null,
    })
}

function errorResponse(res, message, status, details = null){
    return res.status(status).json({
        status: false, message, data: null, error: details
    })
}

// joi validation schema
const biodataSchema = joi.object({
    id: joi.number().integer().positive(),
    nama: joi.string().min(3).max(50).required(),
    nim: joi.string().trim().min(5).max(20).required(),
    kelas: joi.string().trim().min(1).max(20).required(),
})

const idSchema = joi.object({
    id: joi.number().integer().positive().required(),
})