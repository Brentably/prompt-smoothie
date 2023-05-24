/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
}


const nextEnv = require('next-env');
const dotenvLoad = require('dotenv-load');
 
dotenvLoad('.env');

 
const withNextEnv = nextEnv();

module.exports = withNextEnv(nextConfig)
