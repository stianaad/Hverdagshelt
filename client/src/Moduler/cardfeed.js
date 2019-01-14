import * as React from 'react';
import {Component} from 'react-simplified';
import {Card, Feed, Modal} from 'semantic-ui-react';

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
                    </Feed.Content>
                </Feed.Event>
            </Feed>
        );
    }
}

export class Modal extends Component{
    render(){
        return(
            <Modal>
                
            </Modal>
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