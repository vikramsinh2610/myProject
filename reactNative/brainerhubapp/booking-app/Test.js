import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { exp } from "react-native-reanimated";
import PopoverTooltip from 'react-native-popover-tooltip';

class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: 1
        };
    }
    render() {
        return (
            <View style={{ flex: 1, alignSelf: 'stretch',  backgroundColor: '#fff' }}>
          
                <Text>Default Effect</Text>
                <PopoverTooltip
                    ref='tooltip1'
                    buttonComponent={
                        <View style={{ width: 200, height: 50, backgroundColor: 'orange', justifyContent: 'flex-start', alignItems: 'center', borderRadius: 5 }}>
                            <Text>
                                Press Me
                            </Text>
                        </View>
                    }
                    items={[
                        {
                            label: 'Item 1',
                            onPress: () => { }
                        },
                    ]}
                />
            </View>
        );
    }
}


export default Test





