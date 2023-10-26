import React from "react";
import { FlatList, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Header from "../header/Header";
import Search from "../search/Search";

// static image 

import foxHome from '../../assets/images/foxhome.jpg';
import footlocker from '../../assets/images/footlocker.png';
import cafeJoe from '../../assets/images/cafejoe.jpg';
import pierreCardin from '../../assets/images/pierrecardin.jpg';

const VendorList = ({navigation,route}) => {
    const listTab = [
        {
            status: 'All',
            value: 'all',
        },
        {
            status: 'Art',
            value: 'art',
        },
        {
            status: 'Photography',
            value: 'photography',
        },
        {
            status: 'Music',
            value: 'music',
        },
        {
            status: 'Fashion',
            value: 'fashion',
        },
        {
            status: 'Kitchen',
            value: 'kitchen',
        },
    ];

    const vendorsData = [
        {
            id: '1',
            image: foxHome,
            imageName: "foxHome",
            name: 'Fox Home',
            km: '12km',
            color: '#8E8E8E'
        },
        {
            id: '2',
            image: cafeJoe,
            imageName: "cafejoe",
            name: 'Cafe Joe',
            km: '1km',
            color: '#4D4D4D'
        },
    ];


    const allVendorsData = [
        {
            id: '1',
            image: pierreCardin,
            name: 'pierre Cardin',
            km: '5km',
            color: "#E8E8E8",
        },
        {
            id: '2',
            image: footlocker,
            name: 'Foot Locker',
            km: '',
            color: '#FFD1D8',
        },
        {
            id: '3',
            image: pierreCardin,
            name: 'pierre Cardin',
            km: '',
            color: '#FFD8E8',
        },
        {
            id: '4',
            image: footlocker,
            name: 'Foot Locker',
            name: 'Cafe Joe',
            km: '',
            color: '#D0F1FF'
        },
    ];

    /**
* Render popular vendorData
* @param {*} param0
* @returns
*/
    const renderVendorItem = ({ item }) => (
        <TouchableOpacity >
            <View style={styles.vendorBox} >
                <Text style={styles.vendorBoxKM}>{item.km}</Text>
                <ImageBackground
                    source={item.image}
                    resizeMode="cover"
                    style={styles.categoryBoxImg}></ImageBackground>
                <Text
                    style={{
                        backgroundColor: item.color,
                        fontSize: 0,
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        padding: 42,
                    }}>
                </Text>
                <Text style={styles.vendorTitle}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );


    /**
     * Render All vendorData 
     * @param {*} param0 
     * @returns 
     */
    const renderAllVendorItem = ({ item }) => (
        <TouchableOpacity >
            <View style={styles.vendorBox} >
                <Text style={styles.vendorBoxKM}>{item.km}</Text>
                <ImageBackground
                    source={item.image}
                    resizeMode="cover"
                    style={styles.categoryBoxImg}></ImageBackground>
                <Text
                    style={{
                        backgroundColor: item.color,
                        fontSize: 0,
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        padding: 42,
                    }}>
                </Text>
                <Text style={styles.vendorTitle}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ backgroundColor: '#fff' }}>
                <Header navigation={navigation}  headerName="Vendors" isBackIcon={route?.params!==undefined && route?.params ? route?.params?.isWallet:""}/>
                <View style={styles.containerBlock}>
                    <Search navigation={navigation} placeHolder="Search" />
                    <View style={styles.productTabs}>
                        <SafeAreaView>
                            <FlatList
                                data={listTab}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => console.log("calling ")}
                                            style={styles.producttabBtn}>
                                            <Text style={styles.textTab}>{item.status} </Text>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </SafeAreaView>
                    </View>

                    <View>
                        <Text style={styles.popularText}>Popular Vendors</Text>
                    </View>
                    <View style={styles.vendorModule}>
                        <SafeAreaView>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                data={vendorsData}
                                columnWrapperStyle={{ justifyContent: 'space-between' }}
                                numColumns={2}
                                renderItem={renderVendorItem}
                                keyExtractor={item => item.id}
                                // horizontal
                            />
                        </SafeAreaView>
                    </View>

                    <View>
                        <Text style={styles.popularText}>All Vendors</Text>
                    </View>
                    <View style={styles.vendorModule}>
                        <SafeAreaView>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                data={allVendorsData}
                                columnWrapperStyle={{ justifyContent: 'space-between' }}
                                numColumns={2}
                                renderItem={renderAllVendorItem}
                                keyExtractor={item => item.id}
                            />
                        </SafeAreaView>
                    </View>
                </View>

            </View>
        </ScrollView>
    )
}

export default VendorList;

const styles = StyleSheet.create({
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
    containerBlock: {
        paddingHorizontal: 20,
        paddingBottom: 30
    },
    productTabs: {
        flexDirection: 'row',
        overflowX: 'scroll',
        marginBottom: 15,
    },
    producttabBtn: {
        paddingVertical: 10,
        paddingRight: 15,
        fontSize: 14,
        lineHeight: 16,
        color: '#000',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    textTab: {
        color: 'black',
        backgroundColor: '#e8f9ff',
        borderRadius: 10,
        fontSize: 14,
        padding: 15,
        paddingTop: 10,
        paddingBottom: 10

    },
    popularText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6
    },
    categoryList: {
        flexDirection: 'row',
        // overflowX: 'scroll',
        justifyContent: 'space-between',
        marginBottom: 30
    },
    categoryBoxImg: {
        height: 90,
        width: 90,
        borderRadius: 1000,
        borderWidth: 3,
        borderStyle: 'solid',
        borderColor: '#fff',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 8,
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        backgroundColor: "fff",
        shadowColor: '#171717',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        // box-shadow: 1px 1px 5px 0px rgb(0 0 0 / 8%);
    },
    vendorBox: {
        borderRadius: 20,
        backgroundColor: '#fff',
        position: 'relative',
        overflow: 'hidden',
        marginTop: 10,
        padding: 25,
        // width: '90%',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'solid',
        flexDirection: 'column',
        alignItems: 'center',
    },
    vendorList: {
        flexDirection: 'row',
        overflowX: 'scroll',
    },
    vendorTitle: {
        fontSize: 14,
        color: '#333',
        margin: 0,
        fontWeight: '800',
    },
    vendorBoxOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 155,
        display: 'block',
        backgroundColor: '#888',
    },
    vendorImage: {
        height: 90,
        width: 90,
        borderRadius: 50,
        margin: '0 auto',
        marginBottom: 8,
        position: 'relative',
        overflow: 'hidden',
        // boxShadow: '1px 1px 5px 0px rgb(0 0 0 / 8%)',
    },
    vendorModule: {
        marginBottom: 30,
    },
    vendorBoxKM: {
        fontSize: 12,
        lineHeight: 18,
        position: "absolute",
        left: 10,
        top: 10,
        fontWeight: '600',
        color: '#1AABE3',
        zIndex: 5
    }
})