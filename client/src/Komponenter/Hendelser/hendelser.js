import * as React from 'react';
import {Component} from 'react-simplified';
import {hendelseService} from '../../services/hendelseService';
import {generellServices} from '../../services/generellServices';
import {HashRouter, Route, NavLink, Redirect, Switch, Link} from 'react-router-dom';
import {FeedEvent, FeedHendelse, Filtrer, Info, Hendelse} from '../../Moduler/cardfeed';
import {Card, Feed, Grid, Button, Header, Icon, Image, Modal, Dropdown,Popup} from 'semantic-ui-react';
import {PageHeader} from '../../Moduler/header/header';
import { KommuneVelger } from '../../Moduler/KommuneVelger/kommuneVelger';
import { isNullOrUndefined, isUndefined, isNumber } from 'util';

export class Hendelser extends Component {
	isOpen = false;
    hendelser = [];
    alleKategorier = [];
	aktiveHendelser = [];
    link = "/hendelser";
    tider=[];
    kommuner=[];
		fylker=[];
		finnKommuneId=[]

		tilbakestill(){
			// Pushe tilbake til siden? 
			this.aktiveHendelser = this.hendelser;
			this.finnKommuneId = this.kommuner;
		}
	

  filterKategori(e) {
		let verdi =e.target.value;
		if(verdi === "0"){
			this.aktiveHendelser = this.hendelser;
		} else {
		this.aktiveHendelser = this.hendelser.filter((kat) => kat.kategorinavn === verdi);
		}
  }

  filterSted(e) {
		let verdi = e.target.value;
		this.aktiveHendelser = this.hendelser.filter((kat) => kat.sted === verdi);
		this.aktiveHendelser = this.aktiveHendelser.filter((kat) => kat.sted === verdi);
  }

    filterFraTid(e) {
			let fraTid = document.getElementById("fra").value+"0";
			if(fraTid === "0"){
				this.aktiveHendelser = this.hendelser;
			}else{
			this.aktiveHendelser= this.aktiveHendelser.filter((kat) => kat.tid > fraTid);
			}
		}

    filterTilTid(e) {
			let tilTid = document.getElementById("til").value +"0";
			if (tilTid === "0") {
				this.aktiveHendelser = this.hendelser;
				
			} else {
			
				this.aktiveHendelser = this.aktiveHendelser.filter((kat) => kat.tid < tilTid);
			}
	
    }

    filterKommune(e) {
				let verdi = parseInt(e.target.value);
				this.aktiveHendelser = this.hendelser.filter((kat) => kat.kommune_id === verdi);
        this.aktiveHendelser= this.aktiveHendelser.filter((kat) => kat.kommune_id === verdi);
		}


		filterFylke(e) {
			let verdi = e.target.value;
			console.log(verdi);
			this.aktiveHendelser = this.hendelser.filter(fylke => fylke.fylke_navn === verdi);
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
  
  
    render() {
      return (
        <div className="container" >
        <PageHeader history={this.props.history}/>
        
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
                position="bottom left"
              >
                <Grid centered columns={4}>
                    <Grid.Column>
					<select
						onChange={this.filterKategori}
						className="form-control right floated meta m-2"
						style={{height: 30, width: 150}}
						>
						<option hidden> Kategori </option>
						<option value="0"> Alle kategorier </option>
						{this.hendelser.map((kategori) => (
						<option
								value={kategori.kategorinavn}
								key={kategori.kategorinavn}
						>
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
							>
							<option hidden> Kommune </option>
							<option value="0"> Alle kommuner </option>
							{this.kommuner.map((sted) => (
							<option
								value={sted.kommune_id}
								key={sted.id}
							>
								{' '}
								{sted.kommune_navn}
							</option>
							))}
							
						</select>
                    </Grid.Column>
					<Grid.Column>
					<select
						onChange={this.filterSted}
						className="form-control right floated meta m-2"
						style={{height: 30, width: 150}}
						>
						<option hidden> Sted </option>
						<option value="0"> Alle steder </option>
						{this.hendelser.map((sted) => (
						<option
								value={sted.sted}
								key={sted.sted}>
								{' '}
								{sted.sted}
						</option>
						))} 
					</select>
					<br/>
					<select
						onChange={this.filterFylke}
						className="form-control right floated meta m-2"
						style={{height: 30, width: 150}}
						>
						<option hidden> Fylke </option>
						<option value="0"> Alle kommuner </option>
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
					<Button 
					className="mt-2"
					fluid
					size ="mini"
					primary
					onClick ={()=> {this.mounted()}}>
					Tilbakestill
					</Button>
					</Grid.Column>
					<Grid.Column>
						{<label className="ml-1">Til: 
						 	<input 
								onChange={this.filterTilTid}
								type="date" 
								style={{height: 30, width: 110, marginLeft:4}} 
								className="mt-2"
								id = "til"
							/>
						</label>}
					</Grid.Column>
                </Grid>
              </Popup>
           </div>
			<Card.Group stackable>
				{this.aktiveHendelser.map(hendelse => (
					<Hendelse
						onClick={()=>location.href=this.link +"/"+ hendelse.hendelse_id}
						bilde = {hendelse.bilde}
						overskrift = {hendelse.overskrift}
						sted = {hendelse.sted}
						tid = {hendelse.tid}
					/>))}	
					{this.aktiveHendelser.map(hendelse => (
					<Hendelse
						onClick={()=>location.href=this.link +"/"+ hendelse.hendelse_id}
						bilde = {hendelse.bilde}
						overskrift = {hendelse.overskrift}
						sted = {hendelse.sted}
						tid = {hendelse.tid}
					/>))}		
			</Card.Group>
        </div>
      );
	}

	async hentData(){
		let res2 = await generellServices.hentAlleKommuner();
		this.kommuner = await res2.data;
		//this.finnKommuneId = await res2.data;
		
		let res3 = await generellServices.hentAlleFylker();
		this.fylker = await res3.data;

		this.alleKategorier = this.aktiveHendelser.filter(
			kat => kat.kategorinavn
		);
	}

	async mounted() {
		let res1 = await hendelseService.hentHendelserForKommune();
		this.hendelser = await res1.data;
		this.aktiveHendelser = await res1.data;

		console.log(global.payload.user.kommune_id);

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
