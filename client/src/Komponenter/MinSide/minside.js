import * as React from 'react';
import {PageHeader} from '../../Moduler/header/header';
import {Component, sharedComponentData} from 'react-simplified';
import {feilService} from '../../services/feilService';
import {
    Card,
    Feed,
    Grid,
    Button,
    Header,
    Icon,
    Image,
    Popup,
    Modal,
    Input,
    List
  } from 'semantic-ui-react';
  import {FeedEvent, FeedHendelse, Filtrer, Info, FeedMinside} from '../../Moduler/cardfeed';
import { brukerService } from '../../services/brukerService';
import {NavLink} from 'react-router-dom';
import {markerTabell,ShowMarkerMap } from '../../Moduler/kart/map';


export class Minside extends Component {
    rapporterteFeil = [];
    folgteFeil = [];
    folgteHendelser = [];
    valgtFeil = {
        overskrift: "",
        bilde: "",
        beskrivelse: ""
    }

    state = {open: false}

    handleOpen = (feil) => {
        this.valgtFeil = {...feil};
        this.setState({ open: true });
    }

    handleClose = () => {this.setState({open: false})}

    render(){
        return(
            <div>
                <PageHeader history={this.props.history} location={this.props.location}/>
                <Modal open={this.state.open} onClose={this.handleClose} size="small" centered={true} dimmer="blurring">
                    {/*<Modal.Header>
                        {this.valgtFeil.overskrift}
                    </Modal.Header>*/}
                    <Modal.Content>
                        <div>
                            <Card fluid="true">
                                <Card.Content>
                                    <div>
                                        <h1>
                                            {this.valgtFeil.overskrift}
                                            <NavLink
                                                to={'/minside/11'}
                                                onClick={this.handleClose}
                                            >
                                                <img
                                                className="float-right"
                                                src="https://image.freepik.com/free-icon/x_318-27992.jpg"
                                                width="20"
                                                height="20"
                                                />
                                            </NavLink>
                                        </h1>
                                        <h6>Status: {this.valgtFeil.status}{' '}
                                            <img src='/warningicon.png' width="30" height="30" />
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
                                            <ShowMarkerMap
                                                width="100%"
                                                height="300px"
                                                id="posmap"
                                                feil={this.valgtFeil}
                                            />
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
                                        <Image.Group size='tiny'>
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
                    </Modal.Content>
                </Modal>

                <h1 className="text-center">Min side</h1>
                <div className="row ">
                    <div className="col mt-3 ml-3">
                    <h2> </h2>
                    <Card fluid="true">
                  <Card.Content>
                    <Card.Header>
                      Dine rapporterte feil
                      {/*<select
                        onChange={this.filter}
                        className="form-control right floated meta"
                        style={{height: 30, width: 120}}>
                        <option hidden> Filter </option>
                        <option value="0"> Alle kategorier </option>
                        {this.alleKategorier.map((kategori) => (
                          <option
                            value={kategori.kategorinavn}
                            key={kategori.kategorinavn}
                          >
                            {' '}
                            {kategori.kategorinavn}
                          </option>
                        ))}
                      </select>*/
                        }
                    </Card.Header>
                  </Card.Content>
                  <Card.Content>
                    <Feed>
                        {this.rapporterteFeil.map( feil => (
                            <FeedMinside
                            status={feil.status}
                            tid={feil.tid}
                            kategori={feil.kategorinavn}
                            fjern={() => this.fjernFeil(feil.feil_id)}
                            onClick={() => this.handleOpen(feil)}
                          >
                            {feil.overskrift}
                          </FeedMinside>
                        ))}
                    </Feed>
                  </Card.Content>
                </Card>
                    </div>
                    <div className="col mt-3">
                    <h2>Hendelser du følger</h2>
                    <Card.Group itemsPerRow={1}>
                        {this.folgteHendelser.map(hendelse => (
                            <Card >
                            <Image src={hendelse.bilde}/>
                            <Card.Content>
                                <Card.Header>{hendelse.overskrift}</Card.Header>
                                <Card.Description><img className="mr-2"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simple_icon_time.svg/750px-Simple_icon_time.svg.png"
                            height="20"
                            width="25"/>{hendelse.tid}</Card.Description>
                            </Card.Content>
                        </Card>
                        ))}
                    </Card.Group>
                    </div>
                    <div className="col mt-3">
                        <h2>Feil/mangler du følger</h2>
                        <Card.Group itemsPerRow={1}>
                        {this.folgteFeil.map(feil => (
                            <Card>
                                <Image src={feil.url} className="feilCard"/>
                                <Card.Content>
                                    <Card.Header>{feil.overskrift}</Card.Header>
                                    <Card.Description><img className="mr-2"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simple_icon_time.svg/750px-Simple_icon_time.svg.png"
                                height="20"
                                width="25"/>{feil.tid}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                    </div>
                    <div className="col">

                    </div>
                </div>
            </div>
        )
    }

    async finnFeilBruker(id){
        let res1 = await brukerService.finnFeilTilBruker(id);
        this.rapporterteFeil = await res1.data;
        await console.log(res1.data);
    }

    async fjernFeil(id){
        console.log(id);
        /*let res1 = await feilService.slettFeil(id);
        await this.finnFeilBruker(this.props.match.params.bruker_id);*/
    }

    async mounted(){
        await this.finnFeilBruker(this.props.match.params.bruker_id);

        let res2 = await brukerService.finnFolgteFeilTilBruker(this.props.match.params.bruker_id);
        this.folgteFeil = await res2.data;
        await console.log(res2.data);

        let res3 = await brukerService.finnFolgteHendelserTilBruker(this.props.match.params.bruker_id);
        this.folgteHendelser = await res3.data;
        await console.log(res3.data);
    }
}