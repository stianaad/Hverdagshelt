import * as React from 'react';
import {PageHeader} from '../../Moduler/header/header';
import {Component, sharedComponentData} from 'react-simplified';
import {feilService} from '../../services/feilService';
import {Card, Feed, Grid, Button, Header, Icon, Image, Popup, Modal, Input, List,Dropdown} from 'semantic-ui-react';
import {FeedEvent, FeedHendelse, Filtrer, Info, FeedMinside, ModalHendelse} from '../../Moduler/cardfeed';
import {brukerService} from '../../services/brukerService';
import {NavLink,Link} from 'react-router-dom';
import {markerTabell, ShowMarkerMap} from '../../Moduler/kart/map';

export class Minside extends Component {
  oppdaterteFeil = [];
  ikkeOppdaterteFeil = [];
  folgteFeil = [];
  folgteHendelser = [];
  valgtFeil = {
    overskrift: '',
    bilde: '',
    beskrivelse: '',
  };

  bruker = {
    fornavn: '',
    etternavn: '',
    epost: '',
    kommune_id: -1,
  }
  valgteHendelse = {
    overskrift: '',
    bilde: '',
    tid: '',
    sted: '',
    kommune_navn: ''
  };

  visHendelse = false;

  visFeil = false;

  classFeil = 'hovedsideTabeller';

  state = {open: false};

