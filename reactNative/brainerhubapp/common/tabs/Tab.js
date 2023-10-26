import { FlatList, StyleSheet, Text, View } from "react-native"

const Tabs = () => {
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
    return (
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
        </View>
    )
}

export default Tabs;


const style = StyleSheet.create({

});