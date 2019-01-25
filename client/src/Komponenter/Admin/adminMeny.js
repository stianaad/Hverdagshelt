import * as React from 'react';
import { Component } from 'react-simplified';
import { Menu } from 'semantic-ui-react';
import { NavLink, Link } from 'react-router-dom';

export class AdminMeny extends Component {

  render() {

    return (
      <div>
        <Menu vertical fixed="left" className="ansattMenyContainer">
          <Menu.Item>
            <Menu.Header>Administrasjon</Menu.Header>
            <Menu.Menu>
              <Menu.Item
                name='Startside'
                as={Link}
                to='/admin/startside'
              />
            </Menu.Menu>
            <Menu.Header>Feil og mangler</Menu.Header>

            <Menu.Menu>
              <Menu.Item
                name='Oversikt'
                as={NavLink}
                to={'/admin/' + (this.props.kommune && this.props.kommune.kommune_navn.toLowerCase()) + '/oversikt'}
              />
              <Menu.Item
                name='Nye feil'
                as={NavLink}
                to={'/admin/' + (this.props.kommune && this.props.kommune.kommune_navn.toLowerCase()) + '/nyefeil'}
              />
              <Menu.Item
                name='Godkjent'
                as={NavLink}
                to={'/admin/' + (this.props.kommune && this.props.kommune.kommune_navn.toLowerCase()) + '/godkjent'}
              />
              <Menu.Item
                name='Under arbeid'
                as={NavLink}
                to={'/admin/' + (this.props.kommune && this.props.kommune.kommune_navn.toLowerCase()) + '/underbehandling'}
              />
              <Menu.Item
                name='Ferdig'
                as={NavLink}
                to={'/admin/' + (this.props.kommune && this.props.kommune.kommune_navn.toLowerCase()) + '/ferdig'}
              />
            </Menu.Menu>
          </Menu.Item>

          <Menu.Item>
            <Menu.Header>Hendelser</Menu.Header>
            <Menu.Menu>
              <Menu.Item
                name='Alle hendelser'
                as={NavLink}
                to={'/admin/' + (this.props.kommune && this.props.kommune.kommune_navn.toLowerCase()) + '/hendelser'}
              />
              <Menu.Item
                name='Ny hendelse'
                as={NavLink}
                to={'/admin/' + (this.props.kommune && this.props.kommune.kommune_navn.toLowerCase()) + '/nyhendelse'}
              />
            </Menu.Menu>
          </Menu.Item>
          <Menu.Item>
            <Menu.Header>Bedrifter</Menu.Header>
            <Menu.Menu>
              <Menu.Item
                name='Alle bedrifter'
                as={NavLink}
                to={'/admin/' + (this.props.kommune && this.props.kommune.kommune_navn.toLowerCase()) + '/bedrifter/fullforte'}
              />
              <Menu.Item
                name='Feil hos bedrifter'
                as={NavLink}
                to={'/admin/' + (this.props.kommune && this.props.kommune.kommune_navn.toLowerCase()) + '/bedrifter/feil'}
              />
            </Menu.Menu>
          </Menu.Item>
          <Menu.Item>
              <Menu.Header>Statistikk</Menu.Header>
              <Menu.Menu>
                <Menu.Item 
                name='Nasjonal statistikk'
                as={NavLink}
                to='/statistikk'
                />
              </Menu.Menu>
            </Menu.Item>
        </Menu>
      </div>
    )
  }
}
