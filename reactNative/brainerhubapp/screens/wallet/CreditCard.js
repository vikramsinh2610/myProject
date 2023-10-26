import React from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";

//compoennt
import Header from "../header/Header";

//dependencies
import LinearGradient from 'react-native-linear-gradient';

//images

import creditCardboy from '../../assets/images/creditcardboy.png';

//Icon
import AntDesign from 'react-native-vector-icons/AntDesign';

const CreditCard = ({navigation}) => {
    return (
        <ScrollView style={{ backgroundColor: "#fff" }}>
            <View style={{ backgroundColor: '#fff' }}>
                <Header navigation={navigation}  wallet={false} isBackIcon={true} />
                <View style={styles.moneyHeader}>
                    <Text style={styles.moneyHeaderTitle}>Load Money To Wallet</Text>
                    <AntDesign name="arrowright" size={25} color="#666" style={{ marginLeft: 20 }} />
                </View>

                <LinearGradient
          colors={['#0000', '#00000020']}
          style={styles.categoryProductBoxOvarlay}>
                <View style={styles.container}>
                    <View style={styles.loadMoneyText}>
                        <Image source={creditCardboy} height={10} width={10} style={styles.creditCardImg}/>
                        <Text style={styles.creditCardtext}>No fees on the credit the first year
                            order</Text>
                        <Text style={styles.creditCardtext}>Our card now and get <Text style={styles.highlightText}>250</Text> shekels as a gift</Text>
                    </View>
                </View></LinearGradient>

            </View>
        </ScrollView>
    )
}

export default CreditCard;

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
    creditCardtext: {
        fontSize: 20,
        lineHeight: 30,
        color: '#000',
        fontWeight: '600',
        marginBottom: 22,
        textAlign: 'center'
    },
    highlightText: {
        fontSize: 36,
        alignItems: 'center',
        lineHeight: 42,
        color: '#1AABE3',
        marginBottom: 10,
        fontWeight: 'bold'
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
    creditCardImg: {
        height: 250,
        width: 250,
        marginBottom: 20
    }
})