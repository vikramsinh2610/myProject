import React, {useState, useEffect} from 'react';
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
} from 'react-native';

//components 
import Header from '../header/Header';

//icons 

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
// import {CartState} from '../context/Context';

// static image 
import artImage from '../../assets/images/art.jpg';
import artImage1 from '../../assets/images/art1.jpg';
import foxHome from '../../assets/images/foxhome.jpg';
import LinearGradient from 'react-native-linear-gradient';

const vendorsData = [
  {
    id: '1',
    image: foxHome,
    name: 'Fox Home',
  },
  {
    id: '2',
    image: artImage,
    name: 'Cafe Joe',
  },
  {
    id: '3',
    image: artImage,
    name: 'art',
  },
  {
    id: '4',
    image: artImage1,
    name: 'art',
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

const featuredData = [
  {
    id: '1',
    image: foxHome,
    name: 'Fox Home',
  },
  {
    id: '2',
    image: artImage,
    name: 'Cafe Joe',
  },
  {
    id: '3',
    image: artImage,
    name: 'art',
  },
  {
    id: '4',
    image: artImage1,
    name: 'art',
  },
];

/**
 * Render all vendorData
 * @param {*} param0
 * @returns
 */
const renderVendorItem = ({item}) => (
  <View style={styles.vendorBox}>
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
      ggfg
    </Text>
    <Text style={styles.vendorTitle}>{item.name}</Text>
  </View>
);

/**
 * Redner all productData
 * @param {*} param0
 * @returns
 */
const renderProductItem = ({item}) => (
  <View style={styles.productBox}>
    <ImageBackground
      source={item.image}
      resizeMode="cover"
      style={styles.productBoxImg}>
      <View style={styles.productBoxDiscount}>
        <Text style={styles.productBoxOff}>45%</Text>
        <Text style={styles.productBoxLimitedOffer}>
          <Text style={styles.productBoxLimitedOfferTime}>19:25:41 </Text>15%
          off{' '}
        </Text>
      </View>
    </ImageBackground>
    <View style={styles.productBoxInfo}>
      <View style={styles.productBoxInfoTop}>
        <Text style={styles.productBoxBrand}>brand</Text>
        <Text style={styles.productBoxPrice}>15$</Text>
      </View>
      <Text style={styles.productBoxName}>name</Text>
    </View>
  </View>
);

/**
 * Render all featureData
 * @param {*} param0
 * @returns
 */
const renderFeaturedItem = ({item}) => (
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
];

export default function Home({navigation}) {
  const [status, setStatus] = useState('All');
  // const [datalist, setDatalist] = useState(listTab);
  const [category, setCategory] = useState([]);
  const [filterCategory, setFilterCategory] = useState([]);

  // redux code
  // const { state: { cart },
  // dispatch,
  // } = CartState();

  useEffect(() => {
    setCategory(productData);
    setFilterCategory(productData);
  }, []);

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
      navigation.navigate('CategoryList', {
        list: filterCategory,
      });
    }
  };
  return (
    <View style={{backgroundColor: '#fff'}}>
      <Header />
      <ScrollView>
        <View style={styles.innerTemplate}>
          <View style={styles.mainheaderFilter}>
            <View style={styles.searchContainer}>
              <EvilIcons
                name="search"
                size={25}
                color="#1AABE3"
                style={styles.searchContainerBtn}
              />
              <TextInput
                type="text"
                style={{height: 40}}
                placeholder="Search for category / product"
                style={styles.searchContainerInput}
              />
            </View>
            <View style={styles.mainheaderFilterBtns}>
              <View style={styles.mapButton}>
                <Ionicons name="location-sharp" size={25} color="#666" />
              </View>
              <View style={styles.filterButton}>
                <Entypo name="sound-mix" size={22} color="white" />
              </View>
            </View>
          </View>

          <View style={styles.blockSlider}>
            <View style={styles.moduleHeading}>
              <Text style={styles.moduleTitle}>Featured Vendors</Text>
              <Text style={styles.moduleTitleLink}>All vendors</Text>
            </View>
            <View style={styles.categoryList}>
              <FlatList
                data={vendorsData}
                renderItem={renderVendorItem}
                keyExtractor={item => item.id}
                horizontal
              />
            </View>
          </View>

          <View>
            <View style={styles.productTabs}>
              {listTab.map(e => (
                <TouchableOpacity
                  onPress={() => handleProductFilter(e.value)}
                  style={styles.producttabBtn}>
                  <Text style={styles.textTab}>{e.status} </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style="productModule">
              <FlatList
                data={vendorsData}
                columnWrapperStyle={{justifyContent: 'space-between'}}
                numColumns={2}
                renderItem={renderProductItem}
                keyExtractor={item => item.id}
              />
            </View>
          </View>
          <View style={styles.featuredProduct}>
            <View style={styles.moduleHeading}>
              <Text style={styles.moduleTitle}>Featured categories</Text>
            </View>
            <View style={styles.categoryList}>
              <FlatList
                data={featuredData}
                renderItem={renderFeaturedItem}
                keyExtractor={item => item.id}
                horizontal
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
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
    shadowOffset: {width: 1, height: 1},
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
    paddingHorizontal: 20,
    fontSize: 12,
    lineHeight: 16,
    color: '#000',
    borderRadius: 500,
    marginRight: 8,
    backgroundColor: '#fff',
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
    width: 380,
    marginRight: 10,
  },
});
