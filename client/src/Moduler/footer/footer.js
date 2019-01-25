import * as React from 'react';
import {Component} from 'react-simplified';

/**
 * Meget enkel footer for å vise frem e-posten til HverdagsHelt og fylle bånn av siden.
 */

export class Footer extends Component {
  render() {
    return (
      <footer className="page-footer font-small blue pt-4 kontaktOss">
        <div className="footer-copyright text-center py-3">Kontakt oss:
          <br/><a href="mailto:HverdagsHeltTeam07@gmail.com">HverdagsHeltTeam07@gmail.com</a>
        </div>
      </footer>
    );
  }
}
