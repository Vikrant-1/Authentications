import React, {useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const getUserId = () => {
    return auth()?.currentUser?.uid ?? null;
  };
  useEffect(() => {
   setUserInfo(auth().currentUser)
  }, []);

  const onPressGoogleSignUp = async () => {
    GoogleSignin.configure({
      webClientId:WEB_CLIENT_ID,
    });

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const authCerdentials = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      );

      await auth().signInWithCredential(authCerdentials);
      const userDetails = await auth().currentUser;
      setUserInfo(userDetails);
      return;
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  if (getUserId()) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          paddingVertical: 15,
          justifyContent: 'space-around',
        }}>
        <Image
          source={{uri:userInfo?.photoURL}}
          style={{
            width: 100,
            height: 100,
            resizeMode: 'contain',
          }}
        />
        <View style={{width: '100%', alignItems: 'center'}}>
          <Text>{userInfo?.displayName}</Text>
          <Text>{userInfo?.email}</Text>
          <Text></Text>
        </View>

        <View style={{width: '100%', alignItems: 'center'}}>
          <Pressable></Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        paddingVertical: 15,
        justifyContent: 'space-around',
      }}>
      <Image
        source={require('./src/assets/playstore.png')}
        style={{
          width: 150,
          height: 150,
          resizeMode: 'cover',
        }}
      />

      <View style={{width: '100%', alignItems: 'center'}}>
        <GoogleSigninButton size={2} color={1} onPress={onPressGoogleSignUp} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

export default App;
