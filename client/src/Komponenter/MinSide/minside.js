import * as React from 'react';
import {PageHeader} from '../../Moduler/header/header';
import {Component, sharedComponentData} from 'react-simplified';
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

export class Minside extends Component {
    render(){
        return(
            <div>
                <PageHeader history={this.props.history}/>
                <h1 className="text-center">Min side</h1>
                <div className="row ">
                    <div className="col-sm-4 mt-3 ml-3">
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
                        <FeedMinside
                          status="Under behandling"
                          tid={"2019-01-16 20:50"}
                          kategori={"Strømbrudd"}
                        >
                          {"Strømbrudd hjemme hos Stian"}
                        </FeedMinside>
                        <FeedMinside
                          status="Ferdig"
                          tid={"2019-01-15 10:50"}
                          kategori={"Vegproblem"}
                        >
                          {"Hull i vegen ved sverres gate"}
                        </FeedMinside>
                        <FeedMinside
                          status="Under behandling"
                          tid={"2019-01-16 20:50"}
                          kategori={"Strømbrudd"}
                        >
                          {"Strømbrudd hjemme hos Stian"}
                        </FeedMinside>
                        <FeedMinside
                          status="Ferdig"
                          tid={"2019-01-15 10:50"}
                          kategori={"Vegproblem"}
                        >
                          {"Hull i vegen ved sverres gate"}
                        </FeedMinside>
                    </Feed>
                  </Card.Content>
                </Card>
                    </div>
                    <div className="col-sm-4 mt-3">
                    <h2>Hendelser du følger</h2>
                    <Card.Group itemsPerRow={1}>
                        <Card >
                            <Image src="http://www.stavanger-konserthus.no/wp-content/uploads/2015/10/KONSERTER-OG-FORESTILLINGER-1.jpeg"/>
                            <Card.Content>
                                <Card.Header>Julekonsert på Bømlo</Card.Header>
                                <Card.Description><img className="mr-2"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simple_icon_time.svg/750px-Simple_icon_time.svg.png"
                            height="20"
                            width="25"/>2019-01-16 10:50</Card.Description>
                            </Card.Content>
                        </Card>
                        <Card >
                            <Image src="http://www.stavanger-konserthus.no/wp-content/uploads/2015/10/KONSERTER-OG-FORESTILLINGER-1.jpeg"/>
                            <Card.Content>
                                <Card.Header>Julekonsert på Bømlo</Card.Header>
                                <Card.Description><img className="mr-2"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Simple_icon_time.svg/750px-Simple_icon_time.svg.png"
                            height="20"
                            width="25"/>2019-01-16 10:50</Card.Description>
                            </Card.Content>
                        </Card>
                    </Card.Group>
                    </div>
                    
                </div>
            </div>
        )
    }
}