import React from "react";
import { StyleSheet, Text, View } from "react-native";
//icons
import AntDesign from 'react-native-vector-icons/AntDesign';

const HeaderWithBack = ({ navigation, route }) => {
    const { horseDetails } = route?.params;

    return (
        <View>
            <View style={styles.topHeader}>
                <View style={styles.mainheaderBtn} >
                    <AntDesign name="left" size={25} style={styles.topHeaderIcon} onPress={() => navigation?.navigate("Company")} />
                </View>
                <Text stye={styles.topHeaderTitle}>{horseDetails?.name}</Text>
                <View style={styles.mainheaderBtn}>
                    <AntDesign name="hearto" size={25} style={styles.topHeaderIcon} />
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
        fontWeight: "900",
        margin: 0,
        color: '#000000',
    },
})
