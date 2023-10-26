import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

// import { Checkbox } from 'react-native-paper'
import { CheckBox } from 'react-native-elements'

//component
import Header from '../header/Header';

//static images
import shoes from '../../assets/images/shoes.jpg';
import cloths from '../../assets/images/cloths.jpg';
import beauty from '../../assets/images/beauty.jpg';
import kitchen from '../../assets/images/kitchen.jpg';
import foxHome from '../../assets/images/foxhome.jpg';
import user from '../../assets/images/user.png';

//icon
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CategoryList({ navigation }) {
  const [isOpenSplitOrder, setSplitOrder] = useState(false);
  const [isOpenOrderSummary, setOrderSummary] = useState(false);

  const Shoes = [
    {
      id: '1',
      image: cloths,
      name: 'Adidas Shoes',
      varius: 'Suspendisse varius',
      price: '$379',
    },
    {
      id: '2',
      image: shoes,
      name: 'White Shoes',
      varius: 'Suspendisse varius',
      price: '$120',
    },
  ];

  const renderShoes = ({ item }) => (
    <View style={styles.productMainBlock}>
      <View style={styles.productBlock}>
        <View style={styles.productBox}>
          <Image style={styles.productLogo} source={item.image} />
          <View style={styles.productBlockInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productVarius}>{item.varius}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
          </View>
        </View>
        <View style={styles.productremoveBtn}>
          <AntDesign
            name="delete"
            style={styles.moduleIcon}
            size={20}
            color="#fff"
            fill="#fff"
          />
        </View>
      </View>
      <View>
        <TouchableOpacity style={styles.blueBtn}>
          <Text style={styles.blueBtnTitle}>Add To Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.grayBtn}>
          <Text style={styles.grayBtnTitle}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </View>

  );

  const renderSplitOrder = ({ item }) => {
    return <View key={item.id} style={styles.splitView}>
      <View style={styles.splitViewValue}>
        <ImageBackground style={styles.splitImage} source={item.image} />
        <View>
          <Text style={styles.splitName}>{item.name}</Text>
          <Text style={styles.splitPrice}>{item.price}</Text>
        </View>
      </View>
      <View>
        <CheckBox
          center
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checked={item.value}
          checkedColor="#1AABE3"
        />
      </View>
    </View>;
  };

  const splitData = [
    {
      image: user,
      name: 'Kira',
      price: '71$',
      value: true
    },
    {
      image: user,
      name: 'Jarvis Pepperspray',
      price: '21$',
      value: false
    },
    {
      image: user,
      name: 'sandey Gerzman',
      price: '95$',
      value: true
    }, {
      image: user,
      name: 'Piff Jenkins',
      price: '12$',
      value: true
    },
    {
      image: user,
      name: 'Alan Fersco',
      price: '112$',
      value: false
    },
  ];

  const renderOrderSummary = () => {
    return (
      <View style={styles.summryDropdown}>
        <View style={styles.dropdownPriceList}>
          <Text style={styles.subTotal}>Sub Total</Text>
          <Text style={styles.subTotalPrice}>$1000</Text>
        </View>

        <View style={styles.dropdownPriceList}>
          <Text style={styles.subTotal}>Application fee</Text>
          <Text style={styles.subTotal}>$10</Text>
        </View>

        <View style={styles.dropdownPriceList}>
          <Text style={styles.TotalTitle}>Total</Text>
          <Text style={styles.TotalPrice}>$1010</Text>
        </View>

        <View style={styles.promoBtn}>
          <MaterialCommunityIcons name="sale" size={20} color="#222" />
          <Text style={styles.promoBtnText}>Use Promo Code</Text>
          <AntDesign name="right" size={18} color="#bbb" />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.featuredProduct}>
      <Header navigation={navigation} headerName="Payment" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={styles.moduleHeading}>
            <Image style={styles.tinyLogo} source={beauty} />
            <Text style={styles.moduleTitle}>Foot Locker</Text>
          </View>
          <View>
            <FlatList
              data={Shoes}
              renderItem={renderShoes}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
        <View>
          <View style={styles.moduleHeading}>
            <Image style={styles.tinyLogo} source={foxHome} />
            <Text style={styles.moduleTitle}>Fox Home</Text>
          </View>
          <View style={styles.productMainBlock}>
            <View style={styles.productBlock}>
              <View style={styles.productBox}>
                <Image style={styles.productLogo} source={kitchen} />
                <View style={styles.productBlockInfo}>
                  <Text style={styles.productName}>Sofa</Text>
                  <Text style={styles.productVarius}>Suspendisse varius</Text>
                  <Text style={styles.productPrice}>$729</Text>
                </View>
              </View>
              <View style={styles.productremoveBtn}>
                <AntDesign
                  name="delete"
                  style={styles.moduleIcon}
                  size={20}
                  color="#fff"
                  fill="#000"
                />
              </View>
            </View>
            <View>
              <TouchableOpacity style={styles.blueBtn}>
                <Text style={styles.blueBtnTitle}>Add To Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.grayBtn}>
                <Text style={styles.grayBtnTitle}>Pay Now</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.dropdownBlock}>
            <View style={styles.dropdownBlockHead}>
              <Text style={styles.dropdownBlockHeadTitle}>Spilt Order</Text>
              <AntDesign
                name={isOpenSplitOrder ? 'down' : 'up'}
                onPress={() => {
                  if (isOpenSplitOrder) setSplitOrder(false);
                  else setSplitOrder(true);
                }}
                style={{ marginLeft: 12 }}
                size={18}
                color="#222"></AntDesign>
            </View>
            {isOpenSplitOrder ? (
              <View style={styles.OrderDropdown}>
                <FlatList
                  data={splitData}
                  renderItem={renderSplitOrder}
                  keyExtractor={item => item.id}
                />
              </View>
            ) : (
              <View />
            )}
          </View>

          <View style={styles.dropdownBlock}>
            <View style={styles.dropdownBlockHead}>
              <Text style={styles.dropdownBlockHeadTitle}> Order Summary</Text>
              <AntDesign
                name={isOpenOrderSummary ? 'down' : 'up'}
                onPress={() => {
                  if (isOpenOrderSummary) setOrderSummary(false);
                  else setOrderSummary(true);
                }}
                style={{ marginLeft: 12 }}
                size={18}
                color="#222"></AntDesign>
            </View>

            {isOpenOrderSummary ? (
              <View style={{ backgroundColor: '#fff' }}>
                {renderOrderSummary()}
              </View>
            ) : (
              <View />
            )}
          </View>

          <View>
            <TouchableOpacity style={styles.blueBtn}>
              <Text style={styles.blueBtnTitle}>Pay Now $1010</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  featuredProduct: {
    padding: 15,
    marginBottom: 60,
    backgroundColor: '#fff',
  },
  moduleHeading: {
    marginBottom: 18,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleTitle: {
    lineHeight: 18,
    color: '#555',
    fontWeight: 'bold',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 20,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  productMainBlock: {
    padding: 12,
    borderRadius: 15,
    marginBottom: 25,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f1f1',
    borderStyle: 'solid',
    shadowColor: '#000',
  },
  productBlock: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productLogo: {
    borderRadius: 10,
    width: 110,
    height: 110,
    marginRight: 12,
  },
  productBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productremoveBtn: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    position: 'relative',
  },
  productName: {
    fontSize: 17,
    lineHeight: 24,
    color: '#000',
    fontWeight: '600',
    marginBottom: 5,
  },
  productVarius: {
    fontSize: 16,
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
  dropdownBlock: {
    marginBottom: 25,
    width: '100%',
  },
  dropdownBlockHead: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'solid',
    paddingVertical: 10,
    paddingHorizontal: 22,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownBlockHeadTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    color: '#000',
  },
  summryDropdown: {
    paddingVertical: 15,
    paddingHorizontal: 22,
  },
  dropdownPriceList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  subTotal: {
    fontSize: 16,
    color: '#222',
    lineHeight: 20,
  },
  subTotalPrice: {
    fontSize: 16,
    color: '#222',
    lineHeight: 20,
  },
  TotalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#274764',
    lineHeight: 22,
    marginTop: 18,
  },
  TotalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#274764',
    lineHeight: 22,
    marginTop: 18,
  },
  promoBtn: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#b7cee8',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  promoBtnText: {
    fontSize: 18,
    color: '#274764',
    lineHeight: 22,
  },
  blueBtn: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#1AABE3',
    backgroundColor: '#1AABE3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueBtnTitle: {
    fontSize: 18,
    color: '#fff',
    lineHeight: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  grayBtn: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#555',
    backgroundColor: '#555',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  grayBtnTitle: {
    fontSize: 18,
    color: '#fff',
    lineHeight: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  splitView: {
    display: 'flex',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 15
  },
  OrderDropdown: {
    paddingVertical: 12
  },
  splitViewValue: {
    display: 'flex',
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12
  },
  splitName: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  splitPrice: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#00c4f8'
  },
  splitImage: {
    width: 50,
    height: 50,
    borderRadius: 300,
    overflow: 'hidden',
    marginRight: 10
  },
  orderCheckBox: {
    borderColor: '#888',
    borderRadius: 1000,
    borderWidth: 1,
    borderStyle: "solid"
  },
  productBlockInfo: {
    paddingRight: 10,
    width: 148
  }
});
