const { initializeApp } = require('./src/index');
(async () => {
  try {
    await console.info('Will initialize app');

    const publicPort = 4201;
    initializeApp().listen(publicPort, async () => {
      await console.info(`JsJobs backend is listening on port ${publicPort}`);
    });
  } catch (error) {
    console.error(`An error happened: ${error.stack}. Exiting process with error code.`);
    process.exit(-1);
  }
})();
