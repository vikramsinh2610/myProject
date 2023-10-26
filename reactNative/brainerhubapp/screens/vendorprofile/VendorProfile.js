import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, FlatList, ImageBackground, ScrollView, TextInput, ListViewComponent, Image } from "react-native";
import { Card } from "react-native-elements/dist/card/Card";
import { TouchableOpacity } from "react-native-gesture-handler";

//dependencies
import { ProgressBar, Colors } from 'react-native-paper';

//icon 
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';


//images
import shoes1 from '../../assets/images/shoes1.jpg';
import cafeJoe from '../../assets/images/cafejoe.jpg';
import foxHome from '../../assets/images/foxhome.jpg';
import artImage from '../../assets/images/art.jpg';
import artImage1 from '../../assets/images/art1.jpg';

import { Input, Rating } from "react-native-elements";
import { add } from "react-native-reanimated";

const imagePath = "../../assets/images/"
const VendorProfile = ({ navigation, route }) => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [isProfileTab, setProfileTab] = useState(true);

    const [profileTabList,setProfileTabList]=useState([{
        name: "Top Rated",
        value: "toprated",
        selected:true
    },
    {
        name: "All collection",
        value: "allcollection",
        selected:false
    }]);

    useEffect(()=>{

    },)
    const n = 5;
    const { vendarData } = route.params;
    const profileCategoryData = [
        {

            id: '1',
            image: foxHome,
            name: 'Fox Home',
        },
        {
            id: '2',
            image: artImage,
            name: 'Cafe Joe',
        },
        {
            id: '3',
            image: shoes1,
            name: 'art',
        },
        {
            id: '4',
            image: artImage1,
            name: 'art',
        }
    ]

    /**
     * Render category list
     * @param {*} param0 
     */
    const renderCateory = ({ item }) => (
        <View key={item.id} style={styles.productBox}>
            <ImageBackground
                source={item.image}
                resizeMode="cover"
                style={styles.productBoxImg}>
            </ImageBackground>
            <View style={styles.productBoxInfo}>
                <View style={styles.productBoxInfoTop}>
                    <Text style={styles.productBoxBrand}>Fox Home</Text>
                    <Text style={styles.productBoxPrice}>15$</Text>
                </View>
                <Text style={styles.productBoxName}>3 Box Simple</Text>
            </View>
        </View>
    )


    /**
     * Render ratings
     * @returns 
     */
    const renderRatings = () => {
        return <View style={styles.ratingRow}>
            <Rating
                type='custom'
                fractions="{1}" startingValue="{3.3}"
                style={styles.rating}
                ratingColor='#008db2'
                imageSize= {25}
                ratingBackgroundColor='white' />
            <ProgressBar progress={0.5} color={"#008db2"} style={styles.progressBarStyle} />
        </View>
    }

    const profileTab = [{
        name: "Top Rated",
        value: "toprated",
        selected:true
    },
    {
        name: "All collection",
        value: "allcollection",
        selected:false
    }
    ]



    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ backgroundColor: "#fff" }}>
                <View style={styles.topHeader}>
                    <View style={styles.mainheaderBtn} >
                        <AntDesign name="left" size={25} style={styles.topHeaderIcon} onPress={() => navigation?.navigate('Home')} />
                    </View>
                    <Text stye={styles.topHeaderTitle}>Profile</Text>
                    <View style={styles.mainheaderBtn}>
                        <Feather style={styles.hederRight} name="download" size={25} style={styles.topHeaderIcon} />
                    </View>
                </View>

                <View style={styles.containerBlock}>
                    <View style={styles.MainCard}>
                        <View style={styles.MainCardImage}>
                            <Image source={vendarData.imageName==="foxHome"?foxHome:vendarData.imageName==="cafejoe"?cafeJoe: vendarData.imageName==="artIamge"?artImage:artImage1}></Image>
                        </View>
                        <Text style={styles.MainCardTitle}>{vendarData.name}</Text>
                        <Text style={styles.MainCardSubTitle}>Shoes store</Text>
                        <TouchableOpacity style={styles.MainCardBtn}>
                            <Text style={styles.MainCardBtnText}>Follow</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentBlock}>
                        <Text style={styles.contentBlockTitle}>Description</Text>
                        <Text style={styles.contentBlockText}>Fusce finibus imperdiet nisl aliquet feugiat. Donec tempus vestibulum maximus ex vitae tristique. Cras viverra massa in est tempus, ut pellentesque lacus and</Text>
                    </View>

                    <View style={styles.productTabs}>
                        {profileTabList.map((item,index) => {
                            return <Text style={[styles.productTabsItems, { backgroundColor: item.selected ? "#d9d9d9" : "", borderRadius:item.selected? 10:10 }]}
                             onPress={(item) => { 
                            }}>{item.name}</Text>
                        })}
                       
                    </View>

                    <View style={styles.productsModule}>
                        <SafeAreaView>
                            <FlatList
                                data={profileCategoryData}
                                showsHorizontalScrollIndicator={false}
                                columnWrapperStyle={{ justifyContent: 'space-between' }}
                                numColumns={2}
                                renderItem={renderCateory}
                                keyExtractor={item => item.id}
                            />
                        </SafeAreaView>
                    </View>

                    <View style={styles.totelRates}>
                        <Text style={styles.totelRatesTitle}>8.0</Text>
                        <Text style={styles.totelRatesSubTitle}>Out of 10</Text>
                    </View>

                    <View style={styles.RattingsHeading}>
                        <View>
                            <Text style={styles.RattingsTitle}>Review</Text>
                        </View>
                        <View style={styles.RattingsRight}>
                            <Text style={styles.RattingsRightTitle}>Write a Review</Text>
                            <AntDesign name="question" size={17} color="#000" />
                        </View>
                    </View>
                    <View style={{ marginBottom: 100 }}>
                        {[...Array(n)].map(() => (
                            renderRatings()
                        )
                        )}
                    </View>
                    <View style={styles.contactForm}>
                        <Text style={styles.contactFormTitle}>Contact With us</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setName(text)}
                            placeholder="Your Name"
                            value={name}
                        />

                        <TextInput
                            style={styles.input}
                            onChangeText={text => setAddress(text)}
                            placeholder="Email Address *"
                            value={address}
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={(e) => setContact(e)}
                            placeholder="Phone *"
                            value={contact}
                        />
                        <View style={styles.contactFormBtnBlock}>
                            <TouchableOpacity style={styles.contactFormBtn}>
                                <Text style={styles.contactFormBtnText}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                </View>

            </View>
        </ScrollView>
    )
}

