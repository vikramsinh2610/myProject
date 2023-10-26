import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View, TextInput, StyleSheet, SafeAreaView, Modal, Text, ImageBackground, ScrollView, } from 'react-native';

//icons 
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { FlatList } from 'react-native';
import { CheckBox } from 'react-native-elements/dist/checkbox/CheckBox';

//images
import foxHome from '../../assets/images/foxhome.jpg';
import cloths from '../../assets/images/cloths.jpg';
import jewellery from '../../assets/images/Jewellery.jpg';
import kitchen from '../../assets/images/kitchen.jpg';

import LinearGradient from 'react-native-linear-gradient';


const Search = ({ navigation, placeHolder ,isVenderMap}) => {
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [isPaymentFilter, setPaymentFilter] = useState(true);
    const [isSortFilter, setSortFilter] = useState(true);
    const [isCostFilter, setCostFilter] = useState(true);
    const [isShopFilter, setShopFilter] = useState(true);

    const paymentFilter = [{
        id: 1,
        name: "Refill",
        value: false
    },
    {
        id: 2,
        name: "Withdrawal of founds",
        value: true
        ,
    }, {
        id: 3,
        name: "Bonses",
        value: false
    }]

    const sortFilter = [{
        id: 1,
        name: "Date",
        value: true
    }, {
        id: 2,
        name: "Card",
        value: false
    }]

    const purchaseFilter = [{
        id: 1,
        name: "0-100$",
        value: false
    }, {
        id: 2,
        name: "100-150$",
        value: true
    },
    {
        id: 3,
        name: "150$ to more",
        value: false
    }]

    const shopsData = [{
        id: 1,
        image: foxHome,
        name: "Appliances",
        value: false
    }, {
        id: 2,
        image: cloths,
        name: "Cloths",
        value: false
    },
    {
        id: 3,
        image: kitchen,
        name: "Home",
        value: false
    },
    {
        id: 4,
        image: jewellery,
        name: "Jewelry",
        value: false
    }]


    const renderFilter = ({ item }) => {
        return <View key={item.id} style={styles.paymentView}>
            <View style={styles.paymentViewValue}>
                <Text style={styles.paymentName}>{item.name}</Text>
            </View>
            <View style={styles.paymentViewcheck}>
                <CheckBox
                    center
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checked={item.value}
                    checkedColor="#1AABE3"
                    size={18}
                />
            </View>
        </View>;
    };


    const renderShopFilter = ({ item }) => {
        return <TouchableOpacity>
            <View style={styles.shopsBlock}>
                <ImageBackground source={item.image} style={styles.shopsBlockImage} />
                <Text style={styles.shopsBlockTitle}>{item.name}</Text>
                <View style={styles.shopsBlockrate}>
                    <AntDesign name="star" size={18} color='#ebc024' style={styles.listCardIcon} />
                    <Text style={styles.shopsBlockRates}>4.6</Text>
                </View>

            </View>
        </TouchableOpacity>
    }

    return (
        <SafeAreaView>
            <View style={styles.mainheaderFilter}>
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
                        placeholder={placeHolder === "Category" ? "Search for category / product" : "Search"}
                        style={styles.searchContainerInput}
                    />
                </View>
                <View style={styles.mainheaderFilterBtns}>
                    <View style={styles.mapButton} onPress={() => {
                        console.log("isVenderMap",isVenderMap)
                        if(!isVenderMap){
                            navigation?.navigate('Map')
                        }
                        else navigation?.navigate('VendorMap')
                    }}>
                        <Ionicons name="location-sharp" size={25} color="#666" onPress={() => {
                          if(!isVenderMap){
                            navigation?.navigate('Map')
                        }
                        else navigation?.navigate('VendorMap')
                        }} />
                    </View>
                    <View style={styles.filterButton}>
                        <Entypo name="sound-mix" size={22} color="white" onPress={() => setFilterOpen(true)} />
                    </View>
                </View>

                <Modal
                    animationType='fade'
                    transparent
                    visible={isFilterOpen}
                    onRequestClose={() => { console.log("Modal has been closed.") }}>
                    <ScrollView>
                        <View style={styles.filterModal}>
                            <View style={styles.filtermenuHead}>
                                <Text style={styles.filterName}>Filters</Text>
                                <View style={styles.filtermenuHeadBtn}>
                                    <Text style={styles.clear}>Clear</Text>
                                    <AntDesign name="close" color="black" size={22} onPress={() => {
                                        setFilterOpen(false);
                                    }} />
                                </View>
                            </View>
                            <View >
                                <View style={styles.filterblockHead}>
                                    <Text style={styles.filterblockHeadTitle}>Payment</Text>
                                    <AntDesign name="down" size={22} color="#888" onPress={() => {
                                        if (isPaymentFilter) setPaymentFilter(false)
                                        else setPaymentFilter(true)
                                    }} />
                                </View>
                                {isPaymentFilter ? <View>
                                    <FlatList
                                        data={paymentFilter}
                                        renderItem={renderFilter}
                                        keyExtractor={item => item.id}
                                    />
                                </View> : <View></View>}

                            </View>

                            <View>
                                <View style={styles.filterblockHead}>
                                    <Text style={styles.filterblockHeadTitle}>Sort</Text>
                                    <AntDesign name="down" size={22} color="#888"
                                        onPress={() => {
                                            if (isSortFilter) setSortFilter(false)
                                            else setSortFilter(true)
                                        }}
                                    />
                                </View>
                                {isSortFilter ? <View>
                                    <FlatList
                                        data={sortFilter}
                                        renderItem={renderFilter}
                                        keyExtractor={item => item.id}
                                    />
                                </View> : <View></View>}

                            </View>

                            <View >
                                <View style={styles.filterblockHead}>
                                    <Text style={styles.filterblockHeadTitle}>Purchase Cost</Text>
                                    <AntDesign name="down" size={22} color="#888" onPress={() => {
                                        if (isCostFilter) setCostFilter(false)
                                        else setCostFilter(true)
                                    }} />
                                </View>
                                {isCostFilter ? <View>
                                    <FlatList
                                        data={purchaseFilter}
                                        renderItem={renderFilter}
                                        keyExtractor={item => item.id}
                                    />
                                </View> : <View></View>}
                            </View>

                            <View>
                                <View style={styles.filterblockHead}>
                                    <Text style={styles.filterblockHeadTitle}>Shops</Text>
                                    <AntDesign name="down" size={22} color="#888"
                                        onPress={() => {
                                            if (isShopFilter) setShopFilter(false)
                                            else setShopFilter(true)
                                        }} />
                                </View>

                                {isShopFilter ? <View>
                                    <FlatList
                                        showsHorizontalScrollIndicator={false}
                                        data={shopsData}
                                        renderItem={renderShopFilter}
                                        keyExtractor={item => item.id}
                                        horizontal
                                    />
                                </View> : <View></View>}

                            </View>

                            <View onTouchStart={() => {
                                navigation.navigate('FilterList')
                                setFilterOpen(false)
                            }}>
                                <TouchableOpacity style={styles.BtnBlock}>
                                    <LinearGradient
                                        colors={['#00DBFD', '#049DE8']}
                                        style={styles.Btn}>
                                        <Text style={styles.BtnText}>Apply </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
            </View>
        </SafeAreaView>
    )
}

