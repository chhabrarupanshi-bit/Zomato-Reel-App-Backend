const ImageKit = require("imagekit") ; // imagekit ko import kiya jata hai taki image upload ke liye use kiya ja sake

const imageKit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY , // imagekit ke liye public key ko set kiya jata hai
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY , // imagekit ke liye private key ko set kiya jata hai
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT , // imagekit ke liye url endpoint ko set kiya jata hai
}) ;


async function uploadFile(file , filename){
    const result = await imageKit.upload({
        file : file , // file ko upload kiya jata hai
        fileName : filename , // file ke liye filename ko set kiya jata hai
    })
    return result ;
}

module.exports = {uploadFile} ; // uploadFile function ko export kiya jata hai taki dusre files me use kiya ja sake