  handleOpen = (feil) => {
    if(this.visHendelse){
      this.valgteHendelse= {...feil};
      console.log(this.valgteHendelse);
      console.log("ehehheh")
    } else {
      this.valgtFeil = {...feil};
    }
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    return (
      <div>
        <PageHeader history={this.props.history} location={this.props.location} />
        <Modal open={this.state.open} onClose={this.handleClose} size="small" centered={true} dimmer="blurring">
          {/*<Modal.Header>
                        {this.valgtFeil.overskrift}
                    </Modal.Header>*/}
                    {(!this.visHendelse) ? ( <Modal.Content>
            <div>
              <Card fluid>
                <Card.Content>
                  <div>
                    <h1>
                      {this.valgtFeil.overskrift}
                      <NavLink to={'/minside'} onClick={this.handleClose}>
                        <img
                          className="float-right"
                          src="https://image.freepik.com/free-icon/x_318-27992.jpg"
                          width="20"
                          height="20"
                        />
                      </NavLink>
                    </h1>
                    <h6>
                      Status: {this.valgtFeil.status} <img src="/warningicon.png" width="30" height="30" />
                    </h6>
                  </div>
                </Card.Content>
                <Card.Content extra>
                  <Grid fluid columns={3}>
                    <Grid.Column>
                      <h6>Beskrivelse</h6>
                      <Input>{this.valgtFeil.beskrivelse}</Input>
                    </Grid.Column>
                    <Grid.Column>
                      <h6>Posisjon</h6>
                      <ShowMarkerMap width="100%" height="300px" id="posmap" feil={this.valgtFeil} />
                    </Grid.Column>
                    <Grid.Column>
                      <List>
                        <List.Item>
                          <List.Content>
                            <List.Header>Godkjent</List.Header>
                            <List.Description>01.01.18 19:00</List.Description>
                          </List.Content>
                        </List.Item>
                        <List.Item>
                          <List.Content>
                            <List.Header>Godkjent</List.Header>
                            <List.Description>01.01.18 19:00</List.Description>
                          </List.Content>
                        </List.Item>
                        <List.Item>
                          <List.Content>
                            <List.Header>Godkjent</List.Header>
                            <List.Description>01.01.18 19:00</List.Description>
                          </List.Content>
                        </List.Item>
                        <List.Item>
                          <List.Content>
                            <List.Header>Godkjent</List.Header>
                            <List.Description>01.01.18 19:00</List.Description>
                          </List.Content>
                        </List.Item>
                      </List>
                      <Image.Group size="tiny">
                        <Image src="/lofoten.jpg" />
                        <Image src="/lofoten.jpg" />
                        <Image src="/lofoten.jpg" />
                        <Image src="/lofoten.jpg" />
                        <Image src="/lofoten.jpg" />
                        <Image src="/lofoten.jpg" />
                      </Image.Group>
                    </Grid.Column>
                  </Grid>
                </Card.Content>
              </Card>
            </div>
          </Modal.Content>) 
          : (
            <ModalHendelse overskrift={this.valgteHendelse.overskrift} url={this.valgteHendelse.bilde} tid={this.valgteHendelse.tid} sted={this.valgteHendelse.sted} kommune_navn={this.valgteHendelse.kommune_navn}/>
            )}
        </Modal>
        <div className="mt-3 hovedTittel">
          <h1 className="text-center text-capitalize display-4">Min side </h1>
          <Link to="/meldfeil">
            <Button color="red" size="large">
              Meld inn feil
            </Button>
          </Link>

        </div>      
        <div className="row minRow">
          <div className="col-sm mt-3 ml-3" id="sideListe">
            <Card fluid="true">
              <Card.Content>
                <Card.Header>
                  Dine rapporterte feil
                  <Button basic color="green" onClick={this.visRapporterteFeil}>{(this.oppdaterteFeil.length === 0) ? (<span>Ingen ny(e) oppdateringer</span>) : (<span>{this.oppdaterteFeil.length} nye oppdateringer</span>)}</Button>
                </Card.Header>
              </Card.Content>
              {(this.visFeil) ? ( 
              <Card.Content className={this.classFeil}>
              {((this.oppdaterteFeil.length+this.ikkeOppdaterteFeil.length) > 0) ? (<Feed>  
                  {this.oppdaterteFeil.map((feil) => (
                    <FeedMinside
                      status={feil.status}
                      tid={feil.tid}
                      kategori={feil.kategorinavn}
                      oppdatering= {true}
                      fjern={() => {
                        this.fjernFeil(feil.feil_id);
                      }}
                      onClick={() => {this.visHendelse=false;this.handleOpen(feil)}}
                    >
                      {feil.overskrift}
                    </FeedMinside>
                  ))}
                  {this.ikkeOppdaterteFeil.map((feil) => (
                    <FeedMinside
                      status={feil.status}
                      tid={feil.tid}
                      kategori={feil.kategorinavn}
                      fjern={() => {
                        this.fjernFeil(feil.feil_id);
                      }}
                      onClick={() => this.handleOpen(feil)}
                    >
                      {feil.overskrift}
                    </FeedMinside>
                  ))}
                </Feed> ) : (<Card><Card.Content><Header as="h4">Du har desverre ikke rapportert inn noen feil:( </Header></Card.Content></Card>)}
              </Card.Content>) : (null)}
            </Card>
          </div>
          <div className="col-sm mt-3">
            <div className="columnCenter">
              <h2>Hendelser du følger</h2>
              {(this.folgteHendelser.length>0) ? (<Card.Group itemsPerRow={1}>
                {this.folgteHendelser.map((hendelse) => (
                  <Card className="feilCard" onClick={() => {this.visHendelse=true; this.handleOpen(hendelse);}} >
                    <Image src={hendelse.bilde} className="feilCardImage" />
                    <Card.Content>
                      <Card.Header>{hendelse.overskrift}</Card.Header>
                      <Card.Description>
                        <img
                          className="mr-2"
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simple_icon_time.svg/750px-Simple_icon_time.svg.png"
                          height="20"
                          width="25"
                        />
                        {hendelse.tid}
                      </Card.Description>
                    </Card.Content>
                  </Card>
                ))}
              </Card.Group>) : (<Card><Card.Content><Header as="h4">Du følger for øyeblikket ingen hendelser:( Gå til Hendelser for å finne noe du vil abonnere på.</Header></Card.Content></Card> )}
            </div>
          </div>
          <div className="col-sm mt-3">
            <div className="columnCenter">
              <h2>Feil/mangler du følger</h2>
              {(this.folgteFeil.length >0) ? (<Card.Group itemsPerRow={1}>
                {this.folgteFeil.map((feil) => (
                  <Card className="feilCard" onClick={() => {this.visHendelse=false;this.handleOpen(feil)}}>
                    <Image src={feil.url} className="feilCardImage" />
                    <Card.Content>
                      <Card.Header>{feil.overskrift}</Card.Header>
                      <Card.Description>
                        <img
                          className="mr-2"
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simple_icon_time.svg/750px-Simple_icon_time.svg.png"
                          height="20"
                          width="25"
                        />
                        {feil.tid}
                      </Card.Description>
                    </Card.Content>
                  </Card>
                ))}
              </Card.Group>
              ) : (
              <Card><Card.Content><Header as="h4">Du følger for øyeblikket ingen feil:( Gå til feil for å finne noe du vil abonnere på.</Header></Card.Content></Card> )}
              
            </div>
          </div>
          <div className="col-sm mt-3 ml-3" id="sideListeH">
            <Card fluid="true">
              <Card.Content>
                <Card.Header>
                  Brukerinformasjon
                </Card.Header>
              </Card.Content>
              <Card.Content>
                <Feed>
                  {this.bruker.epost}
                </Feed>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  async finnFeilBruker() {
    let res1 = await brukerService.finnFeilTilBruker();
    this.rapporterteFeil = await res1.data;
  }

  async visRapporterteFeil() {
    this.visFeil = !this.visFeil;
    if(this.visFeil){
      this.finnIkkeOppdaterteFeil();
      await this.scrollFeil();
      await brukerService.oppdaterSistInnloggetPrivat();
    }
  }

  scrollFeil() {
    if ((this.oppdaterteFeil.length+this.ikkeOppdaterteFeil.length) > 4) {
      console.log(this.oppdaterteFeil.length+this.ikkeOppdaterteFeil.length);
      this.classFeil = 'rapporterteFeilScroll';
    }
  }

  async finnOppdaterteFeilBruker() {
    let res1 = await brukerService.finnOppdaterteFeilTilBruker();
    this.oppdaterteFeil = await res1.data;
    await console.log(res1.data);
  }

  async finnIkkeOppdaterteFeil(){
    let res1 = await brukerService.finnIkkeOppdaterteFeilTilBruker();
    this.ikkeOppdaterteFeil = await res1.data;
    await this.scrollFeil();
  }

  async fjernFeil(id) {
    console.log(id);
    /*let res1 = await feilService.slettFeil(id);
        await this.finnFeilBruker(this.props.match.params.bruker_id);*/
  }

  async mounted() {
    await this.finnOppdaterteFeilBruker();

    let res2 = await brukerService.finnFolgteFeilTilBruker();
    this.folgteFeil = await res2.data;
    await console.log(res2.data);

    let res3 = await brukerService.finnFolgteHendelserTilBruker();
    this.folgteHendelser = await res3.data;
    await console.log(res3.data);

    let res4 = await brukerService.hentBruker(global.payload.user.bruker_id);
    this.bruker = await {...res4.data};
    await console.log(this.bruker);
  }
}
