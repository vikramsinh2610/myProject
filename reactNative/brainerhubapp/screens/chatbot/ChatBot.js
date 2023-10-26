
import React from 'react';
import { View, Text, StyleSheet, Modal, Button, Picker, ImageBackground } from 'react-native';

//icons 
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

//images
import user from '../../assets/images/user.png';

const ChatBot = () => {
    return (
        <View>
            <View style={styles.chatHead}>
                <View style={styles.chatHeadUser}>
                    <Ionicons name="arrow-back" size={25} color="#666" />
                    <ImageBackground
                        source={user}
                        resizeMode="cover"
                        style={styles.chatHeadUserImg}></ImageBackground>
                    <Text style={styles.chatHeadUserName}>Jhonny Rose</Text>

                </View>
                <View style={styles.chatHeadIcons}>
                    <Ionicons name="ellipsis-vertical" size={25} color="#666" />
                </View>
            </View>

            <View>
                <Text style={styles.chatDate}>17 Jan 2021</Text>
            </View>

            <View>
                <ImageBackground
                    source={user}
                    resizeMode="cover"
                    style={styles.chatHeadUserImg}></ImageBackground>
                <Text style={styles.chatHeadUserName}>Now</Text>
                <Text style={styles.chatMessage}>Hey hou are you today ? Check out the new deals !!</Text>
            </View>

            {/* <Picker
            style={{ height: 50, width: 150 }}
            >
                <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" />
            </Picker> */}

        </View>
    )
}

export default ChatBot

const styles = StyleSheet.create({
    chatHead: {
        paddingVertical: 15,
        paddingBottom: 32,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#D5F6FF"
    },
    chatHeadUser: {
        flexDirection: "row",
        alignItems: "center"
    },
    chatHeadUserImg: {
        height: 32,
        width: 32,
        marginRight: 15,
        resizeMode: 'cover',
        borderRadius: 1000,
        overflow: "hidden"
    },
    chatHeadUserName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#555"
    },
    chatHeadIcons: {
        flexDirection: "row",
        alignItems: "center"
    },
    chatDate: {
        margin: 20,
        textAlign: 'center'
    },
    chatMessage: {
        height: 50,
        width: 300,
        backgroundColor: '#D5F6FF',
    }
})