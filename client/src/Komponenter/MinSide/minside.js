import * as React from 'react';
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
                <h1 className="text-center">Min side</h1>
                <div className="row ">
                    <div className="col-sm-4 mt-3 ml-3">
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
                    <div className="col-sm-4">
                    <Card.Group itemsPerRow={1}>
                        <Card >
                            <Image src="http://www.stavanger-konserthus.no/wp-content/uploads/2015/10/KONSERTER-OG-FORESTILLINGER-1.jpeg"/>
                            <Card.Content>
                                <Card.Header>Julekonsert på Bømlo</Card.Header>
                                <Card.Description>2019-01-16 10:50</Card.Description>
                            </Card.Content>
                        </Card>
                        <Card raised image={ '/images/wireframe/image.png'} />
                        <Card raised image={ '/images/wireframe/image.png'} />
                        <Card raised image={ '/images/wireframe/image.png'} />
                        <Card raised image={ '/images/wireframe/image.png'} />
                    </Card.Group>
                    </div>
                </div>
            </div>
        )
    }
}