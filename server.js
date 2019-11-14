const mongoose = require('mongoose');
const { initializeApp } = require('./src/index');
const serverConfig = require('./src/config/server.settings');

(async () => {
  try {
/*    await mongoose.connect(`${serverConfig.mongo.serverUrl}/${serverConfig.mongo.database}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });*/


    initializeApp().listen(serverConfig.sever.port, async () => {
      await console.info(`JsJobs backend is listening on port ${serverConfig.sever.port}`);
    });
  } catch (error) {
    console.error(`Unable to connect to MongoDB due to ${error.stack}. Exiting process with error code.`);
    process.exit(-1);
  }
})();
