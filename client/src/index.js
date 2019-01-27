/* eslint eqeqeq: "off" */
import * as React from 'react';
import {Component, sharedComponentData} from 'react-simplified';
import {Router, Route, NavLink, Redirect, Switch} from 'react-router-dom';
import ReactDOM from 'react-dom';
import {MeldFeil} from './Komponenter/MeldFeil/meldFeil';
import {Statistikk} from './Komponenter/Statistikk/statistikk';
import {Registrering} from './Komponenter/Registrering/registrering';
import {RegistrerBedrift} from './Komponenter/Registrering/registrerBedrift';
import {RegistrerAnsatt} from './Komponenter/Registrering/registrerAnsatt';
import {RegistrerAdmin} from './Komponenter/Registrering/registrerAdmin';
import {MineOppgaver} from './Komponenter/Ansatt/mineOppgaver';
import {Forside} from './Komponenter/Forside/forside';
import {Hovedside} from './Komponenter/hovedside/hovedside';
import {Minside} from './Komponenter/MinSide/minside';
import {FireNullFire} from './Komponenter/firenullfire/firenullfire';
import {GlemtPassord} from '../src/Komponenter/GlemtPassord/glemtPassord';
import {ResettPassord} from '../src/Komponenter/GlemtPassord/resettPassord';
import {Hendelser} from '../src/Komponenter/Hendelser/hendelser';
import {Bedrift} from '../src/Komponenter/Bedrift/bedrift';
import {RegistrerNyKategori} from '../src/Komponenter/Admin/registrerNyKategori';
import createBrowserHistory from 'history/createBrowserHistory';
import {NyeFeil} from './Komponenter/Ansatt/ansattNye';
import {AnsattFerdig} from './Komponenter/Ansatt/ansattFerdige';
import {NyHendelse} from './Komponenter/Ansatt/nyhendelse';
import {AnsattOversikt} from './Komponenter/Ansatt/ansattOversikt';
import {AnsattUnder} from './Komponenter/Ansatt/ansattUnderBehandling';
import {AnsattHendelser } from './Komponenter/Ansatt/ansattHendelser';
import {AnsattGodkjent} from './Komponenter/Ansatt/ansattGodkjent';
import { AlleBedrifter } from './Komponenter/Ansatt/alleBedrifter';
import { Administrasjon } from './Komponenter/Admin/admin';
import { FeilHosBedrift } from './Komponenter/Ansatt/feilHosBedrift';
const history = createBrowserHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

global.sideRefresh = (hard) => {
  setTimeout(() => {
    let path = window.location.pathname;
    history.push('/refresh');
    if (hard) ReactDOM.render(routes(), root);
    history.replace(path);
  }, 0);
};

global.sidePush = (path, hard) => {
  setTimeout(() => {
    history.push('/refresh');
    if (hard) ReactDOM.render(routes(), root);
    history.replace(path);
  }, 0);
};

setInterval(()=>{
  if (global.payload && global.payload.exp < (new Date().getTime()/1000)) {
    sessionStorage.removeItem('pollett');
    global.payload = null;
    global.sidePush("/", true);
  }
},60000);

let token = sessionStorage.getItem('pollett');
if (token) {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace('-', '+').replace('_', '/');
  global.payload = JSON.parse(window.atob(base64));
}

