import 'react-native-gesture-handler';
import React from 'react';
import Navigation from './navigation/Navigation';
import { Provider as PaperProvider } from 'react-native-paper';
// import Navigation from './booking-app/navigation/Navitation';

function App() {
  return (
    <PaperProvider>
      {/* <Navigation /> */}
      <Navigation/>
    </PaperProvider>

  );
}
export default App;