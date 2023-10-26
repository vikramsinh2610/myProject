import React, { useState } from "react";
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { color } from "react-native-reanimated";

//Icon
import AntDesign from 'react-native-vector-icons/AntDesign';

//images
import orderShoes from '../../assets/images/ordershoes.jpg';
import footlocker from '../../assets/images/footlocker.png';

const ProductDetails = ({ navigation, route }) => {

    const { productdetails } = route?.params
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View>
                <View style={styles.topHeader}>
                    <View style={styles.mainheaderBtn} >
                        <AntDesign name="left" size={25} style={styles.topHeaderIcon} onPress={() => navigation?.navigate("Home")} />
                    </View>
                    <Text style={styles.topHeaderTitle}>{productdetails?.name}</Text>
                    <View style={styles.mainheaderBtn}>
                        <AntDesign name="hearto" size={25} style={styles.topHeaderIcon} />
                    </View>
                </View>

                <View style={styles.containerBlock}>
                <View>
                    <ImageBackground
                        source={orderShoes}
                        resizeMode="cover"
                        style={styles.productBoxImg}>
                        <View style={styles.productBoxDiscount}>
                            <Text style={styles.productBoxOff}>45%</Text>
                        </View>
                    </ImageBackground>
                </View>

                <View style={styles.productBoxHeading}>
                    <Text style={styles.productName}>{productdetails?.name}</Text>
                    <View style={styles.productBoxinfo}>
                        <Text style={styles.productPrice}>100 $</Text>
                        <Text style={styles.productCredit}>/600 e-credits</Text>
                    </View>
                </View>

                <View style={styles.categoryBlock}>
                    <Image source={footlocker} style={styles.categoryImage}></Image>
                    <Text style={styles.categoryName}>Foot Locker</Text>
                </View>

                <View style={styles.contentBlock}>
                    <Text style={styles.contentBlockTitle}>Explanation</Text>
                    <Text style={styles.contentBlockText}>Prasent non ultrices eros. Fusce eget suscipit a massa. Aenean gravida ,ex in dignissim congue, quam numc varis nisl,euismod condimentum...</Text>
                </View>

                <View style={styles.productDetailsBtns}>
                    <TouchableOpacity style={styles.blueBtn}>
                        <Text style={styles.blueBtnTitle}>Add to cart</Text>
                    </TouchableOpacity>
                
                    <TouchableOpacity style={styles.darkblueBtn}>
                        <Text style={styles.darkblueBtnTitle}>Buy Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </ScrollView>
    )
}

export default ProductDetails;

const styles = StyleSheet.create({
    topHeader: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 22,
        // "flex": 100,
        // "backgroundColor": 'black',
    },
    containerBlock: {
        paddingHorizontal: 20,
        paddingBottom: 60
    },
    categoryBlock: {
        flexDirection: "row",
        marginTop: 15,
        alignItems: 'center'
    },
    categoryImage: { height: 40, width: 40, borderRadius: 50 },
    categoryName:{
        fontSize: 15,
        fontWeight: '700',
        marginLeft:20,
        color: "#888"
    },
    mainheaderBtn: {
        height: 35,
        width: 35,
        borderRadius: 10,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topHeaderIcon: {
        color: "#000"
    },
    topHeaderTitle: {
        fontSize: 16,
        lineHeight: 20,
        fontWeight: "900",
        margin: 0,
        color: '#000000',
    },
    containerBlock: {
        paddingHorizontal: 20,
        marginBottom: 0,
    },
    productBoxImg: {
        height: 350,
        borderRadius: 18,
        marginBottom: 20,
        overflow: "hidden"
    },
    productBoxDiscount: {
        position: 'absolute',
        right: 18,
        top: 18,
        fontSize: 14,
        lineHeight: 18,
        fontWeight: 'bold',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    productBoxOff: {
        backgroundColor: '#FF6302',
        paddingVertical: 8,
        paddingHorizontal: 15,
        color: '#fff',
        borderRadius: 1000,
    },
    productBoxHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    productName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000',
    },
    productBoxinfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 22, 
        fontWeight: '600',
        color: '#000'
    },
    productCredit: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1AABE3',
        marginLeft: 4
    },
    contentBlock: {
        marginTop: 35,
        marginBottom: 50
    },
    contentBlockTitle: {
        fontSize: 17,
        lineHeight: 24,
        color: "#000",
        fontWeight: '600',
        textTransform: "uppercase",
        marginBottom: 8
    },
    contentBlockText: {
        fontSize: 15,
        lineHeight: 24,
        color: "#666",
    },
    productDetailsBtns: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30
    },
    blueBtn: {
        borderRadius: 12,
        backgroundColor: '#1AABE3',
        paddingHorizontal: 22,
        paddingVertical: 12,
        width: 165,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    blueBtnTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff'
    },
    darkblueBtn: {
        borderRadius: 12,
        backgroundColor: '#00374d',
        paddingHorizontal: 22,
        paddingVertical: 12,
        width: 152,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    darkblueBtnTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff'
    }
})