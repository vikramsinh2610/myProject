import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
//dependencies
import {Card} from 'react-native-elements';

//icon
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//images
import user from '../../assets/images/user.png';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

const UserProfile = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{backgroundColor: "#f5f5f5"}}>
        <View style={styles.smallHeader}>
          <View style={styles.smallHeaderTitle}>
            <FontAwesome name="user" size={26} color="#222"/>
            <Text style={styles.smallHeaderName}>User Profile</Text>
          </View>
          <View style={styles.smallHeaderBtns}>
            <Text style={styles.smallHeaderEditBtn}>Edit Profile</Text>
            <Feather name="menu" size={30} color="#222"/>
          </View>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.userInfoBlock}>
            <View style={styles.userInfoBlockLeft}>
              <ImageBackground
                source={user} style={styles.userInfoImg}></ImageBackground>
              <View>
                <Text style={styles.userInfoName}>Miki Ito</Text>
                <Text style={styles.userInfoProfile}>Digital Product Designer</Text>
              </View>
            </View>
            <View style={styles.userInfoBlockRight}>
              <Text style={styles.settingsBtn}>Settings</Text>
            </View>
          </View>

          <View>
            <Text style={styles.userInfoContent}>
              Freelance designer specaialzed in UI and interaction design, born
              & raised in China.
            </Text>
          </View>
        </View>

        <View style={styles.containerBlock}>
          <View style={styles.MainCard}>
            <View>
              <Text style={styles.MainCardTitle}>Net Revenuessffs</Text>
              <Text style={styles.MainCardPrice}>$76,124,803</Text>
              <Text style={styles.MainCardAddPrice}>+27.38% ($5,097)</Text>
            </View>
            <Entypo style={styles.revenuGraph} name="bar-graph" size={50} color="#00c4f8"/>
          </View>
        </View>

        <View style={styles.containerBlock}>
          <View style={styles.cardsModule}>
            <View style={styles.smallCard}>
              <View style={styles.smallCardInner}>
                <FontAwesome5 style={styles.smallCardIcon} name="robot" size={50} color="#00c4f8" />
                <Text style={styles.smallCardTitle}>My Bot</Text>
              </View>
            </View>
            <View style={styles.smallCard}>
              <View style={styles.smallCardInner}>
                <Ionicons style={styles.smallCardIcon} name="logo-apple-appstore" size={50} color="#00c4f8" />
                <Text style={styles.smallCardTitle}>My App</Text>
              </View>
            </View>
            <View style={styles.smallCard}>
              <View style={styles.smallCardInner}>
                <AntDesign style={styles.smallCardIcon} name="layout" size={50} color="#00c4f8" />
                <Text style={styles.smallCardTitle}>My Crm</Text>
              </View>
            </View>
            <View style={styles.smallCard}>
              <View style={styles.smallCardInner}>
                <FontAwesome style={styles.smallCardIcon} name="users" size={50} color="#00c4f8" />
                <Text style={styles.smallCardTitle}>Community</Text>
              </View>
            </View>
            <View style={styles.smallCard}>
              <View style={styles.smallCardInner}>
                <MaterialCommunityIcons style={styles.smallCardIcon} name="star-circle" size={50} color="#00c4f8" />
                <Text style={styles.smallCardTitle}>Referral program</Text>
              </View>
            </View>
            <View style={styles.smallCard}>
              <View style={styles.smallCardInner}>
                <MaterialCommunityIcons style={styles.smallCardIcon} name="chart-bar" size={50} color="#00c4f8" />
                <Text style={styles.smallCardTitle}>Sales</Text>
              </View>
            </View>

            <View style={styles.smallCard}>
              <View style={styles.smallCardInner}>
                <FontAwesome style={styles.smallCardIcon} name="pie-chart" size={50} color="#00c4f8" />
                <Text style={styles.smallCardTitle}>Stats</Text>
              </View>
            </View>
            <View style={styles.smallCard}>
              <View style={styles.smallCardInner}>
                <MaterialCommunityIcons style={styles.smallCardIcon} name="chart-bar" size={50} color="#00c4f8" />
                <Text style={styles.smallCardTitle}>Marketing Automations</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.containerBlock}>
          <View style={styles.graphCard}>
            <View style={styles.graphCardBox}>
              <View style={styles.graphCardBlock}>
                <Entypo name="circular-graph" size={42} color="green"/>
                <Text style={styles.graphCardBlockText}>Income</Text>
              </View>
              <View style={styles.graphCardBlock}>
                <Entypo name="circular-graph" size={42} color="skyblue"/>
                <Text style={styles.graphCardBlockText}>Deposit Income</Text></View>
              <View style={styles.graphCardBlock}>
              <Entypo name="circular-graph" size={42} color="red"/>
              <Text style={styles.graphCardBlockText}>Expense</Text></View>
            </View>
            <TouchableOpacity>
              <View style={styles.graphCardBtn}>
                <Text style={styles.graphCardBtnText}>Go to Referral program</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },

  bot: {
    color: '#34495e',
    borderRadius: 200,
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

  smallHeaderBtns: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallHeaderName: {
    fontSize: 20,
    lineHeight: 28,
    color: "#000",
    marginLeft: 15
  },
  smallHeaderEditBtn: {
    fontSize: 16,
    lineHeight: 24,
    color: "#888",
    marginRight: 20
  },
  userInfo: {
    marginBottom: 22,
    paddingHorizontal: 22
  },
  userInfoBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  settingsBtn: {
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 5,
    fontSize: 15,
    color: "#000",
    lineHeight: 20,
  },
  userInfoBlockLeft: {
    flexDirection: "row",
    alignItems: "center",
    width: '55%',
  },
  userInfoBlockRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: '45%',
  },
  userInfoImg: {
    height: 75,
    width: 75,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12
  },
  userInfoName: {
    fontSize: 26,
    lineHeight: 30,
    color: "#000"
  },
  userInfoProfile: {
    fontSize: 16,
    lineHeight: 24,
    color: "#888",
    width: '75%',
  },
  userInfoContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#888",
  },
  containerBlock: {
    paddingHorizontal: 22,
  },
  MainCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderColor: "#ddd",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 20
  },
  MainCardTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#284b75",
    marginBottom: 4,
  },
  MainCardPrice: {
    fontSize: 25,
    lineHeight: 32,
    color: "#102844",
    marginBottom: 4,
    fontWeight: "600"
  },
  MainCardAddPrice: {
    fontSize: 16,
    lineHeight: 24,
    color: "#00c4f8",
  },
  cardsModule: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  smallCard: {
    padding: 25,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 20,
    width: '47%',
    height: 150,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  smallCardInner: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: 'center'
  },
  smallCardTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#000",
    marginTop: 10,
    textAlign: 'center'
  },
  graphCard: {
    padding: 15,
    borderRadius: 12,
    paddingTop: 30,
    backgroundColor: '#fff',
    marginBottom: 20,
    // flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "center"
  },
  graphCardBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    // width: "100%",
  },
  graphCardBtn: {
    backgroundColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 10,
    width: "100%",
    textAlign: "center",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  graphCardBtnText: {
    fontSize: 18,
    color: "#000"
  },
  graphCardBlock: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  graphCardBlockText: {
    fontSize: 15,
    color: "#888",
    lineHeight: 24,
    marginTop: 5
  }
  
});
