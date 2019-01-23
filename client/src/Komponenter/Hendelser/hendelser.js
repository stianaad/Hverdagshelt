import * as React from 'react';
import {Component} from 'react-simplified';
import {hendelseService} from '../../services/hendelseService';
import {generellServices} from '../../services/generellServices';
import {HashRouter, Route, NavLink, Redirect, Switch, Link} from 'react-router-dom';
import {FeedEvent, FeedHendelse, Filtrer, Info, Hendelse,ModalHendelse} from '../../Moduler/cardfeed';
import {Card, Feed, Grid, Button, Header, Icon, Image, Modal, Dropdown,Popup} from 'semantic-ui-react';
import {PageHeader} from '../../Moduler/header/header';
import { KommuneVelger } from '../../Moduler/KommuneVelger/kommuneVelger';
import { isNullOrUndefined, isUndefined, isNumber } from 'util';
import { brukerService } from '../../services/brukerService';

export class Hendelser extends Component {
	isOpen = false;
    hendelser = [];
	alleKategorier = [];
	skrivAlleKommuner = "Kommuner";
	skrivKategori = "Kategori";
	skrivFylke = "Fylke";
	skrivFraTid = "";
	skrivTilTid = "";
	skrivKommuneID = "";
	aktiveHendelser = [];
    link = "/hendelser";
	tider=[];
	hjemKommune = '';
	visFylke = false;
	kommuner=[];
	fylker=[];
	finnKommuneId=[]
	state = {open: false};
	valgteHendelse = {
		overskrift: '',
		bilde: '',
		tid: '',
		sted: '',
		kommune_navn: '',
	  };


		tilbakestill(){
			this.aktiveHendelser = this.hendelser;
			this.hentData();
			 this.skrivAlleKommuner="Alle kommuner";
			 this.skrivKommuneID="";
			 this.skrivKategori="Alle kategorier";
			 this.skrivFylke="Alle fylker";
		}
	

  filterKategori(e) {
	this.skrivKategori = e.target.value;
	if(this.skrivKategori === "0"){
		this.skrivKategori = "Kategori";
		this.aktiveHendelser = this.hendelser;
		this.filterAlle();
	} else {
		this.filterAlle();
	}
  }

    filterFraTid(e) {
			let fraTid = document.getElementById("fra").value;
			if(fraTid === "0"){
				this.aktiveHendelser = this.hendelser;
				this.skrivFraTid = "";
				this.filterAlle()
			}else{
				this.skrivFraTid = fraTid;
				this.filterAlle();
				//this.aktiveHendelser= this.aktiveHendelser.filter((kat) => kat.tid > fraTid);
			}
		}

    filterTilTid(e) {
		let tilTid = document.getElementById("til").value;
		if (tilTid === "0") {
			this.aktiveHendelser = this.hendelser;
			this.skrivTilTid = "";
			this.filterAlle()
		} else {
			this.skrivTilTid = tilTid;
			this.filterAlle();
			//this.aktiveHendelser = this.aktiveHendelser.filter((kat) => kat.tid < tilTid);
		}
    }

    async filterKommune(e) {
			this.skrivKommuneID = parseInt(e.target.value);
			if(this.skrivKommuneID === 0){
				this.aktiveHendelser = this.hendelser;
				this.visFylke = false;
				this.skrivAlleKommuner = "Alle kommuner";
				this.skrivKommuneID = "";
				this.filterAlle();
			}else{
				this.skrivAlleKommuner = this.kommuner.find(e => (e.kommune_id == this.skrivKommuneID)).kommune_navn;
				this.visFylke = true;
				this.skrivFylke = "Fylke";
				this.filterAlle();
				document.getElementById("fylke").value = 0;
			}
		}

		filterFylke(e) {
			this.skrivFylke = e.target.value;
			if( this.skrivFylke === "0"){
				this.skrivFylke = "Fylke";
				this.filterAlle();
			} else {
				this.filterAlle();
			}
		}

	handleOpen = () => {
		if (!this.isOpen) {
			this.isOpen = true;
		}
	};
	
	handleClose = () => {
		if (this.isOpen) {
			this.isOpen = false;
		}
	};

	filterAlle(){
		this.aktiveHendelser = this.hendelser.filter((h) => ((h.kategorinavn === this.skrivKategori) || this.skrivKategori == "Kategori"))
				.filter(h => ((h.kommune_id === this.skrivKommuneID) || this.skrivKommuneID == "")).filter(h => ((h.tid >= this.skrivFraTid) || this.skrivFraTid == "")).filter(h => ((h.tid <= this.skrivTilTid) || this.skrivTilTid == ""))
				.filter(h => ((h.fylke_navn === this.skrivFylke) || this.skrivFylke == "Fylke"));
	}



	handleOpenHendelser = (hendelse) => {
		this.valgteHendelse = {...hendelse};
		console.log(this.valgteHendelse);
		console.log('ehehheh');
		this.setState({open: true});
	  };
	
