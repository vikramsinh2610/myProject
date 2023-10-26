import React from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, SafeAreaView, TouchableOpacity, ImageBackground, Image } from "react-native";
import Header from "../header/Header";
import Search from "../search/Search";

//images
import footlocker from '../../assets/images/footlocker.png';
import visa from '../../assets/images/visa.jpg';
import foxHome from '../../assets/images/foxhome.jpg';
import mastercard from '../../assets/images/mastercard.png';
import HeaderWithBack from "../../common/HeaderWithBack";

const PaymentHistory = ({ navigation }) => {

    const paymentData = [{
        image: footlocker,
        title: "Purchases",
        date: "11.12.2021 at 16:05",
        price: "-$495"
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
        price: "-$729"
    },
    {
        image: mastercard,
        title: "Card replenishment",
        date: "11.12.2021 at 16:05",
        cardNumber: "**** **** **** 5419",
        price: "+$800"
    },
    ]



    const filterDataOne = [
        {
            id: 1,
            image: "shoes",
            title: "Adidas Shoe",
            subTitle: "Suspendisse varius",
            price: "$375"
        },
        {
            id: 2,
            image: "whiteShoes",
            title: "White Shoes",
            subTitle: "Suspendisse varius",
            price: "$120"
        },
    ]

    /**
     * Render payment data
     * @param {*} param0 
     * @returns 
     */

    const renderPaymentData = ({ item }) => (
        <TouchableOpacity style={styles.paymentBlock}  onPress={() => navigation.navigate('PaymentInfo')}>
                <View style={styles.paymentBox} key={item.id}>
                    <View style={styles.paymentLogoBlock}>
                        <ImageBackground source={item?.image} style={styles.paymentLogo} />
                        {/* <Image source={item?.image} style={{width: 260}}/> */}
                    </View>

                    <View style={styles.paymentBlockInfo}>
                        <Text style={styles.paymentName}>{item?.title}</Text>
                        <Text style={styles.paymentName}>{item?.cardNumber}</Text>
                        <Text style={styles.paymentVarius}>{item?.date}</Text>

                    </View>
                </View>
                <View>
                    <Text style={[styles.paymentPrice, { color: item?.cardNumber ? "green" : "red" }]}>{item?.price}</Text>
                </View>
        </TouchableOpacity>
    );

    const renderFilterData = ({ item }) => (
        <View style={styles.paymentBlock}>
            <View style={styles.paymentBox}>
                <View style={styles.paymentLogoBlock}>
                    <ImageBackground source={item?.image} style={styles.paymentLogo} />
                </View>

                <View style={styles.paymentBlockInfo}>
                    <Text style={styles.paymentName}>{item?.title}</Text>
                    <Text style={styles.paymentName}>{item?.subTitle}</Text>
                </View>
            </View>
            <View>
                <Text style={styles.paymentPrice}>{item?.price}</Text>
            </View>
        </View>

    );

    return (
        <View style={{ backgroundColor: '#fff', marginBottom: 65 }}>
            {/* <Header navigation={navigation} headerName="Payment History" wallet={false} /> */}
            <HeaderWithBack navigation={navigation} name="Payment History" navigateFileName="Wallet"></HeaderWithBack>
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={styles.container}>
                    <Search navigation={navigation} placeHolder="Home" />
                    <View style={styles.moduleHeading}>
                        <Text style={styles.moduleTitle}>All Payment</Text>
                    </View>
                    {/* <View style={styles.paymentModule}>
                        <SafeAreaView>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                data={paymentData}
                                renderItem={renderPaymentData}
                                keyExtractor={item => item.id}
                            />
                        </SafeAreaView>
                    </View> */}



                    <View style={styles.vendorModule}>
                        <SafeAreaView>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                data={paymentData}
                                renderItem={renderPaymentData}
                                keyExtractor={item => item.id}
                            />
                        </SafeAreaView>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default PaymentHistory

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        marginBottom: 45
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
    paymentModule: {
        marginBottom: 25
    },
})