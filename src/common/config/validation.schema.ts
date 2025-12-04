import * as Joi from 'joi';

export const validationSchema = Joi.object({
    // Application
    NODE_ENV: Joi.string().valid('dev', 'prod', 'local').required(),
    CLIENT_IP: Joi.string().required(),
    // Port
    PORT: Joi.number().required(),
    // Swagger
    SWAGGER_USER: Joi.string().required(),
    SWAGGER_PASSWORD: Joi.string().required(),

    // Database
    DB_TYPE: Joi.string().valid('postgres').required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_SYNCHRO: Joi.boolean().required(),

    // Encryption
    ENCRYPTION_KEY: Joi.string().required(),
    FIXED_IV: Joi.string().required(),

    // JWT
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_REFRESH_EXPIRES_IN: Joi.string().required(),

    // SessionKey Nice JWT
    JWT_NICE_SESSION_KEY_SECRET: Joi.string().required(),
    JWT_NICE_SESSION_KEY_EXPIRES_IN: Joi.string().required(),

    // SessionKey OAuth JWT
    JWT_OAUTH_SESSION_KEY_SECRET: Joi.string().required(),
    JWT_OAUTH_SESSION_KEY_EXPIRES_IN: Joi.string().required(),

    // NICE 
    NICE_CLIENT_ID: Joi.string().required(),
    NICE_SECRET_KEY: Joi.string().required(),
    NICE_ACCESS_TOKEN: Joi.string().required(),
    NICE_CLIENT_IP: Joi.string().required(),

    // OAuth - Google
    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_SECRET: Joi.string().required(),

    // OAuth - Kakao
    KAKAO_CLIENT_ID: Joi.string().required(),
    KAKAO_SECRET: Joi.string().required(),

    // OAuth - Naver
    NAVER_CLIENT_ID: Joi.string().required(),
    NAVER_SECRET: Joi.string().required(),

    // OAuth - Apple
    APPLE_JWKS_URI: Joi.string().required(),
    APPLE_CLIENT_ID: Joi.string().required(),
    APPLE_TEAM_ID: Joi.string().required(),
    APPLE_KEY_ID: Joi.string().required(),
    APPLE_PRIVATE_KEY: Joi.string().required(),

    // Cache TTL Minutes
    OAUTH_SESSION_KEY_TTL_MINUTE: Joi.number().required(),
    NICE_TOKEN_VERSION_TTL_MINUTE: Joi.number().required(),
    NICE_SESSION_KEY_TTL_MINUTE: Joi.number().required(),
    
    // Login Attempt
    MAX_LOGIN_DEVICE_COUNT: Joi.number().required(),
    // Term 
    TERM_HTML_FILE_BASE_PATH: Joi.string().required(),
    // KG Inicis
    /* INICIS_MID: Joi.string().required(),
    INICIS_HASH_KEY: Joi.string().required(),
    INICIS_API_KEY: Joi.string().required(),
    INICIS_IV: Joi.string().required(), */
});

