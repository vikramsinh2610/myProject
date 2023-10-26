import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet} from 'react-native';

//icon
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';

//screen
import HomeScreen from '../screens/home/Home';
import CategoryList from '../screens/category/CategoryList';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#42f44b' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home Page', headerShown: false }}/>
        <Stack.Screen
          name="CategoryList"
          component={CategoryList}
          options={{ headerShown: false }} 
          />
      </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        headerStyle: { backgroundColor: '#42f44b' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }}>
    </Stack.Navigator>
  );
}

function Navigation() {
  return (
    // <Context>
    <NavigationContainer style={{paddingVertical: 15}}>
      <Tab.Navigator
        initialRouteName="Feed"
        tabBarOptions={{
          showLabel:false,
          activeTintColor: '#1AABE3',
        }}>
        <Tab.Screen
          name="HomeStack"
          component={HomeStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="home"
                color={color}
                size={size}
              />
            ),
          }}  />
        <Tab.Screen
          name="SettingsStack"
          component={SettingsStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <AntDesign
                name="tago"
                color={color}
                size={size}
              />
            ),
          }} />

        <Tab.Screen
          name="NotificationStack"
          component={SettingsStack}
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
          }} />

      <Tab.Screen
          name="UserStack"
          component={SettingsStack}
          options={{
            tabBarLabel: 'UserStack',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Feather
                name="user"
                color={color}
                size={size}
              />
            ),
          }} />

      <Tab.Screen
          name="ChatStack"
          component={SettingsStack}
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
          }} />
      </Tab.Navigator>
    </NavigationContainer>
    // </Context>
  );
}

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
  }
})
export default Navigation;