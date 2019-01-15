import * as React from 'react';
import {Component} from 'react-simplified';
import {Card, Feed, Modal, Grid, GridColumn, Segment} from 'semantic-ui-react';

export class FeedEvent extends Component{
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
        iDag = yyyy + '-' + mm + '-' + dd;
        let iGaar = yyyy + '-' + mm + '-' + (dd-1);
        console.log(tid);
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
        //this.dato();
        console.log("hehe");
        return(
            <Feed>
                
                <Feed.Event>
                {(this.props.status !== "Under behandling") ? ((this.props.status === 'Ikke godkjent') ? (<Feed.Label image={"/warningicon.png"}/>)
                                : (<Feed.Label image={"/successicon.png"}/>)) : (<Feed.Label image={"/processingicon.png"}/>)}
                    <Feed.Content >
                    <a onClick={this.props.onClick}>
                        {this.dato(this.props.tid)}
                        <Feed.Summary>
                            {this.props.children}
                        </Feed.Summary>
                        <span><i>{this.props.kategori}</i></span>
                        </a>
                    </Feed.Content>
                </Feed.Event>
            </Feed>
        );
    }
}

export class FeedHendelse extends Component{
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
        iDag = "2019-08-07";
        let iGaar = yyyy + '-' + mm + '-' + (dd+1);
        console.log(tid);
        if(innKommendeDato===iDag){
            iDag="I dag "+innKommendeKlokkeslett;
        } else if(iGaar === innKommendeDato){
            iDag ="I måren "+innKommendeKlokkeslett;
        } else{
            iDag= tid;
        }
        return(<Feed.Date content={iDag}/>)
    }
    render(){
        //this.dato();
        console.log("hehe");
        return(
            <Feed>
                <Feed.Event>
                <Feed.Label image={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAMd24HjnhiptW56mpiIDURarm6we9vk_7CQPZyjffGKw9d9wA"}/>
                <Feed.Content >
                    <a onClick={this.props.onClick}>
                        {this.dato(this.props.tid)}
                        <Feed.Summary>
                            {this.props.children}
                        </Feed.Summary>
                        <span><i>{this.props.kategori}</i></span>
                        </a>
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

export class Filtrer extends Component{
    render(){
        return(
            <div>
                <select onChange={this.props.onChange} style={{height: 30, width: 120}} className="rigth floated form-control">
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