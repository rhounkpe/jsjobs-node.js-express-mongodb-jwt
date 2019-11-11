const mongoose = require('mongoose');
const { initializeApp } = require('./src/index');

(async () => {
  try {
    await mongoose.connect('mongodb://localhost/jsjobs', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const publicPort = 4201;
    initializeApp().listen(publicPort, async () => {
      await console.info(`JsJobs backend is listening on port ${publicPort}`);
    });
  } catch (error) {
    console.error(`Unable to connect to MongoDB due to ${error.stack}. Exiting process with error code.`);
    process.exit(-1);
  }
})();
