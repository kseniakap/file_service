import Joi from 'joi';

export const envSchema = Joi.object({
  API_HOST: Joi.string().hostname().required(),
  PORT: Joi.number().port().required(),
  ROUTES_PREFIX: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().port().required(),
  DB_DIALECT: Joi.string()
    .valid('postgres', 'mysql', 'sqlite', 'mariadb', 'mssql')
    .required(),
  PATH_UPLOADS: Joi.string().required(),
  S3_DOMAIN: Joi.string().hostname().optional(),
  S3_PORT: Joi.number().port().optional(),
  S3_ACCESS_KEY: Joi.string().optional(),
  S3_SECRET_KEY: Joi.string().optional(),
  S3_NAMESPACE: Joi.string().optional(),
  S3_TAGS: Joi.string().optional(),
  KEY_TAGS: Joi.string().required(),
  SECRET_KEY: Joi.string().required(),
});
