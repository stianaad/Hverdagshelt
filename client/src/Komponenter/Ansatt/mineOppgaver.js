import * as React from 'react';
import {Component} from 'react-simplified';
import {Card, Feed, Grid} from 'semantic-ui-react';
import {FeedEvent, Filtrer} from '../../Moduler/cardfeed'
import Modal from '../../Moduler/Modal/modal';

export class MineOppgaver extends Component{
    constructor() {
        super();

        this.state = {
            isShowing: false
        }
    }

    openModalHandler = () => {
        this.setState({
            isShowing: true
        });
    }

    closeModalHandler = () => {
        this.setState({
            isShowing: false
        });
    }

    render(){
        return(
            <div>
                { this.state.isShowing ? <div onClick={this.closeModalHandler} className="back-drop"></div> : null }
                <div className="container">                    
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
                <Modal
                        className="modal"
                        show={this.state.isShowing}
                        close={this.closeModalHandler}>
                            Maybe aircrafts fly very high because they don't want to be seen in plane sight?
                </Modal>
            </div>
        );
    }
}