const routes = () => {
  return (
    <Router history={history}>
      <div>
        <Switch>
          {/*Routes som er tilgjengelige for alle*/}
          <Route
            exact
            path="/refresh"
            component={() => {
              return null;
            }}
          />
          <Route exact path="/" component={Forside} history={history} />
          <Route exact path="/hovedside/:kommune" component={Hovedside} history={history} />
          <Route exact path="/hendelser" component={Hendelser}/>

          {/*Under ligger spesielle routes*/}
          {global.payload == null
            ? //Ikke logget inn
              [
                <Route exact path="/registrering" key="registrering" component={Registrering} history={history} />,
                <Route exact path="/glemt-passord" key="glemt-passord" component={GlemtPassord} history={history}/>,
                <Route exact path="/resett-passord/:token" key="resett-passord" component={ResettPassord} history={history}/>,
                <Redirect from="/meldfeil" key="meldfeil" to="/" />,
                <Redirect from="/minside" key="minside" to="/" />,
                <Redirect from="/mineoppgaver" key="mineoppgaver" to="/" />,
              ]
            : global.payload.role == 'privat'
            ? //Privatbruker routes
              [
                <Route exact path="/meldfeil" key="meldfeil" component={MeldFeil} history={history} />,
                <Route exact path="/minside" key="minside" component={Minside} history={history} />,
              ]
            : global.payload.role == 'ansatt'
            ? //Ansatt routes
              [
                <Route exact path="/statistikk" component={Statistikk} history={history} />,
                <Route exact path="/registrerbedrift" key="registrerbedrift"component={RegistrerBedrift} history={history} />,
                <Route exact path="/ansatt/nyefeil" key="nyefeil" component={NyeFeil} history={history}/>,
                <Route exact path="/ansatt/nyhendelse" key="nyhendelse" component={NyHendelse} history={history}/>,
                <Route exact path="/ansatt/oversikt" key="oversikt" component={AnsattOversikt} history={history}/>,
                <Route exact path="/ansatt/underbehandling" key="underbehandling" component={AnsattUnder} history={history}/>,
                <Route exact path="/ansatt/ferdig" key="ferdig" component={AnsattFerdig} history={history}/>,
                <Route exact path="/ansatt/hendelser" key="hendelser"component={AnsattHendelser} history={history}/>,
                <Route exact path="/ansatt/godkjent" key="godkjent"component={AnsattGodkjent} history={history}/>,
                <Route exact path='/ansatt/bedrifter/fullforte' key='bedrifterfull' component={AlleBedrifter} history={history}/>,
                <Route exact path='/ansatt/bedrifter/feil' key='bedrifterfeil' component={FeilHosBedrift} history={history}/>
              ]
            : global.payload.role == 'bedrift'
            ? //Bedrift routes
              [<Route exact path="/mineoppgaver" key="mineoppgaver" component={Bedrift} history={history} />]
            : global.payload.role == 'admin'
            ? //Admin routes
              [
              <Route exact path="/meldfeil" key="meldfeil" component={MeldFeil} history={history} />,
              <Route exact path="/statistikk" component={Statistikk} history={history} />,

              <Route exact path="/registreransatt" key="registreransatt"component={RegistrerAnsatt} history={history} />,
              <Route exact path="/registrerbedrift" key="registrerbedrift"component={RegistrerBedrift} history={history} />,
              <Route exact path="/registreradmin" key="registreradmin"component={RegistrerAdmin} history={history} />,
              
              <Route exact path="/admin/startside" key="administrasjon" component={Administrasjon} history={history} />,
              <Route exact path="/admin/kategori" key="kategori" component={RegistrerNyKategori} history={history} />,
              <Route exact path='/admin/bedrifter' key='bedrifter' component={AlleBedrifter} history={history}/>,
              <Route exact path="/admin/:kommune/oversikt" key="oversikt" component={AnsattOversikt} history={history}/>,
              <Route exact path="/admin/:kommune/nyefeil" key="nyefeil" component={NyeFeil} history={history}/>,
              <Route exact path="/admin/:kommune/nyhendelse" key="nyhendelse" component={NyHendelse} history={history}/>,
              <Route exact path="/admin/:kommune/underbehandling" key="underbehandling" component={AnsattUnder} history={history}/>,
              <Route exact path="/admin/:kommune/ferdig" key="ferdig" component={AnsattFerdig} history={history}/>,
              <Route exact path="/admin/:kommune/hendelser" key="hendelser"component={AnsattHendelser} history={history}/>,
              <Route exact path="/admin/:kommune/godkjent" key="godkjent"component={AnsattGodkjent} history={history}/>,
              <Route exact path='/admin/:kommune/bedrifter/fullforte' key='bedrifterfull' component={AlleBedrifter} history={history}/>,
              <Route exact path='/admin/:kommune/bedrifter/feil' key='bedrifterfeil' component={FeilHosBedrift} history={history}/>,
              ]
            : null}

          {/*Siden eksisterer ikke/ingen tilgang*/}
          <Route component={FireNullFire} history={history} />
        </Switch>
      </div>
    </Router>
  );
};

const root = document.getElementById('root');
if (root) ReactDOM.render(routes(), root);
