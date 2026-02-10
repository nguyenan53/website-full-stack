const { HomeBanner } = require('../models/homeBanner');
const { ImageUpload } = require('../models/imageUpload');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require("fs");

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true
});

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
        //imagesArr.push(`${Date.now()}_${file.originalname}`)

    },
})


const upload = multer({ storage: storage })

router.post(`/upload`, upload.array("images", file), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const imagesArr = []; // ✅ biến cục bộ, KHÔNG global

    for (let i = 0; i < req.files.length; i++) {
      const result = await cloudinary.uploader.upload(req.files[i].path, {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      });

      if (!result || !result.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      imagesArr.push(result.secure_url);

      // xoá file local sau khi upload xong
      fs.unlinkSync(req.files[i].path);
    }

    const imagesUploaded = new ImageUpload({
      images: imagesArr,
    });

    await imagesUploaded.save();

    return res.status(200).json(imagesArr);
  } catch (error) {
    console.error("HOME BANNER UPLOAD ERROR:", error);
    return res.status(500).json({
      message: "Image upload failed",
      error: error.message,
    });
  }
});


router.get(`/`, async (req, res) => {

    try {
      
        const bannerImagesList = await HomeBanner.find();


        if (!bannerImagesList) {
            res.status(500).json({ success: false })
        }

        return res.status(200).json(bannerImagesList);

    } catch (error) {
        res.status(500).json({ success: false })
    }


});



router.get('/:id', async (req, res) => {
    slideEditId = req.params.id;

    const slide = await HomeBanner.findById(req.params.id);

    if (!slide) {
        res.status(500).json({ message: 'The slide with the given ID was not found.' })
    }
    return res.status(200).send(slide);
})



router.post('/create', async (req, res) => {
  try {
    const newEntry = new HomeBanner({
      images: req.body.images,
    });

    const saved = await newEntry.save();
    return res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});


router.delete('/deleteImage', async (req, res) => {
    const imgUrl = req.query.img;

   // console.log(imgUrl)

    const urlArr = imgUrl.split('/');
    const image =  urlArr[urlArr.length-1];
  
    const imageName = image.split('.')[0];

    const response = await cloudinary.uploader.destroy(imageName, (error,result)=>{
       // console.log(error, res)
    })

    if(response){
        res.status(200).send(response);
    }
      
});

router.delete('/:id', async (req, res) => {

    const item = await HomeBanner.findById(req.params.id);
    const images = item.images;

    for(img of images){
        const imgUrl = img;
        const urlArr = imgUrl.split('/');
        const image =  urlArr[urlArr.length-1];
      
        const imageName = image.split('.')[0];

        cloudinary.uploader.destroy(imageName, (error,result)=>{
           // console.log(error, result);
        })
      //  console.log(imageName)
    }


    const deletedItem = await HomeBanner.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
        res.status(404).json({
            message: 'Slide not found!',
            success: false
        })
    }

    res.status(200).json({
        success: true,
        message: 'Slide Deleted!'
    })
});



router.put('/:id', async (req, res) => {

    const slideItem = await HomeBanner.findByIdAndUpdate(
        req.params.id,
        {
            images: req.body.images,
        },
        { new: true }
    )

    if (!slideItem) {
        return res.status(500).json({
            message: 'Item cannot be updated!',
            success: false
        })
    }

    imagesArr = [];

    res.send(slideItem);

})




module.exports = router;

