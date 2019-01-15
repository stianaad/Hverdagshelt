import * as React from 'react';
import {Component} from 'react-simplified';
import {Card, Feed, Grid, Button, Header, Icon, Image, Modal} from 'semantic-ui-react';
import {FeedEvent, Filtrer, Info} from '../../Moduler/cardfeed'
import {feilService} from '../../services/feilService';
export class MineOppgaver extends Component{
    nyefeil = []; 
    utførte = []; 
    underBehandling = []; 
    alleFeil = [];
    valgtFeil = null; 

    state = {
        open: false
    }
    

    handleOpen = () => {
        this.setState({ open: true })
        console.log(this.state); 
    }
    handleClose = () => {
        this.setState({ open: false }) 
    } 
    
    render(){
        return(
            <div className="container">
                <Modal open={this.state.open} onClose={this.handleClose} size="small" centered={true}>
                    <Modal.Header>Header</Modal.Header>
                    <Modal.Content>
                        <Info/>
                    </Modal.Content>
                </Modal>
                <h1>
                    Mine oppgaver
                </h1>
                <div className="grid-container">
                    <Card color="red">
                        <Card.Content>
                            <Card.Header>   
                                <Grid>
                                    <Grid.Column width={10}>Nye innsendinger</Grid.Column>                
                                    <Grid.Column width={4}>
                                        <Filtrer/>
                                    </Grid.Column>
                                </Grid>
                            </Card.Header>
                        </Card.Content>
                        <Card.Content>
                            <Feed>
                                {this.nyefeil.map(feil => (
                                    <FeedEvent
                                        image='warningicon.png'
                                        content={feil.tid}
                                        onClick={this.handleOpen}
                                    >
                                    {feil.overskrift}
                                    </FeedEvent>
                                ))}
                            </Feed>
                        </Card.Content>
                    </Card>

                    <Card color='yellow'>
                        <Card.Content>
                            <Card.Header>
                                <Grid>
                                    <Grid.Column width={10}>Under behandling</Grid.Column>                
                                    <Grid.Column width={4}>
                                        <Filtrer/>
                                    </Grid.Column>
                                </Grid>
                            </Card.Header>
                        </Card.Content>
                        <Card.Content>
                            <Feed>
                                {this.underBehandling.map(feil => (
                                    <FeedEvent
                                        image='warningicon.png'
                                        content={feil.tid}
                                        onClick={this.handleOpen}
                                    >
                                    {feil.overskrift}
                                    </FeedEvent>
                                ))}
                            </Feed>
                        </Card.Content>
                    </Card>

                    <Card color="green">
                        <Card.Content>
                            <Card.Header>
                                <Grid>
                                    <Grid.Column width={10}>Avsluttede saker</Grid.Column>                
                                    <Grid.Column width={4}>
                                        <Filtrer/>
                                    </Grid.Column>
                                </Grid>
                            </Card.Header>
                        </Card.Content>

                        <Card.Content>
                            {this.nyefeil.map(feil => (
                                <FeedEvent
                                    image='warningicon.png'
                                    content={feil.tid}
                                    onClick={this.handleOpen}
                                >
                                {feil.overskrift}
                                </FeedEvent>
                            ))}
                        </Card.Content>
                    </Card>                             
                </div>
            </div>
        );
    }

    async mounted(){
        let feil = await feilService.hentAlleFeil();
        this.alleFeil = await feil.data; 
        await console.log(this.alleFeil);
        this.nyefeil = await feil.data.filter(e => (e.status === 'Ikke godkjent'));
        await console.log(this.nyefeil);
        this.underBehandling = await feil.data.filter(e => (e.status === 'Under behandling'));
        await console.log(this.underBehandling);
        this.utførte = await feil.data.filter(e => (e.status === 'Ferdig')); 
        await console.log(this.utførte); 
    }
}