import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet } from 'react-native';

//icon
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//screen
import HomeScreen from '../screens/home/Home';
import CategoryList from '../screens/category/CategoryList';
import ChatBot from '../screens/chatbot/ChatBot';
import Payment from '../screens/payment/Payment';
import UserProfile from '../screens/userprofile/UserProfile';
import Setting from '../screens/setting/Setting';
import Profile from '../screens/userprofile/Profile';
import Cart from '../screens/cart/Cart';
import VendorProfile from '../screens/vendorprofile/VendorProfile';
import VendorList from '../screens/vandorlist/VendorList';
import VendorMap from '../screens/map/VendorMap';
import Deals from '../screens/deals/Deals';
import OrderList from '../screens/order/OrderList';
import ProductDetails from '../screens/productdetails/ProductDetails';
import WishList from '../screens/wishlist/WishList';
import Wallet from '../screens/wallet/Wallet';
import LoadMoney from '../screens/wallet/LoadMoney';
import Shops from '../screens/wallet/Shops';
import Purchase from '../screens/wallet/Purchase';
import CreditCard from '../screens/wallet/CreditCard';
import PaymentHistory from '../screens/wallet/PaymentHistory';
import PaymentInfo from '../screens/wallet/PaymentInfo';
import FilterList from '../screens/wallet/FilterList';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import Company from '../screens/company/Company';
import Product from '../screens/product/Product';
import Calendar from '../screens/calendar/Calendar';
import HorseCart1 from '../screens/horsecart/HorseCart1';
import HorseCart2 from '../screens/horsecart/HorseCart2';
import HorsePayment from '../screens/horsepayment/Payment';
import Map from '../screens/vandorlist/Map';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackScreen({ screenName }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#42F44B' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}>
      <Stack.Screen
        name={screenName}
        component={HomeScreen}
        options={{ title: 'Home Page', headerShown: false }}
      />
      <Stack.Screen
        name="CategoryList"
        component={CategoryList}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Setting"
        component={Setting}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="VendorProfile"
        component={VendorProfile}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="VendorList"
        component={VendorList}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="VendorMap"
        component={VendorMap}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Map"
        component={Map}
        options={{ headerShown: false }}
      />


      <Stack.Screen
        name="Deals"
        component={Deals}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="OrderList"
        component={OrderList}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="WishList"
        component={WishList}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Wallet"
        component={Wallet}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="LoadMoney"
        component={LoadMoney}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Shops"
        component={Shops}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Purchase"
        component={Purchase}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreditCard"
        component={CreditCard}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PaymentHistory"
        component={PaymentHistory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentInfo"
        component={PaymentInfo}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="FilterList"
        component={FilterList}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Company"
        component={Company}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Product"
        component={Product}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Calendar"
        component={Calendar}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="HorseCart1"
        component={HorseCart1}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="HorseCart2"
        component={HorseCart2}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HorsePayment"
        component={HorsePayment}
        options={{ headerShown: false }}
      />


    </Stack.Navigator>
  );
}

function Navigation() {
  return (
    // <Context>
    <NavigationContainer style={{ paddingVertical: 15 }}>
      <Tab.Navigator
        initialRouteName="Feed"
        tabBarOptions={{
          showLabel: false,
          activeTintColor: '#1AABE3',
        }}>
        <Tab.Screen
          name="HomeStack"
          children={() => <HomeStackScreen screenName="Home" />}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="PaymentStack"
          component={Payment}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="tago" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="NotificationStack"
          children={() => <HomeStackScreen screenName="Notification" />}
          options={{
            tabBarLabel: 'NotificationStack',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="bell-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="UserStack"
          component={UserProfile}
          options={{
            tabBarLabel: 'UserStack',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="ChatStack"
          component={ChatBot}
          options={{
            tabBarLabel: 'ChatStack',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="chatbubbles-sharp"
                color={'#fff'}
                size={size}
                style={styles.mainfooterBtns}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
    // </Context>
  );
}

const renderSplitOrder = ({ item }) => {
  return (
    <View key={item.id}>
      <ImageBackground source={item.image} />
      <Text>{item.name}</Text>
      <Text>{item.price}</Text>
      <RadioButton
        value="first"
        status={checked === 'first' ? 'checked' : 'unchecked'}
        onPress={() => setChecked('first')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainfooterBtns: {
    backgroundColor: '#1AABE3',
    height: 60,
    width: 60,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1000,
    paddingTop: 15,
    paddingLeft: 15,
    marginTop: -30,
  },
});
export default Navigation;
