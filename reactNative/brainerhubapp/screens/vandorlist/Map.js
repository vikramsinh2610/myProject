import React, { useState } from "react";
import { StyleSheet, View, SafeAreaView, FlatList, ImageBackground } from "react-native";
import Header from "../header/Header";
import MapView, { Marker } from 'react-native-maps';

//icon
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';



import { TextInput } from "react-native-paper";
const Map = () => {
    const tokyoRegion = {
        latitude: 35.6762,
        longitude: 139.6503,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };
    return (

        <SafeAreaView style={{ flex: 1 }}>

            <Header headerName="Home" ></Header>
            <View style={styles.container}>
                <MapView
                    style={styles.mapStyle}
                    initialRegion={tokyoRegion}
                >
                    <Marker  coordinate={tokyoRegion}  />
                </MapView>
             
                <View style={styles.mapSearchBlock}>
                    <View style={styles.searchContainer}>

                        <EvilIcons
                            name="search"
                            size={25}
                            color="#1AABE3"
                            style={styles.searchContainerBtn}
                        />
                        <TextInput
                            type="text"
                            style={{ height: 40 }}
                            placeholder="Search"
                            style={styles.searchContainerInput}
                        />
                    </View>

                    <View style={styles.mainheaderFilterBtns}>
                        <View style={styles.mapButton} >
                            <Entypo name="list" size={25} color="#666" />
                        </View>
                        <View style={styles.filterButton}>
                            <Entypo name="sound-mix" size={22} color="white" onPress={() => setFilterOpen(true)} />
                        </View>
                    </View>
                </View>
            </View>

        </SafeAreaView>
    )
}

export default Map;

const mapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }],
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }],
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }],
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }],
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }],
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }],
    },
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }],
    },
    {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }],
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }],
    },
    {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }],
    },
];
const styles = StyleSheet.create({
    slideBtn: {
        height: 15,
        width: 100,
        borderRadius: 20,
        backgroundColor: "#000",
        display: 'flex'
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1
    },
    mapStyle: {
        flex: 1,
        height: '100%',
        width: '100%',
        display: 'flex'
    },
    MainCard: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#ddd",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 12,
        backgroundColor: '#fff',
        padding: 20,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "scroll",
        maxHeight: "70%",
        minHeight: 420,
        zIndex: 100
    },
    innerCard: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20
    },
    MainCardImage: {
        borderWidth: 2,
        borderColor: "#fff",
        borderStyle: "solid",
        width: 130,
        height: 130,
        borderRadius: 1000,
        overflow: "hidden",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12
    },
    MainCardImg: {
        width: 100,
        height: 100,
    },
    MainCardTitle: {
        fontSize: 15,
        lineHeight: 18,
        color: '#888',
        marginBottom: 1
    },
    MainCardSubTitle: {
        fontSize: 19,
        lineHeight: 26,
        color: '#111',
        marginBottom: 20
    },
    MainCardBtn: {
        display: "flex",
        flexDirection: "column",
        width: 300,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 25,
        paddingVertical: 12,
        backgroundColor: "#1AABE3",
        borderRadius: 10,
        textAlign: 'center',
        marginBottom: 20
    },
    MainCardBtnText: {
        fontSize: 16,
        lineHeight: 24,
        color: "#fff"
    },
    contentBlock: {
        marginBottom: 32,
    },
    contentBlockTitle: {
        fontSize: 17,
        lineHeight: 24,
        color: "#666",
        textTransform: "uppercase",
        marginBottom: 8
    },
    contentBlockText: {
        fontSize: 15,
        lineHeight: 24,
        color: "#666",
    },
    totelRates: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
        borderColor: "#ddd",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 12,
        backgroundColor: '#fff',
        marginBottom: 10,
        marginTop: 20,
        width: '35%'
    },
    totelRatesTitle: {
        fontSize: 28,
        fontWeight: "900",
        color: "#333",
        marginBottom: 2
    },
    totelRatesSubTitle: {
        fontSize: 14,
        lineHeight: 24,
        color: "#666",
    },
    RattingsHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18
    },
    RattingsTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#000",
    },
    RattingsRightTitle: {
        fontSize: 13,
        color: "#000",
        marginRight: 10,
        fontWeight: "700",
    },
    RattingsRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productTabs: {
        backgroundColor: "#f5f5f5",
        padding: 10,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    productTabsItems: {
        width: '48%',
        paddingVertical: 8,
        paddingHorizontal: 12,
        // borderRadius: 10,
        fontSize: 15,
        color: "#000",
        textAlign: "center"
    },

    productBox: {
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
    flatlist: {
        flexWrap: 'wrap',
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
    productBoxLimitedOffer: {
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 15,
        color: '#FF6302',
        borderRadius: 1000,
        marginTop: 8,
    },
    productBoxLimitedOfferTime: {
        color: '#000',
        marginRight: 5,
    },
    productTabs: {
        flexDirection: 'row',
        overflowX: 'scroll',
        marginBottom: 15,
    },
    producttabBtn: {
        paddingVertical: 4,
        paddingHorizontal: 11,
        fontSize: 12,
        lineHeight: 16,
        color: '#000',
        borderRadius: 500,
        backgroundColor: '#fff',
    },
    searchContainer: {
        position: 'relative',
        flex: 1,
        backgroundColor: '#fff',
    },
    mainheaderFilterBtns: {
        flexDirection: 'row',
    },
    searchContainerBtn: {
        position: 'absolute',
        top: 15,
        left: 12,
        zIndex: 9
    },
    searchContainerInput: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#eee',
        backgroundColor: '#fff',
        height: 30,
        padding: 10,
        lineHeight: 30,
        fontSize: 14,
        borderRadius: 10,
        paddingLeft: 40,
    },
    mapSearchBlock: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 22,
        flexDirection: 'row'
    },
    mainheaderFilterBtns: {
        flexDirection: 'row',
    },
    mapButton: {
        height: 50,
        width: 50,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: '#fff',
        marginLeft: 12,
    },
    filterButton: {
        height: 50,
        width: 50,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: '#1AABE3',
        marginLeft: 12,
        color: '#fff',
    },

});