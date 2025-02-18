const fs = require("fs");
const path = require("path");
const heicConvert = require("heic-convert");

module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "@strapi/provider-upload-cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: async (file) => {
          // Check if the uploaded file is in HEIC format
          if (file.mime === "image/heic" || file.mime === "image/heif") {
            const inputBuffer = fs.readFileSync(file.tmpPath);
            const outputBuffer = await heicConvert({
              buffer: inputBuffer,
              format: "JPEG",
              quality: 0.8, // Adjust quality as needed
            });

            // Define new file path and name
            const newFileName = `${file.name.split(".")[0]}.jpg`;
            const newFilePath = path.join("/tmp", newFileName);
            fs.writeFileSync(newFilePath, Buffer.from(outputBuffer));

            // Update file properties for Cloudinary upload
            file.path = newFilePath;
            file.name = newFileName;
            file.mime = "image/jpeg";
          }

          return file;
        },
        delete: {},
      },
    },
  },
});
