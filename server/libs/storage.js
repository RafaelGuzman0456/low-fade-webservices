const multer = require('multer');
const path = require('path');
//const uuid = require('uuid/v4');
const { uuid } = require('uuidv4');
const express = require('express');
const app = express();
/*const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './storage/images');
    },
    filename: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}`)
    }
  })
   
  const upload = multer({ storage })
module.exports= upload;*/
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: false }));
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'),
    filename: (req, file, cb, filename) => {
        cb(null, uuid() + path.extname(file.originalname));

    }
});
const upload = app.use(multer({ storage }).single('image'));

module.exports = upload;