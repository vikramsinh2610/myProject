import React from "react";
import { FlatList, Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

//icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

//images
import profile from '../../assets/images/profile.jpg';

const Setting = () => {

    const settingData = [{
        image: "",
        title: "Your Account",
        subTitle: "Account settings change number",
        icon:<Feather name="user" size={24} color="#fff"></Feather>
    },
    {
        image: "",
        title: "Referral Program / Bonuses",
        subTitle: "Referral Program / Bonuses",
        icon:<Ionicons name="chatbubble-outline" size={24} color="#fff"></Ionicons>
        
    },
    {
        image: "",
        title: "Chatting",
        subTitle: "Theme , wallpaper , chat history",
        icon:<Ionicons name="chatbubble-outline" size={24} color="#fff"></Ionicons>
    },
    {
        image: "",
        title: "Payments",
        subTitle: "Payments",
        icon:<View></View>,
    },
    {
        image: "",
        title: "Documents",
        subTitle: "Documents",
        icon:<View></View>,
    }
    ]

    /**
     * Render setting items
     * @param {*} param0 
     */
    const renderSettingData = ({ item }) => {
        return <View key={item.id} style={styles.settingDataList}>
            <View style={styles.settingDataHeading}>
                <View style={styles.settingDataListIcon}>
                    {item?.icon}
                </View>
                <View>
                    <Text style={styles.settingDataListTitle}>{item.title}</Text>
                    <Text style={styles.settingDataListSubTitles}>{item.subTitle}</Text>
                </View>
            </View>
            <AntDesign name="right" size={20} color="#888"/>
        </View>
    }
    return (
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View>
                <View style={styles.smallHeader}>
                    <View style={styles.smallHeaderTitle}>
                        <Ionicons name="settings-sharp" size={26} color="#222" />
                        <Text style={styles.smallHeaderName}>Settings</Text>
                    </View>
                    <View style={styles.smallHeaderBtns}>
                        <Ionicons name="menu" size={30} color="#222" />
                    </View>
                </View>

                <View style={styles.containerBlock}>
                    <View style={styles.settingInfo}>
                        <Image style={styles.userLogo} source={profile} />
                        <View style={styles.UserInfoBlock}>
                            <Text style={styles.userName}>Miki Ito</Text>
                            <Text style={styles.userTitle}>Digital Product</Text>
                            <Text style={styles.userDescription}>Freelance designer specaialzed in UI and interaction design</Text>
                            <TouchableOpacity>
                                <Text style={styles.editsBtn}>Edit Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View>
                        <FlatList
                            data={settingData}
                            renderItem={renderSettingData}
                            keyExtractor={item => item.id}
                        ></FlatList>
                    </View>
                </View>
            </View>
            </ScrollView>
        </SafeAreaView>
    )

}


const styles = StyleSheet.create({
    settingHeader: {
        flexDirection: 'row'
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: "center",
        paddingBottom: 25,
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: "#ddd"
    },
    containerBlock: {
        paddingHorizontal: 20,
    },
    userLogo: {
        height: 130,
        width: 130,
        borderRadius: 10,
        marginRight: 15
    },
    smallHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 28,
        paddingTop: 40,
        paddingHorizontal: 22
    },
    smallHeaderTitle: {
        flexDirection: "row",
        alignItems: "center",
    },
    smallHeaderName: {
        fontSize: 20,
        lineHeight: 28,
        color: "#000",
        marginLeft: 15,
        borderRadius:80
    },
    smallHeaderBtns: {
        flexDirection: "row",
        alignItems: "center",
    },
    userName: {
        fontSize: 25,
        lineHeight: 32,
        color: '#000',
        marginBottom: 3
    },
    userTitle: {
        fontSize: 16,
        color: '#888',
        marginBottom: 5
    },
    userDescription: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5
    },
    editsBtn: {
        backgroundColor: '#ddd',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 5,
        fontSize: 15,
        color: "#000",
        lineHeight: 20,
    },
    UserInfoBlock: {
        flexDirection: "column",
        alignItems: "flex-start",
        width: '55%'
    },
    settingDataList: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 22
    },
    settingDataHeading: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10
    },
    settingDataListIcon: {
        height: 50,
        width: 50,
        borderRadius: 8,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1AABE3",
        marginRight: 10
    },
    settingDataListTitle: {
        fontSize: 16,
        color: '#000',
        marginBottom: 5,
        fontWeight: "600"
    },
    settingDataListSubTitles: {
        fontSize: 14,
        color: '#555',
    }
})
export default Setting