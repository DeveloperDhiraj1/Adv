import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

import 'dotenv/config';
import { pathToFileURL } from 'node:url';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 8081;

console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("PORT:", PORT);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
  });
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer().catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });
}

export default app;
