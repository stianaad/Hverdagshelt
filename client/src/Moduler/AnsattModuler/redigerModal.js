import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Grid, Modal, Input, List,Button } from 'semantic-ui-react';
import { ShowMarkerMap } from '../kart/map';
import { feilService } from '../../services/feilService';
import { AbonnerKnapp } from '../abonner/abonner';

export class RedigerModal extends Component {
  open = false;
  bilderTilFeil = [];
  oppTilFeil = [];

  bildeOpen = false;
  bildeModal = "";

  overskrift = "";
  beskrivelse = "";

  async mounted() {
    this.open = this.props.open;

    let res = await feilService.hentBilderTilFeil(this.props.feil.feil_id);
    this.bilderTilFeil = res.data; 
  }

  render() {
    return (
      <>
        {this.open ? (
          <Modal open={true} centered onClose={this.props.onClose}>
            <Modal.Header>
                <div className="row justify-content-md-center">
                    <h1>Rediger feil</h1>
                </div>
            </Modal.Header>
            <Modal.Content scrolling>
                <div className="row justify-content-md-center mt-3 mb-3">
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label>Overskrift</label>
                            <input type="text" className="form-control" value={this.props.feil.overskrift}
                            required={true}
                            onChange={(event) => (this.overskrift = event.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Beskrivelse</label>
                            <textarea type="text" className="form-control" value={this.props.feil.beskrivelse}
                            required={true}
                            onChange={(event) => (this.beskrivelse = event.target.value)} />
                        </div>
                        <div>
                            <h6><b>Bilder:</b></h6>
                            <div className="feilModalFyll">
                                {this.bilderTilFeil.map((bilde) => (
                                <div className="feilModalBilde" key={bilde.bilde_id} onClick={() => this.visBilde(bilde.url)}>
                                    <img src={bilde.url} key={bilde.bilde_id} className="bilder" onClick={() => { this.bildeModal = bilde.url; this.bildeOpen = true; }} />
                                </div>
                                ))}
                            </div>
                        </div>
                        <Button color="blue">Lagre</Button>
                    </div>
                </div>
            </Modal.Content>
          </Modal>
        ) : null}
        <Modal open={this.bildeOpen} onClose={() => { this.bildeOpen = false; }} basic centered className="modalwidth">
          <Modal.Content>
              <div className="godkjennBildeVisning">
                <img src={this.bildeModal}/>
                <div>
                    <Button color="red">Slett</Button>
                    <Button color="green">Behold</Button>
                </div>
              </div>
          </Modal.Content>
        </Modal>
        
      </>
    );
  }
}