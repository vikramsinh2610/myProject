import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import CalendarPicker from 'react-native-calendar-picker';
import DropDown from "react-native-paper-dropdown";
import { TextInput } from 'react-native-paper';

//icons
import AntDesign from 'react-native-vector-icons/AntDesign';


const Calendar = ({ navigation }) => {
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [showDropDown, setShowDropDown] = useState(false);
    const [ranges, setRanges] = useState();
    const [dateSelect, setDateSelect] = useState(false);

    const onDateChange = (date, type) => {
        setDateSelect(true)
        //function to handle the date change
        if (type === 'END_DATE') {
            setSelectedEndDate(date);
        } else {
            setSelectedEndDate(null);
            setSelectedStartDate(date);
        }
    };
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const range = [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
        { label: '7', value: '7' },
        { label: '8', value: '8' }, 
        { label: '9', value: '9' }
    ];
    return (
        <ScrollView style={{ backgroundColor: "#fff" }}>
            <View style={{ backgroundColor: "#fff" }}>
                <View style={styles.topHeader}>
                    <View style={styles.mainheaderBtn} >
                        <AntDesign name="left" size={25} style={styles.topHeaderIcon} onPress={() => setDateSelect(false)} />
                    </View>
                    <Text stye={styles.topHeaderTitle}>אנא בחר את זמן ההזמנה</Text>
                    <View style={styles.mainheaderBtn}>
                        <AntDesign name="hearto" size={25} style={styles.topHeaderIcon} />
                    </View>
                    
                </View>
                <View style={styles.containerBlock}>
                <Text style={{color:"#00C4F8",fontSize:20,fontWeight:'bold',textAlign:'center',marginBottom:20}}>18.11.2021</Text>
                    {!dateSelect ?
                        <View>
                            <View style={styles.calenderBlock}>
                                <CalendarPicker
                                    startFromMonday={true}
                                    allowRangeSelection={false}
                                    minDate={new Date(2018, 1, 1)}
                                    maxDate={new Date(2050, 6, 3)}
                                    dayShape="square"
                                    weekdays={
                                        [
                                            'Mon',
                                            'Tue',
                                            'Wed',
                                            'Thur',
                                            'Fri',
                                            'Sat',
                                            'Sun'
                                        ]}
                                    months={[
                                        'January',
                                        'Febraury',
                                        'March',
                                        'April',
                                        'May',
                                        'June',
                                        'July',
                                        'August',
                                        'September',
                                        'October',
                                        'November',
                                        'December',
                                    ]}
                                    previousTitle="Previous"
                                    nextTitle="Next"
                                    todayBackgroundColor="#E6FFE6"
                                    selectedDayColor="#00F89D"
                                    selectedDayTextColor="#000000"
                                    scaleFactor={375}
                                    dayShape='square'
                                    textStyle={{
                                        fontFamily: 'Cochin',
                                        color: '#000000',
                                    }}
                                    onDateChange={onDateChange}
                                    style={{ padding: 15 }}
                                />

                            </View>
                        </View> :
                        <View>
                            <View style={styles.SelectBlock}>
                                <View style={styles.SelectDropBox}>
                                    <Text style={styles.SelectDropBoxTitle}>מלא</Text>
                                    <DropDown
                                        mode={'outlined'}
                                        value={ranges}
                                        setValue={setRanges}
                                        list={range}
                                        visible={showDropDown}
                                        showDropDown={() => setShowDropDown(true)}
                                        onDismiss={() => setShowDropDown(false)}
                                        inputProps={{
                                            right: <TextInput.Icon name={'menu-down'} />,
                                        }}
                                    />
                                </View>
                                <View style={styles.SelectDropList}>
                                    <Text style={styles.SelectDropListItem}>10.00 - 10:50</Text>
                                    <Text style={styles.SelectDropListItem}>12.30 - 13:20</Text>
                                    <Text style={styles.SelectDropListItem}>13:45 - 14:35</Text>
                                    <Text style={styles.SelectDropListItem}>15.00 - 15:50</Text>
                                </View>
                            </View>
                        </View>

                    }
                    <View style={styles.contentBlock}>
                        <Text style={styles.contentBlockTitle}>טיול רכיבה על סוסים</Text>
                        <Text style={styles.contentBlockText}>  טיולי תומקאר 4 מקומות
                            מחיר לפני הנחה: ₪360
                            מחיר לאחר 11% הנחה: ₪320
                        </Text>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cartBtn} onPress={()=>navigation.navigate('HorseCart1')}>
                            <Text style={styles.btnTitle}>הוסף לסל</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.makeBtn}>
                            <Text style={styles.btnTitle}>שלם כעת</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </ScrollView>
    )
}

