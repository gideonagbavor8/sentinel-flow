import 'dotenv/config';
console.log('DATABASE_URL defined:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length);