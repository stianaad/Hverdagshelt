import * as React from 'react';
import {Component} from 'react-simplified';
import {
    Card,
    Feed,
    Modal,
    Grid,
    Segment,
    Image,
    Button,
    Popup,
    Header,
    Form,
    TextArea,
  } from 'semantic-ui-react';
  import { PageHeader } from '../../Moduler/header/header';
  import {feilService} from '../../services/feilService';

export class RegistrerNyKategori extends Component {
    open = false;
    kategori = "";

    endreVerdi(e){
        this.kategori=e.target.value;
    }

    handleOpen = () => {
		if (!this.open) {
			this.open = true;
		}
	};
	
	handleClose = () => {
		if (this.open) {
			this.open = false;
		}
    };
    
    render(){
        return(
            <div className="text-center">
                <PageHeader history={this.props.history} location={this.props.location} />
                <Popup trigger={<Button>Knapp</Button>} flowing
                size="huge"
                on="click"
                open={this.open}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                position="bottom left">
                <Header as="h3" >{this.props.overskrift}</Header>
                    <label>{this.props.label}:</label>
                    <input
                    type="text"
                    className="form-control"
                    placeholder={"ex: "+this.props.placeholder}
                    //value={this.kategori}
                    onChange={this.endreVerdi}
                    required={true}
                  />
                  <br/>
                <Button onClick={this.registrer} fluid>Send inn</Button>
                </Popup>
            </div>
        )
    }
    async registrer(){
        this.handleClose();
        let res1 = "";
        if(this.props.id === 1) {
            res1 = await feilService.opprettHovedkategori({"kategorinavn": this.kategori});
        } else if(this.props.id === 2){
            res1 = await feilService.opprettSubkategori({"kategorinavn": this.kategori});
        } else if (this.props.id === 3){

        }
        if(res1.data.affectedRows === 1){
            alert("Du har registrert ein ny kategori!");
        } else {
            alert("Noe gikk galt");
        }
    }
}