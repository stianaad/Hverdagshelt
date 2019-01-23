import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Grid, Image, Modal, Input, List } from 'semantic-ui-react';
import { ShowMarkerMap } from '../kart/map';
import { feilService } from '../../services/feilService';

export class FeilModal extends Component {
  open = false;
  bilderTilFeil = [];
  oppTilFeil = [];

  bildeOpen = false;
  bildeModal = "";

  async mounted() {
    this.open = this.props.open;
    if (this.open) {
      let res1 = await feilService.hentBilderTilFeil(this.props.feil.feil_id),
        res2 = await feilService.hentAlleOppdateringerPaaFeil(this.props.feil.feil_id);
      this.bilderTilFeil = await res1.data;
      this.oppTilFeil = await res2.data;
    }
  }


  render() {
    return (
      <>
        {this.open ? (
          <Modal open={true} size="medium" centered onClose={this.props.onClose}>
            <Card.Content>
              <div>
                <h1>
                  {this.props.feil.overskrift}
                  <img
                    style={{ cursor: "pointer" }}
                    onClick={this.props.onClose}
                    className="float-right"
                    src="https://image.freepik.com/free-icon/x_318-27992.jpg"
                    width="20"
                    height="20"
                  />
                </h1>
                <h6>
                  Status: {this.props.feil.status} <img src="/warningicon.png" width="30" height="30" />
                </h6>
              </div>
            </Card.Content>
            <Card.Content extra>
              <Grid fluid columns={3}>
                <Grid.Column>
                  <h6>Beskrivelse</h6>
                  <Input>{this.props.feil.beskrivelse}</Input>
                </Grid.Column>
                <Grid.Column>
                  <h6>Posisjon</h6>
                  <ShowMarkerMap width="100%" height="300px" id="posmap" feil={this.props.feil} />
                </Grid.Column>
                <Grid.Column>
                  <h6>Oppdateringer: </h6>
                  <div className="oppdateringScroll">
                    <List className="p-2">
                      {this.oppTilFeil.map((opp) => (
                        <List.Item>
                          <List.Content>
                            <List.Header>{opp.status}<span className="float-right font-weight-light font-italic">{opp.tid}</span></List.Header>
                            <List.Description>{opp.kommentar}</List.Description>
                          </List.Content>
                        </List.Item>
                      ))}
                    </List>
                  </div>
                  <br />
                  <div className="bildeBoks">
                    <h6>Bilder:</h6>
                    <Grid columns={5}>
                      {this.bilderTilFeil.map((bilde) => (
                        <Grid.Column key={bilde.bilde_id}>
                          <div onClick={() => this.visBilde(bilde.url)}>
                            <img src={bilde.url} key={bilde.bilde_id} className="bilder" onClick={() => { this.bildeModal = bilde.url; this.bildeOpen = true; }} />
                          </div>
                        </Grid.Column>
                      ))}
                    </Grid>
                  </div>
                </Grid.Column>
              </Grid>
            </Card.Content>
          </Modal>
        ) : null}
        <Modal open={this.bildeOpen} onClose={()=>{this.bildeOpen = false;}} basic centered className="modalwidth">
          <Modal.Content>
            <img src={this.bildeModal} className="bildevisning" />
          </Modal.Content>
        </Modal>
      </>
    );
  }
}