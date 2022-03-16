require('dotenv/config');
const { Sequelize } = require('sequelize');
const config = require('./config');

console.log("CURRENT ENVIRONMENT: ",  String(process.env.NODE_ENV).trim());
console.log("MYSQL:");
console.log("    user: ", String(process.env.DB_USER).trim())
console.log("    password: ", String(process.env.DB_PASS).trim());

/**
 * Criando a classe e passando suas configurações
 * @param name: string
 * @param DB_NAME: string
 * @param DB_USER: string
 * @param DB_PASS: string
 * @param OPTIONS: any
 */

const MysqlDB = new Sequelize(
  process.env.DB_NAME,          // Carregando o nome do DB
  process.env.DB_USER,          // Carregando o usuario
  process.env.DB_PASS,          // Carregando a password do usuario
  {
    dialect: process.env.DB_DIALECT,           // DB usado
    host: process.env.DB_HOST,  // Carregando o endereço do DB
    port: process.env.DB_PORT,
  }
);

module.exports = MysqlDB;