	  handleCloseHendelser = () => {
		this.setState({open: false});
	  };
  
  
    render() {
      return (
        <div className="container" >
        <PageHeader history={this.props.history}/>
		<Modal open={this.state.open} onClose={this.handleCloseHendelser} size="small" centered={true} dimmer="blurring">
			<ModalHendelse overskrift={this.valgteHendelse.overskrift} url={this.valgteHendelse.bilde} tid={this.valgteHendelse.tid} sted={this.valgteHendelse.sted} kommune_navn={this.valgteHendelse.kommune_navn}/>
		</Modal>
            <h1 className="text-center b-5" >Hendelser</h1>
           <div className="row ml-1">
		   <Popup
                trigger={
					<Button className="float-right mb-2" onClick={this.hentData}>Filtrer <img src="https://png.pngtree.com/svg/20160828/filter_45418.png" height="20" width="20"/> </Button>}
				flowing
                on="click"
                open={this.isOpen}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                position="bottom left">
                <Grid centered columns={3}>
                    <Grid.Column>
					<select
						onChange={this.filterKategori}
						className="form-control right floated meta m-2"
						style={{height: 30, width: 150}}>
						<option hidden> {this.skrivKategori} </option>
						<option value="0"> Alle kategorier </option>
						{this.alleKategorier.map((kategori) => (
						<option
								value={kategori.kategorinavn}
								key={kategori.kategorinavn}>
								{' '}
								{kategori.kategorinavn}
						</option>
						))}
					</select>
					<br/>
					<select
							onChange={this.filterKommune}
							className="form-control right floated meta m-2"
							style={{height: 30, width: 150}}
							value="hehehe"
							>
							<option hidden> {this.skrivAlleKommuner}</option>
							<option value="0"> Alle kommuner </option>
							{this.kommuner.map((sted) => (
							<option
								value={sted.kommune_id}
								key={sted.kommune_navn}
							>
								{' '}
								{sted.kommune_navn}
							</option>
							))}
							
						</select>
                    </Grid.Column>
					<Grid.Column>
					{<div>
						 	<label> Fra: 
						 		<input 
									onChange={this.filterFraTid}
									type="date" 
									style={{height: 30, width: 110}} 
									className="mt-2" 
									id="fra"
								/> 
							</label>
						</div>}
					<br/>
					<select
						onChange={this.filterFylke}
						className="form-control right floated meta m-2"
						disabled={this.visFylke}
						id="fylke"
						style={{height: 30, width: 150}}>
						<option hidden> {this.skrivFylke} </option>
						<option value="0"> Alle Fylker </option>
						{this.fylker.map((sted) => (
						<option
							value={sted.fylke_navn}
							key={sted.fylke_navn}>
							{' '}
							{sted.fylke_navn}
						</option>
						))}
               		</select>
					</Grid.Column>
					<Grid.Column>
					{<label className="ml-1">Til: 
						 	<input 
								onChange={this.filterTilTid}
								type="date" 
								style={{height: 30, width: 110}} 
								className="mt-2"
								id = "til"
							/>
						</label>}
						<br/>
					<Button 
					className="mt-4"
					fluid
					size ="mini"
					primary
					onClick ={()=> {this.tilbakestill()}}>
					Tilbakestill
					</Button>
					</Grid.Column>
                </Grid>
              </Popup>
           </div>
			<Card.Group stackable>
				{this.aktiveHendelser.map(hendelse => (
					<Hendelse
					onClick={() => {
                        this.handleOpenHendelser(hendelse);
                      }}
						bilde = {hendelse.bilde}
						overskrift = {hendelse.overskrift}
						sted = {hendelse.sted}
						kommune_navn = {hendelse.kommune_navn}
						tid = {hendelse.tid}
						key={hendelse.hendelse_id}
						hendelse_id={hendelse.hendelse_id}
					/>))}			
			</Card.Group>
        </div>
      );
	}

	async hentData(){
		let res2 = await generellServices.hentAlleKommuner();
		this.kommuner = await res2.data;
		if(global.payload != null){
			if(this.skrivAlleKommuner == "Kommuner"){
				this.skrivKommuneID = global.payload.user.kommune_id;
				let res1 = await res2.data.find(e => e.kommune_id == this.skrivKommuneID);
				this.skrivAlleKommuner = res1.kommune_navn;
			}
			if(this.skrivAlleKommuner != "Alle kommuner"){
				this.visFylke = true;
			}
			let res = await hendelseService.hentAlleHendelser();
			this.hendelser = await res.data;
			this.aktiveHendelser = await res.data;
			await this.filterAlle();
		}

		let res3 = await generellServices.hentAlleFylker();
		this.fylker = await res3.data;

		let res4 = await hendelseService.hentAlleKategorier();
		this.alleKategorier = await res4.data;
	}

	async mounted() {
		let res1 = '';
		if(global.payload == null){
			res1 = await hendelseService.hentAlleHendelser();
		} else {
			res1 = await hendelseService.hentHendelserForKommune(global.payload.user.kommune_id);
		}
		this.hendelser = await res1.data;
		this.aktiveHendelser = await res1.data;
		console.log(this.hendelser);
		/*this.tider = this.aktiveHendelser.map(
			kat => kat.tid
		);
		this.navn = this.kommuner.map(
			navn =>navn.kommune_navn
			);

			this.fylkekommune = this.kommuner*/
		//console.log(this.alleKategorier);
		//console.log(this.tider);
			//console.log(this.kommuner);
			//console.log(this.aktiveHendelser);
		//console.log(this.navn);
		//console.log(this.fylker);
	}

}
