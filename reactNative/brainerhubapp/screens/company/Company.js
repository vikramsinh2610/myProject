import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, FlatList, ImageBackground } from "react-native";
import Header from "../header/Header";
import MapView, { Marker } from 'react-native-maps';

//images
import brownHorse1 from '../../assets/images/brownhorse1.jpg';
import brownhorse2 from '../../assets/images/brownhorse2.jpg';
import headerHorse from '../../assets/images/headerHorse.jpg';


const Company = ({ navigation }) => {

    const [profileTabList, setProfileTabList] = useState([{
        name: "מדורגים ביותר",
        value: "toprated",
        selected: true
    },
    {
        name: "כל הקולקציה",
        value: "allcollection",
        selected: false
    }]);

    const hourseData = [
        {

            id: '1',
            image: brownHorse1,
            name: 'רכיבה שעתית',
            imageName:"brownhorse1"
        },
        {
            id: '2',
            image: brownhorse2,
            name: 'רכיבה קבוצתית',
            imageName:"brownhorse2"

        },

    ]

    /**
    * Render category list
    * @param {*} param0 
    */
    const renderDetails = ({ item }) => {
        return <TouchableOpacity style={styles.productBox} onPress={() =>{ 
            navigation.navigate('Product', { horseDetails: item })}}>
            <View key={item.id} >
                <ImageBackground
                    source={item.image}
                    resizeMode="cover"
                    style={styles.productBoxImg}>
                </ImageBackground>
                <View style={styles.productBoxInfo}>
                    <View style={styles.productBoxInfoTop}>
                        <Text style={styles.boxBrand}>{item.name}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    }
    return (

        <SafeAreaView style={{ flex: 1 }}>
            <Header headerName="בית" navigation={navigation}isHorse={true} ></Header>
            <View style={styles.container}>
                <MapView
                    style={styles.mapStyle}
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        draggable
                        coordinate={{
                            latitude: 37.78825,
                            longitude: -122.4324,
                        }}
                        onDragEnd={
                            (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
                        }
                        title={'Test Marker'}
                        description={'This is a description of the marker'}
                    />
                </MapView>
            </View>
            <View style={[styles.MainCard]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.innerCard}>
                        <View style={styles.MainCardImage}>
                            <Image source={headerHorse} style={styles.MainCardImg}></Image>
                        </View>
                        <Text style={styles.MainCardSubTitle}>חווית הרוכבים</Text>

                    </View>

                    <><View style={styles.contentBlock}>
                        <Text style={styles.contentBlockTitle}>תיאור</Text>
                        <Text style={styles.contentBlockText}>טיול רכיבה חוויתי ומלהיב על גבי סוסים
                            בינות הנופים המרהיבים
                            של חורש הכרמל
                        </Text>
                    </View>
                        <View style={styles.productTabs}>
                            {profileTabList.map((item, i) => {
                                return <Text key={i} style={[styles.productTabsItems, { backgroundColor: item.selected ? "#fff" : "", borderRadius: item.selected ? 10 : 10, color: item.selected ? "#1AABE3" : "", elevation:item.selected?5:0 }]}
                                    onPress={(item) => {
                                        console.log("Call");
                             
                                    }}>{item.name}</Text>;
                            })}

                        </View>
                        <View style={styles.productsModule}>
                            <View>
                                <FlatList
                                    data={hourseData}
                                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                                    numColumns={2}
                                    renderItem={renderDetails}
                                    keyExtractor={item => item.id} />
                            </View>
                        </View></>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default Company;

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
        maxHeight: "80%",
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
        marginBottom: 12,
        elevation: 5
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
        color: 'black',
        marginBottom: 20,
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
        fontSize: 18,
        lineHeight: 24,
        color: "#000",
        textTransform: "uppercase",
        marginBottom: 8,
        textAlign: 'right',
        fontWeight: 'bold'
    },
    contentBlockText: {
        fontSize: 15,
        lineHeight: 24,
        color: "#666",
        textAlign: 'right'
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
        padding: 8,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 5,
    },
    boxBrand: {
        fontSize: 12,
        color: 'black',
        lineHeight: 14,
        margin: 0,
        marginTop: 8,
        textAlign: 'right'
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
    producttabBtn: {
        paddingVertical: 4,
        paddingHorizontal: 11,
        fontSize: 12,
        lineHeight: 16,
        color: '#000',
        borderRadius: 500,
        backgroundColor: '#fff',
    },
});