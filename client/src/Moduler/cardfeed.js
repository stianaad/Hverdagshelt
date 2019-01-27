import * as React from 'react';
import {Component} from 'react-simplified';
import {feilService} from '../services/feilService';
import {AbonnerKnapp} from './abonner/abonner';
import {
  Card,
  Feed,
  Modal,
  Grid,
  Segment,
  Image,
  Button,
  Popup,
  Header,
  Form,
  TextArea,
} from 'semantic-ui-react';
 
/**
 * Feedevent blir brukt til å vise en liste med feil.
 * @reactProps {string} statuts - For å finne statusen til en feil så kan en sende inn status som en prop.
 * @reactProps {!function(feil: Object)} onClick - onClick blir brukt slik at en kan trykke på en feil for å se mer informasjon.
 * @reactProps {?string} tid - For at en skal kunne se hvilket klokkeslett en feil ble sendt inn, kan en sende tid som en prop.
 * @reactProps {?string} children - Hvis en skal sende inn overskrifta til en feil, kan en sende dette som en prop.
 * @reactProps {?string} kategori - Denne blir brukt for å sende inn hovedkategorien til en feil.
 * @reactProps {?number} visSakID - Hvis en har behov for å vise id til en feil, kan en sende inn dette som en prop.
 * @reactProps {?boolean} visRedigering - Hvis en skal kunne redigere en feil, kan en sende inn visRedigerig som en prop.
 * @reactProps {?number} feil_id - Hvis en har behov for å vise id til en feil, kan en sende inn dette som en prop.
 * @reactProps {!function(this.tekstverdi: string, this.statusID: number,feil_id: number)} knapp - Knapp blir brukt til å sende en funksjon når en skal lagre de nye oppdateringene om en feil.  
 */
 
export class FeedEvent extends Component {
  klikk = false;
 
  /**
   * Tekstverdien som skal bli oppdatert
   * @type {string}
   */
  tekstverdi = '';
  /**
   * Liste over alle statuser
   * @type {Status[]}
   */
  statuser = [];
 
  /**
   * Status id til feil
   * @type {number}  
   */
  statusID = '';
 
  /** @ignore */
  dato(tid) {
    let innKommendeDato = tid.substr(0, 10);
    let innKommendeKlokkeslett = tid.substr(11, 16);
    let iDag = new Date();
    let dd = iDag.getDate();
    let mm = iDag.getMonth() + 1; //January is 0!
    let yyyy = iDag.getFullYear();
 
    if (dd < 10) {
      dd = '0' + dd;
    }
 
    if (mm < 10) {
      mm = '0' + mm;
    }
    iDag = yyyy + '-' + mm + '-' + dd;
    let iGaar = yyyy + '-' + mm + '-' + (dd - 1);
    if (innKommendeDato === iDag) {
      iDag = 'I dag ' + innKommendeKlokkeslett;
    } else if (iGaar === innKommendeDato) {
      iDag = 'I går ' + innKommendeKlokkeslett;
    } else {
      iDag = tid;
    }
    return <Feed.Date content={iDag} />;
  }
 
  /** @ignore */
  tekstFelt(e) {
    this.tekstverdi = e.target.value;
  }
 
  /** @ignore */
  statusVerdi(e) {
    this.statusID = e.target.value;
  }
 
  /**
   * En variabel for å opne en Modal
   * @type {Object}
   * @property {boolean} modalOpen 
   */
  state = {modalOpen: false};
 
  /** @ignore */
  async open() {
    this.setState({modalOpen: true});
    let res1 = await feilService.hentAlleStatuser();
    this.statuser = await res1.data.filter((status) => status.status_id > 2);
  }
 
  /** @ignore */
  lukk = () => this.setState({modalOpen: false});
 
