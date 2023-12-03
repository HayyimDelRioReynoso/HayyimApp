import React from 'react'
import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

export default function ButtonGradient() {
    return (
        <TouchableOpacity >
            <LinearGradient
                // Button Linear Gradient
                colors={['#000000', '#545454', 'gray']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
            >
                <Text style={styles.text}>Ingresar</Text>
            </LinearGradient>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: '80%',
        height: 50,
        justifyContent: 'center',
        borderRadius: 10,
        padding: 10,
        marginTop: 40,
    },
    text: {
        fontSize: 25,
        color: 'white',
    }
});