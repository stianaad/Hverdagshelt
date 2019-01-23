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
  import {hendelseService} from '../../services/hendelseService';

export class RegistrerNyKategori extends Component {
    open = false;
    kategori = "";
    hovedkategoriID = "";
    alleHovedKategorier = [];

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

    verdiSubKat(e){
        console.log(e.target.value);
        this.hovedkategoriID = e.target.value;
    }
    
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
                position="right center">
                <Header as="h3" >{this.props.overskrift}</Header>
                {(this.props.id === 2) ? (<span><select onChange={this.verdiSubKat} placeholder="Velg hovedkategori" className="w-100">
                    <option hidden>
                        Velg hovedkategori
                    </option>
                    {this.alleHovedKategorier.map( kat => (
                        <option key={kat.hovedkategori_id} value={kat.hovedkategori_id}>
                            {kat.kategorinavn}
                        </option>
                    ))}
                </select><br/></span>) : (null)}
                <br/>
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
            res1 = await feilService.opprettSubkategori({"kategorinavn": this.kategori,"hovedkategori_id": this.hovedkategoriID});
        } else if (this.props.id === 3){
            res1 = await hendelseService.opprettHendelseskategori({"kategorinavn": this.kategori});
        }
        if(res1.data.affectedRows === 1){
            alert("Du har registrert ein ny kategori!");
        } else {
            alert("Noe gikk galt");
        }
    }

    async mounted(){
        if(this.props.id === 2){
            let res1 = await feilService.hentAlleHovedkategorier();
            this.alleHovedKategorier = res1.data;
        }
    }
}