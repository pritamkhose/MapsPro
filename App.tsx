/*
https://blog.logrocket.com/react-native-maps-introduction/
https://stackoverflow.com/questions/47558468/how-to-get-current-location-using-react-native-maps
https://www.youtube.com/watch?v=UOAr5iUO4l0&list=PLeIJUF3PiXDfOoCWgD4uibjkGQMT7a78v&index=8

https://blog.logrocket.com/building-custom-maps-react-native-mapbox/
https://stackoverflow.com/questions/64007478/cocoapods-error-installing-mapbox-ios-sdk

*/
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Button,
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Geolocation from '@react-native-community/geolocation';

import Mapbox, {MapView} from '@rnmapbox/maps';
const apikey =
  'pk.eyJ1IjoicHJpdGFtY29nMjEiLCJhIjoiY2x2a2w5M3VoMHZlcTJ2cDcxbTQwZjBwbCJ9.DYbboFMf-MQ19b8eUDQgNw';
Mapbox.setAccessToken(apikey);
Mapbox.setTelemetryEnabled(false);

const locArr = [
  {
    id: 1,
    title: 'Hats Off',
    description: 'Alexander Calder',
    latitude: 41.033769,
    longitude: -73.6913,
    icon: 'y',
    url: 'https://lh5.googleusercontent.com/p/AF1QipNfFziPZZ2cwtkfz8ujAGrVLC_obp_nxMVBFhtY=h1440',
  },
  {
    id: 2,
    title: 'Kiosque l’evide',
    description: 'Alexander Calder',
    latitude: 41.034308,
    longitude: -73.691757,
    icon: 'y',
    url: 'https://lh5.googleusercontent.com/p/AF1QipO5IpF9Ag8S1Sk_n_dU_SUOHgfmFKCo0-2BMgFx=h1440',
  },
  {
    id: 3,
    title: 'Grande Disco',
    description: 'Arnaldo Pomodoro',
    latitude: 41.034681,
    longitude: -73.692277,
    icon: 'y',
    url: 'https://lh5.googleusercontent.com/p/AF1QipNA3bbPNWHNIEQxsBuC4kWwLpcpUElKs8M50e9-=h1440',
  },
  {
    id: 7,
    title: 'Mozart II',
    description: 'Kenneth Snelson',
    latitude: 41.035652,
    longitude: -73.692436,
    icon: 'r',
    url: 'https://lh5.googleusercontent.com/p/AF1QipNfFziPZZ2cwtkfz8ujAGrVLC_obp_nxMVBFhtY=h1440',
  },
  {
    id: 36,
    title: 'Reclining Figure',
    description: 'Henry Moore',
    latitude: 41.035749,
    longitude: -73.692196,
    icon: 'y',
    url: 'https://lh5.googleusercontent.com/p/AF1QipNfFziPZZ2cwtkfz8ujAGrVLC_obp_nxMVBFhtY=h1440',
  },
  {
    id: 36,
    title: 'Girl with a Dolphin',
    description: 'David Wynne',
    latitude: 41.034993,
    longitude: -73.69346,
    icon: 'r',
    url: 'https://lh5.googleusercontent.com/p/AF1QipPv8Ilc1-uuTPQqdnOxzp83tI-8GB3zofqobYl8=h1440',
  },
];

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [route, setRoute] = useState([]);

  const [offlineRoutes, setOfflineRoutes] = useState(null);

  const [loading, setLoading] = useState(false);

  const [dirData, setDirData] = useState({distance: 0, time: 0});

  function toRad(n: number) {
    return (n * Math.PI) / 180;
  }

  function distance(lat1: number, lon1: number) {
    var d = 0;
    var lat2 = position.latitude;
    var lon2 = position.longitude;

    var R = 6371; // km
    //has a problem with the .toRad() method below.
    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    d = R * c;
    return Number.isNaN(d) ? 0 : (d * 1000).toFixed(2);
  }

  const [markerData, setMarkerData] = useState({});

  const [position, setPosition] = useState({
    latitude: 10,
    longitude: 10,
  });
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  useEffect(() => {
    Geolocation.getCurrentPosition(
      pos => {
        const crd = pos.coords;
        setPosition({
          latitude: crd.latitude,
          longitude: crd.longitude,
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

  useEffect(() => {
    console.log('markerData-->', markerData);
    if (Object.keys(markerData).length > 0 && position) {
      getApi();
    }
  }, [markerData]);

  const getApi = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${position.longitude}%2C${position.latitude}%3B${markerData.longitude}%2C${markerData.latitude}?alternatives=true&annotations=distance%2Cduration&continue_straight=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${apikey}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      const json = await response.json();
      // console.log('json-->', json.routes[0].geometry.coordinates, json.routes[0].geometry.coordinates);
      if (json?.code === 'Ok') {
        setDirData({
          distance: json.routes[0]?.distance,
          time: json.routes[0]?.duration,
        });
        setRoute(json.routes[0].geometry.coordinates);
      } else {
        Alert.alert(
          'Map Error',
          `${json?.code} - ${json?.message}.\n\nFor more information: https://docs.mapbox.com/api/navigation/map-matching/#map-matching-api-errors`,
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        );
      }
    } catch (error) {
      setRoute([]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadOfflineMap = async () => {
    try {
      await Mapbox.offlineManager.createPack(
        {
          name: 'offlinePack',
          styleURL: 'mapbox://styles/mapbox/streets-v11',
          minZoom: 15,
          maxZoom: 20,
          bounds: [
            [-73.698315, 41.038534],
            [-73.687993, 41.031304],
          ],
        },
        (offlinePack, status) => {
          console.log('offline Maps sucess -->', status);
          // const offlinePacks = await Mapbox.offlineManager.getPacks();
          setOfflineRoutes(offlinePack);
        },
        (offlinePack, err) => {
          console.log('offline Maps Error-->', err);
          console.log(offlinePack, err);
        },
      );
      console.log('Downloading');
    } catch (err) {
      console.log(err);
    }
  };

  const mapView = useRef<MapView>(null);

  const [camera, setCamera] = useState([-73.69289022709438, 41.03505669972807]);

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
        }}>
        <View style={{flexDirection: 'row'}}>
          <Button
            color="red"
            title="Reset"
            onPress={() => {
              setMarkerData({});
              console.log('camera-->', camera);
              setCamera([-73.69289022709438, 41.03505669972807]);
            }}
          />
          <Button
            color="blue"
            title="Google map"
            onPress={() => {
              const url = `https://www.google.com/maps/dir/${position.latitude},${position.longitude}/${markerData.latitude},${markerData.latitude}/@${position.latitude},${position.longitude},17z/data=!4m2!4m1!3e0?entry=ttu`;
              console.log('GoogleMap-->', url);
              Linking.openURL(url);
            }}
          />
          <Button
            color="green"
            title="Apple Map"
            onPress={() => {
              const url = `https://maps.apple.com/?daddr=${position.latitude},${position.longitude}&dirflg=w&saddr=${locArr[0].latitude},${locArr[0].longitude}&t=h`;
              console.log('AppleMap-->', url);
              Linking.openURL(url);
            }}
          />
          <Button
            color="cyan"
            title="Offline Map"
            onPress={downloadOfflineMap}
          />
        </View>
        <View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Image
                source={{
                  uri: markerData?.url, // 'https://avatars.githubusercontent.com/u/13750893?s=96&v=4',
                }}
                style={{width: 100, height: 100, backgroundColor: 'white'}}
              />
            </View>
            <View style={{flex: 2}}>
              <Text>{markerData?.title}</Text>
              <Text>{markerData?.description}</Text>
              <Text>
                Distance :{' '}
                {distance(markerData?.latitude, markerData?.longitude)} m
              </Text>
              <Text>{`Direction Distance : ${dirData.distance} m and Time : ${(
                dirData.time / 60
              ).toFixed(0)} min`}</Text>
            </View>
          </View>
        </View>

        <View style={styles.page}>
          <View style={styles.container}>
            <Mapbox.MapView
              ref={mapView}
              style={styles.map}
              attributionEnabled={false}
              logoEnabled={false}
              styleURL={Mapbox.StyleURL.SatelliteStreet}>
              <Mapbox.Camera
                zoomLevel={16}
                centerCoordinate={
                  camera?.length === 2
                    ? camera
                    : [position.longitude, position.latitude]
                }
                animationMode="flyTo"
                animationDuration={2000}
              />

              {locArr.map((data, index) => {
                return (
                  <Mapbox.MarkerView
                    anchor={{x: 0.5, y: 0.5}}
                    id={`id${index}`}
                    key={index}
                    allowOverlap={false}
                    isSelected={index === selectedIndex}
                    coordinate={[data.longitude, data.latitude]}>
                    <Pressable
                      style={[
                        styles.markerBox,
                        {backgroundColor: 'red', padding: 4},
                      ]}
                      onPress={() => {
                        setCamera([data.longitude, data.latitude]);
                        setMarkerData(data);
                        setSelectedIndex(index =>
                          index === index ? -1 : index,
                        );
                      }}>
                      <Text style={styles.markerText}>{data.title}</Text>
                    </Pressable>
                    <View>
                      {data.icon === 'r' ? (
                        <Image
                          key={index}
                          source={require('./placeholderr.png')}
                          style={styles.icon}
                        />
                      ) : (
                        <Image
                          key={index}
                          source={require('./placeholdery.png')}
                          style={styles.icon}
                        />
                      )}
                    </View>
                  </Mapbox.MarkerView>
                );
              })}

              {/* current Provider location */}
              <Mapbox.MarkerView
                id={`id${9999}`}
                key={9999}
                coordinate={[position.longitude, position.latitude]}>
                <View>
                  <Image
                    key={1000}
                    source={require('./placeholderb.png')}
                    style={styles.icon}
                  />
                </View>
              </Mapbox.MarkerView>

              {/* <Mapbox.PointAnnotation
                selected={true}
                key="9999"
                id="userLocation"
                title="Your location"
                coordinate={[position.longitude, position.latitude]}>
                <Image
                  key={9999}
                  source={require('./placeholderb.png')}
                  style={styles.icon}
                />
                <Mapbox.Callout title="My Location" />
              </Mapbox.PointAnnotation> */}
              {route?.length > 1 ? (
                <Mapbox.ShapeSource
                  id="line1"
                  shape={{
                    type: 'FeatureCollection',
                    features: [
                      {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                          type: 'LineString',
                          coordinates: route,
                        },
                      },
                    ],
                  }}>
                  <Mapbox.LineLayer
                    id="linelayer1"
                    style={{
                      lineColor: 'blue',
                      lineWidth: 4,
                      lineCap: 'round',
                    }}
                  />
                </Mapbox.ShapeSource>
              ) : null}
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
    height: 600,
    // width: 500,
  },
  map: {
    flex: 1,
  },
  icon: {height: 25, width: 25},
  markerBox: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    padding: 4,
    borderWidth: 2,
    borderColor: 'black',
  },
  markerBoxSelected: {
    padding: 12,
  },
  markerText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default App;
