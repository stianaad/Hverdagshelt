import * as React from 'react';
import {Component} from 'react-simplified';
import {Card, Feed, Grid, Button, Header, Icon, Image, Modal} from 'semantic-ui-react';
import {FeedEvent, Filtrer} from '../../Moduler/cardfeed'

export class MineOppgaver extends Component{
    render(){
        return(
            <div className="container">
                <Modal trigger={<Button>Show Modal</Button>} size="small" centered={true}>
                    <Modal.Header>Header</Modal.Header>
                    <Modal.Content>
                        <p>
                            Dette er et avsnitt hvor jeg gjør hva jeg vil!!
                        </p>
                    </Modal.Content>
                </Modal>
                <h1>
                    Mine oppgaver
                </h1>
                <div className="grid-container">
                    <Card>
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
                                <FeedEvent onClick={this.openModalHandler} 
                                    image='warningicon.png' 
                                    content='I dag'
                                    onClick={this.openModalHandler}>
                                    Strømbrudd i hele Trondheim.
                                </FeedEvent>
                                <FeedEvent 
                                    image='processingicon.png' 
                                    content='I går'>
                                    Sykkelen min er borte!
                                </FeedEvent>
                                <FeedEvent 
                                    image='successicon.png' 
                                    content='06.01.2018'>
                                    Vanntrøbbel hos Stian
                                </FeedEvent>
                            </Feed>
                        </Card.Content>
                    </Card>

                    <Card>
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
                                <FeedEvent 
                                    image='warningicon.png' 
                                    content='I dag'>
                                    Strømbrudd i hele Trondheim.
                                </FeedEvent>
                                <FeedEvent 
                                    image='processingicon.png' 
                                    content='I går'>
                                    Sykkelen min er borte!
                                </FeedEvent>
                                <FeedEvent 
                                    image='successicon.png' 
                                    content='06.01.2018'>
                                    Vanntrøbbel hos Stian
                                </FeedEvent>
                            </Feed>
                        </Card.Content>
                    </Card>

                    <Card>
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
                            <FeedEvent 
                                image='warningicon.png' 
                                content='I dag'>
                                Strømbrudd i hele Trondheim.
                            </FeedEvent>
                            <FeedEvent 
                                image='processingicon.png' 
                                content='I går'>
                                Sykkelen min er borte!
                            </FeedEvent>
                            <FeedEvent 
                                image='successicon.png' 
                                content='06.01.2018'>
                                Vanntrøbbel hos Stian
                            </FeedEvent>
                        </Card.Content>
                    </Card>                             
                </div>
            </div>
        );
    }
}