import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import { extractFilenameFromUrl, getFilePathFromFilename } from "../utils/imageUtils.js"


const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, bestseller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item)=> item !== undefined)

        let imagesUrl = []
        
        // Check if Cloudinary credentials are available
        if (process.env.CLOUDINARY_API_KEY && images.length > 0) {
            // Upload to Cloudinary if credentials are available
            imagesUrl = await Promise.all(
                images.map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                    return result.secure_url
                })
            )
        } else if (images.length > 0) {
            // Use local storage - create URLs pointing to local server
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            imagesUrl = images.map(item => {
                return `${baseUrl}/uploads/products/${item.filename}`;
            });
        } else {
            // Use placeholder images if no images uploaded
            imagesUrl = [
                'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop',
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
                'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=300&h=300&fit=crop',
                'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop'
            ].slice(0, 1) // Use at least one placeholder image
        }
        
        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()

        res.json({success: true, message:"Product added"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({success:true, products})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

const removeProduct = async (req, res) => {
    try {
        // Get the product first to access its images
        const product = await productModel.findById(req.body.id);
        
        if (product && product.image && product.image.length > 0) {
            // Delete local image files
            const filesToDelete = [];
            
            product.image.forEach(imageUrl => {
                const filename = extractFilenameFromUrl(imageUrl);
                if (filename) {
                    const filePath = getFilePathFromFilename(filename);
                    if (filePath) {
                        filesToDelete.push(filePath);
                    }
                }
            });
            
            // Delete the files (don't wait for this to complete)
            if (filesToDelete.length > 0) {
                import('../utils/imageUtils.js').then(({ deleteMultipleFiles }) => {
                    deleteMultipleFiles(filesToDelete).catch(err => {
                        console.error('Error deleting image files:', err);
                    });
                });
            }
        }
        
        // Delete the product from database
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: "Product Removed"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success:true, product})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

export {addProduct, listProduct, removeProduct, singleProduct}