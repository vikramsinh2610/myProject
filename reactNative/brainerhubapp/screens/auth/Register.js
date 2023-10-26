import React, { useState } from "react";
import { StyleSheet, Text, View, Picker } from "react-native";
import { Checkbox } from 'react-native-paper';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { TextInput } from 'react-native-paper';
import { CheckBox } from 'react-native-elements'
import DropDown from "react-native-paper-dropdown";

const Register = ({ navigation }) => {
    const [isRemember, setRemember] = useState(false);
    const [selectedValue, setSelectedValue] = useState("India");
    const [showDropDown, setShowDropDown] = useState(false);
    const [country, setCounty] = useState();

    const countryList = [
        { label: 'India', value: 'india' },
        { label: 'Australia', value: 'australia' },
        { label: 'Brazil', value: 'brazil' },

    ];
    return (
        <ScrollView style={{ backgroundColor: '#fff' }}>
            <View style={styles.loginTemplate}>
                <View style={styles.loginHeading}>
                    <Text style={styles.loginTitle}>Register</Text>
                    <Text style={styles.loginText}>Let's Sign up first for enter into Square Website, Uh She up ! </Text>
                </View>

                <View style={{ marginBottom: 20, flexDirection: 'row', marginVertical: 40 }}>
                    <View style={styles.inputWrap}>
                        <TextInput
                            mode='outlined'
                            label="First Name"
                            theme={styles.input}
                            style={styles.inputBox}
                        />
                    </View>
                    <View style={styles.inputWrap}>
                        <TextInput
                            passwordRules="true"
                            mode='outlined'
                            label="Last Name"
                            theme={styles.input}
                            style={styles.inputBox}
                        />
                    </View>
                </View>

                <View style={{ marginBottom: 20, flexDirection: 'row' }}>
                    <View style={styles.inputWrap}>
                        <TextInput
                            passwordRules="true"
                            mode='outlined'
                            label="+62"
                            theme={styles.input}
                            style={styles.inputBox}
                        />
                    </View>
                    <View style={styles.inputWrap}>
                        <TextInput
                            mode='outlined'
                            label="Phone Number"
                            theme={styles.input}
                            style={styles.inputBox}
                        />
                    </View>
                    <View style={styles.inputWrap}>
                        <DropDown
                            theme={styles.input}
                            label={'Country'}
                            mode={'outlined'}
                            value={country}
                            setValue={setCounty}
                            list={countryList}
                            visible={showDropDown}
                            showDropDown={() => setShowDropDown(true)}
                            onDismiss={() => setShowDropDown(false)}
                            inputProps={{
                                right: <TextInput.Icon name={'menu-down'} />,
                            }}
                        />
                    </View>
                </View>


                <View style={{ marginBottom: 20 }}>
                    <View style={styles.inputWrap}>
                        <TextInput
                            mode='outlined'
                            label="Mail Address  @squareteam.com"
                            style={styles.inputBox}
                            theme={styles.input}
                        />
                    </View>
                </View>


                <View style={{ marginBottom: 20, flexDirection: 'row' }}>
                    <View style={styles.inputWrap}>
                        <TextInput
                            mode='outlined'
                            label="Password"
                            theme={styles.input}
                            style={styles.inputBox}
                        />
                    </View>
                    <View style={styles.inputWrap}>
                        <TextInput
                            mode='outlined'
                            label="Confirm Password"
                            theme={styles.input}
                            style={styles.inputBox}
                        />
                    </View>
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={styles.inputWraplabel}>Tell us about yourself</Text>
                    <View style={styles.inputWrap}>
                        <TextInput
                            mode='outlined'
                            label="Hell my name..."
                            theme={styles.input}
                            style={styles.inputBox}
                        />
                    </View>
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
                        <Text style={styles.bottomcheckLabel}>I agree to Square's <Text style={{ color: '#1AABE3' }}>Cookie</Text> and <Text style={{ color: '#1AABE3' }}>Privacy Policy</Text></Text>
                    </View>
                </View>

                <View style={styles.btnBlock}>
                    <TouchableOpacity style={styles.grayBtn} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.grayBtnText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.loginBtn}>
                        <Text style={styles.loginBtnText}>Get Started</Text>
                    </TouchableOpacity>
                </View>


            </View>
        </ScrollView>
    )
}

export default Register

const styles = StyleSheet.create({
    loginTemplate: {
        textAlign: 'center',
        paddingHorizontal: 20,
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
    grayBtn: {
        paddingVertical: 12,
        backgroundColor: "#eee",
        borderRadius: 25,
        textAlign: 'center',
        width: 120,
        marginRight: 10
    },
    grayBtnText: {
        fontSize: 20,
        lineHeight: 26,
        color: '#000',
        textAlign: 'center',
        fontWeight: 'bold',
        
    },
    loginBtn: {
        paddingVertical: 12,
        backgroundColor: "#1AABE3",
        borderRadius: 25,
        textAlign: 'center',
        width: 180,
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
    },
    input: {
        colors: { primary: '#1AABE3' },
        borderColor: 'gray',
        roundness: 50

    },
    bottomcheckLabel: {
        fontSize: 17,
        lineHeight: 24,
        color: '#666',
        textAlign: 'left',
        flex: 1,
        marginTop: 5
    },
    forgotbtn: {
        fontSize: 17,
        lineHeight: 24,
        color: '#1AABE3',
        textAlign: 'center'
    },
    bottomText: {
        fontSize: 17,
        lineHeight: 24,
        color: '#666',
        textAlign: 'center',
        marginTop: 25
    },
    firstName: {
        borderRadius: 500,
        backgroundColor: '#fff',
    },
    inputWrap: {
        flex: 1,
        marginHorizontal: 5
    },
    inputWraplabel: {
        fontWeight: 'bold'
    },
    btnBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
})