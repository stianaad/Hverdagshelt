import nodemailer from 'nodemailer';

const avsender = 'HverdagsHeltTeam07@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'HverdagsHeltTeam07@gmail.com',
    pass: 'HverdagsHeltTeam07SuperSecret',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = class epost {

  /**
   * Sender bekreftelse til en bruker at feilen er innsendt.
   * @param {number} feil_id - Iden til feilen som er meldt inn.
   * @param {string} mottaker - Eposten til brukeren som sendte inn feilen.
   */
  innsendtFeil(feil_id, mottaker) {
    let subject = 'Melding av feil';
    let html =
      '<div style="margin-left:36px"><p>Meldt feil med saksnummer ' +
      feil_id +
      ' er innsendt og avventer respons fra en kommuneansatt. Når feilen blir avslått/godkjent vil du bli varslet per mail.</p></div><div style="float:left;margin-top:45px">' +
      '<img src="http://drive.google.com/uc?export=view&id=1FTiZHS4274x2VpVfjt2jj7aIfBbvVfBg" width="280"/></div>' +
      '<div style="margin-left:15px;margin-top:80px"><p>E-post: contact@HverdagsHelt.no</p>' +
      '<p>tlf: +47 00 00 00 00</p><p>Prosjekt HverdagsHelt</p></div>';

    let mailOptions = {
      from: avsender,
      to: mottaker,
      subject: subject,
      html: html,
    };

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }

  /**
   * Response på en innlagt feil med saksnummer og bekreftelse på at den er registrert.
   * @param {number} saksnummer - Iden til saksnummer til feilen som er meldt inn.
   * @param {string} mottaker - Eposten til brukeren som sendte inn feilen.
   */
  feilGodkjent(saksnummer, mottaker) {
    let subject = 'Melding av feil';
    let html =
      '<div style="margin-left:36px"><p>Meldt feil med saksnummer ' +
      saksnummer +
      ' er godkjent og registrert for behandling</p></div><div style="float:left;margin-top:45px">' +
      '<img src="http://drive.google.com/uc?export=view&id=1FTiZHS4274x2VpVfjt2jj7aIfBbvVfBg" width="280"/></div>' +
      '<div style="margin-left:15px;margin-top:80px"><p>E-post: contact@HverdagsHelt.no</p>' +
      '<p>tlf: +47 00 00 00 00</p><p>Prosjekt HverdagsHelt</p></div>';

    let mailOptions = {
      from: avsender,
      to: mottaker,
      subject: subject,
      html: html,
    };
    console.log('Hello im sending mail');
    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }

  /**
   * Melding om feil ble ikke godkjent av administrasjonen.
   * @param {string} begrunnelse - Begrunnelsen til hvorfor en meldt inn feil ikke ble godkjent.
   * @param {string} mottaker - Eposten til brukeren som sendte inn feilen.
   */
  feilIkkeGodkjent(begrunnelse, mottaker) {
    let subject = 'Melding av feil';
    let html =
      '<div style="margin-left:36px"><p>Melding om feil kom ikke gjennom godkjenningsprosessen fordi:</p><p>' +
      begrunnelse +
      '</p></div><div style="float:left;margin-top:45px">' +
      '<img src="http://drive.google.com/uc?export=view&id=1FTiZHS4274x2VpVfjt2jj7aIfBbvVfBg" width="280"/></div><div style="margin-left:15px;margin-top:80px">' +
      '<p>E-post: contact@HverdagsHelt.no</p><p>tlf: +47 00 00 00 00</p><p>Prosjekt HverdagsHelt</p></div>';

    let mailOptions = {
      from: avsender,
      to: mottaker,
      subject: subject,
      html: html,
    };

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }

  /**
   * Oppdatering underveis av utbedring av meldt feil.
   * @param {number} saksnummer - Saksnummer er iden til feilen.
   * @param {string} status - Status sier hvor langt feilen har kommet i behandling.
   * @param {string} mottaker - Eposten til brukeren.
   */
  feilStatusOppdatering(saksnummer, status, mottaker) {
    let subject = 'Statusoppdatering av feil';
    let html =
      '<div style="margin-left:36px"><p>Meldt feil med saksnummer ' +
      saksnummer +
      ' er ' +
      status +
      '</p></div><div style="float:left;margin-top:45px"><img src="http://drive.google.com/uc?export=view&id=1FTiZHS4274x2VpVfjt2jj7aIfBbvVfBg" width="280"/>' +
      '</div><div style="margin-left:15px;margin-top:80px"><p>E-post: contact@HverdagsHelt.no</p>' +
      '<p>tlf: +47 00 00 00 00</p><p>Prosjekt HverdagsHelt</p></div>';

    let mailOptions = {
      from: avsender,
      to: mottaker,
      subject: subject,
      html: html,
    };

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }

  /**
   * E-post om at brukerregistreringen lykkes.
   * @param {string} brukernavn - Brukernavnet til brukeren som har blitt registrert.
   * @param {string} mottaker - Eposten til brukeren.
   */
  registreringsBekreftelse(brukernavn, mottaker) {
    let subject = 'Brukerregistrering';
    let html =
      '<div style="margin-left:36px"><p>' +
      'Velkommen til HverdagsHelt, ' +
      brukernavn +
      '!' +
      '</p></div><div style="float:left;margin-top:45px">' +
      '<img src="http://drive.google.com/uc?export=view&id=1FTiZHS4274x2VpVfjt2jj7aIfBbvVfBg" width="280"/></div><div style="margin-left:15px;margin-top:80px">' +
      '<p>E-post: contact@HverdagsHelt.no</p><p>tlf: +47 00 00 00 00</p><p>Prosjekt HverdagsHelt</p></div>';

    let mailOptions = {
      from: avsender,
      to: mottaker,
      subject: subject,
      html: html,
    };

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }

  /**
   * E-post med nytt passord etter brukeren ba om nytt.
   * @param {string} brukernavn - Det nye passordet.
   * @param {string} mottaker - Eposten til brukeren.
   */
  nyttPassord(passord, mottaker) {
    let subject = 'Endring av passord';
    let html =
      '<div style="margin-left:36px"><p>Nytt passord:</p><p>' +
      passord +
      '</p></div>' +
      '<div style="float:left;margin-top:45px"><img src="http://drive.google.com/uc?export=view&id=1FTiZHS4274x2VpVfjt2jj7aIfBbvVfBg" width="280"/></div>' +
      '<div style="margin-left:15px;margin-top:80px"><p>E-post: contact@HverdagsHelt.no</p>' +
      '<p>tlf: +47 00 00 00 00</p><p>Prosjekt HverdagsHelt</p></div>';

    let mailOptions = {
      from: avsender,
      to: mottaker,
      subject: subject,
      html: html,
    };

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }

  /**
   * E-post med link til å lage nytt passord pga glemt passord.
   * @param {string} brukerMail - Epost til bruker.
   * @param {string} link - Lenken.
   */
  glemtPassord(brukerMail, link) {
    let subject = 'Glemt passord';

    let html =
      '<div style="margin-left:36px"><p>Nytt passord:</p><p>' +
      '<a href="' +
      link +
      '">Klikk her</a> for å resette ditt passord.</p></div>' +
      '<div style="float:left;margin-top:45px"><img src="http://drive.google.com/uc?export=view&id=1FTiZHS4274x2VpVfjt2jj7aIfBbvVfBg" width="280"/></div>' +
      '<div style="margin-left:15px;margin-top:80px"><p>E-post: contact@HverdagsHelt.no</p>' +
      '<p>tlf: +47 00 00 00 00</p><p>Prosjekt HverdagsHelt</p></div>';

    let mailOptions = {
      from: avsender,
      to: brukerMail,
      subject: subject,
      html: html,
    };

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }

  /**
   * E-post med link og beskjed at passordet har blit resatt.
   * @param {string} brukerMail - Epost til bruker.
   * @param {string} link - Lenken.
   */
  resattPassord(brukerMail, link) {
    let subject = 'Passordet er resatt';

    let html =
      '<div style="margin-left:36px"><p>Nytt passord:</p><p>' +
      'Gå hit for å logge inn igjen' +
      link +
      '</p></div>' +
      '<div style="float:left;margin-top:45px"><img src="http://drive.google.com/uc?export=view&id=1FTiZHS4274x2VpVfjt2jj7aIfBbvVfBg" width="280"/></div>' +
      '<div style="margin-left:15px;margin-top:80px"><p>E-post: contact@HverdagsHelt.no</p>' +
      '<p>tlf: +47 00 00 00 00</p><p>Prosjekt HverdagsHelt</p></div>';

    let mailOptions = {
      from: avsender,
      to: brukerMail,
      subject: subject,
      html: html,
    };

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }

  /**
   *Sender ut hendelse til alle i området.
   * @param {string} overskrift - Overskrift på hendelsen.
   * @param {string} tid - Tidspunktet til hendelsen.
   * @param {string} beskrivelse - Beskrivelse til hendelsen.
   * @param {string} sted - Hvor hendelsen skjer.
   * @param {string} bilde - Bilder relatert til hendelsen.
   * @param {string} eposter - Epostene til alle som er i området.
   */
  hendelse(overskrift, tid, beskrivelse, sted, bilde, eposter) {
    let subject = overskrift;
    let html =
      '<div style="margin-left:36px"><p>Ny hendelse i ditt fylke!</p><p>' +
      overskrift +
      '</p><p>' +
      tid +
      '</p><p>' +
      sted +
      '</p><p>' +
      beskrivelse +
      '.</p><br>' +
      '<img src="cid:bilde"/></div><div style="float:left;margin-top:45px">' +
      '<p>Dette er en varsel om at en hendelse skjer i ditt fylke. Dersom du ønsker å ikke få mail på dette kan du endre innstillingene dine på Min Side.</p>' +
      '<img src="http://drive.google.com/uc?export=view&id=1FTiZHS4274x2VpVfjt2jj7aIfBbvVfBg" width="280"/></div><div style="margin-left:15px;margin-top:80px">' +
      '<p>E-post: contact@HverdagsHelt.no</p><p>tlf: +47 00 00 00 00</p><p>Prosjekt HverdagsHelt</p></div>';

    let mottaker = eposter.join(', ');

    let mailOptions = {
      from: avsender,
      bcc: mottaker, //hendelser skal sendes ut til mange, dermed må strengen av mottakere være i formatet "test1@test.test, test2@test.test... osv."
      subject: subject,
      html: html,
      attachments: [
        {
          filename: bilde,
          path: bilde, //bilde trenger veien til filen fra hvor denne biten kode kjøres. F.eks C:/Users/Username/image.jpg eller med scriptet som start ./image.jpg
          cid: 'bilde',
        },
      ],
    };

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }
};
