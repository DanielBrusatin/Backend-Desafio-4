import multer from 'multer'
import __dirname from '../utils.js'

const storage = multer.diskStorage({
  destination: __dirname + '/public/images/products/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '.png')
  }
})

const upload = multer({ storage })
export default upload