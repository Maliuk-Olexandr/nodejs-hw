
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();
const PORT = process.env.PORT || 3030;


app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`);
});
export default app;
