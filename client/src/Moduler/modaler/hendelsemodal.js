import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Grid, Modal, Input, List, Image, Button } from 'semantic-ui-react';
import { hendelseService } from '../../services/hendelseService';
import { AbonnerKnapp } from '../abonner/abonner';

export class HendelseModal extends Component {
    open = false;

    async mounted() {
        this.open = this.props.open;
      }

      render() {
        return (
          <>
            {this.open ? (
              <Modal open={true} size="small" centered onClose={this.props.onClose}>
                <div className="hendelseModalBoks">
                  <Card.Header className="hendelseModalHeader">
                      <h1 className="hendelseModalTittel">
                        {this.props.hendelse.overskrift}
                      </h1>
                      <img
                      onClick={this.props.onClose}
                      className="hendelseModalX"
                      src="https://image.freepik.com/free-icon/x_318-27992.jpg"
                      width="20"
                      height="20"
                    />
                  </Card.Header>
                  <Card.Content className="hendelseModalInnhold">
                    <Grid fluid columns={2} stackable style={{margin:"0"}}>
                      <Grid.Column>
                        <Image rounded bordered src={this.props.hendelse.bilde} className="hendelseModalBilde"/>
                        <br />
                        {this.props.hendelse.billett && <a href={this.props.hendelse.billett} target="_blank"><Button floated='left' color='green' style={{height:"33.5px"}}>Kjøp billett</Button></a>}
                        {global.payload && global.payload.role == "privat" && this.props.abonner && <AbonnerKnapp style={{float:"right", width:"90px"}} key={this.props.hendelse.hendelse_id} hendelse_id={this.props.hendelse.hendelse_id} />}
                        <div className="hendelseModalSpace"></div>
                        <p><img src="https://image.flaticon.com/icons/svg/33/33622.svg" height="20" width="20" />&nbsp;{this.props.hendelse.sted}</p>
                        <p><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simple_icon_time.svg/750px-Simple_icon_time.svg.png" height="20" width="25" />&nbsp;{this.props.hendelse.tid}</p>
                      </Grid.Column>
                      <Grid.Column>
                        <h6><b>Detaljer:</b></h6>
                        <div className="hendelseModalBeskrivelse">{this.props.hendelse.beskrivelse.split("\n").map((tekst) => (
                          <p >{tekst}</p>))}
                        </div>
                      </Grid.Column>
                    </Grid>
                  </Card.Content>
                </div>
              </Modal>
            ) : null}
          </>
        );
      }
}