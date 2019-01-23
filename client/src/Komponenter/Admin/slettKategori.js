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

    verdiKat(e){
        let res1 = "";
        if(e.target.value === 1){
            res1 = await feilService.hentAlleHovedkategorier();
        } else {
            res1 = await feilService.hentAlleSubkategorier();
        }
        this.kategorier = res1.data;
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
                {(this.kategorier.length>0) ? (
                <select onChange={this.verdiKat}>
                    {this.kategorier.map(e => (
                        <option >

                        </option>
                    ))}
                </select>) : ()}
                <br/>
                <br/>
                <Button onClick={this.handleClose} color="red" fluid>Slett feil</Button>
                </Popup>
              </div>

          )
      }
  }