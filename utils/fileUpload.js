const multer = require("multer");
const path = require('path')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    

    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    

    const ext = path.extname(file.originalname)
    const mimetype = "." + file.mimetype.split("/")[1]
    cb(null, Date.now() + ext)
    // if (ext == mimetype) {
    //      cb(null,Date.now() + ext)
    // }
    // else {
    //   cb(new Error('File corrupted'))
    // }

  }
})

// req.file.mimetype.split('/')[1]  == req.file.originalname.substring(req.file.originalname.lastIndexOf('.') + 1, req.file.originalname.length)
const upload = multer({ storage: storage })
module.exports = upload; 