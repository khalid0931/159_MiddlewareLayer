import "dotenv/config";
import express from "express";
import pg from "pg";
import joi from "joi";

const app = express();
const port = process.env.PORT || 3000;
const { Pool } = pg;

