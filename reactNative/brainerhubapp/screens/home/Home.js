import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView
} from 'react-native';

//components 
import Header from '../header/Header';
import Search from '../search/Search';

;
// import {CartState} from '../context/Context';

//dependencies
import LinearGradient from 'react-native-linear-gradient';

// static image 
import artImage from '../../assets/images/art.jpg';
import artImage1 from '../../assets/images/art1.jpg';
import foxHome from '../../assets/images/foxhome.jpg';
import electronic from '../../assets/images/electronic.jpg';
import shoes from '../../assets/images/shoes.jpg';
import cloths from '../../assets/images/cloths.jpg';
import shoes1 from '../../assets/images/shoes1.jpg';
import cafeJoe from '../../assets/images/cafejoe.jpg';
import brownHorse from '../../assets/images/brownhorse2.jpg';

//icon
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function Home({ navigation, route }) {


  const [status, setStatus] = useState('All');
  // const [datalist, setDatalist] = useState(listTab);
  const [category, setCategory] = useState([]);
  const [filterCategory, setFilterCategory] = useState([]);
  const [isPromoCode, setPromoCode] = useState(false);
  const [screen, screenName] = useState("Notification");

  // const { screename } = route?.params;
  // console.log("name",name)
  // redux code
  // const { state: { cart },
  // dispatch,
  // } = CartState();

  useEffect(() => {
    setCategory(productData);
    setFilterCategory(productData);
    setPromoCode(false)
  }, []);


  const featureVendorsData = [
    {
      id: '1',
      image: foxHome,
      imageName: "foxHome",
      name: 'Fox Home',
    },
    {
      id: '2',
      image: cafeJoe,
      imageName: "cafejoe",
      name: 'Cafe Joe',
    },
    {
      id: '3',
      image: artImage,
      imageName: "artImage",
      name: 'Art',
    },
    {
      id: '4',
      image: artImage1,
      imageName: "artImage1",
      name: 'Art One',
    },
  ];
  const productData = [
    {
      id: '1',
      image: 'image',
      name: 'Fox Home',
      type: 'all',
    },
    {
      id: '2',
      image: '../../assets/images/art1.jpg',
      name: 'Cafe Joe',
      type: 'all',
    },
    {
      id: '3',
      image: 'artImage',
      name: 'art',
      type: 'art',
    },
    {
      id: '4',
      image: 'artImage1',
      name: 'art',
      type: 'art',
    },

    {
      id: '5',
      image: 'Photography',
      name: 'photography',
      type: 'photography',
    },

    {
      id: '6',
      image: 'Music',
      name: 'music',
      type: 'music',
    },
  ];


  const vendorsData = [
    {
      id: '1',
      image: brownHorse,
      imageName: "booking",
      name: 'Booking',
    },
    {
      id: '2',
      image: cafeJoe,
      imageName: "cafejoe",
      name: 'Cafe Joe',
    },
    {
      id: '3',
      image: artImage,
      imageName: "artImage",
      name: 'Art',
    },
    {
      id: '4',
      image: artImage1,
      imageName: "artImage1",
      name: 'Art One',
    },
  ];
  const featuredCategory = [
    {
      id: '1',
      image: cloths,
      name: 'Fashion',
    },
    {
      id: '2',
      image: electronic,
      name: 'Electronic',
    },
    {
      id: '3',
      image: shoes,
      name: 'Shoes',
    },
    {
      id: '4',
      image: shoes1,
      name: 'Shoes',
    },
  ];

  const promoList = [{
    name: "Cashback",
    type: "Promo",
    text: "up to",
    offer: "70%"
  }, {
    name: "Cashback",
    type: "cupons",
    text: "up to",
    offer: "50%"
  },
  {
    name: "Cashback",
    type: "cupons",
    text: "up to",
    offer: "70%"
  }]

  const listTab = [
    {
      status: 'All',
      value: 'all',
    },
    {
      status: 'Art',
      value: 'art',
    },
    {
      status: 'Photography',
      value: 'photography',
    },
    {
      status: 'Music',
      value: 'music',
    },
    {
      status: 'Fashion',
      value: 'fashion',
    },
    {
      status: 'Kitchen',
      value: 'kitchen',
    },
  ];



  /**
   * Redner all productData
   * @param {*} param0
   * @returns
   */
  const renderProductItem = ({ item }) => {

    return <TouchableOpacity style={styles.productBox} onPress={() => {
      if (item.name === "Booking") {
        navigation?.navigate('Company')
      } else {
        navigation?.navigate('ProductDetails', { productdetails: item })
      }

    }}>
      <View>
        <ImageBackground
          source={item.image}
          resizeMode="cover"
          style={styles.productBoxImg}>
          <AntDesign name="hearto" style={styles.wishList} onPress={() => navigation?.navigate('WishList')} color="#fff" />
          {item.name !== "Booking" ? <View style={styles.productBoxDiscount}>
            <Text style={styles.productBoxOff}>45%</Text>
            <Text style={styles.productBoxLimitedOffer}>
              <Text style={styles.productBoxLimitedOfferTime}>19:25:41 </Text>15%
              off{' '}
            </Text>
          </View> : <View></View>}

        </ImageBackground>
        <View style={styles.productBoxInfo}>
          <View style={styles.productBoxInfoTop}>
            <Text style={styles.productBoxBrand}>{item.name}</Text>
            <Text style={styles.productBoxPrice}>15$</Text>
          </View>
          <Text style={styles.productBoxName}>name</Text>
        </View>
      </View>
    </TouchableOpacity>
  };

  /**
   * Render all featureData
   * @param {*} param0
   * @returns
   */
  const renderFeaturedItem = ({ item }) => (
    <View style={styles.featureBox}>
      <ImageBackground source={item.image} style={styles.featuredProductBox}>
        <LinearGradient
          colors={['#0000', '#00000080']}
          style={styles.featuredProductBoxOvarlay}>
          <Text style={styles.featuredProductBoxTitle}>{item.name}</Text>
        </LinearGradient>
      </ImageBackground>
    </View>
  );


  /**
   * Render promo list
   * @param {*} param0 
   * @returns 
   */
  const renderPromoLsit = ({ item }) => (
    <View style={styles.promoBox}>
      <Text style={styles.promoName}>{item.name}</Text>
      <Text style={styles.promoType}>{item.type}</Text>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.promoText}>{item.text}</Text>
        <Text style={styles.promoOffer}>{item.offer}</Text>
      </View>
    </View>
  )

  /**
 * Render all vendorData
 * @param {*} param0
 * @returns
 */
  const renderVendorItem = ({ item }) => {

    return <TouchableOpacity onPress={() => navigation?.navigate("VendorProfile", { vendarData: item })}>
      <View style={styles.vendorBox} >
        <ImageBackground
          source={item.image}
          resizeMode="cover"
          style={styles.categoryBoxImg}></ImageBackground>
        <Text
          style={{
            backgroundColor: '#888',
            fontSize: 0,
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            padding: 35,
          }}>
        </Text>
        <Text style={styles.vendorTitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  };
  const handleProductFilter = value => {
    if (value === 'art') {
      let artFilter = category.filter(x => x.type === value);
      setFilterCategory(artFilter);
    } else if (value === 'photography') {
      let artFilter = category.filter(x => x.type === value);
      setFilterCategory(artFilter);
    } else if (value === 'music') {
      let artFilter = category.filter(x => x.type === value);
      setFilterCategory(artFilter);
    } else {
      setFilterCategory(category);
      // navigation.navigate('CategoryList', {
      //   list: filterCategory,
      // });
    }
  };
  return (
    <SafeAreaView>
      <View style={{ backgroundColor: '#fff', marginBottom: 65 }}>
        <Header navigation={navigation} headerName="Home" wallet={true} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.innerTemplate}>
            <Search navigation={navigation} placeHolder="Home" isVenderMap={true} />
            <View style={styles.blockSlider}>
            <View style={styles.blanceModule}>
                <View style={styles.blanceModuleRow}>
                  <View>
                    <Text style={styles.blanceTitle}>Your Blance</Text>
                    <Text style={styles.blancePrice}>$ 2000</Text>
                  </View>
                </View>

              </View>
              <View style={{ marginBottom: 25 }}>
                <SafeAreaView>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={promoList}
                    renderItem={renderPromoLsit}
                    keyExtractor={item => item}
                    horizontal
                  />
                </SafeAreaView>
              </View>

              {/* {route?.name === "Notification" && !isPromoCode ?
               <View style={styles.blanceModule}>
                <View style={styles.blanceModuleRow}>
                  <View>
                    <Text style={styles.blanceTitle}>Your Blance</Text>
                    <Text style={styles.blancePrice}>$ 2000</Text>
                  </View>
                </View>

              </View> : route?.name === "Notification" && isPromoCode ? <View style={{ marginBottom: 25 }}>
                <SafeAreaView>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={promoList}
                    renderItem={renderPromoLsit}
                    keyExtractor={item => item}
                    horizontal
                  />
                </SafeAreaView>
              </View> : <View></View>} */}

              <View style={styles.moduleHeading}>
                <Text style={styles.moduleTitle}>Featured Vendors</Text>
                <Text style={styles.moduleTitleLink} onPress={() => navigation.navigate("VendorList")}>All vendors</Text>
              </View>
              <View style={styles.categoryList}>
                <SafeAreaView>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={featureVendorsData}
                    renderItem={renderVendorItem}
                    keyExtractor={item => item.id}
                    horizontal
                  />
                </SafeAreaView>
              </View>
            </View>

            <View>
              <View style={styles.productTabs}>
                <SafeAreaView>
                  <FlatList
                    data={listTab}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => {
                      return (
                        <TouchableOpacity
                          onPress={() => handleProductFilter(item.value)}
                          style={styles.producttabBtn}>
                          <Text style={styles.textTab}>{item.status} </Text>
                        </TouchableOpacity>
                      )
                    }}
                  />
                </SafeAreaView>
              </View>

              <View style="productModule">
                <SafeAreaView>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={vendorsData}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    numColumns={2}
                    renderItem={renderProductItem}
                    keyExtractor={item => item.id}
                  />
                </SafeAreaView>
              </View>
            </View>

            {route?.name === "Home" ? <View style={styles.featuredProduct}>
              <View style={styles.moduleHeading}>
                <Text style={styles.moduleTitle}>Featured categories</Text>
              </View>
              <View style={styles.categoryList}>
                <SafeAreaView>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={featuredCategory}
                    renderItem={renderFeaturedItem}
                    keyExtractor={item => item.id}
                    horizontal
                  />
                </SafeAreaView>
              </View>
            </View> : <View></View>}

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  innerTemplate: {
    paddingHorizontal: 15,
    paddingBottom: 70,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {},
  sectionDescription: {
    marginTop: 8,
  },
  highlight: {},
  mainHeader: {
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  topHeader: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainheaderBtn: {
    height: 35,
    width: 35,
    borderRadius: 10,
    // boxShadow: '0px 0px 19px 0px rgba(0,0,0,0.03)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topHeaderIcon: {
    color: '#000',
  },
  topHeaderTitle: {
    lineHeight: 20,
    margin: 0,
    color: 'black',
  },
  blockSlider: {
    marginBottom: 25,
  },

  blanceModule: {
    backgroundColor: '#888888',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,

  },

  blanceTitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '400',
    margin: 0
  },

  blancePrice: {
    fontSize: 24,
    color: '#fff',
    margin: 0,
    fontWeight: '400'
  },

  blanceModuleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  blanceModuleButton: {
    backgroundColor: '#c9c9c9',
    borderRadius: 5,
    padding: 15,
    height: 35,
    width: 35,
    textAlign: 'right',
    alignItems: 'center',
    justifyContent: "center"
  },

  moduleIcon: {
    color: 'black',
    height: 20,
    width: 20
  },

  moduleHeading: {
    marginBottom: 10,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleTitle: {
    lineHeight: 18,
    color: '#555',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  moduleTitleLink: {
    lineHeight: 17,
    color: '#1AABE3',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  vendorBox: {
    borderRadius: 20,
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 10,
    padding: 25,
    width: 135,
    marginRight: 20,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'solid',
    flexDirection: 'column',
    alignItems: 'center',
  },
  vendorList: {
    flexDirection: 'row',
    overflowX: 'scroll',
  },
  vendorTitle: {
    fontSize: 14,
    color: '#333',
    margin: 0,
    fontWeight: '800',
  },
  vendorBoxOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 120,
    display: 'block',
    backgroundColor: '#888',
  },
  vendorImage: {
    height: 90,
    width: 90,
    borderRadius: 50,
    margin: '0 auto',
    marginBottom: 8,
    position: 'relative',
    overflow: 'hidden',
    // boxShadow: '1px 1px 5px 0px rgb(0 0 0 / 8%)',
  },
  productBlock: {
    marginBottom: 10,
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
  productBoxInfo: {
    marginTop: 10,
  },
  mainheaderFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 30,
  },
  searchContainer: {
    position: 'relative',
    flex: 1,
  },
  mainheaderFilterBtns: {
    flexDirection: 'row',
  },
  searchContainerBtn: {
    position: 'absolute',
    top: 12,
    left: 10,
  },
  searchContainerInput: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#eee',
    height: 40,
    padding: 10,
    lineHeight: 40,
    fontSize: 14,
    borderRadius: 5,
    paddingLeft: 40,
  },
  mapButton: {
    height: 40,
    width: 40,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginLeft: 12,
  },
  filterButton: {
    height: 40,
    width: 40,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#1AABE3',
    marginLeft: 12,
    color: '#fff',
  },
  categoryList: {
    flexDirection: 'row',
    overflowX: 'scroll',
  },
  categoryBoxImg: {
    height: 90,
    width: 90,
    borderRadius: 1000,
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: '#fff',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 8,
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
    shadowColor: '#171717',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    // box-shadow: 1px 1px 5px 0px rgb(0 0 0 / 8%);
  },
  productBox: {
    width: '48%',
    marginBottom: 25,
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
  flatlist: {
    flexWrap: 'wrap',
  },
  productBoxInfoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  productBoxBrand: {
    fontSize: 12,
    color: '#888',
    lineHeight: 14,
    margin: 0,
  },
  productBoxPrice: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    fontWeight: '600',
  },
  productBoxName: {
    fontSize: 16,
    lineHeight: 18,
    margin: 0,
    color: '#555',
  },
  productBoxDiscount: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: 'bold',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  wishList: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 35,
    height: 35,
    padding: 8,
    fontSize: 18,
    backgroundColor: '#00000073',
    borderRadius: 500,
  },
  productBoxOff: {
    backgroundColor: '#FF6302',
    paddingVertical: 8,
    paddingHorizontal: 15,
    color: '#fff',
    borderRadius: 1000,
  },
  productBoxLimitedOffer: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    color: '#FF6302',
    borderRadius: 1000,
    marginTop: 8,
  },
  productBoxLimitedOfferTime: {
    color: '#000',
    marginRight: 5,
  },
  productTabs: {
    flexDirection: 'row',
    overflowX: 'scroll',
    marginBottom: 15,
  },
  producttabBtn: {
    paddingVertical: 4,
    paddingHorizontal: 11,
    fontSize: 12,
    lineHeight: 16,
    color: '#000',
    borderRadius: 500,
    backgroundColor: '#fff',
  },
  textTab: {
    color: 'black',
    fontWeight: '700',
    backgroundColor: 'lightgray',
    borderRadius: 200,
    fontSize: 12,
    paddingTop: 4,
    padding: 15,
    paddingBottom: 4

  },
  featuredCategory: {
    borderRadius: 1000,
  },
  featuredProductBox: {
    borderRadius: 15,
    height: 160,
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 25,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    position: 'relative',
    overflow: 'hidden',
  },
  featuredProductBoxOvarlay: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    top: 80,
    backgroundGradient: 'vertical',
    backgroundGradientTop: '#333333',
    backgroundGradientBottom: '#666666',
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 15,
  },
  featuredProductBoxTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 28,
    margin: 0,
    position: 'relative',
    zIndex: 10,
  },
  featureBox: {
    width: 300,
    marginRight: 10,
  },

  promoBox: {
    width: 280,
    marginRight: 10,
    backgroundColor: '#888',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 25,
    position: "relative",
    overflow: "hidden"
  },

  promoName: {
    fontSize: 20,
    lineHeight: 22,
    marginBottom: 4,
    fontWeight: '600',
    color: '#fff',
  },

  promoType: {
    fontSize: 17,
    lineHeight: 20,
    marginBottom: 12,
    color: '#fff',
  },

  promoText: {
    fontSize: 12,
    lineHeight: 20,
    color: '#fff',
    marginRight: 5
  },

  promoOffer: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '600',
    color: '#fff',
  }
});
