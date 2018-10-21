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

const dummyBooks = [
  {
    "publishers": [{
          "name": "Springer-Verlag"
      }],
      "pagination": "xiv, p. 646-934, [51] p. :",
      "identifiers": {
          "lccn": ["84005479"],
          "openlibrary": ["OL2843509M"],
          "isbn_10": ["0387909850"],
          "goodreads": ["2710459"],
          "librarything": ["1294490"]
      },
      "classifications": {
          "dewey_decimal_class": ["515"],
          "lc_classifications": ["QA303 .M33724 1985"]
      },
      "title": "Calculus III",
      "url": "http://openlibrary.org/books/OL2843509M/Calculus_III",
      "notes": "Previous ed. published in 1980 as chapters 13-18 of Calculus.\nIncludes index.",
      "number_of_pages": 934,
      "cover": {
          "small": "https://covers.openlibrary.org/b/id/245257-S.jpg",
          "large": "https://covers.openlibrary.org/b/id/245257-L.jpg",
          "medium": "https://covers.openlibrary.org/b/id/245257-M.jpg"
      },
      "subjects": [{
          "url": "https://openlibrary.org/subjects/calculus",
          "name": "Calculus"
      }],
      "publish_date": "1985",
      "key": "/books/OL2843509M",
      "authors": [{
          "url": "http://openlibrary.org/authors/OL236454A/Jerrold_E._Marsden",
          "name": "Jerrold E. Marsden"
      }],
      "by_statement": "Jerrold Marsden, Alan Weinstein.",
      "publish_places": [{
          "name": "New York"
      }]
  },
  { 
    "publishers": [{
          "name": "Addison-Wesley"
      }],
      "pagination": "xiii, 657 p. :",
      "identifiers": {
          "lccn": ["93040325"],
          "openlibrary": ["OL1429049M"],
          "isbn_10": ["0201558025"],
          "wikidata": ["Q15303722"],
          "librarything": ["45844"],
          "goodreads": ["112243"]
      },
      "subtitle": "a foundation for computer science",
      "title": "Concrete mathematics",
      "url": "http://openlibrary.org/books/OL1429049M/Concrete_mathematics",
      "classifications": {
          "dewey_decimal_class": ["510"],
          "lc_classifications": ["QA39.2 .G733 1994"]
      },
      "notes": "Includes bibliographical references (p. 604-631) and index.",
      "number_of_pages": 657,
      "cover": {
          "small": "https://covers.openlibrary.org/b/id/135182-S.jpg",
          "large": "https://covers.openlibrary.org/b/id/135182-L.jpg",
          "medium": "https://covers.openlibrary.org/b/id/135182-M.jpg"
      },
      "subjects": [{
          "url": "https://openlibrary.org/subjects/computer_science",
          "name": "Computer science"
      }, {
          "url": "https://openlibrary.org/subjects/mathematics",
          "name": "Mathematics"
      }],
      "publish_date": "1994",
      "key": "/books/OL1429049M",
      "authors": [{
          "url": "http://openlibrary.org/authors/OL720958A/Ronald_L._Graham",
          "name": "Ronald L. Graham"
      }, {
          "url": "http://openlibrary.org/authors/OL229501A/Donald_Knuth",
          "name": "Donald Knuth"
      }, {
          "url": "http://openlibrary.org/authors/OL2669938A/Oren_Patashnik",
          "name": "Oren Patashnik"
      }],
      "by_statement": "Ronald L. Graham, Donald E. Knuth, Oren Patashnik.",
      "publish_places": [{
          "name": "Reading, Mass"
      }],
      "ebooks": [{
          "formats": {},
          "preview_url": "https://archive.org/details/concretemathemat00grah_444",
          "availability": "restricted"
      }]
  }
]

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <SectionList
              sections={[
                {title: 'Searching for', data: dummyBooks},
                {title: 'Able to swap', data: dummyBooks}
              ]}
              renderItem={({item}) => 
              <View style={styles.bookitem}>
                <Image
                  style={{width: 50, height: 50}}
                  source={{uri: item.cover.medium }}
                />
                <View style={styles.booktext}>
                  <Text style={styles.booktitle}>{item.title}</Text>
                  <Text style={styles.bookauthors}>{item.authors[0].name}</Text>
                </View>
              </View>}
      
              renderSectionHeader={({section}) => 
              <Text style={styles.listheader}>{section.title}</Text>}
              keyExtractor={(item, index) => index}
            />
        </ScrollView>
      </View>
    );
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
