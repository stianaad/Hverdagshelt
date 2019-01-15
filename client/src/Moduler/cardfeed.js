import * as React from 'react';
import {Component} from 'react-simplified';
import {Card, Feed, Modal, Grid, GridColumn, Segment} from 'semantic-ui-react';

export class FeedEvent extends Component{
    render(){
        return(
            <Feed>
                <Feed.Event>
                    <Feed.Label image={this.props.image}/>
                    <Feed.Content >
                        <Feed.Date content={this.props.content}/>
                        <Feed.Summary>
                            <a onClick={this.props.onClick}>{this.props.children}</a>
                        </Feed.Summary>
                        <span><i>kategori</i></span>
                    </Feed.Content> 
                </Feed.Event>
            </Feed>
        );
    }
}

export class Info extends Component{
    render(){
        return(
            <div>
                <Grid columns={3} divided>
                    <Grid.Row stretched> 
                        <Grid.Column>
                            <Segment>Beskrivelse</Segment>
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

export class Filtrer extends Component{
    render(){
        return(
            <div>
                <select onChange={this.props.onChange}>
                    <option hidden>
                        Filtrer
                    </option>
                    <option value="0">Alle kategorier</option>
                    <option value="0">Alle kategorier</option>
                    <option value="0">Alle kategorier</option>
                    <option value="0">Alle kategorier</option>
                </select>
            </div>

        );
    }
    /*{this.alleKategorier.map(kategori => (
                        <option value={kategori.hovedkategori_id} key={ketegori.hovedkategori_id}>
                            {kategori.kategorinavn}
                        </option>
                    ))}*/
}