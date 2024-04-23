import multer from 'multer'
// import os from "os"

// const hostname = os.hostname();
// console.log('Hostname:', hostname);
// let hostName = window.location.hostname;


    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, './upload/books/cover_images'); 
        },
        filename: function (req, file, cb) {
            let name = file.originalname.replace(/\s+/g, ' ');
            name = name.replace(/[&\/\\#, +()$~%'":*?<>{}@-]/g, '_');
            cb(null, Date.now() + "_" + name);
        },
    });

   const fileFilterConfig = function(req, file, cb) {
      if (file.mimetype === "image/jpeg"
          || file.mimetype === "image/png") {
          cb(null, true);
      } else {
          cb(null, false);
      }
    };

    export const upload = multer({
          storage: storage,
          limits: {
              fileSize: 1024 * 1024 * 5
          },
          fileFilter: fileFilterConfig,
    });
  