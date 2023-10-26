import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Header() {
  return (
    <View style={styles.mainHeader}>
      <View style={styles.topHeader}>
        <View style={styles.mainheaderBtn}>
          <Entypo name="menu" size={25} style={styles.topHeaderIcon} />
        </View>
        <Text stye={styles.topHeaderTitle}>Home</Text> 
        <View style={styles.mainheaderBtn}>
          <AntDesign name="shoppingcart" size={25} style={styles.topHeaderIcon} />
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 600,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 400,
  },
  highlight: {
    fontWeight: 700,
  },
  mainHeader: {
    paddingtop: 30,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  topHeader: {
    "marginTop": 10,
    flexDirection: 'row',
    "alignItems": 'center',
    "justifyContent": 'space-between',
    // "padding": 15,
    // "flex": 100,
    // "backgroundColor": 'black',
  },
  mainheaderBtn: {
    height: 35,
    width: 35,
    borderRadius: 10,
    // boxShadow: "0px 0px 19px 0px rgba(0,0,0,0.03)",
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
    fontWeight: 900,
    margin: 0,
    color: 'black',
  },
});
