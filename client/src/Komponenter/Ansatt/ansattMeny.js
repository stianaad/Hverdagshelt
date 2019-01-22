import * as React from 'react';
import {Component} from 'react-simplified';
import {Menu} from 'semantic-ui-react';
import {NavLink} from 'react-router-dom';

export class AnsattMeny extends Component {
    handleItemClick = name => this.setState({ activeItem: name });
  
    render() {
      const { activeItem } = this.state || {};
  
      return (
        <div>
          <Menu vertical fixed="left" className="ansattMenyContainer">
            <Menu.Item>
              <Menu.Header>Feil og mangler</Menu.Header>
  
              <Menu.Menu>
                <NavLink exact to="/ansattest">
                  <Menu.Item
                    name='Oversikt'
                    active={activeItem === 'Oversikt'}
                    onClick={this.handleItemClick}
                  />
                </NavLink>
                <Menu.Item
                  name='Nye feil'
                  active={activeItem === 'Nye feil'}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  name='Under arbeid'
                  active={activeItem === 'Under behandling'}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  name='Ferdig'
                  active={activeItem === 'Ferdig'}
                  onClick={this.handleItemClick}
                />
              </Menu.Menu>
              
            </Menu.Item>
  
            <Menu.Item>
              <Menu.Header>Hendelser</Menu.Header>
  
              <Menu.Menu>
                <Menu.Item
                  name='Alle hendelser'
                  active={activeItem === 'Alle hendelser'}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  name='Ny hendelse'
                  active={activeItem === 'Ny hendelse'}
                  onClick={this.handleItemClick}
                />
              </Menu.Menu>
            </Menu.Item>
          </Menu>
        </div>
      )
    }
  }
  