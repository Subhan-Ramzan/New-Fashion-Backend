module.exports = ({ env }) => ({
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'), // Read JWT Secret from .env file
    },
  },
  upload: {
    config: {
      provider: '@strapi/provider-upload-cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: async (file) => {
          const fs = require('fs');
          const path = require('path');
          const heicConvert = require('heic-convert');

          if (file.mime === 'image/heic' || file.mime === 'image/heif') {
            const inputBuffer = fs.readFileSync(file.tmpPath);
            const outputBuffer = await heicConvert({
              buffer: inputBuffer,
              format: 'JPEG',
              quality: 0.8,
            });

            const newFileName = `${file.name.split('.')[0]}.jpg`;
            const newFilePath = path.join('/tmp', newFileName);
            fs.writeFileSync(newFilePath, Buffer.from(outputBuffer));

            file.path = newFilePath;
            file.name = newFileName;
            file.mime = 'image/jpeg';
          }

          return file;
        },
        delete: {},
      },
    },
  },
});