export default Search
const styles = StyleSheet.create({

    mainheaderFilter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 30,
    },
    searchContainer: {
        position: 'relative',
        flex: 1,
    },
    mainheaderFilterBtns: {
        flexDirection: 'row',
    },
    searchContainerBtn: {
        position: 'absolute',
        top: 12,
        left: 10,
    },
    searchContainerInput: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#eee',
        height: 40,
        padding: 10,
        lineHeight: 40,
        fontSize: 14,
        borderRadius: 5,
        paddingLeft: 40,
    },
    mapButton: {
        height: 40,
        width: 40,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: '#fff',
        marginLeft: 12,
    },
    filterButton: {
        height: 40,
        width: 40,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: '#1AABE3',
        marginLeft: 12,
        color: '#fff',
    },
    filterModal: {
        width: '80%',
        height: '100%',
        backgroundColor: "white",
        alignSelf: 'flex-start',
        elevation: 8,
        flex: 1,
        padding: 15,
    },
    filtermenuHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderStyle: 'solid',
        paddingVertical: 15
    },
    filtermenuHeadBtn: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    filterName: {
        fontWeight: 'bold',
        color: "black",
        fontSize: 22,
        lineHeight: 28
    },
    clear: {
        textAlign: 'right',
        fontSize: 17,
        lineHeight: 24,
        color: "#888",
        marginRight: 8
    },
    filterblockHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 30,
        marginBottom: 10
    },
    filterblockHeadTitle: {
        color: "black",
        fontSize: 20,
        lineHeight: 28
    },
    paymentView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#eee',
        borderStyle: 'solid',
        borderBottomWidth: 1
    },
    paymentName: {
        fontSize: 17,
        lineHeight: 18,
        color: "#888",
    },
    paymentViewcheck: {
        marginRight: -15
    },
    shopsBlock: {
        width: 67,
        marginRight: 12
    },
    shopsBlockImage: {
        height: 67,
        width: 67,
        borderRadius: 500,
        overflow: 'hidden',
        marginBottom: 8,
        textAlign: 'center'
    },
    shopsBlockTitle: {
        fontSize: 12,
        lineHeight: 18,
        color: "#000",
        marginBottom: 5,
        textAlign: 'center'
    },
    shopsBlockRates: {
        fontSize: 12,
        lineHeight: 18,
        color: "#888",
        textAlign: 'center'
    },
    BtnBlock: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    Btn: {
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 12,
        width: 260,
        marginHorizontal: 'auto'
    },
    BtnText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center'
    },
    shopsBlockrate: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
})