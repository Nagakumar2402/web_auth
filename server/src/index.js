import { app } from "./app.js";
import { ConnectDB } from "./db/config.js";
const PORT = process.env.PORT || 8000;
ConnectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
