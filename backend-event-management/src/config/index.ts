import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,

    // cloudinary
    cloudinary: {
        api_secret: process.env.CLOUDINARY_API_SECRET,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY
    },

    // JWT
    jwt: {
        access_secret: process.env.JWT_ACCESS_SECRET,
        access_expires: process.env.JWT_ACCESS_EXPIRES,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
        refresh_expires: process.env.JWT_REFRESH_EXPIRES,
        reset_pass_secret: process.env.RESET_PASS_TOKEN,
        reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN
    },
    reset_pass_link: process.env.RESET_PASS_LINK,

    // EMAIL

    emailSender: {
        email: process.env.EMAIL,
        app_pass: process.env.APP_PASS
    },

    // STRIPE
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.WEBHOOK_SECRET

}