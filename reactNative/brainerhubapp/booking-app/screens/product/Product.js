import React, { useState } from "react";
import { StyleSheet, Text, View, Image, Modal } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
// import { Tooltip } from 'react-native-elements';
// import { Tooltip } from 'native-base';
import PopoverTooltip from 'react-native-popover-tooltip';


//icons

import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';


//images 
import brownHorse1 from '../../assets/images/brownhorse1.jpg';
import brownhorse2 from '../../assets/images/brownhorse2.jpg';
import headerHorse from '../../assets/images/headerHorse.jpg';

const Product = ({ navigation, route }) => {
    const { horseDetails } = route?.params;

    return (
        <ScrollView style={{ backgroundColor: "#fff" }}>
            <View style={{ backgroundColor: "#fff" }}>
                <View style={styles.topHeader}>
                    <View style={styles.mainheaderBtn} >
                        <AntDesign name="left" size={25} style={styles.topHeaderIcon} onPress={() => navigation?.navigate("Company")} />
                    </View>
                    <Text stye={styles.topHeaderTitle}>{horseDetails?.name}</Text>
                    <View style={styles.mainheaderBtn}>
                        <AntDesign name="hearto" size={25} style={styles.topHeaderIcon} />
                    </View>
                </View>

                <View style={styles.contentBlock}>
                    <View style={styles.productBlock}>
                        <View style={styles.productBox}>
                            <Image style={styles.productLogo} source={horseDetails.imageName === "brownhorse1" ? brownHorse1 : brownhorse2} />
                            <View style={styles.productIconInfo}>
                                <View style={{ marginRight: 10 }}>
                                    {/* <Tooltip
                                        skipAndroidStatusBar={false}
                                        backgroundColor='white'
                                        withOverlay={false}
                                        style={{ marginRight: 10 }}
                                        skipAndroidStatusBar={false}
                                        popover={<Text>הפעילות מתאימה לגילאי 5
                                            גילאי 5 עד 8 מקבלים אקדח דמה
                                            ילד החל מגיל 8 מקבל ציוד מלא </Text>}>
                                        <Feather name="alert-circle" size={20} color={'red'}  />
                                    </Tooltip>
                                  */}

                                    <PopoverTooltip
                                        labelContainerStyle={{ backgroundColor: 'white', alignItems: 'center', marginLeft: 100 }}
                                        buttonComponent={
                                            <View>
                                                <Text>
                                                    <Feather name="alert-circle" size={20} color={'red'} />
                                                </Text>
                                            </View>
                                        }
                                        items={[
                                            {
                                                label: 'הפעילות מתאימה לגילאי 5 גילאי 5 עד 8 מקבלים אקדח דמהילד החל מגיל 8 מקבל ציוד מלא '
                                            },
                                        ]}
                                    />
                                </View>
                                {/* <View>
                                    <Tooltip
                                        backgroundColor='white'
                                        withOverlay={false}
                                        // skipAndroidStatusBar={false}
                                        popover={<Text>חוויה מסעירה בטבע פראי
                                            משחק לייזר תאג מלא (כשעה פעילות)
                                            בין הסלעים והשיחים ובצל העצים
                                            של הכרמל </Text>}>
                                        <AntDesign name="pushpino" size={20} />
                                    </Tooltip>
                                </View> */}
                                <PopoverTooltip
                                    labelContainerStyle={{ backgroundColor: 'white', alignItems: 'center', marginLeft: 100 }}
                                    buttonComponent={
                                        <View >
                                            <Text>
                                                <AntDesign name="pushpino" size={20} color="#FF8800" />
                                            </Text>
                                        </View>
                                    }
                                    items={[
                                        {
                                            label: 'חוויה מסעירה בטבע פראימשחק לייזר תאג מלא (כשעה פעילות)בין הסלעים והשיחים ובצל העציםשל הכרמל'
                                        },
                                    ]}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.productSubHead}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SimpleLineIcons name="calendar" size={26} color="#00F89D" onPress={() => navigation.navigate('Calendar')} />
                            <Text style={styles.productSubHeadTime}> 18.11.2021</Text>
                        </View>
                        <Text style={styles.rideTime} >רכיבה סוסים שעתית</Text>
                    </View>

                    <View style={styles.bioBlock}>
                        <Text style={styles.bioBlockTitle}>רכיבה סוסים שעתית</Text>
                        <Image style={styles.companyLogo} source={headerHorse} />
                    </View>

                    <View style={styles.contentModule}>
                        <Text style={styles.contentModuleTitle}>תיאור החוויה</Text>
                        <Text style={styles.contentModuleText}>
                            יציאה בליווי מדריך לנסיעה מלהיבה ומלאת ריגושים בינות פיתולי הכרמל, במסלולי שטח אתגריים עם נוף מרהיב.  נהיגה עצמית (בהצגת רישיון נהיגה בלבד) ברכב שטח חזק, בטיחותי, ידידותי למשתמש ומסעיר.
                        </Text>
                    </View>

                    <View style={styles.buttonRow}>

                        <TouchableOpacity style={styles.favBtn}>
                            <Text style={styles.btnTitle}>הוסף למועדפים</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.timeBtn}>
                            <Text style={styles.btnTitle}>הזמן</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cartBtn}>
                            <Text style={styles.btnTitle}>הוסף לסל</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.makeBtn}>
                            <Text style={styles.btnTitle}>שלם כעת</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default Product;

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
        padding: 0,
        borderRadius: 8,
        marginBottom: 25,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f1f1f1',
        borderStyle: 'solid',
        shadowColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
    },
    productIconInfo: {
        position: 'absolute',
        top: 10,
        left: 10,
        flexDirection: 'row'
    },
    productSubHead: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 22
    },
    productSubHeadTime: {
        fontSize: 14,
        color: '#000',
        lineHeight: 22,
        marginLeft: 8
    },
    bioBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 22
    },
    bioBlockTitle: {
        fontSize: 17,
        lineHeight: 26,
        color: '#555'
    },
    contentModule: {
        marginBottom: 25
    },
    contentModuleTitle: {
        color: '#000',
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 5
    },
    contentModuleText: {
        color: '#555',
        fontSize: 15,
        lineHeight: 24
    },
    productBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productName: {
        fontSize: 17,
        lineHeight: 24,
        color: '#555',
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
        width: 450,
        height: 450,
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
    },
    companyLogo: {
        height: 40,
        width: 40,
        borderRadius: 50,
        marginLeft: 15
    },
    rideTime: {
        color: 'black',
        // float: 'right',
        fontSize: 20,
        lineHeight: 28
    },
    favBtn: {
        height: 45,
        // width: 90,
        width: 158,
        flex: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        textAlign: 'center',
        marginHorizontal: 8,
        backgroundColor: '#FF8800',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    timeBtn: {
        height: 45,
        // width: 90,
        width: 158,
        flex: 1,
        borderRadius: 10,
        marginHorizontal: 8,
        paddingHorizontal: 12,
        textAlign: 'center',
        paddingVertical: 12,
        backgroundColor: '#00F89D',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    cartBtn: {
        height: 45,
        // width: 90,
        width: 158,
        flex: 1,
        borderRadius: 10,
        marginHorizontal: 8,
        paddingHorizontal: 12,
        textAlign: 'center',
        paddingVertical: 12,
        backgroundColor: '#00374D',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    makeBtn: {
        height: 45,
        // width: 90,
        width: 158,
        flex: 1,
        borderRadius: 10,
        marginHorizontal: 8,
        paddingHorizontal: 12,
        textAlign: 'center',
        paddingVertical: 12,
        backgroundColor: '#00C4F8',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    btnTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        lineHeight: 22
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    }
})