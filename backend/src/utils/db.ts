import { Sequelize } from 'sequelize';
import * as dotendv from 'dotenv';

dotendv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
    },
  },
});
