import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Grid, Modal, Input, List,Button } from 'semantic-ui-react';
import { ShowMarkerMap } from '../kart/map';
import { feilService } from '../../services/feilService';
import { AbonnerKnapp } from '../abonner/abonner';

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
          <Modal open={true} centered onClose={this.props.onClose}>
            <div className="feilModalBoks">
              <Card.Header className="feilModalHeader">
                  <h1 className="feilModalTittel">
                    {this.props.feil.overskrift}
                  </h1>
                  <span>
                    Status: {(this.props.feil.status== "Godkjent") ? (<span>Mottatt</span>) : (this.props.feil.status)}
                    {this.props.feil.status !== 'Under behandling' ? (
                      this.props.feil.status === 'Ferdig' ? (
                        <img src="/successicon.png" width="30" height="30" />
                      ) : (
                        <img src="/warningicon.png" width="30" height="30" />
                      )
                    ) : (
                      <img src="/processingicon.png" width="30" height="30" />
                    )}
                  {this.props.aksepter && (<span>
                            <Button
                              floated="right"
                              color="red"
                              size="small"
                              onClick={() => {
                                this.props.avslaJobb(this.props.feil.feil_id);
                              }}
                            >
                              Ikke godta
                            </Button>
                            <Button
                              floated="right"
                              color="green"
                              size="small"
                              onClick={() => {
                                this.props.godtaJobb(this.props.feil.feil_id);
                              }}>
                              Godta jobb
                            </Button>
                          </span>)}
                  {this.props.abonner && (<AbonnerKnapp style={{float:"right", width:"90px"}} key={this.props.feil.feil_id} feil_id={this.props.feil.feil_id} />)}
                  </span>
                  <img
                      onClick={this.props.onClose}
                      className="feilModalX"
                      src="https://image.freepik.com/free-icon/x_318-27992.jpg"
                      width="20"
                      height="20"
                    />
              </Card.Header>
                <Grid fluid="true" columns={3} stackable className="feilModalInnhold" style={{margin:"0", overflowY:"auto"}}>
                  <Grid.Column>
                    <h6><b>Beskrivelse:</b></h6>
                    <div className="feilModalBeskrivelse">{this.props.feil.beskrivelse.split("\n").map((tekst,i) => (
                        <p key={i}>{tekst}</p>))}
                    </div>
                  </Grid.Column>
                  <Grid.Column>
                    <h6><b>Posisjon:</b></h6>
                    <ShowMarkerMap width="100%" height="300px" id="posmap" feil={this.props.feil} />
                  </Grid.Column>
                  <Grid.Column>
                    <div className="feilModalBoks feilModalRad">
                      <h6><b>Oppdateringer:</b></h6>
                      <div className="feilModalFyll">
                        <List className="p-2">
                          {this.oppTilFeil.map((opp) => (
                            <List.Item key={opp.tid + ' '+ opp.status}>
                              <List.Content>
                                <List.Header>{opp.status}<span className="float-right font-weight-light font-italic">{opp.tid}</span></List.Header>
                                <List.Description>{opp.kommentar}</List.Description>
                              </List.Content>
                            </List.Item>
                          ))}
                        </List>
                      </div>
                    </div>

                    <div className="feilModalBoks feilModalRad">
                      <h6><b>Bilder:</b></h6>
                      <div className="feilModalFyll">
                        {this.bilderTilFeil.map((bilde) => (
                          <div className="feilModalBilde" key={bilde.bilde_id} onClick={() => this.visBilde(bilde.url)}>
                            <img src={bilde.url} key={bilde.bilde_id} className="bilder" onClick={() => { this.bildeModal = bilde.url; this.bildeOpen = true; }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </Grid.Column>
                </Grid>
            </div>
          </Modal>
        ) : null}
        <Modal open={this.bildeOpen} onClose={() => { this.bildeOpen = false; }} basic centered className="modalwidth">
          <Modal.Content>
            <img src={this.bildeModal} className="bildevisning" />
          </Modal.Content>
        </Modal>
      </>
    );
  }
}