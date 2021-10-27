import dotenv from 'dotenv-safe';

dotenv.config();

export const config = {
    port: Number(process.env.PORT) + 1
};
