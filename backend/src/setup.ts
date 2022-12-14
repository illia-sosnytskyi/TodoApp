import { TodoModel } from "./models/Todo";
import { sequelize } from "./utils/db";

(async() => {
  await TodoModel.sync({ force: true });
  await sequelize.close();
})();
