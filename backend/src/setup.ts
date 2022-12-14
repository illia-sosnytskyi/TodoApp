import { TodoModel } from "./models/TodoModel";
import { sequelize } from "./utils/db";

(async() => {
  await TodoModel.sync({ force: true });
  await sequelize.close();
})();

