import nodemailer from 'nodemailer';

const avsender = 'HverdagsHeltTeam07@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'HverdagsHeltTeam07@gmail.com',
    pass: 'HverdagsHeltTeam07SuperSecret'
  }
});

module.exports = class epost {

  //Response på en innlagt feil med saksnummer og bekreftelse på at den er registrert
  feilGodkjent(saksnummer, mottaker){

    let subject = 'Melding av feil';
    let html = '<div style="margin-left:36px"><p>Meldt feil med saksnummer ' + saksnummer
    + ' er godkjent og registrert for behandling</p></div><div style="float:left;margin-top:45px">'
    + '<img src="http://gdurl.com/BbIX" width="280"/></div>'
    + '<div style="margin-left:15px;margin-top:80px"><p>E-post: contact@HverdagsHelt.no</p>'
    + '<p>tlf: +47 00 00 00 00</p><p>Prosjekt HverdagsHelt</p></div>';

    let mailOptions = {
      from: avsender,
      to: mottaker,
      subject: subject,
      html: html
    };

    transporter.sendMail(mailOptions, function(err, info){
      if(err){
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }

  //Melding om feil ble ikke godkjent av administrasjonen
  feilIkkeGodkjent(begrunnelse, mottaker){

    let subject = 'Melding av feil';
    let html = '<div style="margin-left:36px"><p>Melding om feil kom ikke gjennom godkjenningsprosessen fordi:</p><p>' + begrunnelse
    + '</p></div><div style="float:left;margin-top:45px">'
    + '<img src="http://gdurl.com/BbIX" width="280"/></div><div style="margin-left:15px;margin-top:80px">'
    + '<p>E-post: contact@HverdagsHelt.no</p><p>tlf: +47 00 00 00 00</p><p>Prosjekt HverdagsHelt</p></div>';

    let mailOptions = {
      from: avsender,
      to: mottaker,
      subject: subject,
      html: html
    };

    transporter.sendMail(mailOptions, function(err, info){
      if(err){
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }

  //Oppdatering underveis av utbedring av meldt feil. Legge til bilder?
  feilStatusOppdatering(saksnummer, status, mottaker){

    let subject = 'Statusoppdatering av feil';
    let html = '<div style="margin-left:36px"><p>Meldt feil med saksnummer ' + saksnummer + ' er ' + status
    + '</p></div><div style="float:left;margin-top:45px"><img src="http://gdurl.com/BbIX" width="280"/>'
    + '</div><div style="margin-left:15px;margin-top:80px"><p>E-post: contact@HverdagsHelt.no</p>'
    + '<p>tlf: +47 00 00 00 00</p><p>Prosjekt HverdagsHelt</p></div>';

    let mailOptions = {
      from: avsender,
      to: mottaker,
      subject: subject,
      html: html
    };

    transporter.sendMail(mailOptions, function(err, info){
      if(err){
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }

  //E-post om at brukerregistreringen lykkes
  registreringsBekreftelse(brukernavn, mottaker){

    let subject = 'Brukerregistrering';
    let html = '<div style="margin-left:36px"><p>Brukerregistrering fullført, velkommen til Hverdagshelt, ' + brukernavn + '</p></div><div style="float:left;margin-top:45px">'
    + '<img src="http://gdurl.com/BbIX" width="280"/></div><div style="margin-left:15px;margin-top:80px">'
    + '<p>E-post: contact@HverdagsHelt.no</p><p>tlf: +47 00 00 00 00</p><p>Prosjekt HverdagsHelt</p></div>';

    let mailOptions = {
      from: avsender,
      to: mottaker,
      subject: subject,
      html: html
    };

    transporter.sendMail(mailOptions, function(err, info){
      if(err){
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }

  //E-post med nytt passord etter brukeren ba om nytt
  nyttPassord(passord, mottaker){

    let subject = 'Endring av passord';
    let html = '<div style="margin-left:36px"><p>Nytt passord:</p><p>' + passord + '</p></div>'
    + '<div style="float:left;margin-top:45px"><img src="http://gdurl.com/BbIX" width="280"/></div>'
    + '<div style="margin-left:15px;margin-top:80px"><p>E-post: contact@HverdagsHelt.no</p>'
    + '<p>tlf: +47 00 00 00 00</p><p>Prosjekt HverdagsHelt</p></div>';

    let mailOptions = {
      from: avsender,
      to: mottaker,
      subject: subject,
      html: html
    };

    transporter.sendMail(mailOptions, function(err, info){
      if(err){
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }

  //E-post med link til å lage nytt passord pga glemt passord
  glemtPassord(brukerMail, link){

    let subject = "Glemt passord";

    let html = '<div style="margin-left:36px"><p>Nytt passord:</p><p>'+"<a href=\"" + link + "\">Klikk her</a> for å resette ditt passord.</p></div>"
    + '<div style="float:left;margin-top:45px"><img src="http://gdurl.com/BbIX" width="280"/></div>'
    + '<div style="margin-left:15px;margin-top:80px"><p>E-post: contact@HverdagsHelt.no</p>'
    + '<p>tlf: +47 00 00 00 00</p><p>Prosjekt HverdagsHelt</p></div>';

    let mailOptions = {
      from: avsender,
      to: brukerMail,
      subject: subject,
      html:html
    };

    transporter.sendMail(mailOptions, function(err, info){
      if(err){
        console.log(err);
      } else {
        console.log(info);
      }
    });

  }

  // Resatt passord
  resattPassord(brukerMail, link){

    let subject = "Passordet er resatt";

    let html = '<div style="margin-left:36px"><p>Nytt passord:</p><p>'+ "Gå hit for å logge inn igjen" + link + '</p></div>'
    + '<div style="float:left;margin-top:45px"><img src="http://gdurl.com/BbIX" width="280"/></div>'
    + '<div style="margin-left:15px;margin-top:80px"><p>E-post: contact@HverdagsHelt.no</p>'
    + '<p>tlf: +47 00 00 00 00</p><p>Prosjekt HverdagsHelt</p></div>';

    let mailOptions = {
      from: avsender,
      to: brukerMail,
      subject: subject,
      html:html
    };

    transporter.sendMail(mailOptions, function(err, info){
      if(err){
        console.log(err);
      } else {
        console.log(info);
      }
    });

  }

  //Sender ut hendelse til alle i området
  hendelse(overskrift, tid, beskrivelse, sted, bilde, mottaker){

    let subject = overskrift;
    let html = '<div style="margin-left:36px"><p>' + overskrift + '</p><p>' + tid + '</p><p>' + sted
    + '</p><p>' + beskrivelse + '</p><img src="cid:bilde"/></div><div style="float:left;margin-top:45px">'
    + '<img src="http://gdurl.com/BbIX" width="280"/></div><div style="margin-left:15px;margin-top:80px">'
    + '<p>E-post: contact@HverdagsHelt.no</p><p>tlf: +47 00 00 00 00</p><p>Prosjekt HverdagsHelt</p></div>';

    let mailOptions = {
      from: avsender,
      to: mottaker, //hendelser skal sendes ut til mange, dermed må strengen av mottakere være i formatet "test1@test.test, test2@test.test... osv."
      subject: subject,
      html: html,
      attachments: [{
        filename: bilde,
        path: bilde, //bilde trenger veien til filen fra hvor denne biten kode kjøres. F.eks C:/Users/Username/image.jpg eller med scriptet som start ./image.jpg
        cid: 'bilde'
      }]
    };

    transporter.sendMail(mailOptions, function(err, info){
      if(err){
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }
}