  render() {
    return (
      <Feed>
        <Feed.Event>
          {this.props.status !== 'Under behandling' ? (
            this.props.status === 'Ferdig' ? (
              <Feed.Label image={'/successicon.png'} />
            ) : (
              <Feed.Label image={'/warningicon.png'} />
            )
          ) : (
            <Feed.Label image={'/processingicon.png'} />
          )}
          <Feed.Content>
            <a onClick={this.props.onClick}>
              {this.dato(this.props.tid)}
              <Feed.Summary>
                <h4 style={{overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '250px'}}>
                  {this.props.children}
                </h4>
                </Feed.Summary>
              <span>
                <i>{this.props.kategori}</i>
              </span>
              <br />
              {(this.props.visSakID) ? (<span>Sak ID: {this.props.feil_id}</span>)
              : (null)}
            </a>
          </Feed.Content>
          {this.props.visRedigering ? (
            <a>
              <Feed.Label>
                {/*<Popup trigger={<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw2X0OANh285WcTWw99iFMeMuniesVc2Aqs4iYGx5pzJv15LW8"  width="30" height="30"/>}
                            hideOnScroll
                            on = "click"
                            >
                            <Grid>
                                <Header as="h3">Legg til en oppdatering på feilen</Header>
                            </Grid>
                    </Popup>*/}
                <Modal
                  trigger={
                    <img
                      onClick={this.open}
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw2X0OANh285WcTWw99iFMeMuniesVc2Aqs4iYGx5pzJv15LW8"
                      width="20"
                      height="20"
                    />
                  }
                  size="tiny"
                  className="oppdaterFeilBedrift"
                  open={this.state.modalOpen}
                  onClose={this.lukk}
                >
                  <Modal.Header className="fiksStorrelseOverskrift">Skriv inn en oppdatering på feilen</Modal.Header>
                  <Modal.Content>
                    <Modal.Description>
                      <Header textAlign="center">{this.props.children}</Header>
                      <div className="fiksStorrelseOverskrift">
                        <select onChange={this.statusVerdi} className="form-control statusTabell">
                          <option hidden>Velg status</option>
                          {this.statuser.map((status) => (
                            <option key={status.status_id} value={status.status_id}>
                              {status.status}
                            </option>
                          ))}
                        </select>
                        <br />
                        <Form>
                          <TextArea className="tekstFeltOppdatering" required={true} autoHeight placeholder="Skriv oppdatering..." onChange={this.tekstFelt} />
                        </Form>
                        <br />
                        <Button
                          disabled={this.tekstverdi=== '' || this.statusID === ''}
                          onClick={() => {
                            this.props.knapp(this.tekstverdi, this.statusID,this.props.feil_id);
                            this.lukk();
                          }}
                        >
                          {' '}
                          Send inn oppdatering
                        </Button>
                      </div>
                    </Modal.Description>
                  </Modal.Content>
                </Modal>
              </Feed.Label>
            </a>
          ) : null}
        </Feed.Event>
      </Feed>
    );
  }
}
 
 
/**
 * FeedHendelse blir brukt til å vise en liste med hendelser.
 * @reactProps {!function(hendelse: Object)} onClick - onClick blir brukt slik at en kan trykke på en hendelse for å se mer informasjon.
 * @reactProps {?string} tid - For at en skal kunne se hvilket klokkeslett en hendelse skal forekomme, kan en sende tid som en prop.
 * @reactProps {?string} children - Hvis en skal sende inn overskrifta til en hendelse, kan en sende dette som en prop.
 * @reactProps {?string} kategori - Denne blir brukt for å sende inn hovedkategorien til en hendelse.
*/
export class FeedHendelse extends Component {
 
  /**@ignore */
  dato(tid) {
    let innKommendeDato = tid.substr(0, 10);
    let innKommendeKlokkeslett = tid.substr(11, 16);
    let iDag = new Date();
    let dd = iDag.getDate();
    let mm = iDag.getMonth() + 1; //January is 0!
    let yyyy = iDag.getFullYear();
 
    if (dd < 10) {
      dd = '0' + dd;
    }
 
    if (mm < 10) {
      mm = '0' + mm;
    }
    //iDag = yyyy + '-' + mm + '-' + dd;
    iDag = '2019-08-07';
    let iGaar = yyyy + '-' + mm + '-' + (dd + 1);
    if (innKommendeDato === iDag) {
      iDag = 'I dag ' + innKommendeKlokkeslett;
    } else if (iGaar === innKommendeDato) {
      iDag = 'I måren ' + innKommendeKlokkeslett;
    } else {
      iDag = tid;
    }
    return <Feed.Date content={iDag} />;
  }
  render() {
    return (
      <Feed>
        <Feed.Event>
          <Feed.Label
            image={
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAMd24HjnhiptW56mpiIDURarm6we9vk_7CQPZyjffGKw9d9wA'
            }
          />
          <Feed.Content>
            <a onClick={this.props.onClick}>
              {this.dato(this.props.tid)}
              <Feed.Summary>{this.props.children}</Feed.Summary>
              <span>
                <i>{this.props.kategori}</i>
              </span>
            </a>
          </Feed.Content>
        </Feed.Event>
      </Feed>
    );
  }
}
 
 
/**
 * FeedMinside blir brukt til å vise en liste med feil på min side.
 * @reactProps {string} statuts - For å finne statusen til en feil så kan en sende inn status som en prop.
 * @reactProps {!function(feil: Object)} onClick - onClick blir brukt slik at en kan trykke på en feil for å se mer informasjon.
 * @reactProps {?string} tid - For at en skal kunne se hvilket klokkeslett en feil ble sendt inn, kan en sende tid som en prop.
 * @reactProps {?string} children - Hvis en skal sende inn overskrifta til en feil, kan en sende dette som en prop.
 * @reactProps {?string} kategori - Denne blir brukt for å sende inn hovedkategorien til en feil.
 * @reactProps {?boolean} oppdatering - Dersom en skal vise at en feil har blitt oppdatert, kan en sende inn oppdatering som en prop.
 */
