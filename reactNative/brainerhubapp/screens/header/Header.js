import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Button, ImageBackground } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import artImage1 from '../../assets/images/art1.jpg';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Header({ navigation, headerName, wallet, isBackIcon,isHorse }) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.mainHeader}>
      <View style={styles.topHeader}>

        <View style={styles.mainheaderBtnLeftBlock}>
          {isBackIcon ? <View style={styles.mainheaderBtn} onTouchStart={() => {
              if(isHorse){
                navigation?.navigate('Company')
              }
              else navigation?.navigate('Wallet')
            }}>
            <AntDesign name="arrowleft" size={28} style={styles.topHeaderIcon} />
          </View> : <View />}
          <View style={styles.mainheaderBtn} >
            <Entypo name="menu" size={28} style={styles.topHeaderIcon} onPress={() => setMenuOpen(true)} />
          </View>
        </View>
        <Text stye={styles.topHeaderTitle}>{headerName}</Text>
        <View style={styles.mainheaderBtnBlock}>
          <View style={styles.mainheaderBtn}>
            <AntDesign name={headerName === "Payment" ? "hearto" : "shoppingcart"} size={28} style={styles.topHeaderIcon} onPress={() => {
              if(isHorse)  navigation?.navigate('HorseCart1')
             else  navigation?.navigate('Cart')}} />
          </View>
          {wallet ? <View style={styles.mainheaderBtn}>
            <Ionicons name="wallet-outline" size={28} style={styles.topHeaderIcon} onPress={() => navigation?.navigate('Wallet')} /></View> :
            <View />}
        </View>


      </View>
      <Modal
        animationType='fade'
        transparent
        visible={isMenuOpen}
        onRequestClose={() => { console.log("Modal has been closed.") }}>
        <ScrollView>
          <View style={styles.modal}>
            <View style={styles.menuHead}>
              <View style={styles.menuHeadUser} onTouchStart={() => {
                setMenuOpen(false)
              }}>
                <ImageBackground
                  source={artImage1}
                  resizeMode="cover"
                  style={styles.menuHeadUserImg}></ImageBackground>
                <Text style={styles.menuHeadUserName}>Jhonny Rose</Text>
              </View>
              <View style={styles.menuHeadIcons}>
                <Ionicons name="ios-notifications-sharp" size={20} style={{ marginRight: 10, }} />
                <AntDesign name="close" color="black" size={28} onPress={() => {
                  setMenuOpen(false);
                }} />
              </View>
            </View>

            <View>
              <View style={styles.menuItem}>
                <AntDesign name="search1" style={styles.menuIcon} size={20} />
                <Text style={styles.menuName}>Search for products</Text>
              </View>

              <View style={styles.menuItem} onTouchStart={() => {
                setMenuOpen(false)
                navigation?.navigate('CategoryList')
              }}>

                <Ionicons name="location-sharp" style={styles.menuIcon} size={20} />
                <Text style={styles.menuName}>Categories</Text>
              </View>

              <View style={styles.menuItem}>
                <FontAwesome5 name="shopping-cart" style={styles.menuIcon} size={20} />
                <Text style={styles.menuName}>MarketPlace</Text>
              </View>

              <View style={styles.menuItem}>
                <FontAwesome name="group" style={styles.menuIcon} size={20} />
                <Text style={styles.menuName}>Group Chats</Text>
              </View>

              <View style={styles.menuItem}>
                <Ionicons name="chatbubbles-sharp" style={styles.menuIcon} size={20} />
                <Text style={styles.menuName}>All Chats</Text>
              </View>

              <View style={styles.menuItem}>
                <MaterialCommunityIcons name="star-circle" style={styles.menuIcon} size={20} />
                <Text style={styles.menuName}>Referral Program</Text>
              </View>

              <View style={styles.menuItem}>
                <Octicons name="mail-read" style={styles.menuIcon} size={20} />
                <Text style={styles.menuName}>Invite Friends</Text>
              </View>

              <View style={styles.menuItem} onTouchStart={() => {
                setMenuOpen(false)
                navigation?.navigate("OrderList")
              }}>
                <Octicons name="mail-read" style={styles.menuIcon} size={20} />
                <Text style={styles.menuName}>Orders</Text>
              </View>

              <View style={styles.menuItem}>
                <MaterialIcons name="shopping-bag" style={styles.menuIcon} size={20} />
                <Text style={styles.menuName}>Cart</Text>
              </View>


              <View style={styles.menuItem} onTouchStart={() => {
                setMenuOpen(false)
                navigation?.navigate("Deals")
              }}>
                <MaterialIcons name="shopping-bag" style={styles.menuIcon} size={20} />
                <Text style={styles.menuName}>Deals</Text>
              </View>
            </View>


            <View style={styles.menuItem} onTouchStart={() => {
              setMenuOpen(false)
              navigation?.navigate("Login")
            }}>

              <AntDesign name="login" style={styles.menuIcon} size={20} />
              <Text style={styles.menuName}>Login</Text>
            </View>

            <View style={styles.menuItem} onTouchStart={() => {
              setMenuOpen(false)
              navigation?.navigate("Register")
            }}>
              <FontAwesome name="registered" style={styles.menuIcon} size={20} />
              <Text style={styles.menuName}>Register</Text>

            </View>

            <View style={styles.menuFooter}>
              <TouchableOpacity
                style={styles.grayBtn}
              >
                <Text style={styles.btnTextGray}>My Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.blueBtn}
              >
                <Text style={styles.btnText}>chat With Our Bot</Text>
              </TouchableOpacity>


              <View style={styles.menuBottomBtn}>
                <View>
                  <TouchableOpacity
                    style={styles.iconsBtn}
                  >
                    <AntDesign name="logout" style={styles.iconsBtnImg} size={20} />
                    <Text style={styles.iconsBtnText}>Logout</Text>
                  </TouchableOpacity>
                </View>

                <View onTouchStart={() => {
                  setMenuOpen(false)
                  navigation?.navigate('Setting')
                }}>
                  <TouchableOpacity
                    style={styles.iconsBtn}
                  >
                    <Ionicons name="settings-sharp" style={styles.iconsBtnImg} size={20} />
                    <Text style={styles.iconsBtnText}>Settings</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>
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
    position: 'relative',
    zIndex: 99
  },
  topHeader: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainheaderBtnLeftBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainheaderBtnBlock: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainheaderBtn: {
    height: 35,
    width: 35,
    borderRadius: 10,
    marginLeft: 8
  },
  topHeaderIcon: {
    color: "#000"
  },
  topHeaderTitle: {
    fontSize: 20,
    lineHeight: 20,
    fontWeight: "900",
    margin: 0,
    color: '#000000',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  modal: {
    width: '80%',
    height: '100%',
    backgroundColor: "white",
    alignSelf: 'flex-start',
    elevation: 8,
    flex: 1,
    padding: 15,
  },
  text: {
    color: '#3f2949',
    marginTop: 10
  },
  menuHead: {
    paddingVertical: 15,
    paddingBottom: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  menuHeadUser: {
    flexDirection: "row",
    alignItems: "center"
  },
  menuHeadUserImg: {
    height: 32,
    width: 32,
    marginRight: 15,
    resizeMode: 'cover',
    borderRadius: 1000,
    overflow: "hidden"
  },
  menuHeadUserName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#555"
  },
  menuHeadIcons: {
    flexDirection: "row",
    alignItems: "center"
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15
  },
  menuIcon: {
    marginRight: 12,
    width: 25,
    color: "#555"
  },
  menuName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555"
  },
  menuFooter: {
    paddingHorizontal: 5,
    marginTop: 50,
  },
  menuBottomBtn: {
    paddingHorizontal: 5,
    paddingTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  grayBtn: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 18,
    lineHeight: 24,
    color: "#555",
    backgroundColor: "#eee",
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  blueBtn: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 18,
    lineHeight: 24,
    color: "#fff",
    marginTop: 12,
    backgroundColor: "#1AABE3",
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
  },
  iconsBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconsBtnImg: {
    marginRight: 10,
    color: "#555"
  },
  iconsBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    textAlign: "center"
  },
  btnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    textTransform: "capitalize"
  },
  btnTextGray: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
    textTransform: "capitalize"
  }
});
