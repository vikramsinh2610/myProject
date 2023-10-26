import React from "react";
import { FlatList, Image, StyleSheet, Text, View, ImageBackground, TouchableOpacity, ScrollView } from "react-native";

//Icon
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//Image
import cloths from '../../assets/images/cloths.jpg';
import artImage1 from '../../assets/images/art1.jpg';
import foxHome from '../../assets/images/foxhome.jpg';
import electronic from '../../assets/images/electronic.jpg';
import shoes from '../../assets/images/shoes.jpg';
import shoes1 from '../../assets/images/shoes1.jpg';
import Header from "../header/Header";


const productData = [
    {
        id: '1',
        image: cloths,
        name: 'Fox Home',
        price: '15$',
        description: "3 Box Simple"
    },
    {
        id: '2',
        image: electronic,
        name: 'Pierre Cardin',
        price: '600$',
        description: "3 Box Simple"

    },
];


const Cart = ({ navigation }) => {

    /**
     * Render cart product data
     * @param {*} param0 
     */
    const rendeCartProductData = ({ item }) => {
        return <View style={styles.productCartBox}>
            <ImageBackground
                source={item.image}
                resizeMode="cover"
                style={styles.productBoxImg}>
                <View style={styles.productBoxDiscount}>
                    <Text style={styles.productBoxOff}>45%</Text>
                </View>
            </ImageBackground>
            <View style={styles.productBoxInfo}>
                <View style={styles.productBoxInfoTop}>
                    <Text style={styles.productBoxBrand}>brand</Text>
                    <Text style={styles.productBoxPrice}>15$</Text>
                </View>
                <Text style={styles.productBoxName}>name</Text>
            </View>
        </View>
    }
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{backgroundColor: "#fff"}}>
            <View style={styles.topHeader}>
                <View style={styles.mainheaderBtn} >
                    <AntDesign name="left" size={25} style={styles.topHeaderIcon} onPress={() => navigation.navigate("Home")} />
                </View>
                <Text stye={styles.topHeaderTitle}>Cart</Text>
                <View style={styles.mainheaderBtn}>
                    <AntDesign name="hearto" size={25} style={styles.topHeaderIcon} />
                </View>
            </View>

            <View style={styles.containerBlock}>

                <View style={styles.productBlock}>
                    <View style={styles.productBox}>
                        <Image style={styles.productLogo} source={cloths} />
                        <View style={styles.productBlockInfo}>
                            <Text style={styles.productName}>Magic of Light</Text>
                            <Text style={styles.productVarius}>Suspendisse varius</Text>
                            <Text style={styles.productPrice}>$379</Text>
                        </View>
                    </View>
                    <View style={styles.productremoveBtn}>
                        <AntDesign
                            name="delete"
                            style={styles.moduleIcon}
                            size={20}
                            color="#fff"
                            fill="#fff"
                        />
                    </View>
                </View>

                <View style={styles.promoBtn}>
                    <MaterialCommunityIcons name="sale" size={20} color="#222" />
                    <Text style={styles.promoBtnText}>Use Promo Code</Text>
                    <AntDesign name="right" size={18} color="#bbb" />
                </View>

                <View style={styles.contentBlock}>
                    <Text style={styles.contentBlockTitle}>Goes well with</Text>
                    <Text style={styles.contentBlockText}>Few more product based on you prefernces</Text>
                </View>

                <View style="productModule">
                    <FlatList
                        data={productData}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        numColumns={2}
                        renderItem={rendeCartProductData}
                        key={item => item.id}
                        keyExtractor={item => item.id}
                    />
                </View>

                <View style={styles.dropdownPriceList}>
                    <Text style={styles.TotalTitle}>Total</Text>
                    <Text style={styles.TotalPrice}>$379</Text>
                </View>

                <TouchableOpacity style={styles.payBtn}>
                    <Text style={styles.payBtnText}>Pay Now</Text>
                </TouchableOpacity>
            </View>

        </View>
        </ScrollView>
    )
}

export default Cart

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
    productModule: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        display: 'flex',
    },
    productModule: {
        marginRight: 20,
        marginBottom: 25,
        width: '40%',
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
    productLogo: {
        borderRadius: 10,
        width: 110,
        height: 110,
        marginRight: 12,
    },
    productModule: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        display: 'flex',
    },
    productModule: {
        marginRight: 20,
        marginBottom: 25,
        width: '40%',
    },
    productBoxInfo: {
        marginTop: 10,
    },
    productBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productCartBox: {
        width: '48%',
        marginBottom: 25,
    },
    productBoxImg: {
        width: '100%',
        height: 172,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
    },
    productBoxDiscount: {
        position: 'absolute',
        right: 10,
        bottom: 10,
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
    productBoxInfoTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    productBoxBrand: {
        fontSize: 12,
        color: '#888',
        lineHeight: 14,
        margin: 0,
    },
    productBoxPrice: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
        fontWeight: '600',
    },
    productBoxName: {
        fontSize: 16,
        lineHeight: 18,
        margin: 0,
        color: '#555',
    },
    productremoveBtn: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        position: 'relative',
    },
    productName: {
        fontSize: 17,
        lineHeight: 24,
        color: '#000',
        fontWeight: '600',
        marginBottom: 5,
    },
    productVarius: {
        fontSize: 16,
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
    moduleIcon: {
        height: 45,
        width: 45,
        backgroundColor: '#1AABE3',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
    },
    promoBtn: {
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: '#b7cee8',
        paddingVertical: 18,
        paddingHorizontal: 30,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    promoBtnText: {
        fontSize: 18,
        color: '#274764',
        lineHeight: 22,
    },
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
    contentBlock: {
        marginVertical: 32
    },
    contentBlockTitle: {
        fontSize: 15,
        lineHeight: 24,
        color: "#000",
        fontWeight: '700',
        marginBottom: 2
    },
    contentBlockText: {
        fontSize: 15,
        lineHeight: 24,
        fontWeight: '700',
        color: "#777",
    },
    productBlockInfo: {
        paddingRight: 10,
        width: 148
      }
})