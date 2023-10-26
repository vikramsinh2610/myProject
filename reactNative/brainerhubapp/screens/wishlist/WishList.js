import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

//icons
import AntDesign from 'react-native-vector-icons/AntDesign';

//images
import shoes from '../../assets/images/shoes.jpg';
import footlocker from '../../assets/images/footlocker.png';

const WishList = ({navigation}) => {

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{backgroundColor: '#fff'}}>
                <View style={styles.topHeader}>
                    <View style={styles.mainheaderBtn} >
                        <AntDesign name="left" size={25} style={styles.topHeaderIcon} onPress={() => navigation?.navigate("Home")} />
                    </View>
                    <Text stye={styles.topHeaderTitle}>WishList</Text>
                    <View style={styles.mainheaderBtn}>
                        <AntDesign name="shoppingcart" size={25} style={styles.topHeaderIcon} onPress={() => navigation?.navigate('Cart')} />
                    </View>
                </View>

                <View style={styles.containerBlock}>
                    <View style={styles.categoryBlock}>
                        <Image source={footlocker} style={styles.categoryImage}></Image>
                        <Text style={styles.categoryName}>Foot Locker</Text>
                    </View>
                    <View style={styles.productBlock}>
                        <View style={styles.productBox}>
                            <Image style={styles.productLogo} source={shoes} />
                            <View>
                                <Text style={styles.productName}>Magic of Light</Text>
                                <Text style={styles.productVarius}>Suspendisse varius</Text>
                                <View style={styles.ProductRow}>
                                    <Text style={styles.productPrice}>$379</Text>
                                    <TouchableOpacity style={styles.darkblueBtn}>
                                        <Text style={styles.darkblueBtnTitle}>Add to cart</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{marginTop: 80}}>
                        <View style={styles.dropdownPriceList}>
                            <Text style={styles.TotalTitle}>Total</Text>
                            <Text style={styles.TotalPrice}>$379</Text>
                        </View>

                        <TouchableOpacity style={styles.payBtn}>
                            <Text style={styles.payBtnText}>Pay Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
            </View>
        </ScrollView>
    )
}

export default WishList;

const styles = StyleSheet.create({
    containerBlock: {
        paddingHorizontal: 20,
        paddingBottom: 30
    },
    topHeader: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 22,
    },
    containerBlock: {
        paddingHorizontal: 20,
        paddingBottom: 30
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
    productBlock: {
        padding: 12,
        borderRadius: 15,
        marginBottom: 25,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f1f1f1',
        borderStyle: 'solid',
        shadowColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    productBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productLogo: {
        borderRadius: 10,
        width: 110,
        height: 110,
        marginRight: 12,
    },
    productName: {
        fontSize: 17,
        lineHeight: 24,
        color: '#000',
        fontWeight: '600',
        marginBottom: 5,
    },
    productVarius: {
        fontSize: 17,
        lineHeight: 24,
        color: '#888',
        fontWeight: '600',
        marginBottom: 5,
    },
    productPrice: {
        fontSize: 24,
        lineHeight: 32,
        color: '#1AABE3',
        fontWeight: '600',
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
    dropdownPriceList: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        marginBottom: 20
    },
    TotalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#274764',
        lineHeight: 22,
        marginTop: 18,
        textTransform: "uppercase",
    },
    TotalPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#00c4f8',
        lineHeight: 22,
        marginTop: 18,
    },
    payBtn: {
        display: "flex",
        flexDirection: "column",
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 25,
        paddingVertical: 12,
        backgroundColor: "#1AABE3",
        borderRadius: 10,
        textAlign: 'center'
    },
    payBtnText: {
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '700',
        color: "#fff"
    },
    ProductRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    categoryBlock: {
        flexDirection: "row",
        marginLeft:10,
        padding:7
    },
    categoryImage: { height: 60, width: 60, borderRadius: 50 },
    categoryName:{
        fontSize: 15,
        fontWeight: '700',
        marginTop:15,
        marginLeft:20,
        color: "black"
    },
    darkblueBtn: {
        borderRadius: 12,
        backgroundColor: '#00374d',
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: 110,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15
    },
    darkblueBtnTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff'
    }
})
