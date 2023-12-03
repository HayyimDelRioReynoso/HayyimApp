import * as React from 'react';
import * as RN from 'react-native';
import EmojiPicker from 'rn-emoji-keyboard';
import { database } from '../config/firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';


export default function Add() {

    const navigation = useNavigation();
    const [isOpen, setIsOpen] = React.useState(false);
    const [newItem, setNewItem] = React.useState({
        emoji: '🍔',
        nombre: '',
        precio: 0,
        isSold: false,
        createdAt: new Date(),

    })

    const onSend = async () => {
        await addDoc(collection(database, 'productos'), newItem)
        navigation.goBack();
    }

    const handlePick = (emojiObject) => {
        setNewItem({
            ...newItem,
            emoji: emojiObject.emoji,
        })
    }
    return (
        <RN.View style={styles.container}>
            <RN.Text style={styles.title}>Agregar Productos</RN.Text>

            <RN.View style={styles.tarjeta}>
                <RN.Text style={styles.etiquetaPrincipal}>Selecciona el icono del Producto</RN.Text>
                <RN.Text style={styles.emoji} onPress={() => setIsOpen(true)}>{newItem.emoji}</RN.Text>
                <EmojiPicker
                    onEmojiSelected={handlePick}
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                />
                <RN.Text style={styles.etiquetas}>Nombre del Producto</RN.Text>
                <RN.TextInput
                    style={styles.inputContainer}
                    placeholder='Producto'
                    placeholderTextColor="gray"
                    onChangeText={(text) => setNewItem({ ...newItem, nombre: text })}
                />
                <RN.Text style={styles.etiquetas}>Precio del Producto</RN.Text>
                <RN.TextInput
                    style={styles.inputContainer}
                    placeholder='$ 0.00 MXN'
                    placeholderTextColor="gray"
                    onChangeText={(text) => setNewItem({ ...newItem, precio: text })}
                    keyboardType="number-pad"
                />



                <RN.TouchableOpacity
                    onPress={onSend}
                    style={styles.button}>
                    <RN.Text style={styles.buttonText}>Guardar</RN.Text>
                </RN.TouchableOpacity>

            </RN.View>

        </RN.View>
    )
}

const styles = RN.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',

    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginTop: 30,
    },
    etiquetas: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
        marginLeft: 20,

    },
    etiquetaPrincipal: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
        marginTop: 25,
        alignSelf: 'center',

    },
    inputContainer: {
        width: '90%',
        padding: 13,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 6,
        alignSelf: 'center',
        color: 'white',
        marginBottom: 40,

    },
    emoji: {
        fontSize: 100,
        
        borderColor: 'white',
        borderRadius: 12,
        padding: 10,
        marginVertical: 6,
        marginTop: 30,
        marginBottom: 30,
        alignSelf: 'center',
    },
    tarjeta: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        marginTop: 20,
    },
    button: {
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 6,
        borderRadius: 8,
        alignItems: 'center',
        width: '80%',
        alignSelf: 'center',
    },
    buttonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },

})