var passord = require('password-hash-and-salt');

var bruker = [];

passord('mysecret').hash((error,hash) => {
    if(error){
        throw new Error('Nåke gjekk galt');
    }
    bruker.hash = hash;
    console.log(bruker.hash);
    console.log("test");

    passord('mysecret').verifyAgainst(bruker.hash, (error,verified) => {
        if(error)
            throw new Error('Nåke gjekk galt!');
        if(!verified) {
            console.log("feil");
        } else {
            console.log("The secret is...");
        }
    })
})
