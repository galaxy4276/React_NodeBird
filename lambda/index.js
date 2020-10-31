const AWS = require('aws-sdk');
const sharp = require('sharp');


// lambda 는 따로 인증절차를 수행하지 않아도 된다.
const s3 = new AWS.S3();


exports.handler = (event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name; // galaxyhi4276-react-nodebird
  const Key = decodeURIComponent(event.Records[0].s3.object.key); // original/123123_abc.png
  console.log(Bucket, Key);
  const filename = Key.split('/')[Key.split('/').length - 1]; 
  const ext = Key.split('.')[Key.split('.').length - 1].toLowerCase();
  const requireFormat = ext === 'jpg' ? 'jpeg' : ext;
  console.log('filename', filename, 'ext', ext);

  try {
    const s3Object = await s3.getObject({ Bucket, Key }).promise();
    console.log('original', s3Object.Body.length);
    const resizedImage = await sharp(s3Object.Body)
      .resize(400, 400, { fit: 'inside' })
      .toFormat(requireFormat)
      .toBuffer();
      await s3.putObject({
        Bucket,
        Key: `/thumb/${filename}`,
        Body: resizedImage,
      }).promise();
      console.log('put', resizedImage.length);
      return callback(null, `thumb/${filename}`);
  } catch(error) {
    console.error(err);
    return callback(error);
  }
}