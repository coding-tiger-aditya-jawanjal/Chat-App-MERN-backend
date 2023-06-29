const multer = require("multer");
const os = require('os');

const storage = multer.diskStorage({
    destination: os.tmpdir(),
    filename:function(req,file,cb){
        cb(null , file.originalname);
    }
})

exports.uploadProfilePic = multer({storage:storage});
exports.uploadGroupIcon = multer({storage:storage});
exports.uploadMediaMessage = multer({storage:storage});

// exports.uploadProfilePic = multer({dest:`/images/profiles`});
// exports.uploadGroupIcon = multer({dest:`/images/groupIcons`});
// exports.uploadMediaMessage = multer({dest:`/images/media`});