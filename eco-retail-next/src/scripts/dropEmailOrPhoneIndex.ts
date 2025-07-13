import { dropEmailOrPhoneIndex } from '../lib/mongodb';

(async () => {
  await dropEmailOrPhoneIndex();
  process.exit(0);
})(); 