//Importamos
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import Svg, { Path } from "react-native-svg"
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as React from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config/firebase-config';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { database } from '../config/firebase-config';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import * as RN from 'react-native';
import Product from '../componentesAdicionales/products';

//Metodo para manejar la autenticación 
WebBrowser.maybeCompleteAuthSession();

function LoginScreen() {

    //Definimos variables para la interfaz
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    //Definimos navigation para el desplazamiento entre screens
    const navigation = useNavigation();

    //Inicializamos metodos para firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    //Creamos método para ir al registro
    const registro = () => {
        navigation.navigate('Registro');
    }


    //Definimos primer ruta posible: Inicio de sesión por correo en firebase
    const handleSignIn = () => (
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Sesión Iniciada');
                const user = userCredential.user;
                console.log(user);
                AsyncStorage.setItem('@user:displayName', user.displayName);
                Alert.alert('¡Bienvenido, ' + user.displayName + '!', 'Inicio de Sesión Exitoso')
                navigation.navigate('Home');

            })
            .catch(error => {
                console.log(error);

            })
    )

    //Definimos segunda ruta posible: Inicio de sesión por autenticación de Google
    //Definimos variables
    const [token, setToken] = React.useState("");
    const [userInfo, setUserInfo] = React.useState(null);

    //Establecemos ID de acceso
    const [request, response, promtAsync] = Google.useAuthRequest({
        webClientId: "416675925823-djitfd0vt45voeis6ofg1095eatmc4er.apps.googleusercontent.com",
        iosClientId: "416675925823-aekvp88l5rdc2ffr2rg5be6nq95o5k1k.apps.googleusercontent.com",
        androidClientId: "416675925823-vae9sin8h0jhvklhas9ruu72jgmcc7gk.apps.googleusercontent.com"
    });

    //Usamos useEffect para el manejo de operaciones asíncronas
    React.useEffect(() => {
        handleEffect();
    }, [response, token]);

    //Verificamos si existe un usuario almacenado de manera local
    async function handleEffect() {
        const user = await getLocalUser();
        console.log("Usuario", user);
        //Si no hay ninguno local
        if (!user) {
            if (response?.type === "success") {

                getUserInfo(response.authentication.accessToken);
            }
            //Si hay uno local
        } else {
            setUserInfo(user);
            console.log("Cargado Localmente");
        }
    }

    // Función para obtener el usuario almacenado localmente
    const getLocalUser = async () => {
        // Obtener datos almacenados localmente bajo la clave "@user" utilizando AsyncStorage
        const data = await AsyncStorage.getItem("@user");
        // Verificar si no hay datos almacenados localmente
        if (!data) return null;
        // Si hay datos, parsearlos como JSON y devolverlos
        return JSON.parse(data);
    };

    // Función para obtener información del usuario utilizando un token de acceso
    const getUserInfo = async (token) => {
        if (!token) return;
        try {
            //Realizamos solitud de informacion a Google
            const response = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const user = await response.json();
            // Almacenar los datos del usuario en AsyncStorage bajo la clave "@user"
            await AsyncStorage.setItem("@user", JSON.stringify(user));
            setUserInfo(user);
        } catch (error) {

        }
    };

    //Ruta en caso de Login con Google
    const ShowUserInfo = () => {
        if (userInfo) {


            const [productos, setProductos] = React.useState([]);

            function salir() {
                //async () => await AsyncStorage.removeItem("@user");
                navigation.navigate('Login')
            }



            React.useEffect(() => {
                const collectionRef = collection(database, 'productos');
                const q = query(collectionRef, orderBy('createdAt', 'desc'));

                const unsuscribe = onSnapshot(q, querySnapshot => {
                    setProductos(
                        querySnapshot.docs.map(doc => ({
                            id: doc.id,
                            emoji: doc.data().emoji,
                            nombre: doc.data().nombre,
                            precio: doc.data().precio,
                            isSold: doc.data().isSold,
                            createdAt: doc.data().createdAt,
                        }))
                    )
                    return unsuscribe;
                })
            }, []);
            return (
                <View style={styles.containerG}>
                    <Text style={styles.tituloG}>
                        ¡Hola, {userInfo.given_name}!
                    </Text>
                    <Image source={{ uri: userInfo.picture }} style={styles.imagenG} />




                    <View style={styles.tarjetaG}>

                        <AntDesign style={styles.agregarG} name="pluscircle" onPress={() => navigation.navigate('Add')} size={30} color="black" />

                        <RN.ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                            <Text style={styles.titleProductosG}>Tus Productos:</Text>
                            {productos.map((product) => (
                                <Product key={product.id} {...product} />
                            ))}


                            <MaterialCommunityIcons name="exit-run" style={styles.cerrarTxtG} onPress={salir} size={35} color="black" />
                        </RN.ScrollView>
                    </View>
                </View>
            )
        }
    }

    function SvgTop() {
        return (
            <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                <Path d="M407 47c9.4-9.4 24.6-9.4 33.9 0l17.2 17.2c1.9-.1 3.9-.2 5.8-.2h32c11.2 0 21.9 2.3 31.6 6.5L543 55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-12.9 13c7.6 12.2 12 26.7 12 42.1 0 10.2 7.4 18.8 16.7 23 27.9 12.5 47.3 40.5 47.3 73 0 26.2-12.6 49.4-32 64v32c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16v-16h-64v16c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16v-17.6c-11.8-2.4-22.7-7.4-32-14.4-1.5-1.1-2.9-2.3-4.3-3.5-17-14.7-27.7-36.4-27.7-60.5 0-8.8-7.2-16-16-16s-16 7.2-16 16c0 44.7 26.2 83.2 64 101.2V352c0 17.7 14.3 32 32 32h32v64c0 17.7-14.3 32-32 32h-64c-17.7 0-32-14.3-32-32v-76c-19.8 7.7-41.4 12-64 12s-44.2-4.3-64-12v76c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V329.1l-18.1 40.6c-5.4 12.1-19.6 17.6-31.7 12.2s-17.5-19.5-12.1-31.6L24 300.9c5.3-11.9 8-24.7 8-37.7C32 155.7 117.2 68 223.8 64.1l.2-.1h64c41.7 0 83.4 12.1 117.2 25.7 1.7-1.8 3.5-3.6 5.3-5.2L407 81c-9.4-9.4-9.4-24.6 0-33.9zm73 185a24 24 0 1 0-48 0 24 24 0 1 0 48 0zm88 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm-88-112a16 16 0 1 0-32 0 16 16 0 1 0 32 0zm48 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32z" />
            </Svg>
        )
    }
    return (
        <View style={{ flex: 1 }}>
            {!userInfo ? (
                <View style={styles.container}>
                    <View style={styles.svgCont}>
                        <Image
                            source={require('../assets/logoMed.png')}
                            
                        />
                    </View>

                    
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
                    <StatusBar style="auto" />
                    <TouchableOpacity
                        onPress={handleSignIn}
                        style={styles.button}>
                        <Text style={styles.buttonText}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                    <Text style={styles.subtituloCuenta}>¿Aún no tiene una cuenta?</Text>
                    <TouchableOpacity
                        onPress={registro}
                        style={styles.buttonR}>
                        <Text style={styles.buttonTextR}>Registrarse</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            promtAsync();
                        }}
                    >
                        <Image
                            source={require('../assets/google-logo.png')}
                            style={styles.imagen}
                        />
                    </TouchableOpacity>
                </View>
            ) : (
                //<HomeScreen />
                <ShowUserInfo />
            )}
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
        width: 80,
        marginTop: -10,
        marginLeft:-340,

    },
    titulo: {
        fontSize: 45,
        color: 'black',
        fontWeight: 'bold',
        marginTop: -750,
    },

    subtitulo: {
        fontSize: 20,
        color: 'gray',
        marginTop: 15,
    },
    subtituloCuenta: {
        fontSize: 15,
        color: 'gray',
        alignSelf: 'flex-start',
        marginTop: 20,
        marginLeft: 50,
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
        marginTop: 20,
    },
    buttonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    buttonR: {
        backgroundColor: 'white',
        padding: 1,
        alignSelf: 'flex-end',
        marginTop: -20,
        marginRight: 60,
    },
    buttonTextR: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    imagen: {
        width: 50,
        height: 50,
        borderRadius: 100,
        alignSelf: 'center',
        marginTop: 20,
        borderWidth: 0.5,


    },
    containerG: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'flex-start',

    },
    cerrarTxtG: {

        alignSelf: 'flex-end',
        marginRight: 30

    },
    agregarG: {
        alignSelf: 'flex-end',
        marginRight: 30,
        marginTop: 20,
        flexDirection: 'row',
    },
    titleProductosG: {
        fontSize: 25,
        color: 'black',
        fontWeight: 'bold',
        marginTop: 5,
        alignSelf: 'center',
    },
    tituloG: {
        fontSize: 35,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 50,
        marginLeft: 20,


    },

    imagenG: {
        width: 50,
        height: 50,
        borderRadius: 100,
        alignSelf: 'flex-end',
        marginTop: -45,
        marginRight: 20,
        marginBottom: 15

    },

    subtituloG: {
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
    tarjetaG: {
        width: '100%',
        height: '80%',
        backgroundColor: 'white',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    }

});

export default LoginScreen;