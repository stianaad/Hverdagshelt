import * as React from 'react';
import {Component} from 'react-simplified';
import {Card, Feed, Modal, Grid, GridColumn, Segment, Image, Button,Popup, Header} from 'semantic-ui-react';

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
        //console.log(tid);
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
        //console.log("hehe");
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
        //console.log(tid);
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
        //console.log("hehe");
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

export class FeedMinside extends Component{
    isOpen= false;
    
    handleOpen = () => {
        this.isOpen = true ;
      }
    
      handleClose = () => {
        this.isOpen = false;
      }
    

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
        iDag = yyyy + '-' + mm + '-' + dd;
        let iGaar = yyyy + '-' + mm + '-' + (dd-1);
        //console.log(tid);
        if(innKommendeDato===iDag){
            iDag="I dag "+innKommendeKlokkeslett;
        } else if(iGaar === innKommendeDato){
            iDag ="I går "+innKommendeKlokkeslett;
        } else{
            iDag= tid;
        }
        return(<Feed.Date content={iDag}/>)
    }

    handleOpen = () => {
        if (!this.isOpen){
            this.isOpen = true ;
        }
      }
    
      handleClose = () => {
          if(this.isOpen){
            this.isOpen = false;
          }
      }
    render(){
        //this.dato();
        //console.log("hehe");
        return(
            <Feed>
                <Feed.Event>
                <Feed.Label image={"/warningicon.png"}/>
                <Feed.Content >
                    <a onClick={this.props.onClick}>
                        {this.dato(this.props.tid)}
                        <Feed.Summary>
                            {this.props.children}
                        </Feed.Summary>
                        <span><i>{this.props.kategori}</i></span>
                        </a>
                    </Feed.Content>
                    <Feed.Label>
                    <a>
                    <Popup
                        trigger={<img src="https://cdn4.iconfinder.com/data/icons/devine_icons/Black/PNG/Folder%20and%20Places/Trash-Recyclebin-Empty-Closed.png" width="30" height="30"/>}
                        on='click'
                        open={this.isOpen}
                        onOpen={this.handleOpen}
                        onClose={this.handleClose}
                        position='bottom left'>
                        <Grid centered>
                            <Grid.Row columns={1}>
                                <Grid.Column>
                                    <Header as="h3">Er du sikker på at du vil slette denne feilen?</Header>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns="equal">
                            <Grid.Column>
                                <a onClick={() => this.handleClose()}>
                                    <Button color="green" fluid 
                                    content="Ja"
                                    onClick={this.props.fjern}/>
                                 </a>
                            </Grid.Column>
                            <Grid.Column>
                                <Button color="red" fluid content="Nei" onClick={() => {this.handleClose()}}/>
                            </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Popup>
                    </a>
                    </Feed.Label>
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

//For hendelse siden
export class Hendelse extends Component{
    render(){
        return(
            <Card>
            <Image src={this.props.bilde} onClick={this.props.onClick} size='medium'/>
            <Card.Content>
            <a onClick={this.props.onClick}>
              <Card.Header>{this.props.overskrift}</Card.Header>
              <Card.Meta>
                <span className='date'>{this.props.sted} {this.props.tid}</span>
              </Card.Meta>
              <Card.Description>{this.props.beskrivelse}</Card.Description>
              </a>
            </Card.Content>
            <Card.Content extra>
             <div className='ui two buttons'>
             <Button positive>
                Følg
             </Button>
             </div>
            </Card.Content>
          </Card>
        );
    }

}


  

