import React from 'react';
import {
  Image,
  Platform,
  SectionList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';
import { getBookInformation } from '../utils/apiUtils'
export default class HomeScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {
      bookData: []
    };
  
  }

  componentDidMount() {
    var self = this;
    getBookInformation(["0201558025", "9780262533058", "0345803485"]).then(
      function(data){
        self.setState({
          bookData: Object.values(data)
        });
      }
    );
  }



  render() {   
    console.log(this.state.bookData);
    if (typeof this.state.bookData === "undefined" || this.state.bookData.length == 0) {
      return (
        <View style={styles.container}>
          <Text>Add a book!</Text>
        </View>
      )
    } else {        
      return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
              <SectionList
                sections={[
                  {title: 'Able to swap', data: this.state.bookData}
                ]}
                renderItem={({item}) => 
                  <View style={styles.bookitem}>
                    <Image
                      style={{width: 50, height: 50}}
                      source={{uri: item.cover.medium }}
                    />
                    <View style={styles.booktext}>
                      <Text style={styles.booktitle}>{item.title}</Text>
                      <Text style={styles.bookauthors}>{
                        typeof item.authors === "undefined" || item.authors.length === 0 ? "Author(s) unavailable" :
                        item.authors.map((x)=>(x.name)).join(", ")
                      }</Text>
                        
                      
                    </View>
                  </View>
                }
        
                renderSectionHeader={({section}) => 
                <Text style={styles.listheader}>{section.title}</Text>}
                keyExtractor={(item, index) => index}
              />
          </ScrollView>
        </View>
      );
    }
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bookitem: {
    padding: 10,
    display: "flex",
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '100%'
  },
  listheader: {
    fontSize: 24,
    backgroundColor: '#eee',
    paddingLeft: 10,
  },
  booktext: {
    display: "flex",
    flexDirection: 'column',
  },

  booktitle: {
    fontSize: 16,
    paddingLeft: 10,
  },
  bookauthors: {
    fontSize: 12,
    paddingLeft: 10,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
