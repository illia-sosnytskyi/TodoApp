import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('postgres', 'postgres', 'test1234', {
  host: 'https://melodious-jalebi-b4f592.netlify.app/.netlify/functions/server',
  dialect: 'postgres',
});