var client = require('ssh2-sftp-client');
var fs = require('fs');
const EKSTERN_URL = 'https://bjornost.tihlde.org/hverdagshelt/';

function lastOpp(filer, cb) {
  lenker = [];
  let sftp = new client();
  sftp
    .connect({
      host: 'tihlde.org',
      port: '22',
      username: 'bjornost',
      password: 'wBvNl566DdCx',
    })
    .then(() => {
      for (let i = 0; i < filer.length; i++) {
        sftp
          .fastPut(
            filer[i].path,
            '/home/students/bjornost/public_html/hverdagshelt/' +
              filer[i].filename
          )
          .then(fs.unlink(filer[i].path, (err) => {}));
        lenker.push(EKSTERN_URL + filer[i].filename);
      }
      cb(lenker);
    });
}
