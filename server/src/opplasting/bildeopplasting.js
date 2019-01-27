import client from 'ssh2-sftp-client';
import fs from 'fs';
const EKSTERN_URL = 'https://bjornost.tihlde.org/hverdagshelt/';

/**
 * Klasse for håndtering av bildeopplasting
 */
module.exports = class BildeOpplasting {
  /**
   * 
   * @param {Object[]} filer - Express filobjekter som lastes opp på en tihlde server
   * @param {function(lenker: string[])} cb - Callback for å sende lenkene til de opplastede bildene
   */
  lastOpp(filer, cb) {
    let lenker = [];
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
            .fastPut(filer[i].path, '/home/students/bjornost/public_html/hverdagshelt/' + filer[i].filename)
            .then(fs.unlink(filer[i].path, (err) => {}));
          lenker.push(EKSTERN_URL + filer[i].filename);
        }
        cb(lenker);
      });
  }
};