export class FeedMinside extends Component {
  /**
   * Variabel for å bestemme om en skal opne Modal
   * @type {boolean}
   */
  isOpen = false;
 
  /**@ignore */
  handleOpen = () => {
    this.isOpen = true;
  };
 
  /**@ignore */
  handleClose = () => {
    this.isOpen = false;
  };
 
  /**@ignore */
  dato(tid) {
    let innKommendeDato = tid.substr(0, 10);
    let innKommendeKlokkeslett = tid.substr(11, 16);
    let iDag = new Date();
    let dd = iDag.getDate();
    let mm = iDag.getMonth() + 1; //January is 0!
    let yyyy = iDag.getFullYear();
 
    if (dd < 10) {
      dd = '0' + dd;
    }
 
    if (mm < 10) {
      mm = '0' + mm;
    }
    //iDag = yyyy + '-' + mm + '-' + dd;
    iDag = yyyy + '-' + mm + '-' + dd;
    let iGaar = yyyy + '-' + mm + '-' + (dd - 1);
    if (innKommendeDato === iDag) {
      iDag = 'I dag ' + innKommendeKlokkeslett;
    } else if (iGaar === innKommendeDato) {
      iDag = 'I går ' + innKommendeKlokkeslett;
    } else {
      iDag = tid;
    }
    return <Feed.Date content={iDag} />;
  }
 
  /**@ignore */
  handleOpen = () => {
    if (!this.isOpen) {
      this.isOpen = true;
    }
  };
 
  /**@ignore */
  handleClose = () => {
    if (this.isOpen) {
      this.isOpen = false;
    }
  };
  render() {
    return (
      <Feed>
        <Feed.Event>
        {this.props.status !== 'Under behandling' ? (
            this.props.status === 'Ferdig' ? (
              <Feed.Label image={'/successicon.png'} />
            ) : (
              <Feed.Label image={'/warningicon.png'} />
            )
          ) : (
            <Feed.Label image={'/processingicon.png'} />
          )}
          <Feed.Content color="green">
            <a onClick={this.props.onClick}>
              {this.dato(this.props.tid)}
              <Feed.Summary>{(this.props.oppdatering) ? (<span className="highlight">{this.props.children}</span>) : (this.props.children)} </Feed.Summary>
              <span >
                <i>{this.props.kategori}</i>
              </span>
            </a>
          </Feed.Content>
          <Feed.Label>
            <a>
              <Popup
                trigger={
                  <img
                    src="https://cdn4.iconfinder.com/data/icons/devine_icons/Black/PNG/Folder%20and%20Places/Trash-Recyclebin-Empty-Closed.png"
                    width="30"
                    height="30"
                  />
                }
                on="click"
                open={this.isOpen}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                position="bottom left"
              >
                <Grid centered>
                  <Grid.Row columns={1}>
                    <Grid.Column>
                      <Header as="h3">Er du sikker på at du vil slette denne feilen?</Header>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns="equal">
                    <Grid.Column>
                      <a onClick={() => this.handleClose()}>
                        <Button color="green" fluid content="Ja" onClick={this.props.fjern} />
                      </a>
                    </Grid.Column>
                    <Grid.Column>
                      <Button
                        color="red"
                        fluid
                        content="Nei"
                        onClick={() => {
                          this.handleClose();
                        }}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Popup>
            </a>
          </Feed.Label>
        </Feed.Event>
      </Feed>
    );
  }
}
 
 
/**
 * ModalHendelse blir brukt til å vise mer informasjon om en hendelse.
 * @reactProps {!string} tid - For at en skal kunne se hvilket klokkeslett en feil ble sendt inn, kan en sende tid som en prop.
 * @reactProps {!string} overskrift - Hvis en skal sende inn overskrifta til en feil, kan en sende dette som en prop.
 * @reactProps {!string} url - Hvis en har lyst å vise fram et bilde, kan en sende inn url som en prop.
 * @reactProps {!string} beskrivelse - Hvis en har lyst å ha en beskrivelse til en hendelse, kan en sende i beskrivelse som en prop.
 * @reactProps {!string} sted - Hvis en vil vise stedet som en hendelse skal forekomme på, kan en sende inn sted som en prop.
 * @reactProps {!string} kommune_navn - Hvis en vil vise kommune navnet til hvor hendelsen finner sted, kan en sende inn kommune_navn som en prop.
 */
