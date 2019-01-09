import passord from 'password-hash-and-salt';

export function nyttPassord(nyttP) {
    passord(nyttP).hash((error,hash) => {
        if(error){
            throw new Error('Nåke gjekk galt');
        }
        console.log(hash);
        nyHash = hash;
    })
    return nyHash;
}

const sjekkPassord = (passord) => {
    passord('mysecret').verifyAgainst(passord, (error,verified) => {
        if(error)
            throw new Error('Noe gikk galt!');
        if(!verified) {
            return false;
        } else {
            return true;
        }
    })
}