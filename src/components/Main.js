import React, { Component } from 'react';
import {Row, Col, Tabs, Tab, Alert, ButtonGroup, Button} from 'react-bootstrap';
import './main.css';
import Card from './Card';
const axios = require('axios');

class Main extends Component {
  state = {
    personlista: null,
    tabActive: 1,
    errorLoading: false
  };

  componentDidMount(){
    //TODO: Update the localstorage if the data is older than (?)

    //Stores the data in localstorage to minimize number of api calls and make application faster
    const storage = localStorage.getItem('personlista');

    if(storage !== null){
      this.setState({
        personlista: JSON.parse(storage)
      })
    }else{
      axios.get('http://data.riksdagen.se/personlista/?utformat=json')
        .then(res =>{

          //Sort by name
          let sortedList = res.data.personlista.person.sort((a,b) =>{
            return (a.tilltalsnamn > b.tilltalsnamn) ? 1 : b.tilltalsnamn > a.tilltalsnamn ? -1 : 0;
          });

          //Save to state & localstorage
          this.setState({personlista: sortedList});
          localStorage.setItem('personlista', JSON.stringify(sortedList));
        })
        .catch(err => {
          this.setState({errorLoading: true});
          console.log(err);
        })
    }
  }

  handleTabChange(key) {
    this.setState({tabActive: key});
  }
  createCard = (item, index) =>{
    return <Card tilltalsnamn={item.tilltalsnamn}
                 efternamn={item.efternamn}
                 img={item.bild_url_80}
                 status={item.status}
                 missions={item.personuppdrag.uppdrag}
                 year_born={item.fodd_ar}
                 key={index}/>
  };

  renderTab = (party, index) =>{
    return(
    <Tab eventKey={index} title={party} className="tab-wrapper">
      {
        this.state.personlista.map((item, index) =>{
          return item.parti === party && this.createCard(item, index)
        })
      }
    </Tab>)
  };

  sortByMissions = () =>{
    let sortedList = this.state.personlista.sort((a, b) =>{
      return b.personuppdrag.uppdrag.length - a.personuppdrag.uppdrag.length;
    });
    this.setState({personlista: sortedList});
  };
  sortByOldest = () =>{
    let sortedList = this.state.personlista.sort((a, b) =>{
      return a.fodd_ar - b.fodd_ar;
    });
    this.setState({personlista: sortedList});
  };
  sortByYoungest = () =>{
    let sortedList = this.state.personlista.sort((a, b) =>{
      return b.fodd_ar - a.fodd_ar;
    });
    this.setState({personlista: sortedList});
  };
  sortByName = () =>{
    let sortedList = this.state.personlista.sort((a, b) =>{
      return (a.tilltalsnamn > b.tilltalsnamn) ? 1 : b.tilltalsnamn > a.tilltalsnamn ? -1 : 0;
    });
    this.setState({personlista: sortedList});
  };
  render() {
    return (
        <Row>
          <Col sm={10} smOffset={1}>
            {this.state.personlista !== null ?
            <Tabs
              activeKey={this.state.tabActive}
              onSelect={this.handleTabChange.bind(this)}
              id="party-tab"
              animation={false}
              bsStyle="pills"
            >
              <div className="sort-buttons">
                Filtrera på: {' '}
                <ButtonGroup>
                  <Button bsSize="small" onClick={this.sortByMissions.bind(this)}>Antal uppdrag</Button>
                  <Button bsSize="small" onClick={this.sortByOldest.bind(this)}>Äldst</Button>
                  <Button bsSize="small" onClick={this.sortByYoungest.bind(this)}>Yngst</Button>
                  <Button bsSize="small" onClick={this.sortByName.bind(this)}>Rensa filter</Button>
                </ButtonGroup>
              </div>

              {this.renderTab("V", 1)}
              {this.renderTab("S", 2)}
              {this.renderTab("MP", 3)}
              {this.renderTab("C", 4)}
              {this.renderTab("KD", 5)}
              {this.renderTab("L", 6)}
              {this.renderTab("M", 7)}
              {this.renderTab("SD", 8)}
            </Tabs>
              : this.state.errorLoading === true && (<Alert className="text-center" bsStyle="danger">Något gick fel. Försök igen senare</Alert>)
            }
          </Col>
        </Row>
    );
  }
}

export default Main;
