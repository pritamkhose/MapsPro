/*
https://blog.logrocket.com/react-native-maps-introduction/
https://stackoverflow.com/questions/47558468/how-to-get-current-location-using-react-native-maps
https://www.youtube.com/watch?v=UOAr5iUO4l0&list=PLeIJUF3PiXDfOoCWgD4uibjkGQMT7a78v&index=8

*/
import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Image,
  Dimensions,
  Button,
} from 'react-native';
import MapView, {LatLng, MAP_TYPES, Marker, Region} from 'react-native-maps';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Geolocation from '@react-native-community/geolocation';

// const r = require('./placeholderr.png');
// const y = require('./placeholdery.png');
// const b = require('./placeholderb.png');

const ScreenHeight = Dimensions.get('window').height;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const locArr = [
    {
      id: 1,
      title: 'Hats Off',
      description: 'Alexander Calder',
      latitude: 41.033769,
      longitude: -73.6913,
      icon: 'y',
    },
    {
      id: 2,
      title: 'Kiosque l’evide',
      description: 'Alexander Calder',
      latitude: 41.034308,
      longitude: -73.691757,
      icon: 'y',
    },
    {
      id: 3,
      title: 'Grande Disco',
      description: 'Arnaldo Pomodoro',
      latitude: 41.034681,
      longitude: -73.692277,
      icon: 'y',
    },
    {
      id: 7,
      title: 'Mozart II',
      description: 'Kenneth Snelson',
      latitude: 41.035652,
      longitude: -73.692436,
      icon: 'r',
    },
    {
      id: 36,
      title: 'Reclining Figure',
      description: 'Henry Moore',
      latitude: 41.035749,
      longitude: -73.692196,
      icon: 'y',
    },
    {
      id: 36,
      title: 'Girl with a Dolphin',
      description: 'David Wynne',
      latitude: 41.034993,
      longitude: -73.69346,
      icon: 'r',
    },
  ];

  const mapView = useRef<MapView>(null);
  const regionRef = useRef<Region | null>(null);

  const randLatLngChange = (latLng: LatLng) => {
    const latitude = latLng.latitude;
    const longitude = latLng.longitude;

    return {latitude, longitude};
  };

  const [position, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  useEffect(() => {
    Geolocation.getCurrentPosition(
      pos => {
        const crd = pos.coords;
        setPosition({
          latitude: crd.latitude,
          longitude: crd.longitude,
          latitudeDelta: 0.009,
          longitudeDelta: 0.009,
        });
      },
      error => {
        console.error(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
      },
    );
  }, []);

  const [region, setRegion] = useState({
    latitude: 41.03505669972807,
    longitude: -73.69289022709438,
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
      <Button
        color="red"
        title="Random Camera"
        onPress={() =>
          mapView.current?.animateCamera(
            {
              center: randLatLngChange({
                latitude: region.latitude,
                longitude: region.longitude,
              }),
            },
            {duration: 200},
          )
        }
      />
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={region}
          mapType={MAP_TYPES.STANDARD} // SATELLITE
          ref={mapView}
          onRegionChange={region => {
            // console.log('-->', region);
            setRegion(region);
          }}
          onRegionChangeComplete={region => (regionRef.current = region)}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          showsCompass={true}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}>
          {locArr.map((data, index) => {
            return (
              <Marker
                key={index}
                title={data.title}
                description={data.description}
                // tracksViewChanges={false}
                coordinate={{
                  latitude: data.latitude,
                  longitude: data.longitude,
                }}>
                <Image
                  key={index}
                  source={require('./placeholdery.png')}
                  // source={data.icon === 'r' ? r : y}
                  // source={require(`${data.icon}`)}
                  // source={require(data.id === 7
                  //   ? './placeholderr.png'
                  //   : './placeholdery.png')}
                  style={styles.icon}
                />
              </Marker>
            );
          })}
        </MapView>
        {/* <Marker
          // icon={require('./placeholder.png')}
          title="Yor are here"
          description="This is a description"
          coordinate={position}
        /> */}
        {/* <Text style={styles.sectionDescription}>{region.latitude}</Text>
          <Text style={styles.sectionDescription}>{region.longitude}</Text> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  container: {
    height: ScreenHeight,
    marginTop: 30,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  icon: {height: 25, width: 25},
});

export default App;
