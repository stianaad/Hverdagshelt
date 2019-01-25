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

export class FeedEvent extends Component {
  klikk = false;
  tekstverdi = '';
  statuser = [];
  statusID = '';

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
    //console.log(tid);
    if (innKommendeDato === iDag) {
      iDag = 'I dag ' + innKommendeKlokkeslett;
    } else if (iGaar === innKommendeDato) {
      iDag = 'I går ' + innKommendeKlokkeslett;
    } else {
      iDag = tid;
    }
    return <Feed.Date content={iDag} />;
  }

  tekstFelt(e) {
    this.tekstverdi = e.target.value;
  }

  statusVerdi(e) {
    this.statusID = e.target.value;
  }

  state = {modalOpen: false};

  async open() {
    this.setState({modalOpen: true});
    let res1 = await feilService.hentAlleStatuser();
    this.statuser = await res1.data.filter((status) => status.status_id > 2);
    await console.log(this.statuser);
  }

  lukk = () => this.setState({modalOpen: false});

  render() {
    //this.dato();
    //console.log("hehe");
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

export class FeedHendelse extends Component {
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
    //console.log(tid);
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
    //this.dato();
    //console.log("hehe");
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

export class FeedMinside extends Component {
  isOpen = false;

  handleOpen = () => {
    this.isOpen = true;
  };

  handleClose = () => {
    this.isOpen = false;
  };

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
    //console.log(tid);
    if (innKommendeDato === iDag) {
      iDag = 'I dag ' + innKommendeKlokkeslett;
    } else if (iGaar === innKommendeDato) {
      iDag = 'I går ' + innKommendeKlokkeslett;
    } else {
      iDag = tid;
    }
    return <Feed.Date content={iDag} />;
  }

  handleOpen = () => {
    if (!this.isOpen) {
      this.isOpen = true;
    }
  };

  handleClose = () => {
    if (this.isOpen) {
      this.isOpen = false;
    }
  };
  render() {
    //this.dato();
    //console.log("hehe");
    return (
      <Feed>
        <Feed.Event>
          <Feed.Label image={'/warningicon.png'} />
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


//For hendelse siden
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
