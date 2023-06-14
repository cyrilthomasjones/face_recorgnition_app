import React, { Component } from 'react';
// import Particles from 'react-particles-js';
import ParticlesBg from 'particles-bg'
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo'; 
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'; 
import Rank from './components/Rank/Rank'; 
import './App.css';

/*const particlesOptions = {
    particles: {
      line_linked: {
        shadow: {
          enable: true,
          color: "#3CA9D1",
          blur: 5
      }
    }
  }
}
   */  

// URL of image to use. Change this to your image.
/*const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';

const raw = JSON.stringify({
  "user_app_id": {
    "user_id": "clarifai",
    "app_id": "main"
  },
  "inputs": [
      {
          "data": {
              "image": {
                  "url": IMAGE_URL
              }
          }
      }
  ]
});

const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key '+'e90e6858801c49dba5faaeeb8cfdb35a'
    },
    body: raw
};*/

const initialState = {
      input: '',
      imageUrl:'',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''  
      }
    }

class App extends Component{
  constructor() {
    super();
    this.state = initialState;
  }
// componentDidMount(){
//   fetch('http://localhost:300/')
//     .then(response => response.json())
//     .then(console.log)
// }

loadUser = (data) => {
  this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
  }})
}

calculateFaceLocation = (data) =>{
    const clariaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clariaiFace.left_col * width,
      topRow: clariaiFace.top_row * height,
      rightCol: width - (clariaiFace.right_col * width),
      bottomRow: height - (clariaiFace.bottom_row * height)
    }
  }

displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
      this.setState({imageUrl: this.state.input});
      // app.models.predict('face-detection', this.state.input)
          fetch('http://localhost:3000/imageurl', {
                    method: 'post',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                      input: this.state.input
                    })

                  })
          .then(response => response.json())
          .then(response => {
            if(response){
              fetch('http://localhost:3000/image', {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  id: this.state.user.id
                })

              })
                .then(response => response.json())
                .then(count =>{
                  this.setState(Object.assign(this.state.user, count))
                })
                .catch(console.log)
            }
            this.displayFaceBox(this.calculateFaceLocation(response))
          })
          .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      // this.setState({isSignedIn: false});
      this.setState (initialState);
    }else if(route === 'home'){
      this.setState({isSignedIn: true});
    }

    this.setState({route: route});

  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
    <div className="App">
      <ParticlesBg type="cobweb" num={300} bg={true} color="#ffffff" />
     <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
     { route === 'home'
        ?<div>
            <Logo />
            <Rank 
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition box={box} imageUrl={imageUrl}/>
        </div>
        :( 
          route === 'signin'
          ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
     }
    </div>
   );
  }
}

export default App;
