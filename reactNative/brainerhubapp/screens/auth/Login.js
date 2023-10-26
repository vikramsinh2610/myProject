import React, { useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { Checkbox } from 'react-native-paper';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { TextInput } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//images
import facebook from '../../assets/images/facebook.jpg';
import google from '../../assets/images/google.png';

const Login = () => {
    const [isRemember, setRemember] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isValidForm, setValidForm] = useState(false);

    /**
     * Handle login click
     */
    const handleLoginChange = () => {
        if (email === "" || password === "")
            setValidForm(true)
        else
            setValidForm(false)

    }
    return (
        <ScrollView style={{ backgroundColor: '#fff' }}>
            <View style={styles.loginTemplate}>
                <View style={styles.loginHeading}>
                    <Text style={styles.loginTitle}>Sign In</Text>
                    <Text style={styles.loginText}>Just sign in if you have an acoount in here. Enjoy our Website </Text>
                </View>
                <View style={{ marginBottom: 20 }}>
                    <TextInput
                        mode='outlined'
                        label="Your Email / Username"
                        theme={{ colors: { primary: isValidForm ? "red" : '#1AABE3' }, roundness: 50 }}
                        style={styles.inputBox}
                        value={email}
                        onChangeText={text => setEmail(text)}
                    />
                </View>

                <View style={{ marginBottom: 20 }}>
                    <TextInput
                        passwordRules="true"
                        mode='outlined'
                        label="Password"
                        theme={{ colors: { primary: isValidForm ? "red" : '#1AABE3' }, roundness: 50 }}
                        style={styles.inputBox}
                        value={password}
                        onChangeText={text => setPassword(text)}
                    />
                </View>

                <View style={styles.bottomBlock}>
                    <View style={styles.bottomcheckBlock}>
                        <Checkbox
                            color="#1AABE3"
                            status={isRemember ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setRemember(!isRemember);
                            }}
                        />
                        <Text style={styles.bottomcheckLabel}>Remember</Text>
                    </View>
                    <Text style={styles.forgotbtn}>Forgot Password</Text>
                </View>

                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.loginBtn} onPress={() => handleLoginChange()}>
                        <Text style={styles.loginBtnText}>Login</Text>
                    </TouchableOpacity>

                    <View style={styles.socialBtns}>
                        <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#395694' }]} >
                            <FontAwesome name="facebook" size={22} color='#fff' />
                            <Text style={styles.socialBtnText}>facebook</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#e94235' }]} >
                            <FontAwesome name="google-plus" size={22} color='#fff' />
                            <Text style={styles.socialBtnText}>Google</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.bottomText}>
                        Already have an Square account? <Text style={{ textDecorationLine: 'underline' }} >Log in</Text>
                    </Text>
                </View>


            </View>
        </ScrollView>
    )
}

export default Login

const styles = StyleSheet.create({
    loginTemplate: {
        textAlign: 'center',
        paddingHorizontal: 30,
        paddingVertical: 50
    },
    loginHeading: {
        marginBottom: 25
    },
    loginTitle: {
        fontSize: 22,
        lineHeight: 30,
        color: '#000',
        marginBottom: 8,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    loginText: {
        fontSize: 17,
        lineHeight: 24,
        color: '#666',
        textAlign: 'center'
    },
    inputBox: {
        borderRadius: 500, backgroundColor: '#fff'
    },
    loginBtn: {
        paddingVertical: 12,
        backgroundColor: "#1AABE3",
        borderRadius: 25,
        textAlign: 'center',
        width: 300,
    },
    loginBtnText: {
        fontSize: 20,
        lineHeight: 26,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    bottomBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 55
    },
    bottomcheckBlock: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomcheckLabel: {
        fontSize: 17,
        lineHeight: 24,
        color: '#666',
        textAlign: 'center'
    },
    forgotbtn: {
        fontSize: 17,
        lineHeight: 24,
        color: '#1AABE3',
        textAlign: 'center'
    },
    bottomText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#666',
        textAlign: 'center',
        marginTop: 25
    },
    socialBtns: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    socialBtn: {
        overflow: 'hidden',
        marginHorizontal: 5,
        textAlign: 'cenetr',
        width: 135,
        backgroundColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 200,
        height: 50
    },
    socialBtnText: {
        fontSize: 17,
        lineHeight: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8
    }
})