import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";

//compoents
import Header from "../header/Header";

//dependencies
import QRCode from 'react-native-qrcode-svg';

//icon
import AntDesign from 'react-native-vector-icons/AntDesign';
const Purchase = ({navigation}) => {

    return (
        <ScrollView style={{ backgroundColor: "#fff" }}>
            <View style={{ backgroundColor: '#fff' }}>
                <Header  navigation={navigation}  wallet={false} isBackIcon={true} />
                <View style={styles.moneyHeader}>
                    <Text style={styles.moneyHeaderTitle}>Load Money To Wallet</Text>
                    <AntDesign name="arrowright" size={25} color="#666" style={{ marginLeft: 20 }} />
                </View>

                <View style={styles.container}>
                    <View style={styles.loadMoneyText}>
                        <Text style={styles.creditCardtext}>To pay for the product please scan the QR code</Text>
                        <QRCode
                            value="https://reactnative.dev/"
                        />
                    </View>
                </View>

            </View>
        </ScrollView>
    )
}

export default Purchase;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginBottom: 45
    },
    moneyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        // elevation: 2,
        // shadowOffset: {width: 0, height: 5},
        borderBottomWidth: 2,
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5'
    },
    moneyHeaderTitle: {
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center'
    },
    loadMoneyText: {
        textAlign: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20
    },
    priceTitle: {
        fontSize: 24,
        lineHeight: 30,
        color: '#000',
        fontWeight: '600',
        marginVertical: 30,
        textAlign: 'center'
    },
    creditCardtext: {
        fontSize: 24,
        lineHeight: 36,
        color: '#000',
        fontWeight: '400',
        marginBottom: 30,
        textAlign: 'center'
    },
    blueBtn: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#1AABE3',
        backgroundColor: '#1AABE3',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        width: 250
    },
    blueBtnTitle: {
        fontSize: 18,
        color: '#fff',
        lineHeight: 22,
        fontWeight: '700',
        textAlign: 'center',
    },
})