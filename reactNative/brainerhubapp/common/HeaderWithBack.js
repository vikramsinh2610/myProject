import React from "react";
import { StyleSheet, Text, View } from "react-native";

//icon
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

const HeaderWithBack = ({navigation,name,navigateFileName}) => {
    return (
        <View>
            <View style={styles.topHeader}>
                <View style={styles.mainheaderBtn} >
                    <AntDesign name="left" size={25} style={styles.topHeaderIcon} onPress={() => navigation?.navigate(navigateFileName)} />
                </View>
                <Text stye={styles.topHeaderTitle}>{name}</Text>
                <View style={styles.mainheaderBtn}>
                    <AntDesign style={styles.hederRight} name="hearto" size={25} style={styles.topHeaderIcon} />
                </View>
            </View>
        </View>
    )
}

export default HeaderWithBack;


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
        fontWeight: "bold",
        margin: 0,
        color: 'black',
    },
})