export default Calendar;

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
    totalText: {
        marginBottom: 20
    },
    totalTitle: {
        fontSize: 19,
        color: '#000',
        fontWeight: '800',
        lineHeight: 23
    },
    productBlock: {
        padding: 0,
        borderRadius: 8,
        marginBottom: 25,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f1f1f1',
        borderStyle: 'solid',
        shadowColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
    },
    productIconInfo: {
        position: 'absolute',
        top: 10,
        left: 10,
        flexDirection: 'row'
    },
    productSubHead: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 22
    },
    productSubHeadTime: {
        fontSize: 14,
        color: '#000',
        lineHeight: 22,
        marginLeft: 8
    },
    bioBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 22
    },
    bioBlockTitle: {
        fontSize: 17,
        lineHeight: 26,
        color: '#555'
    },
    contentModule: {
        marginBottom: 25
    },
    contentModuleTitle: {
        color: '#000',
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 5
    },
    contentModuleText: {
        color: '#555',
        fontSize: 15,
        lineHeight: 24
    },
    productBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productName: {
        fontSize: 17,
        lineHeight: 24,
        color: '#555',
        fontWeight: '600',
        marginBottom: 5,
    },
    productremoveBtn: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        position: 'relative',
    },
    moduleIcon: {
        height: 45,
        width: 45,
        backgroundColor: '#1AABE3',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
    },
    productVarius: {
        fontSize: 17,
        lineHeight: 24,
        color: '#888',
        fontWeight: '600',
        marginBottom: 5,
    },
    productPrice: {
        fontSize: 24,
        lineHeight: 32,
        color: '#1AABE3',
        fontWeight: '600',
    },
    productLogo: {
        width: 450,
        height: 450,
        marginRight: 12,
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
    contentBlock: {
        paddingHorizontal: 20,
        marginBottom: 32,
      
    },
    listCard: {
        flexDirection: "row",
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        borderStyle: "solid",
        borderRadius: 15,
        marginBottom: 8
    },
    listCardIcon: {
        marginRight: 15,
    },
    listCardTitle: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 22,
        color: "#000",
        marginRight: 20
    },
    listCardSubtitle: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 22,
        color: "#1AABE3",
        marginRight: 15
    },
    ProductRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    darkblueBtn: {
        borderRadius: 12,
        backgroundColor: '#00374d',
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: 110,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15
    },
    darkblueBtnTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff'
    },
    companyLogo: {
        height: 40,
        width: 40,
        borderRadius: 50,
        marginLeft: 15
    },
    rideTime: {
        color: 'black',
        // float: 'right',
        fontSize: 20,
        lineHeight: 28
    },
    favBtn: {
        height: 45,
        // width: 90,
        width: 158,
        flex: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        textAlign: 'center',
        marginHorizontal: 8,
        backgroundColor: '#FF8800',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    timeBtn: {
        height: 45,
        // width: 90,
        width: 158,
        flex: 1,
        borderRadius: 10,
        marginHorizontal: 8,
        paddingHorizontal: 12,
        textAlign: 'center',
        paddingVertical: 12,
        backgroundColor: '#00F89D',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    cartBtn: {
        height: 45,
        // width: 90,
        width: 158,
        flex: 1,
        borderRadius: 10,
        marginHorizontal: 8,
        paddingHorizontal: 12,
        textAlign: 'center',
        paddingVertical: 12,
        backgroundColor: '#00374D',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    makeBtn: {
        height: 45,
        // width: 90,
        width: 158,
        flex: 1,
        borderRadius: 10,
        marginHorizontal: 8,
        paddingHorizontal: 12,
        textAlign: 'center',
        paddingVertical: 12,
        backgroundColor: '#00C4F8',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    btnTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        lineHeight: 22
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        // position: 'absolute',
        // bottom: 0,
        // left: 0,
        // right: 0
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
    SelectBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        minHeight: 300
    },
    SelectDropBox: {
        width: 150
    },
    SelectDropBoxTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        lineHeight: 22,
        color: "red",
        marginBottom: 10,
        textAlign: 'left',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderRadius: 5
    },
    SelectDropList: {
        width: 150
    },
    SelectDropListItem: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginBottom: 5
    },
    calenderBlock: {
        // backgroundColor: '#eee',
        // borderRadius: 8,
        // borderStyle: 'solid',
        // borderColor: '#ccc',
        // borderWidth: 1,
        padding: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
})