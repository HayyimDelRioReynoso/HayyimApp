
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput,TouchableOpacity,Alert } from 'react-native';
import Svg, { Path} from "react-native-svg"
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config/firebase-config';
import { useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

function SignUP() {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [displayName, setDisplayName] = useState('');

    const navigation = useNavigation();

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);



    const handleCreateAccount = () => {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            
            const user = userCredential.user;
            const imageUrl = 'https://drive.google.com/uc?export=download&id=1lmVNTkHjk0lbagSaUtKqTD5pVrVDuyyE';
      
            if (user) {
              
              updateProfile(user, { displayName, photoURL: imageUrl })
                .then(() => {
                  console.log('Cuenta creada con displayName:', user);
      
                  
                  Alert.alert('¡Registro exitoso!', 'Inicie sesión para continuar');
                  navigation.navigate('Login');
                })
                .catch((updateError) => {
                  console.error('Error al actualizar el perfil:', updateError.message);
                  
                });
                navigation.navigate('Home');
            } else {
              console.error('El objeto de usuario es undefined');
             
            }
          })
          .catch((error) => {
            console.log(error);
            Alert.alert(error.message);
          });
      };


    function SvgTop() {
        return (
            <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                <Path d="M407 47c9.4-9.4 24.6-9.4 33.9 0l17.2 17.2c1.9-.1 3.9-.2 5.8-.2h32c11.2 0 21.9 2.3 31.6 6.5L543 55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-12.9 13c7.6 12.2 12 26.7 12 42.1 0 10.2 7.4 18.8 16.7 23 27.9 12.5 47.3 40.5 47.3 73 0 26.2-12.6 49.4-32 64v32c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16v-16h-64v16c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16v-17.6c-11.8-2.4-22.7-7.4-32-14.4-1.5-1.1-2.9-2.3-4.3-3.5-17-14.7-27.7-36.4-27.7-60.5 0-8.8-7.2-16-16-16s-16 7.2-16 16c0 44.7 26.2 83.2 64 101.2V352c0 17.7 14.3 32 32 32h32v64c0 17.7-14.3 32-32 32h-64c-17.7 0-32-14.3-32-32v-76c-19.8 7.7-41.4 12-64 12s-44.2-4.3-64-12v76c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V329.1l-18.1 40.6c-5.4 12.1-19.6 17.6-31.7 12.2s-17.5-19.5-12.1-31.6L24 300.9c5.3-11.9 8-24.7 8-37.7C32 155.7 117.2 68 223.8 64.1l.2-.1h64c41.7 0 83.4 12.1 117.2 25.7 1.7-1.8 3.5-3.6 5.3-5.2L407 81c-9.4-9.4-9.4-24.6 0-33.9zm73 185a24 24 0 1 0-48 0 24 24 0 1 0 48 0zm88 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm-88-112a16 16 0 1 0-32 0 16 16 0 1 0 32 0zm48 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32z" />
            </Svg>
        )
    }
    return (
        <View style={{ flex: 1 }}>

            <View style={styles.container}>
                <View style={styles.svgCont}>
                    <SvgTop />
                </View>

                <Text style={styles.titulo}>Registrarse</Text>
                <Text style={styles.subtitulo}>Ingrese en su cuenta</Text>
                <TextInput
                    onChangeText={(text) => setEmail(text)}
                    placeholder='Correo' style={styles.textInput}
                    autoCapitalize='none'
                />
                <TextInput
                    onChangeText={(text) => setPassword(text)}
                    placeholder='Contraseña' style={styles.textInput}
                    secureTextEntry={true}
                />

                <TextInput
                    placeholder="Nombre de usuario"
                    style={styles.textInput}
                    onChangeText={(text) => setDisplayName(text)}
                />

                <StatusBar style="auto" />

                <TouchableOpacity
                    onPress={handleCreateAccount}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Registrarme</Text>
                </TouchableOpacity>

                

                
            </View>



        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    svgCont: {
        width: 170,
        marginTop: -1000,

    },
    titulo: {
        fontSize: 45,
        color: 'black',
        fontWeight: 'bold',
        marginTop: -800,
    },

    subtitulo: {
        fontSize: 20,
        color: 'gray'
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        paddingStart: 30,
        paddingEnd: 30,
        width: '80%',
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: 'black',
        padding: 10,
        marginVertical: 6,
        borderRadius: 8,
        alignItems: 'center',
        width: '80%',
        alignSelf: 'center',
        marginTop: 30,
    },
    buttonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },

});

export default SignUP;