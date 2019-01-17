import * as React from 'react';
import {PageHeader} from '../../Moduler/header/header';
import {Component, sharedComponentData} from 'react-simplified';
import {feilService} from '../../services/feilService';
import {
    Card,
    Feed,
    Grid,
    Button,
    Header,
    Icon,
    Image,
    Modal,
  } from 'semantic-ui-react';
  import {FeedEvent, FeedHendelse, Filtrer, Info, FeedMinside} from '../../Moduler/cardfeed';
import { brukerService } from '../../services/brukerService';

export class Minside extends Component {
    rapporterteFeil = [];
    folgteFeil = [];
    folgteHendelser = [];


    render(){
        return(
            <div>
                <PageHeader history={this.props.history}/>
                <h1 className="text-center">Min side</h1>
                <div className="row ">
                    <div className="col mt-3 ml-3">
                    <h2> </h2>
                    <Card fluid="true">
                  <Card.Content>
                    <Card.Header>
                      Dine rapporterte feil
                      {/*<select
                        onChange={this.filter}
                        className="form-control right floated meta"
                        style={{height: 30, width: 120}}>
                        <option hidden> Filter </option>
                        <option value="0"> Alle kategorier </option>
                        {this.alleKategorier.map((kategori) => (
                          <option
                            value={kategori.kategorinavn}
                            key={kategori.kategorinavn}
                          >
                            {' '}
                            {kategori.kategorinavn}
                          </option>
                        ))}
                      </select>*/
                        }
                    </Card.Header>
                  </Card.Content>
                  <Card.Content>
                    <Feed>
                        {this.rapporterteFeil.map( feil => (
                            <FeedMinside
                            status={feil.status}
                            tid={feil.tid}
                            kategori={feil.kategorinavn}
                            fjern={() => this.fjernFeil(feil.feil_id)}
                          >
                            {feil.overskrift}
                          </FeedMinside>
                        ))}
                    </Feed>
                  </Card.Content>
                </Card>
                    </div>
                    <div className="col mt-3">
                    <h2>Hendelser du følger</h2>
                    <Card.Group itemsPerRow={1}>
                        {this.folgteHendelser.map(hendelse => (
                            <Card>
                            <Image src={hendelse.bilde} className="feilCard"/>
                            <Card.Content>
                                <Card.Header>{hendelse.overskrift}</Card.Header>
                                <Card.Description><img className="mr-2"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simple_icon_time.svg/750px-Simple_icon_time.svg.png"
                            height="20"
                            width="25"/>{hendelse.tid}</Card.Description>
                            </Card.Content>
                        </Card>
                        ))}
                    </Card.Group>
                    </div>
                    <div className="col mt-3">
                        <h2>Feil/mangler du følger</h2>
                        <Card.Group itemsPerRow={1}>
                        {this.folgteFeil.map(feil => (
                            <Card >
                                <Image src={feil.url} className="feilCard"/>
                                <Card.Content>
                                    <Card.Header>{feil.overskrift}</Card.Header>
                                    <Card.Description><img className="mr-2"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simple_icon_time.svg/750px-Simple_icon_time.svg.png"
                                height="20"
                                width="25"/>{feil.tid}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                    </div>
                    <div className="col">

                    </div>
                </div>
            </div>
        )
    }

    async finnFeilBruker(id){
        let res1 = await brukerService.finnFeilTilBruker(id);
        this.rapporterteFeil = await res1.data;
        await console.log(res1.data);
    }

    async fjernFeil(id){
        console.log(id);
        let res1 = await feilService.slettFeil(id);
        await this.finnFeilBruker(this.props.match.params.bruker_id);
    }

    async mounted(){
        await this.finnFeilBruker(this.props.match.params.bruker_id);

        let res2 = await brukerService.finnFolgteFeilTilBruker(this.props.match.params.bruker_id);
        this.folgteFeil = await res2.data;
        await console.log(res2.data);

        let res3 = await brukerService.finnFolgteHendelserTilBruker(this.props.match.params.bruker_id);
        this.folgteHendelser = await res3.data;
        await console.log(res3.data);
    }
}