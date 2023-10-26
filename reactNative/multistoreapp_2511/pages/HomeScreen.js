import React,{useState,useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, FlatList,ScrollView,Image,TouchableOpacity} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { CartState } from '../context/Context';
// import Header from './Header';
// import artImage from '../assests/images/art.jpg';
// import artImage1 from '../assests/images/art1.jpg';
// import foxHome from '../assests/images/foxhome.jpg';

const vendorsData = [
  {
    id: '1',
    image: 'foxHome',
    name: 'Fox Home',
  },
  {
    id: '2',
    image: 'artImage',
    name: 'Cafe Joe',
  },
  {
    id: '3',
    image: 'artImage',
    name: 'art',
  },
  {
    id: '4',
    image: 'artImage1',
    name: 'art',
  }
];
const categoryData=[{
  id: '1',
  image: 'image',
  name: 'Fox Home',
  type:'all'
},
{
  id: '2',
  image: 'image',
  name: 'Cafe Joe',
  type:'all'
},
{
  id: '3',
  image: 'artImage',
  name: 'art',
  type:'art'
},
{
  id: '4',
  image: 'artImage1',
  name: 'art',
  type:'art'
},

{
    id: '5',
    image: 'Photography',
    name: 'photography',
    type:'photography'
  },
  
{
    id: '6',
    image: 'Music',
    name: 'music',
    type:'music'
  },
]
const renderVendorItem = ({item}) => (
  <View style={styles.vendorBox}>
    <Image source={item.image} style={{height:40,width:40}} />
    <Text  style={styles.vendorTitle}>{item.name}</Text>
  </View>
);
const renderProductItem = ({item}) => (
    <View style={styles.vendorBox}>
    <Image source={item.image} style={{height:40,width:40}} />
    <Text  style={styles.vendorTitle}>{item.name}</Text>
  </View>
);


const listTab = [
    {
        status: 'All',
        value:'all',
    },
    {
        status: 'Art',
        value:'art',
    },
    {
        status: 'Photography',
        value:'photography',
    },
    {
        status: 'Music',
        value:'music',
    },
]



export default function HomeScreen() {
    const [status, setStatus] = useState('All')

    const [datalist, setDatalist] = useState(listTab)
    const [category, setCategory] = useState([]);
    const [filterCategory, setFilterCategory] = useState([]);

    // const { state: { cart },
    // dispatch,
    // } = CartState();

    useEffect(() => {
        setCategory(categoryData)
        setFilterCategory(categoryData)
    }, [])


    const handleProductFilter = (value) => {
        if (value === "art") {
            let artFilter = category.filter(x => x.type === value);
            setFilterCategory(artFilter)
        }
        else if (value === "photography") {
            let artFilter = category.filter(x => x.type === value);
            setFilterCategory(artFilter)
        }
        else if (value === "music") {
            let artFilter = category.filter(x => x.type === value);
            setFilterCategory(artFilter)
        }
        else {
            setFilterCategory(categoryData)
        }
    }
  return (
    <View>
    {/* <Header /> */}
    <ScrollView>
    <View>
      <EvilIcons name="search" size={50} />
      <TextInput
        type="text"
        style={{height: 40}}
        placeholder="Type here to translate!"
      />
      <Ionicons name="location-sharp" size={50} />
      <Entypo name="sound-mix" size={50} />
      <View style={styles.blockSlider}>
        <View style={styles.moduleHeading}>
          <Text style={styles.moduleTitle}>Featured Vandors</Text>
          <Text style={styles.moduleTitleLink}>Allvandors</Text>
        </View>
        <View>
          {/* <FlatList
            data={vendorsData}
            renderItem={renderVendorItem}
            keyExtractor={item => item.id}
            style={styles.vendorList}
          /> */}
        </View>
      </View>
      <View >
      {
                listTab.map(e => (
                    <TouchableOpacity
                        // style={[styles.btnTab, status === e.status && styles.btnTabActive]}
                        onPress={() => handleProductFilter(e.value)}>
                    <Text style={styles.textTab}>{e.status}  /</Text>
                    </TouchableOpacity>
                ))
            }
        <View>
          <FlatList
            data={filterCategory}
            renderItem={renderProductItem}
            keyExtractor={item => item.id}
            style={styles.vendorList}
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
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    // fontWeight: 600,
  },
  sectionDescription: {
    marginTop: 8,
    // fontWeight: 400,
  },
  highlight: {
    // fontWeight: 700,
  },
  mainHeader: {
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  topHeader: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // "padding": 15,
    // "flex": 100,
    // "backgroundColor": 'black',
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
    width: 145,
    marginRight: 20,
    textAlign: 'center',
    float: 'left',
  },
  vendorList: {
    flexDirection: 'row',
    overflowX: 'scroll',
  },
  vendorTitle: {
    fontSize: 14,
    color: '#333',
    margin: 0,
  },
  vendorImage: {
    height: 90,
    width: 90,
    borderRadius: 50,
    // border: '3px solid #fff',
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
});