export default VendorProfile

const styles = StyleSheet.create({
    rating: {
        color: "#008db2",
        fontSize: 12
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
    topHeader: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 22,
        // "flex": 100,
        // "backgroundColor": 'black',
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
    },
    productsModule: {
        marginTop: 20,
    },
    productBoxInfo: {
        marginTop: 10,
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
    MainCard: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        paddingVertical: 30,
        borderColor: "#ddd",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 12,
        backgroundColor: '#fff',
        marginBottom: 20,
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
        textAlign: 'center'
    },
    MainCardBtnText: {
        fontSize: 16,
        lineHeight: 24,
        color: "#fff"
    },
    contentBlock: {
        marginBottom: 32
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
    contactForm: {
        marginBottom: 25
    },
    input: {
        fontSize: 16,
        lineHeight: 22,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: "#ddd",
        borderRadius: 15,
        marginBottom: 15,
        padding: 10,
        paddingHorizontal: 15
    },
    contactFormTitle: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: "700",
        color: '#000',
        marginBottom: 15
    },
    contactFormBtnBlock: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    contactFormBtn: {
        marginHorizontal: "auto",
        justifyContent: "center",
        paddingHorizontal: 25,
        paddingVertical: 12,
        backgroundColor: "#1AABE3",
        borderRadius: 15,
        textAlign: 'center',
        width: 120
    },
    contactFormBtnText: {
        fontSize: 16,
        lineHeight: 24,
        color: "#fff",
        textAlign: 'center',
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 18
    },
    progressBarStyle: {
        height: 15, 
        width: 180, 
        borderRadius: 20
    }
})

