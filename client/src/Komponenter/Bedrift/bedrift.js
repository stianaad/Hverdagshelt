import * as React from 'react';
import {Component} from 'react-simplified';
import {PageHeader} from '../../Moduler/header/header';
import {Card, Feed, Grid, Button, Header, Icon, Input, Image, Modal, List, CardContent} from 'semantic-ui-react';
import {FeedEvent, Filtrer, Info} from '../../Moduler/cardfeed'
import {feilService} from '../../services/feilService';
import {markerTabell,ShowMarkerMap } from '../../Moduler/kart/map';
import {NavLink} from 'react-router-dom';

export class Bedrift extends Component{
    nyefeil = []; 
    utførte = []; 
    underBehandling = []; 
    alleFeil = [];
    bilderTilFeil = []; 
    oppdateringer = []; 
    visGodkjennJobb = false;

    valgtFeil = {
        overskrift: "",
        bilde: "",
        beskrivelse: ""
    }; 

    classNye = 'hoyde-tabell'; 
    classUnderB = 'hoyde-tabell'; 
    classFerdig = 'hoyde-tabell'; 

    state = {
        open: false
    }
    

    handleOpen = (feil) => {
        this.valgtFeil = {...feil};
        this.opneFeil(feil);
        console.log(this.valgtFeil);
        this.setState({ open: true });
        console.log(this.state)
    }

    async opneFeil(feil){
        let res = await feilService.hentBilderTilFeil(feil.feil_id);
        this.bilderTilFeil = await res.data; 
        console.log("Bilder: " + this.bilderTilFeil);

        let res2 = await feilService.hentAlleOppdateringerPaaFeil(feil.feil_id);
        this.oppdateringer = await res2.data; 
        await console.log(this.oppdateringer);
        await console.log("res2: " + res2);
    }

    handleClose = () => {
        this.setState({ open: false }) 
    } 


    render(){
        return(
            <>
            <PageHeader history={this.props.history} location={this.props.location}/>
            <div className="bedriftContainer">
                <Modal open={this.state.open} onClose={this.handleClose} size="small" centered={true} dimmer="blurring">
                    {/*<Modal.Header>
                        {this.valgtFeil.overskrift}
                    </Modal.Header>*/}
                    <Modal.Content>
                        <div>
                            <Card fluid>
                                <Card.Content>
                                    <div>
                                        <h1>
                                            {this.valgtFeil.overskrift}
                                            <NavLink
                                                to={'/bedriftsoppgaver/'}
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
                                            {(this.visGodkjennJobb) ? (<span><Button floated='right' color='red' size="small"
                                            onClick={() => {this.avslaJobb(this.valgtFeil.feil_id)}}>
                                            Ikke godta</Button>
                                            <Button floated='right' color='green' size="small"
                                            onClick={() => {this.godtaJobb(this.valgtFeil.feil_id)}}>
                                            Godta jobb
                                            </Button></span>) : (null)}
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
                                        <div className="oppdateringScroll">
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
                                        </div>
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
                        <div>
                            
                        </div>
                    </Modal.Content>
                </Modal>
                <h1>
                    Mine oppgaver
                </h1>
                <div>
                    <div className="row mt-5">
                        <div className="col-sm-4"> 
                            <div className="m1-3">
                                <Card color="red" fluid="true">
                                    <Card.Content>
                                        <Card.Header>   
                                            Nye innsendinger
                                            <Filtrer/>
                                        </Card.Header>
                                    </Card.Content>
                                    <Card.Content className={this.classNye}>
                                        {this.nyefeil.map(feil => (
                                            <FeedEvent onClick={() => {this.handleOpen(feil);this.visGodkjennJobb=true;}}
                                                status ={"Ikke godkjent"}
                                                tid={feil.tid}
                                                feil_id={feil.feil_id}
                                                kategori ={feil.kategorinavn}>
                                                {feil.overskrift}
                                            </FeedEvent>
                                        ))} 
                                    </Card.Content>
                                </Card>
                            </div>
                        </div>
                        <div className="col-sm-4"> 
                            <div className="m1-3">
                                <Card color='yellow' fluid="true">
                                    <Card.Content>
                                        <Card.Header>
                                            Under behandling
                                            <Filtrer/>
                                        </Card.Header>
                                    </Card.Content>
                                    <Card.Content className={this.classUnderB}>
                                        {this.underBehandling.map(feil => (
                                            <FeedEvent onClick={() => {this.handleOpen(feil);this.visGodkjennJobb=false;}}
                                                status ={"Under behandling"}
                                                tid={feil.tid}
                                                visRedigering="true"
                                                knapp = {this.knapp}
                                                feil_id={feil.feil_id}
                                                kategori ={feil.kategorinavn}>
                                                {feil.overskrift}
                                            </FeedEvent>
                                        ))}
                                    </Card.Content>
                                </Card>
                            </div>
                        </div>
                        <div className="col-sm-4"> 
                            <div className="m1-3">
                                <Card color="green" fluid="true">
                                    <Card.Content>
                                        <Card.Header>
                                            Avsluttede saker
                                            <Filtrer/>
                                        </Card.Header>
                                    </Card.Content>

                                    <Card.Content className={this.classFerdig}>
                                        {this.utførte.map(feil => (
                                                <FeedEvent onClick={() => {this.handleOpen(feil);this.visGodkjennJobb=false;}}
                                                    status ={feil.status}
                                                    tid={feil.tid}
                                                    kategori ={feil.kategorinavn}>
                                                    {feil.overskrift}
                                                </FeedEvent>
                                            ))}
                                    </Card.Content>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        );
    }

