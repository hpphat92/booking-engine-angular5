var FtpDeploy = require('ftp-deploy');
var ftpDeploy = new FtpDeploy();
var Client = require('ftp');
var fs = require('fs');
var xml2js = require('xml2js');

function readProfileFromArgs() {
  var args = process.argv.slice(2);
  var fileName = args[0];
  var distName = args[1] || './dist';
  if (!args.length) {
    var files = fs.readdirSync('.');
    var profileFile = files.find(function (f) {
      return f.endsWith('.PublishSettings');
    });
    if (!profileFile) {
      return Promise.reject(new Error('Please specify publish profile file'));
    } else {
      fileName = profileFile;
    }
  } else {

  }
  return readFile(fileName, distName)
}

function readFile(fileName, distFile) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, 'utf8', function (err, content) {
      if (err) {
        reject(err);
      }
      xml2js.parseString(content, function (error, fileInfo) {
        if (error) {
          reject(error);
        }
        var profiles = fileInfo.publishData.publishProfile;
        var ftpProfile = profiles.find(function (pf) {
          return pf.$.publishMethod.toLowerCase() === 'ftp';
        })
        if (ftpProfile) {
          ftpProfile = ftpProfile.$;
          var hosts = ftpProfile.publishUrl.split(/\/\/|\//);

          resolve({
            host: hosts[1],
            user: ftpProfile.userName.replace('\\\\', '\\'),
            password: ftpProfile.userPWD,
            localRoot: distFile || 'dist',
            include: ['*', '**/*'],
            exclude: [],
            remoteRoot: hosts.slice(2).join('/'),
            deleteRemote: true
          });
        } else {
          reject(new Error('File format invalid'))
        }
      })
    });
  })
}

readProfileFromArgs().then(function (config) {
  console.log(config);
  ftpDeploy.deploy(config, function (err) {
    if (err) console.log(err);
    else {
      console.log('Completed');
    }
  });
  ftpDeploy.on('uploading', function (data) {
    console.log('Uploading File', data.filename, '(', data.transferredFileCount, 'of', data.totalFilesCount, ')');
  });

  ftpDeploy.on('upload-error', function (data) {
    console.log(data.err); // data will also include filename, relativePath, and other goodies
  });
});
// var config = {
//   host: 'waws-prod-sg1-011.ftp.azurewebsites.windows.net',
//   user: 'trabbletestapp\\$trabbletestapp',
//   password: 'nC9oe6ZSXp8xr1k2xfqKiNnx2gCgE8jufl8PWLwTsqc8qWwsNf50PA255xBa',
//   localRoot: './dist',
//   include: ['*', '**/*'],
//   remoteRoot: '/site/wwwroot/wwwroot',
//   exclude: [],
//   deleteRemote: true                // delete existing files at destination before uploading
// };
// ftpDeploy.deploy(config, function (err) {
//   if (err) console.log(err);
//   else {
//     console.log('Completed');
//   }
// });
// ftpDeploy.on('uploading', function (data) {
//   console.log('Uploading File', data.filename, '(', data.transferredFileCount, 'of', data.totalFilesCount, ')');
// });
//
// ftpDeploy.on('upload-error', function (data) {
//   console.log(data.err); // data will also include filename, relativePath, and other goodies
// });
