import React from 'react';
import { View, Text, FlatList, ImageBackground, StyleSheet } from 'react-native';

//dependencies
import LinearGradient from 'react-native-linear-gradient';


//component
import Search from '../search/Search';
import Header from '../header/Header';


//static images 
import electronic from '../../assets/images/electronic.jpg';
import shoes from '../../assets/images/shoes.jpg';
import cloths from '../../assets/images/cloths.jpg';
import shoes1 from '../../assets/images/shoes1.jpg';
import beauty from '../../assets/images/beauty.jpg';
import hair from '../../assets/images/hair.jpg';
import kitchen from '../../assets/images/kitchen.jpg';


export default function CategoryList({ navigation }) {


  const category = [
    {
      id: '1',
      image: cloths,
      name: 'Fashion',
    },
    {
      id: '2',
      image: shoes,
      name: 'Shoes',
    },
    {
      id: '3',
      image: electronic,
      name: 'Electronic',
    },

    {
      id: '4',
      image: beauty,
      name: 'Beauty',
    },
    {
      id: '5',
      image: hair,
      name: 'Hair',
    },
    {
      id: '6',
      image: kitchen,
      name: 'Kitchen',
    },
    {
      id: '7',
      image: shoes1,
      name: 'Shoes',
    },
  ];


  /**
   * Render category
   * @param {*} param0 
   * @returns 
   */
  const renderCategory = ({ item }) => (
    <View style={styles.categoryBox}>
      <ImageBackground source={item.image} style={styles.categoryProductBox}>
        <LinearGradient
          colors={['#0000', '#00000080']}
          style={styles.categoryProductBoxOvarlay}>
          <Text style={styles.categoryProductBoxTitle}>{item.name}</Text>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
  
  return (
    <View style={styles.featuredProduct}>
      <Header navigation={navigation} headerName="Categories" />
      <Search navigation={navigation} placeHolder="Category" />
      <View style={styles.moduleHeading}>
        <Text style={styles.moduleTitle}>Categories</Text>
      </View>
      <View style={styles.categoryList}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={category}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  categoryList: {
    paddingBottom: 280,
    position: 'relative',
    overflowX: 'scroll',
  },
  featuredProduct: {
    padding: 15,
    marginBottom: 40,
    backgroundColor: '#fff'
  },
  moduleHeading: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleTitle: {
    lineHeight: 18,
    color: '#555',
    fontWeight: 'bold',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  categoryProductBox: {
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
  categoryProductBoxOvarlay: {
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
  categoryProductBoxTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 28,
    margin: 0,
    position: 'relative',
    zIndex: 10,
  },
  categoryBox: {
    width: 380,
    marginRight: 10,
  },
});
