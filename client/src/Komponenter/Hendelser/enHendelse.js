import * as React from 'react';
import {Component} from 'react-simplified';
import {hendelseService} from '../../services/hendelseService';
import {HashRouter, Route, NavLink, Redirect, Switch} from 'react-router-dom';
import {FeedEvent, FeedHendelse, Filtrer, Info, Hendelse} from '../../Moduler/cardfeed';
import {Card, Feed, Grid, Button, Header, Icon, Image, Modal} from 'semantic-ui-react';
import {PageHeader} from '../../Moduler/header/header';

export class enHendelse extends Component {
  hendelse = {
    overskrift: '',
    beskrivelse: '',
    bilde: '',
    sted: '',
    tid: '',
    url: '',
  };

  enHendelse = [];

  render() {
    return (
      <div className="container">
        <PageHeader history={this.props.history} />

        <div className="row mt-10 center">
          <div className="col-sm-10 ">
            <div className="ml-10">
              <Card fluid>
                <Card.Content>
                  <div>
                    <h1>
                      {this.hendelse.overskrift}
                      <NavLink
                        to={'/hendelser/'}
                        onClick={() => {
                          this.visHendelser = false;
                        }}
                      >
                        <img
                          className="float-right"
                          src="https://image.freepik.com/free-icon/x_318-27992.jpg"
                          width="20"
                          height="20"
                        />
                      </NavLink>
                    </h1>
                    <div>
                      <Grid columns={1}>
                        <Grid.Column>
                          <img
                            src={this.hendelse.url}
                            className="img-fluid w-100 "
                          />
                          <br />
                          <div>
                            <Button color="green">Kjøp billetter</Button>
                            <Button floated="right" color="red">
                              Abonner
                            </Button>
                          </div>
                          <br />

                          <div>
                            <p>
                              <img src="https://image.flaticon.com/icons/svg/33/33622.svg" height="50" width="55" />
                              {this.hendelse.sted}, Trondheim, Norge{' '}
                            </p>
                            <p>
                              <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simple_icon_time.svg/750px-Simple_icon_time.svg.png"
                                height="50"
                                width="55"
                              />
                              {this.hendelse.tid}
                            </p>
                          </div>
                        </Grid.Column>
                        <Grid.Column>
                          <p>
                            {this.hendelse.beskrivelse}
                          </p>
                        </Grid.Column>
                      </Grid>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  async mounted() {
    /* let res1= await hendelseService.hentEnHendelse(1);
        let parsedata= JSON.parse(await res1.data[0]);
        console.log(res1.data[0].beskrivelse);
        this.enHendelse = parsedata;
        //console.log(this.enHendelse = JSON.parse(this.enHendelse = await res1.data[0]));
        
        
        this.hendelse.overskrift = await res1.data.overskrift;*/
  }
}
