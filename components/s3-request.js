import AWS from 'aws-sdk';
import { config } from '../config';

let s3 = new AWS.S3({
  apiVersion: '2017-12-31',
  params: { Bucket: config.s3.bucketName }
});

export function createAlbum(albumName) {
  return new Promise((resolve, reject) => {
    albumName = albumName.trim();
    if (!albumName) {
      console.log('Album names must contain at least one non-space character.');
      reject(false);
    }
    if (albumName.indexOf('/') !== -1) {
      console.log('Album names cannot contain slashes.');
      reject(false);
    }
    let albumKey = encodeURIComponent(albumName) + '/';
    s3.headObject({ Key: albumKey }, function (err, data) {
      if (!err) {
        console.log('Album already exists.');
        reject(false);
      }
      if (err.code !== 'NotFound') {
        console.log('There was an error creating your album: ' + err.message);
        reject(false);
      }
      s3.putObject({ Key: albumKey }, function (err, data) {
        if (err) {
          console.log('There was an error creating your album: ' + err.message);
          reject(false);
        }
        console.log('Successfully created album.');
        resolve(true);
      });
    });
  });
}

export function addPhoto(albumName, img) {
  return new Promise((resolve, reject) => {
    let fileName = img.name;
    let imgData = img.data;
    let albumPhotosKey = encodeURIComponent(albumName) + '/';
    let photoKey = albumPhotosKey + fileName;
    s3.upload({
      Key: photoKey,
      Body: imgData,
      ACL: 'public-read'
    }, function (err, data) {
      if (err) {
        console.log('There was an error uploading your photo: ', err.message);
        reject(false);
      }
      console.log('Successfully uploaded photo.');
      resolve(true);
    });
  })
}

export function deletePhoto(albumName, photoKey) {
  s3.deleteObject({ Key: photoKey }, function (err, data) {
    if (err) {
      return alert('There was an error deleting your photo: ', err.message);
    }
    alert('Successfully deleted photo.');
    viewAlbum(albumName);
  });
}
