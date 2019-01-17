import passord from 'password-hash-and-salt';

var bruker = [];

passord('mysecret').hash((error, hash) => {
  if (error) {
    throw new Error('Noe gikk galt!');
  }
  bruker.hash = hash;
  console.log(bruker.hash);
  console.log('test');

  passord('mysecret').verifyAgainst(bruker.hash, (error, verified) => {
    if (error) throw new Error('Noe gikk galt!!');
    if (!verified) {
      console.log('Feil');
    } else {
      console.log('The secret is...');
    }
  });
});