    oppdater(tekst,statusVerdi,feil_id,bruker_id){
        console.log(statusVerdi);

    }

    async godtaJobb(feil_id){
        console.log(feil_id);
        this.handleClose();
        let res = await feilService.oppdaterStatusFeilTilBedrift({"bruker_id": 7,"feil_id":feil_id,"status":3});
        console.log(res.data);
        await this.hentNyeFeil(7);
        await this.hentUnderBehandlingFeil(7);
    }

    avslaJobb(feil_id){
        console.log(feil_id);
        this.handleClose();
    }

    scrollNye(){
        if(this.nyefeil.length > 4){
            this.classNye='scroll-tabell';
        }
    }

    scrollUnderB(){
        if(this.underBehandling.length > 4){
            this.classUnderB='scroll-tabell';
        }
    }

    scrollFerdig(){
        if(this.utførte.length > 4){
            this.classFerdig='scroll-tabell';
        }
    }

    async hentNyeFeil(id){
        let hentNyeFeilTilBedrift = await feilService.hentNyeFeilTilBedrift(id);
        this.nyefeil = await hentNyeFeilTilBedrift.data;
        await this.scrollNye();
        //await console.log(this.nyefeil);
    }

    async hentUnderBehandlingFeil(id){
        let underBehandling = await feilService.hentUnderBehandlingFeilTilBedrift(id);
        this.underBehandling = await underBehandling.data;
        await this.scrollUnderB();
        //await console.log(this.nyefeil);
    }

    async mounted(){
        let feil = await feilService.hentAlleFeil();
        this.alleFeil = await feil.data; 
        await console.log(this.alleFeil);

        await this.hentNyeFeil(7);
        
        await this.hentUnderBehandlingFeil(7);
        
        /*this.utførte = await feil.data.filter(e => (e.status === 'Ferdig')); 
        await this.scrollFerdig(); 
        await console.log(this.utførte); */
    }
}

/*<Grid columns={3} divided fluid>
                                <Grid.Row> 
                                    <Grid.Column>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porttitor quam eget enim pharetra faucibus. Nam porttitor commodo justo et congue. Aliquam metus ipsum, sodales in molestie nec, porttitor ac justo. Nullam lobortis vel ex at molestie. Duis ultrices at libero commodo consequat. Donec in tellus quis sem imperdiet dignissim. Nunc libero metus, volutpat id facilisis auctor, consequat eu mi. Fusce mauris nunc, blandit et nulla a, tempor venenatis est. Etiam euismod diam id quam laoreet, id elementum nisi elementum.</p>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <ShowMarkerMap width="100%" height="300px" id="posmap" feil={this.valgtFeil} markers={markerTabell(this.alleFeil)}/>
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
                                            {this.oppdateringer.map(oppdatering => (
                                                <List.Item>
                                                    <List.Content>
                                                        <List.Header>{oppdatering.kommentar}</List.Header>
                                                        <List.Description>{oppdatering.tid}</List.Description>
                                                    </List.Content>
                                                </List.Item>
                                            ))}
                                        </List>
                                        <Image.Group size='tiny'>
                                            <Image src="lofoten.jpg" />
                                            <Image src="lofoten.jpg" />
                                            <Image src="lofoten.jpg" />
                                            <Image src="lofoten.jpg" />
                                            <Image src="lofoten.jpg" />
                                            <Image src="lofoten.jpg" />
                                        </Image.Group>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>*/