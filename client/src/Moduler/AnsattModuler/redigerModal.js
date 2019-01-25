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
  valgtBilde = {
      bilde_id: '',
      url: ''
  }

  feil = "";

  overskrift = this.props.feil.overskrift; 
  beskrivelse = this.props.feil.beskrivelse;

  async mounted() {
    this.open = this.props.open;
    let res = await feilService.hentBilderTilFeil(this.props.feil.feil_id);
    this.bilderTilFeil = res.data; 
    this.feil = await {...this.props.feil};
  }

  async slett(bilde){
    let res = await feilService.slettBildeFraFeil({bilde_id: bilde.bilde_id, feil_id: this.props.feil.feil_id, kommune_id: this.props.feil.kommune_id});
    await this.mounted();
    this.bildeOpen = await false;
  }

  visBilde(bilde){
    this.valgtBilde = {...bilde};
    this.bildeOpen = true; 
  }

  async lagre(){
    await feilService.oppdaterFeil({
        kommune_id : this.props.feil.kommune_id, 
        subkategori_id: this.feil.subkategori_id,
        overskrift: this.overskrift,
        beskrivelse: this.beskrivelse,
        lengdegrad: this.feil.lengdegrad,
        breddegrad: this.feil.breddegrad,
        feil_id: this.feil.feil_id
      });
    
    await this.props.onClose; 
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
                            <input type="text" className="form-control"
                            required={true}
                            onChange={(event) => (this.overskrift=event.target.value)} 
                            value={this.overskrift}/>
                        </div>
                        <div className="form-group">
                            <label>Beskrivelse</label>
                            <textarea type="text" className="form-control" 
                            required={true}
                            onChange={(event) => (this.beskrivelse = event.target.value)} 
                            value={this.beskrivelse}/>
                        </div>
                        <div>
                            <h6><b>Bilder:</b></h6>
                            <div className="feilModalFyll">
                                {this.bilderTilFeil.map((bilde) => (
                                <div className="feilModalBilde" key={bilde.bilde_id} onClick={() => this.visBilde(bilde)}>
                                    <img src={bilde.url} key={bilde.bilde_id} className="bilder" onClick={() => this.visBilde(bilde)} />
                                </div>
                                ))}
                            </div>
                        </div>
                        <Button color="blue" onClick={this.lagre}>Lagre</Button>
                    </div>
                </div>
            </Modal.Content>
          </Modal>
        ) : null}
        <Modal open={this.bildeOpen} onClose={() => { this.bildeOpen = false; }} basic centered className="modalwidth">
          <Modal.Content>
              <div className="bildevisning">
                <img src={this.valgtBilde.url} className="godkjennBildeVisning"/>
                <div style={{alignContent: 'center'}}>
                    <Button color="red" onClick={() => this.slett(this.valgtBilde)}>Slett</Button>
                    <Button color="green" onClick={() => {this.bildeOpen = false; }}>Behold</Button>
                </div>
              </div>
          </Modal.Content>
        </Modal>
        
      </>
    );
  }
}