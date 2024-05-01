/*
https://blog.logrocket.com/react-native-maps-introduction/
https://stackoverflow.com/questions/47558468/how-to-get-current-location-using-react-native-maps
https://www.youtube.com/watch?v=UOAr5iUO4l0&list=PLeIJUF3PiXDfOoCWgD4uibjkGQMT7a78v&index=8

https://blog.logrocket.com/building-custom-maps-react-native-mapbox/
https://stackoverflow.com/questions/64007478/cocoapods-error-installing-mapbox-ios-sdk

*/
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
// import MapView, {MAP_TYPES, Marker} from 'react-native-maps';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Geolocation from '@react-native-community/geolocation';

import Bubble from './Bubble';

import Mapbox from '@rnmapbox/maps';
Mapbox.setAccessToken(
  'pk.eyJ1IjoicHJpdGFtY29nMjEiLCJhIjoiY2x2a2w5M3VoMHZlcTJ2cDcxbTQwZjBwbCJ9.DYbboFMf-MQ19b8eUDQgNw',
);
Mapbox.setTelemetryEnabled(false);

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [calloutVisible, setCalloutVisible] = useState(false);

  const [coordinates] = useState([-5, 55]);

  const onMarkerPress = () => {
    setCalloutVisible(true);
  };

  const [position, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  useEffect(() => {
    Geolocation.getCurrentPosition(pos => {
      const crd = pos.coords;
      setPosition({
        latitude: crd.latitude,
        longitude: crd.longitude,
        latitudeDelta: 0.0421,
        longitudeDelta: 0.0421,
      });
    });
  }, []);

  const [region, setRegion] = useState({
    latitude: 41.03505669972807,
    longitude: -73.69289022709438,
    // latitudeDelta: 0.0421,
    // longitudeDelta: 0.0421,
    latitudeDelta: 0.009,
    longitudeDelta: 0.009,
  });

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          // flex: 0
        }}>
        <Text style={styles.sectionDescription}>Hi</Text>
        {/* <View style={styles.container}>
          <MapView
            style={styles.map}
            //specify our coordinates.
            initialRegion={region}
            mapType={MAP_TYPES.SATELLITE}
            onRegionChange={region => {
              // console.log('-->', region);
              setRegion(region);
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
            followsUserLocation={true}
            showsCompass={true}
            scrollEnabled={true}
            zoomEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
          />
          <Marker
            title="DMK Garden"
            pinColor="green"
            coordinate={{
              latitude: 41.03505669972807,
              longitude: -73.69289022709438,
            }}
          />
          <Marker
            title="Yor are here"
            description="This is a description"
            coordinate={position}
          />
          // <Text style={styles.sectionDescription}>{region.latitude}</Text>
          // <Text style={styles.sectionDescription}>{region.longitude}</Text> 
        </View>  */}
        <View style={styles.page}>
          <View style={styles.container}>
            <Mapbox.MapView
              style={styles.map}
              styleURL={Mapbox.StyleURL.SatelliteStreet}>
              <Mapbox.Camera
                zoomLevel={15}
                centerCoordinate={[position.longitude, position.latitude]}
                animationMode="flyTo"
                animationDuration={2000}
              />

              <Mapbox.MarkerView
                id={'hello'}
                coordinate={[position.longitude, position.latitude]}>
                <View>
                  <Text style={styles.sectionDescription}>my Location</Text>
                </View>
              </Mapbox.MarkerView>

              {/* <Mapbox.PointAnnotation
                id="userLocation"
                coordinate={[position.longitude, position.latitude]}
                title="Your location"
              /> */}
            </Mapbox.MapView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: 'red',
  },
  highlight: {
    fontWeight: '700',
  },
  /* container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 500,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }, */
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    height: 500,
    // width: 500,
  },
  map: {
    flex: 1,
  },
});

export default App;
