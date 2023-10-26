import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { color } from "react-native-reanimated";

//images
import paymentSuccess from '../../../assets/images/paymentsuccess.png';


const HorsePayment = () => {
    return (
        <ScrollView>
            <View style={styles.paymentSuccess}>
                <View style={styles.paymentSuccessBlock}>
                    <Image source={paymentSuccess} style={{ width: 250, height: 250 }} />
                    <Text style={styles.paymentSuccessText}>הקנייה הסתיימה בהצלחה</Text>
                </View>
                <TouchableOpacity style={styles.blueBtn} >
                    <Text style={styles.blueBtnTitle} >חזרה לתפריט הראשי</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default HorsePayment

const styles = StyleSheet.create({
    blueBtn: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#1AABE3',
        backgroundColor: '#1AABE3',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    blueBtnTitle: {
        fontSize: 18,
        color: '#fff',
        lineHeight: 22,
        fontWeight: '700',
        textAlign: 'center',
    },
    paymentSuccess: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 20
    },
    paymentSuccessBlock: {
        marginBottom: 100
    },
    paymentSuccessText: {
        fontSize: 18,
        lineHeight: 24,
        color: '#000',
        fontWeight: 'bold',
        marginTop: 15,
        textAlign: 'center'
    }
})