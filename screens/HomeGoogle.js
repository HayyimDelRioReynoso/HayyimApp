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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const maxSquareHeight = screenHeight - 30;


function HomeGoogle() {
    const navigation = useNavigation();
    
    const [productos, setProductos] = React.useState([]);

    function salir(){
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

const styles = StyleSheet.create({
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
        width: screenWidth,
        height: maxSquareHeight,
        backgroundColor: 'white',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    }

});

export default HomeGoogle;