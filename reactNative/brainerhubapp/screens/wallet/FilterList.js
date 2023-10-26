import React from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, SafeAreaView, TouchableOpacity, ImageBackground, Image } from "react-native";
import Header from "../header/Header";
import Search from "../search/Search";

//images
import footlocker from '../../assets/images/footlocker.png';
import foxHome from '../../assets/images/foxhome.jpg';
import shoes from '../../assets/images/shoes.jpg';
import whiteShoes from '../../assets/images/whiteShoes.jpg';
import Sofa from '../../assets/images/sofa.jpg';
import HeaderWithBack from "../../common/HeaderWithBack";

const FilterList = ({ navigation }) => {

    const filterDataOne = [
        {
            id: 1,
            image: shoes,
            title: "Adidas Shoe",
            subTitle: "Suspendisse varius",
            price: "$375"
        },
        {
            id: 2,
            image: whiteShoes,
            title: "White Shoes",
            subTitle: "Suspendisse varius",
            price: "$120"
        },
    ]

    const filterDataTwo = [
        {
            id: 1,
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
        <ScrollView>
            <View style={{ backgroundColor: '#fff', marginBottom: 65 }}>
                <HeaderWithBack navigation={navigation} name="Payment" navigateFileName="Wallet"></HeaderWithBack>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <Search navigation={navigation} placeHolder="Home" />
                        <View style={styles.filterListHeading}>
                            <View style={styles.filterListBrand}>
                                <View style={styles.filterListBrandLogo}>
                                    <Image source={footlocker} style={styles.filterListBrandImg}></Image>
                                </View>
                                <Text style={styles.filterListBrandTitle}>Foot Locker</Text>
                            </View>
                            <Text style={styles.filterListTime}>11.12.2021 at 16:05</Text>
                            <Text style={styles.filterListPrice}>$495</Text>
                        </View>
                        <View style={styles.vendorModule}>
                            <SafeAreaView>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    data={filterDataOne}
                                    renderItem={renderFilterData}
                                    keyExtractor={item => item.id}
                                />
                            </SafeAreaView>
                        </View>


                        <View style={styles.filterListHeading}>
                            <View style={styles.filterListBrand}>
                                <View style={styles.filterListBrandLogo}>
                                    <Image source={foxHome} style={styles.filterListBrandImg}></Image>
                                </View>
                                <Text style={styles.filterListBrandTitle}>Fox Home</Text>
                            </View>
                            <Text style={styles.filterListTime}>07.12.2021 at 11:27</Text>
                            <Text style={styles.filterListPrice}>$729</Text>
                        </View>
                        <View style={styles.vendorModule}>
                            <SafeAreaView>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    data={filterDataTwo}
                                    renderItem={renderFilterData}
                                    keyExtractor={item => item.id}
                                />
                            </SafeAreaView>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </ScrollView>
    )
}

export default FilterList

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
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
        width: 160
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
        textAlign: "right",
        color: '#1AABE3'
    },
    filterListHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    filterListBrand: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterListBrandTitle: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#888'
    },
    filterListBrandLogo: {
        width: 40,
        height: 40,
        borderRadius: 500,
        elevation: 4,
        overflow: 'hidden'
    },
    filterListBrandImg: {
        width: 40,
        height: 40,
    },
    filterListTime: {
        fontSize: 14,
        fontWeight: '600',
        color: '#888'
    },
    filterListPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000'
    },
    vendorModule: {
        marginBottom: 25
    }
})