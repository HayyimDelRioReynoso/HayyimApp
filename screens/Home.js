//Importamos
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import * as RN from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { database } from '../config/firebase-config';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Product from '../componentesAdicionales/products';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//Definimos variables para tamaño de la interfaz
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const maxSquareHeight = screenHeight - 30;


function HomeScreen() {

    //Definimos navigation para el desplazamiento entre screens
    const navigation = useNavigation();

    //Definimos variables para la interfaz
    const [displayName, setDisplayName] = useState('');
    const [productos, setProductos] = React.useState([]);

    //Creamos método para volver al Login
    function salir(){
        navigation.navigate('Login');
    }

   
    //Usamos useEffect para el manejo de operaciones asíncronas
    React.useEffect(() => {
        // Obtenemos el displayName del almacenamiento local
        const getDisplayName = async () => {
            const storedDisplayName = await AsyncStorage.getItem('@user:displayName');
            setDisplayName(storedDisplayName || 'Usuario');
        };

        getDisplayName();

        //Llamamos al método collection de firebase para almacenar los productos
        const collectionRef = collection(database, 'productos');

        //Creamos el query para visualizar los items de la base
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        //Utilizamos onSnapshot como un listener de cambios en la base y mapeamos al ser un arreglo
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

    //Creamos la screen Home
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>
                ¡Hola, {displayName}!
            </Text>
            <Image source={require('../assets/imagenID_2.jpg')} style={styles.imagen} />




            <View style={styles.tarjeta}>

                <AntDesign style={styles.agregar} name="pluscircle" onPress={() => navigation.navigate('Add')} size={30} color="black" />

                <RN.ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    <Text style={styles.titleProductos}>Tus Productos:</Text>
                    {productos.map((product) => (
                        <Product key={product.id} {...product} />
                    ))}


                    <MaterialCommunityIcons name="exit-run" style={styles.cerrarTxt} onPress={salir} size={35} color="black" />
                </RN.ScrollView>
            </View>
        </View>
    )
}

//Definimos los estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'flex-start',

    },
    cerrarTxt: {

        alignSelf: 'flex-end',
        marginRight: 30

    },
    agregar: {
        alignSelf: 'flex-end',
        marginRight: 30,
        marginTop: 20,
        flexDirection: 'row',
    },
    titleProductos: {
        fontSize: 25,
        color: 'black',
        fontWeight: 'bold',
        marginTop: 5,
        alignSelf: 'center',
    },
    titulo: {
        fontSize: 35,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 50,
        marginLeft: 20,


    },

    imagen: {
        width: 50,
        height: 50,
        borderRadius: 100,
        alignSelf: 'flex-end',
        marginTop: -45,
        marginRight: 20,
        marginBottom: 15

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
    tarjeta: {
        width: screenWidth,
        height: maxSquareHeight,
        backgroundColor: 'white',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    }

});

export default HomeScreen;