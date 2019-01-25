import * as React from 'react';
import {Component} from 'react-simplified';
import {Menu} from 'semantic-ui-react';
import {NavLink} from 'react-router-dom';

export class AnsattMeny extends Component {  
    render() {
      
      return (
        <div>
          <Menu vertical fixed="left" className="ansattMenyContainer">
            <Menu.Item>
              <Menu.Header>Feil og mangler</Menu.Header>
  
              <Menu.Menu>
                <Menu.Item
                    name='Oversikt'
                    as={NavLink}
                    to='/ansatt/oversikt'
                />
                <Menu.Item
                  name='Nye feil'
                  as={NavLink}
                  to='/ansatt/nyefeil'
                />
                <Menu.Item
                  name='Godkjent'
                  as={NavLink}
                  to='/ansatt/godkjent'
                />
                <Menu.Item
                  name='Under arbeid'
                  as={NavLink}
                  to='/ansatt/underbehandling'
                />
                <Menu.Item
                  name='Ferdig'
                  as={NavLink}
                  to='/ansatt/ferdig'
                />
              </Menu.Menu>
            </Menu.Item>
  
            <Menu.Item>
              <Menu.Header>Hendelser</Menu.Header>
              <Menu.Menu>
                <Menu.Item
                  name='Alle hendelser'
                  as={NavLink}
                  to='/ansatt/hendelser'
                />
              <Menu.Item
                name='Ny hendelse'
                as={NavLink}
                to='/ansatt/nyhendelse'
              />
              </Menu.Menu>
            </Menu.Item>
            <Menu.Item>
              <Menu.Header>Bedrifter</Menu.Header>
              <Menu.Menu>
                <Menu.Item
                  name='Alle bedrifter'
                  as={NavLink}
                  to='/ansatt/bedrifter/fullforte'
                />
              <Menu.Item
                name='Feil hos bedrifter'
                as={NavLink}
                to='/ansatt/bedrifter/feil'
              />
              <Menu.Item
                name='Registrer ny bedrift'
                as={NavLink}
                to='/registrerbedrift'
              />
              </Menu.Menu>
            </Menu.Item>
          </Menu>
        </div>
      )
    }
  }
  