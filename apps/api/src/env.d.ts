declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      WEB_HOST: string;
      JWT_SECRET: string;

      GOOGLE_CLIENT_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_CALLBACK: string;

      GITHUB_CLIENT_SECRET: string;
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_CALLBACK: string;

      S3_ID: string;
      S3_KEY: string;
      S3_HOST: string;
      S3_BUCKET: string;
    }
  }
}

export {};
