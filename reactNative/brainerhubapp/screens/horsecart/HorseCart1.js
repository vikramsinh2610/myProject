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


//component
import Header from '../header/Header';

//images
import brownHorse1 from '../../assets/images/brownhorse1.jpg';
import brownhorse2 from '../../assets/images/brownhorse2.jpg';
import headerHorse from '../../assets/images/headerHorse.jpg';
import cloths from '../../assets/images/cloths.jpg';

//icon
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HorseCart1({ navigation }) {


  const SelectedHorse = [
    {
      id: '1',
      image: brownHorse1,
      name: 'רכיבה שעתית',
      date: '18.11.2021',
      price: '$379',
    },

  ];

  const hourseData = [
    {

      id: '1',
      image: brownHorse1,
      name: 'רכיבה שעתית',
      imageName: "brownhorse1"
    },
    {
      id: '2',
      image: brownhorse2,
      name: 'רכיבה קבוצתית',
      imageName: "brownhorse2"

    },

  ]

  const renderSelectedHourseData = ({ item }) => (
    <View style={styles.productBlock}>
      <View style={styles.productremoveBtn}>
        <AntDesign
          name="delete"
          style={styles.moduleIcon}
          size={20}
          color="#fff"
          fill="#fff"
        />
      </View>
      <View style={styles.productBox}>
        <View style={styles.productBlockInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productDate}>{item.date}</Text>
          <Text style={styles.productPrice}>{item.price}</Text>
        </View>
        <Image style={styles.productLogo} source={item.image} />
      </View>

    </View>
  );
  /**
     * Render category list
     * @param {*} param0 
     */
  const renderHorseData = ({ item }) => {
    return <TouchableOpacity style={styles.horseBox} onPress={() => navigation.navigate('Product', { horseDetails: item })}>
      <View key={item.id} >
        <ImageBackground
          source={item.image}
          resizeMode="cover"
          style={styles.productBoxImg}>
        </ImageBackground>
        <View style={styles.productBoxInfo}>
          <View style={styles.productBoxInfoTop}>
            <Text style={styles.boxBrand}>{item.name}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  }

  return (
    <View style={styles.featuredProduct}>
      <Header navigation={navigation} headerName="סל"  isBackIcon={true} isHorse={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>

          <View>
            <FlatList
              data={SelectedHorse}
              renderItem={renderSelectedHourseData}
              keyExtractor={item => item.id}
            />
          </View>

          <TouchableOpacity onPress={()=>navigation.navigate('HorseCart2')}>
          <View style={styles.promoBtn} >
            <MaterialCommunityIcons name="sale" size={20} color="#222"  />
            <Text style={styles.promoBtnText}>השתמש בקופון</Text>
            <AntDesign name="right" size={18} color="#bbb" />
          </View>
          </TouchableOpacity>
          <View >
            <Text style={{ marginTop: 20, color: 'black' }}>פופלרי עם</Text>
          </View>

          <View>
            <Text style={{ marginTop: 10, marginBottom: 10 }}>עוד מוצרים שיוכלו לעניין אותך
            </Text>
          </View>
        </View>
        <View>

          <View style={styles.productsModule}>
            <View>
              <FlatList
                data={hourseData}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                numColumns={2}
                renderItem={renderHorseData}
                keyExtractor={item => item.id} />
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 ,marginBottom:20}}>
            <Text style={styles.horsePrice}>$379</Text>
            <Text style={styles.title}>סכום כולל</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.blueBtn} onPress={() => {
              navigation.navigate('HorsePayment')
            }}>
              <Text style={styles.blueBtnTitle} >שלם כעת</Text>
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
  productBlock: {
    padding: 12,
    borderRadius: 15,
    marginBottom: 25,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f1f1',
    borderStyle: 'solid',
    shadowColor: '#000',
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
  productBoxImg: {
    width: '100%',
    height: 172,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
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
    marginBottom: 5,
  },
  productDate: {
    fontSize: 16,
    lineHeight: 24,
    color: '#888',
    fontWeight: '600',
    marginLeft: 45,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 24,
    lineHeight: 32,
    color: '#1AABE3',
    fontWeight: '600',
    marginLeft: 65,
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
    marginBottom:20
  },
  blueBtnTitle: {
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
    paddingRight: 20,
    width: 148
  },
  horsePrice: {
    fontSize: 24,
    lineHeight: 32,
    color: '#1AABE3',
    fontWeight: '600',
    // marginBottom: 20
  },
  title: {
    textAlign: 'right',
    marginLeft: 20
  },

  horseBox: {
    width: '48%',
    marginBottom: 25,
  }
});
