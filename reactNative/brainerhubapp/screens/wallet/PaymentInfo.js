import React from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, SafeAreaView, TouchableOpacity, ImageBackground, Linking } from "react-native";
import Header from "../header/Header";
import Search from "../search/Search";

//images
import footlocker from '../../assets/images/footlocker.png';
import visa from '../../assets/images/visa.jpg';
import foxHome from '../../assets/images/foxhome.jpg';
import Sofa from '../../assets/images/sofa.jpg';
import shoes from '../../assets/images/shoes.jpg';
import whiteShoes from '../../assets/images/whiteShoes.jpg';
import mastercard from '../../assets/images/mastercard.png';
import HeaderWithBack from "../../common/HeaderWithBack";

const PaymentInfo = ({ navigation }) => {

    const paymentData = [{
        image: footlocker,
        title: "Purchases",
        date: "11.12.2021 at 16:05",
        link: 'more',
        price: "-$495"
    },
    {
        image: shoes,
        title: "Adidas Shoe",
        subTitle: "Suspendisse varius",
        price: "$375"
    },
    {
        image: whiteShoes,
        title: "White Shoes",
        subTitle: "Suspendisse varius",
        price: "$120"
    },

    {
        image: visa,
        title: "Card replenishment",
        date: "11.12.2021 at 16:05",
        cardNumber: "**** **** **** 2704",
        price: "+$105"
    },
    {
        image: foxHome,
        title: "Purchases",
        date: "11.12.2021 at 16:05",
        link: 'more',
    },
    {
        image: Sofa,
        title: "Sofa",
        subTitle: "Suspendisse varius",
        price: "$729",
    },
    ]

    /**
     * Render payment data
     * @param {*} param0 
     * @returns 
     */

    const renderPaymentData = ({ item }) => (
        <TouchableOpacity style={styles.paymentBlock} onPress={() => navigation.navigate('PaymentInfo')}>
            <View style={styles.paymentBox} key={item.id}>
                <View style={styles.paymentLogoBlock}>
                    <ImageBackground source={item?.image} style={styles.paymentLogo} />
                    {/* <Image source={item?.image} style={{width: 260}}/> */}
                </View>
                <View style={styles.paymentBlockInfo}>
                    <Text style={styles.paymentName}>{item?.title}</Text>
                    {item?.subTitle ? <Text style={styles.paymentName}>{item?.subTitle}</Text> : <Text style={styles.paymentName}>{item?.cardNumber}</Text>}
                    <Text style={styles.paymentVarius}>{item?.date}</Text>

                </View>
            </View>
            <View>
                {item?.link ? <Text style={{ color: "black", fontWeight: 'bold', textDecorationLine: 'underline' }}
                >{item?.link}</Text> : <Text style={[styles.paymentPrice, { color: item?.cardNumber ? "green" : "red" }]}>{item?.price}</Text>
                }
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ backgroundColor: '#fff', marginBottom: 65 }}>
            <HeaderWithBack navigation={navigation} name="Payment History" navigateFileName="PaymentHistory"></HeaderWithBack>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <Search navigation={navigation} placeHolder="Home" />
                    <View >
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            data={paymentData}
                            renderItem={renderPaymentData}
                            keyExtractor={item => item.id}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default PaymentInfo

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
    },
    moduleHeading: {
        marginBottom: 10,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5
    },
    moduleTitle: {
        lineHeight: 18,
        color: '#555',
        margin: 0,
        letterSpacing: 1,
        fontWeight: 'bold'
    },
    paymentBlock: {
        padding: 12,
        borderRadius: 25,
        marginVertical: 10,
        backgroundColor: '#fff',
        // borderWidth: 1,
        // borderColor: '#f1f1f1',
        // borderStyle: 'solid',
        marginHorizontal: 5,
        elevation: 4,
        shadowColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    paymentLogoBlock: {
        borderRadius: 500,
        width: 70,
        height: 70,
        overflow: 'hidden',
        elevation: 4,
        margin: 5,
        marginRight: 12,
    },
    paymentLogo: {
        width: 70,
        height: 70,
        resizeMode: 'contain'
    },
    paymentBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentBlockInfo: {
        paddingRight: 10,
        width: 150
    },
    paymentremoveBtn: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        position: 'relative',
    },
    paymentName: {
        fontSize: 17,
        lineHeight: 24,
        color: '#000',
        fontWeight: '600',
        marginBottom: 5,
    },
    paymentVarius: {
        fontSize: 16,
        lineHeight: 24,
        color: '#888',
        fontWeight: '600',
        marginBottom: 5,
    },
    paymentPrice: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: '600',
        textAlign: "right"
    },
})