export class ModalHendelse extends Component{
  render(){
    return(
      <Modal.Content image>
        <Grid>
        <Header as="h1" className="mt-2">{this.props.overskrift}</Header>
          <Grid.Row columns={2}>
            <Grid.Column>
            <Modal.Description>
              <Image src={this.props.url} className="hendelserBilde"/>
              <Button color="green" className="mt-2" floated="left" content="Kjøp billett"/>
              <Button color="red"  className="mt-2" floated="right" content="Abonner"/>
              <br />
                <div className="mt-5">
                <p>
                  <img src="https://image.flaticon.com/icons/svg/33/33622.svg" height="20" width="20" />
                  {this.props.sted}, {this.props.kommune_navn}, Norge{' '}
                </p>
                <p>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simple_icon_time.svg/750px-Simple_icon_time.svg.png"
                    height="20"
                    width="25"
                  />
                  {this.props.tid}
                </p>
              </div>
            </Modal.Description>
            </Grid.Column>
            <Grid.Column>
            <p>
              {this.props.beskrivelse}
            </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        </Modal.Content>
    )
  }
}
 
/**
 * @ignore
 */
export class Info extends Component {
  render() {
    return (
      <div>
        <Grid columns={3} divided>
          <Grid.Row stretched>
            <Grid.Column>
              <p>{this.props.children}</p>
            </Grid.Column>
            <Grid.Column>
              <Segment>Kart</Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>Oppdatering</Segment>
              <Segment>Bilder</Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
 
/**
 * Denne klassen blir brukt til å filtrere feil/hendelser
 *  @reactProps {?function(kategori: Object)} onChange - Denne brukes til å sende inn den kategorien en vil filtrere på
 *  @reactProps {!string[]} alleKategorier - Denne blir brukt til å vise alle kategoriene
 */
export class Filtrer extends Component {
  render() {
    return (
      <div>
        <select onChange={this.props.onChange} style={{height: 30, width: 120}} className="rigth floated form-control">
          <option hidden>Filtrer</option>
          <option value="0"> Alle kategorier </option>
          {this.props.alleKategorier.map( filtrer => (
            <option value={filtrer.kategorinavn} key={filtrer.kategorinavn}>
            {' '}
            {filtrer.kategorinavn}
          </option>
          ))}
        </select>
      </div>
    );
  }
}
 
 
/**
 * Denne blir brukt til å vise alle kategoriene
 *  @reactProps {?function(kategori: Object)} onChange - Denne brukes til å sende inn den kategorien en vil filtrere på
 *  @reactProps {!string[]} alleKategorier - Denne blir brukt til å vise alle kategoriene
 *  @reactProps {?string} kategorinavn - Kan velge å vise et bestemt kategorinavn øverst i dropdown listen.
*/
export class KatDropdown extends Component {  
  render() {
    return (
      <div>
        <select onChange={this.props.onChange} style={{height: 30, width: 120}} className="rigth floated form-control">
          <option hidden value={this.props.valgt.kategorinavn}>{this.props.valgt.kategorinavn}</option>
          {this.props.alleKategorier.map( filtrer => (
            <option value={filtrer.kategorinavn} key={filtrer.kategorinavn}>
            {' '}
            {filtrer.kategorinavn}
          </option>
          ))}
        </select>
      </div>
    );
  }
}
 
 
/**
 * Denne blir brukt til å vise en liste med hendelser
 * @reactProps {!function(feil: Object)} onClick - onClick blir brukt slik at en kan trykke på en hendelse for å se mer informasjon.
 * @reactProps {!string} bilde - Denne propen blir brukt til sende inn et bilde som tilhører den bestemte hendelsen.
 * @reactProps {!string} sted - Denne propen blir brukt til å sende inn stedet som en hendelse skal forekomme på
 * @reactProps {!string} kommune_navn - Denne propen blir brukt til å vise kommune navnet til hvor hendelsen finner sted.
 * @reactProps {!string} overskrift - Denne propen blir brukt til sende inn overskrift som hører til den bestemte hendelsen.
 * @reactProps {!number} hendelse_id - Denne propen blir brukt til å sende inn id til den bestemte hendelsen.
 * @reactProps {!boolean} rediger - Denne propen blir brukt til å vise om en kan redigere en hendelse.
 */
export class Hendelse extends Component{
    dato(tid){
        let innKommendeDato = tid.substr(0,10);
        let innKommendeKlokkeslett = tid.substr(11,16);
        let iDag = new Date();
        let dd = iDag.getDate();
        let mm = iDag.getMonth()+1; //January is 0!
        let yyyy = iDag.getFullYear();
 
        if(dd<10) {
            dd = '0'+dd
        }
 
        if(mm<10) {
            mm = '0'+mm
        }
        //iDag = yyyy + '-' + mm + '-' + dd;
        iDag = yyyy + '-' + mm + '-' + dd;
        let iGaar = yyyy + '-' + mm + '-' + (dd-1);
 
        if(innKommendeDato===iDag){
            iDag="I dag "+innKommendeKlokkeslett;
        } else if(iGaar === innKommendeDato){
            iDag ="I går "+innKommendeKlokkeslett;
        } else{
            iDag= tid;
        }
        return(<Feed.Date content={iDag}/>)
    }
    render(){
        return(
          <Card className="feilCard" raised >
          <a onClick={this.props.onClick}>
          <Image src={this.props.bilde} className="feilCardImage" />
          <Card.Content>
          <Header as="h3" className="mt-1">{this.props.overskrift}</Header>
            <Card.Description>
              <p>
            <img className="mr-2" src="https://image.flaticon.com/icons/svg/33/33622.svg" height="20" width="20" />
            {this.props.sted}, {this.props.kommune_navn}
            </p>
            <p>
              <img
                className="mr-2"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simple_icon_time.svg/750px-Simple_icon_time.svg.png"
                height="20"
                width="25"
              />
              {this.props.tid}
              </p>
             
            </Card.Description>
          </Card.Content>
          </a>
          {(global.payload && global.payload.role == 'privat') ? (
           
            <div className="text-center "><AbonnerKnapp key={this.props.hendelse_id} hendelse_id={this.props.hendelse_id} /></div>
         
        ) :(global.payload && (global.payload.role === 'ansatt' || global.payload.role === 'admin')) ? (
            <Button color="green" onClick={this.props.rediger}>Rediger</Button>
        ) : (
          null
        )}
        </Card>
              /*<Card className="h-100" fluid>
              <Image src={this.props.bilde} className="hendelseBilde"/>
              <Card.Content>
                  <Card.Header>{this.props.overskrift}</Card.Header>
                  <Card.Meta>
                      <div className="row justify-content-md-center">
                          <span className="date"><img
                      className="mr-2"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simple_icon_time.svg/750px-Simple_icon_time.svg.png"
                      height="20"
                      width="25"
                    />
                    {this.props.tid}</span>
                          <span className="date float-rigth">{this.props.sted}</span>
                      </div>
                  </Card.Meta>
              </Card.Content>
              <Card.Content extra>
                  <Button color="green">Endre</Button>
              </Card.Content>
          </Card>
            /*<Image src={this.props.bilde} onClick={this.props.onClick} rounded />
            <Card.Content>
            <a onClick={this.props.onClick}>
              <Card.Header>{this.props.overskrift}</Card.Header>
              <Card.Meta>
                <span className='date'>{this.props.sted} {this.dato(this.props.tid)}</span>
              </Card.Meta>
              <Card.Description>{this.props.beskrivelse}</Card.Description>
              </a>
            </Card.Content>
            <Card.Content extra>
             <div className='ui two buttons'>
             <Button positive>
                Følg
             </Button>
             </div>
        </Card.Content>*/
        );
    }
 
}