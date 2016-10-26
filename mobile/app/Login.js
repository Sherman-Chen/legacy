import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  Alert,
} from 'react-native';
import t from 'tcomb-form-native';
import MealList from './MealList';

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // backgroundColor: 'black',
  },
  container: {
    justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 30,
    marginRight: 50,
    marginLeft: 50,
    borderRadius: 10,
    flexDirection: 'column',
    // width: 150,
    // height: 300,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,.75)',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: 30,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    marginBottom: 30,
    color: 'white',
    opacity: 1,
    textAlign: 'center',
    textShadowColor: 'black',
    textShadowRadius: 2,
    textShadowOffset: {
      width: 2,
      height: 2,
    },
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    height: 36,
    backgroundColor: 'green',
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
  }
});
// ENV Variables
const loginUrl = 'https://mealdotnext4.herokuapp.com/api/user/authenticate';
const signupUrl = 'https://mealdotnext4.herokuapp.com/api/user';
const Form = t.form.Form;
const Person = t.struct({
  username: t.String,
  password: t.String,
});
const options = {};


const onValueChange = async (item, selectedValue) => {
  try {
    await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log(`AsyncStorage error: ${error.message}`);
  }
};

export default class Login extends React.Component {
  gotoNext() {
    this.props.navigator.push({
      component: MealList,
      passProps: {
        id: 'MY ID',
      },
    });
  }

  authUser(url) {
    const value = this.refs.form.getValue();
    console.log('VALUE', value);
    if (value) {
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: value.username,
          password: value.password,
        }),
      })
      .then(response => response.json())
      .then((responseData) => {
        onValueChange('token', responseData.token);
        onValueChange('userId', responseData.userId);
        this.gotoNext();
      })
      .catch(() => {
        Alert.alert('DO YOU EVEN LYFT BRUH?');
      })
      .done();
    }
  }

  render() {
    return (
      <View style={styles.main}>
        <Image
          // if background image doesn't appear test url, site may have dropped uploaded image
          source={{ uri: 'https://s21.postimg.org/azydn73pz/resized_background.jpg' }}
          style={styles.backgroundImage}
        >
          <View style={styles.row}>
            <Text style={styles.title}>Meal.next</Text>
          </View>
          <View style={styles.container}>
            <View style={styles.row}>
              <Form
                ref="form"
                type={Person}
                options={options}
              />
            </View>
            <View style={styles.row}>
              <TouchableHighlight
                style={styles.button}
                onPress={() => this.authUser(loginUrl)}
                underlayColor="limegreen"
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.button}
                onPress={() => this.authUser(signupUrl)}
                underlayColor="limegreen"
              >
                <Text style={styles.buttonText}>Signup</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Image>
      </View>
    );
  }
}

Login.propTypes = {
  navigator: React.PropTypes.object,
  success: React.PropTypes.func,
};