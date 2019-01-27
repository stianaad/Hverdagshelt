import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Grid, Modal, Input, List,Button, Popup } from 'semantic-ui-react';
import { ShowMarkerMap } from '../kart/map';
import { feilService } from '../../services/feilService';
import { AbonnerKnapp } from '../abonner/abonner';

/**
 * Vinduet som kommer opp når man ønsker å redigere en feil
 * @reactProps {function()} onClose - Det som skal gjøres når vinduet lukkes. 
 * @reactProps {?function()} lukk - brukes for å laste inn informasjon på nytt når endringer lagres. 
 * @reactProps {boolean} open - true: vinduet skal være åpent. 
 * @reactProp {Object} feil - feilen som skal redigeres. 
 */
export class RedigerModal extends Component {

  /**
   * Skal vinduet være åpent eller ikke
   * @type {boolean} 
   * @default false */  
  open = false;

    /**
     * Bilder som hører til en feil
     * @type {Object[]}
     */
  bilderTilFeil = [];

  /**
   * Oppdateringer som hører til en feil
   * @type {Object[]}
   */
  oppTilFeil = [];

  /**
   * Om et bilde skal være åpent stort eller ikke
   * @type {boolean}
   * @default false
   */
  bildeOpen = false;

  /**
   * Det bildet man ønsker å se større
   * @property {number} bilde_id id-en som brukes for å skille bildene fra hverandre i databasen
   * @property {string} url link til hvor bildet er lagret i serveren. 
   */
  valgtBilde = {
      bilde_id: '',
      url: ''
  }

  /**
   * Den feilen man har valgt
   */
  feil = "";

  /**
   * Brukes for å lagre en ny overskrift til en feil
   * @type {string}
   */
  overskrift = ''; 

  /**
   * Brukes for å lagre en ny beskrivelse til en feil
   * @type {string}
   */
  beskrivelse = '';

  /** @ignore */
  async mounted() {
    this.overskrift = this.props.feil.overskrift; 
    this.beskrivelse = this.props.feil.beskrivelse;
    this.open = this.props.open;
    let res = await feilService.hentBilderTilFeil(this.props.feil.feil_id);
    this.bilderTilFeil = res.data; 
    this.feil = await {...this.props.feil};
  }

  /** @ignore */
  async slett(bilde){
    let res = await feilService.slettBildeFraFeil({bilde_id: bilde.bilde_id, feil_id: this.props.feil.feil_id, kommune_id: this.props.feil.kommune_id});
    await this.mounted();
    this.bildeOpen = await false;
  }

  /** @ignore */
  visBilde(bilde){
    this.valgtBilde = {...bilde};
    this.bildeOpen = true; 
  }

  /** @ignore */
  async lagre(){
    await feilService.oppdaterFeil({
        kommune_id : this.feil.kommune_id, 
        subkategori_id: this.feil.subkategori_id,
        overskrift: this.overskrift,
        beskrivelse: this.beskrivelse,
        lengdegrad: this.feil.lengdegrad,
        breddegrad: this.feil.breddegrad,
        feil_id: this.feil.feil_id
      });
    //this.props.lukk();  
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
                        <Button color="blue" onClick={() => {this.lagre(); this.props.lukk(); this.props.onClose()}}>Lagre</Button>
                    </div>
                </div>
            </Modal.Content>
          </Modal>
        ) : null}
        <Modal open={this.bildeOpen} onClose={() => { this.bildeOpen = false; }} basic centered className="modalwidth">
          <Modal.Content>
              <div className="bildevisning">
                <Grid>
                    <Grid.Row centered>
                        <img src={this.valgtBilde.url} className="godkjennBildeVisning"/>
                    </Grid.Row>
                    <Grid.Row centered>
                        <div style={{alignContent: 'center'}}>
                            <Popup trigger={<Button color="red" onClick={() => this.slett(this.valgtBilde)}>Slett</Button>} content="Hvis du trykker her slettes bildet automatisk."/>
                            <Button color="green" onClick={() => {this.bildeOpen = false; }}>Behold</Button>
                        </div>
                    </Grid.Row>
                </Grid>
              </div>
          </Modal.Content>
        </Modal>
      </>
    );
  }
}