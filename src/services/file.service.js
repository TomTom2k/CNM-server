const { s3 } = require("../configs/aws.config")
require("dotenv").config()

const getFileBufferService = async (data) => {
    const { fileName } = data

    const paramsS3 = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName
    }
    const obj = await s3.getObject(paramsS3).promise()

    return {
        status: 200,
        data: obj.Body
    };
}

module.exports = {getFileBufferService}