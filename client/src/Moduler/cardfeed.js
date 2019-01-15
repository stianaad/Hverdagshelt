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

export class Info extends Component{
    render(){
        return(
            <div>
                <h1>Strømbrudd hos stian</h1>
                <br/>
                <p>06.01.2018</p>
                <div>
                    <div className="a">
                        <p>Masse tekst</p>
                    </div>
                    <div className="b">
                        <p>Kart</p>
                    </div>
                    <div className="c">
                        <p>Oppdateringer</p>
                    </div>
                    <div className="d">
                        <p>Bilder</p>
                    </div>
                </div>
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