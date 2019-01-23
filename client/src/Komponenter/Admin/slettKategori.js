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

  export class SlettKategori extends Component{
    open = false;
    kategorier = [];
    velgKatergori = "";
    kategoriID = "";
    slettFeil = true;
    hovedSub = "";

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

    async verdiKat(e){
        let res1 = "";
        this.slettFeil = true;
        this.velgKatergori= e.target.value;
        if(e.target.value == 1){
            res1 = await feilService.hentAlleHovedkategorier();
            this.hovedSub = "Velg hovedkategori";
        } else if (e.target.value == 2){
            res1 = await feilService.hentAlleSubkategorier();
            this.hovedSub = "Velg subkategori";
        }
        this.kategorier = res1.data;
    }

    verdiEtterValgtKat(e) {
        this.kategoriID = this.kategorier.find(kat => (kat.kategorinavn === e.target.value));
        if(this.velgKatergori == 1){
            this.kategoriID = this.kategoriID.hovedkategori_id;
        } else if (this.velgKatergori == 2){
            this.kategoriID = this.kategoriID.subkategori_id;
        }
        this.slettFeil = false;
    }

      render(){
          return(
              <div>
                  <Popup trigger={<Button>Knapp</Button>} flowing
                size="huge"
                on="click"
                open={this.open}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                position="right center">
                <Header as="h3" >{this.props.overskrift}</Header>
                <select onChange={this.verdiKat} placeholder="Velg hovedkategori" className="w-100">
                    <option hidden> Velg kategori</option>
                    <option key="1" value="1">
                        Hovedkategori
                    </option>
                    <option key="2" value="2">
                        Subkategori
                    </option>
                </select>
                <br/>
                {(this.kategorier.length>0) ? (
                <span><br/><select onChange={this.verdiEtterValgtKat} className="w-100">
                    <option hidden>{this.hovedSub}</option> 
                    {this.kategorier.map(e => (
                        <option key={e.kategorinavn} value={e.kategorinavn}>
                            {e.kategorinavn}
                        </option>
                    ))}
                </select></span>) : (null)}
                <br/>
                <br/>
                <Button onClick={this.slettKategori} disabled={this.slettFeil} color="red" fluid>Slett feil</Button>
                </Popup>
              </div>

          )
      }

      async slettKategori(){
        this.handleClose();
        let res1 = "";
        if(this.velgKatergori == 1){
            res1 = await feilService.slettHovedkategori(this.kategoriID);
        } else if (this.velgKatergori == 2){
            res1 = await feilService.slettSubkategori(this.kategoriID);
        }
        if(res1.data.affectedRows == 1){
            alert("Du har slettet en kategori");
        } else {
            alert("Noe gikk galt");
        }
      }
  }