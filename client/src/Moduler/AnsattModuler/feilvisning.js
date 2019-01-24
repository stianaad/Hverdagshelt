import * as React from 'react';
import {Component} from 'react-simplified';
import {Card, Feed, Grid, Button, Header, Icon, Input, Image, Modal, List, CardContent} from 'semantic-ui-react';


export class FeilVisning extends Component {
    render(){
        return(
            <div>
                <Card fluid>
                    <Card.Content>
                        <Grid columns={3}>
                            <Grid.Column><h1>{this.props.feil.overskrift}</h1></Grid.Column>
                            <Grid.Column/>
                            <Grid.Column>{this.props.feil.tid}</Grid.Column>
                            <Grid.Column>Status: {this.props.feil.status}</Grid.Column>
                        </Grid>
                    </Card.Content>
                </Card>
            </div>
        ); 
    }
}
