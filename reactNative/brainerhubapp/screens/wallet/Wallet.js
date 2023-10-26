import React, { useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, SafeAreaView, FlatList, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { View } from "react-native";
import Header from "../header/Header";

//Images
import paymentPurchse from '../../assets/images/paymentpurchse.jpg';
import cardPayment from '../../assets/images/cardpayment.png';
import loadMoney from '../../assets/images/loadmoney.jpg';
import shopPayment from '../../assets/images/shoppayment.jpg';


const Wallet = ({ navigation }) => {
    const [isMoneyTransfer, setMoneyTransfer] = useState(false);
    const [fromData, setFormData] = useState({
        amount: "",
        user: "",
        purpose: ""
    })
    // const [name, setName] = useState("");
    // const [address, setAddress] = useState("");
    // const [contact, setContact] = useState("");
    const walletValue = [
        {
            name: "Payment for purchase",
            image: paymentPurchse,
            value: 'paymentpuchase'
        },
        {
            name: "Load money",
            image: loadMoney,
            value: 'loadmoney'

        },
        {
            name: "Credit card order",
            image: cardPayment,
            value: 'cardpayment'

        },
        {
            name: "Shops ",
            image: shopPayment,
            value: 'shops'

        }
    ];

    /**
     * Render wallet item
     * @param {*} param0 
     * @returns 
     */
    const renderWalletItem = ({ item }) => {

        return <TouchableOpacity style={styles.shippingIcons} onPress={() => handleWalletClick(item)}>
            <View style={styles.shippingIconsInner}>
                <Image
                    source={item.image}
                    style={styles.shippingIconsImg} />
                <View style={styles.shippingIconsTitle}>
                    <Text style={styles.shippingIconsText}>{item.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    };

    /**
     * Handle wallet click
     * @param {*} item 
     */
    const handleWalletClick = (item) => {
        if (item.value === 'paymentpuchase') {
            navigation.navigate('Purchase')
        }
        if (item.value === "loadmoney") {
            navigation.navigate('LoadMoney')
        }
        if (item.value === "cardpayment") {
            navigation.navigate('CreditCard')
        }
        if (item.value === "shops") {
            navigation.navigate('VendorList', { isWallet: true })
        }
    }

    const handleFormChange = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))

    }

    return (<ScrollView style={{ backgroundColor: "#fff" }}>
        <View>
            <View style={{ backgroundColor: '#fff' }}>
                <Header wallet={false} navigation={navigation} />
                <View style={styles.container}>
                    <SafeAreaView>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            data={walletValue}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            numColumns={2}
                            renderItem={renderWalletItem}
                            keyExtractor={item => item.id}
                        />
                    </SafeAreaView>

                    <View style={styles.moneyBtn}>
                        <TouchableOpacity style={styles.blueBtn} onPress={()=>navigation.navigate('PaymentHistory')}>
                            <Text style={styles.blueBtnTitle}>Payment History</Text>
                        </TouchableOpacity>
                    </View>
                  
                    <Text style={styles.moneyBlance}>Money Balance</Text>
                    <Text style={styles.moneyRs}>67.50</Text>
                    <View style={styles.moneyBtn}>
                        <TouchableOpacity style={styles.blueBtn} onPress={() => setMoneyTransfer(true)}>
                            <Text style={styles.blueBtnTitle}>Money Transfer</Text>
                        </TouchableOpacity>
                    </View>

                    {isMoneyTransfer ? <View>
                        <View style={styles.transferForm}>
                            <Text style={styles.formTitle}>Send money</Text>
                            <TextInput
                                style={styles.input}
                                name="amount"
                                onChangeText={(amount) => handleFormChange("amount", amount)}
                                // onChangeText={(amount) => setFormData({"amount":amount})}
                                placeholder="Amount, e-credits"
                                value={fromData.amount}
                            />

                            <TextInput
                                style={styles.input}
                                name="user"
                                onChangeText={(user) => handleFormChange("user", user)}
                                placeholder="User"
                                value={fromData.user}
                            />
                            <TextInput
                                style={styles.input}
                                name="purpose"
                                onChangeText={(purpose) => handleFormChange("purpose", purpose)}
                                placeholder="Transfer purpose"
                                value={fromData.purpose}
                            />

                            <View style={styles.formBtnBlock}>
                                <TouchableOpacity style={styles.formCancelBtn} onPress={() => setMoneyTransfer(false)}>
                                    <Text style={styles.formCancelBtnText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.formSendBtn} onPress={() => {
                                    setMoneyTransfer(false)
                                    // setFormData({ amount: "", user: "", purpose: "" })
                                }}>
                                    <Text style={styles.formSendBtnText}>Send</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View> : <View />}

                </View>
            </View >
        </View >
    </ScrollView >)
}

export default Wallet;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginBottom: 45
    },
    shippingIcons: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'solid',
        borderRadius: 1000,
        height: 150,
        width: 150,
        shadowOffset: { width: 50, height: 50 },
        shadowColor: '#000',
        shadowOpacity: 0.9,
        marginBottom: 22,
    },
    shippingIconsInner: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 25
    },
    shippingIconsImg: {
        width: 55,
        height: 55
    },
    shippingIconsTitle: {
        marginTop: 10,
        textAlign: 'center'
    },
    shippingIconsText: {
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '600',
        color: '#333',
        height: 95,
        textAlign: 'center'
    },
    PaymentBtn:{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'    
    },

    moneyBlance: {
        fontSize: 26,
        lineHeight: 32,
        color: '#000',
        fontWeight: '600',
        marginTop: 20,
        textAlign: 'center'
    },
    moneyRs: {
        fontSize: 56,
        lineHeight: 62,
        color: '#1AABE3',
        fontWeight: '700',
        marginTop: 15,
        textAlign: 'center'
    },
    moneyBtn: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    blueBtn: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#1AABE3',
        backgroundColor: '#1AABE3',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginHorizontal: 'auto',
        width: 250
    },

    PaymentblueBtn:{

    },
    paymentBtn:{
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#1AABE3',
        backgroundColor: '#1AABE3',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginHorizontal: 'auto',
        width: 250  
    },
    blueBtnTitle: {
        fontSize: 18,
        color: '#fff',
        lineHeight: 22,
        fontWeight: '700',
        textAlign: 'center',
    },
    transferForm: {
        marginBottom: 25,
        marginTop: 30
    },
    formTitle: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: "700",
        color: '#000',
        marginBottom: 15
    },
    input: {
        fontSize: 16,
        lineHeight: 22,
        borderWidth: 1,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderStyle: 'solid',
        borderColor: "#ddd",
        marginBottom: 15,
        padding: 10,
        paddingHorizontal: 15
    },
    formBtnBlock: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        marginTop: 20
    },

    formCancelBtn: {
        marginHorizontal: "auto",
        justifyContent: "center",
        paddingHorizontal: 25,
        paddingVertical: 12,
        backgroundColor: "#1AABE3",
        borderRadius: 10,
        textAlign: 'center',
        width: 120,
        marginRight: 10,
    },
    formCancelBtnText: {
        fontSize: 16,
        lineHeight: 24,
        color: "#fff",
        textAlign: 'center',
    },
    formSendBtn: {
        marginHorizontal: "auto",
        justifyContent: "center",
        paddingVertical: 12,
        backgroundColor: "#1AABE3",
        borderRadius: 10,
        textAlign: 'center',
        width: 120,
    },
    formSendBtnText: {
        fontSize: 16,
        lineHeight: 24,
        color: "#fff",
        textAlign: 'center',
    }
})