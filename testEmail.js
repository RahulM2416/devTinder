const { run } = require('./src/utils/sendEmail');

(async () => {
  try {
    const result = await run();
    console.log("Email sent:", result);
  } catch (err) {
    console.error("Error:", err);
  }
})();