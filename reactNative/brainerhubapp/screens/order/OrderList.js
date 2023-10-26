import React from "react";
import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

//icons
import AntDesign from 'react-native-vector-icons/AntDesign'

//images 
import orderShoes from '../../assets/images/ordershoes.jpg';

const OrderList = ({navigation}) => {

    const totalCredit = [{
        id: 1,
        name: "Korzi Jau",
        earn: "+50 e-credits"
    },
    {
        id: 2,
        name: "Sofa Inulas",
        earn: "+290 e-credits"
    }]
    return (
        <ScrollView style={{ backgroundColor: "#fff" }}>
        <View style={{ backgroundColor: "#fff" }}>
            <View style={styles.topHeader}>
                <View style={styles.mainheaderBtn} >
                    <AntDesign name="left" size={25} style={styles.topHeaderIcon} onPress={() => navigation?.navigate("Home")} />
                </View>
                <Text stye={styles.topHeaderTitle}>Orders</Text>
                <View style={styles.mainheaderBtn}>
                    <AntDesign name="hearto" size={25} style={styles.topHeaderIcon} />
                </View>
            </View>

            <View style={styles.contentBlock}>
                <View style={styles.productBlock}>
                    <View style={styles.productBox}>
                        <Image style={styles.productLogo} source={orderShoes} />
                        <View>
                            <Text style={styles.productName}>Magic of Light</Text>
                            <Text style={styles.productVarius}>Suspendisse varius</Text>
                            <View style={styles.ProductRow}>
                                <Text style={styles.productPrice}>$379</Text>
                                <TouchableOpacity style={styles.darkblueBtn}>
                                    <Text style={styles.darkblueBtnTitle}>Buy again</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.totalText}>
                    <Text style={styles.totalTitle}>Total e-credits earned</Text>
                </View>

                <FlatList
                    data={totalCredit}
                    renderItem={({ item }) => (
                        <View style={styles.listCard}>
                            <AntDesign name="star" size={40} color='#ff9100' style={styles.listCardIcon}/>
                            <Text style={styles.listCardTitle}>{item.name} </Text>
                            <Text style={styles.listCardSubtitle}>{item.earn} </Text>
                        </View>
                    )}
                    keyExtractor={item => item}
                />
            </View>
        </View>
        </ScrollView>
    )
}

export default OrderList;

const styles = StyleSheet.create({
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
    totalText: {
        marginBottom: 20
    },
    totalTitle: {
        fontSize: 19,
        color: '#000',
        fontWeight: '800',
        lineHeight: 23
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
    productName: {
        fontSize: 17,
        lineHeight: 24,
        color: '#000',
        fontWeight: '600',
        marginBottom: 5,
    },
    productremoveBtn: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        position: 'relative',
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
    contentBlock: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    listCard: {
        flexDirection: "row",
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        borderStyle: "solid",
        borderRadius: 15,
        marginBottom: 8
    },
    listCardIcon: {
        marginRight: 15,
    },
    listCardTitle: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 22,
        color: "#000",
        marginRight: 20
    },
    listCardSubtitle: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 22,
        color: "#1AABE3",
        marginRight: 15
    },
    ProductRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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