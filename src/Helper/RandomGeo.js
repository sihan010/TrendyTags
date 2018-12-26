import { Dimensions } from 'react-native'

const generateRandomPoints = (center, radius, count) => {
  var points = [];
  for (var i = 0; i < count; i++) {
    points.push(generateRandomPoint(center, radius));
  }
  return points;
}

const generateRandomPoint = (center, radius) => {
  var x0 = center.lng;
  var y0 = center.lat;
  // Convert Radius from meters to degrees.
  var rd = radius / 111300;

  var u = Math.random();
  var v = Math.random();

  var w = rd * Math.sqrt(u);
  var t = 2 * Math.PI * v;
  var x = w * Math.cos(t);
  var y = w * Math.sin(t);

  var xp = x / Math.cos(y0);

  // Resulting point.
  return { 'lat': y + y0, 'lng': xp + x0 };
}

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

const deg2rad = (deg) => {
  return deg * (Math.PI / 180)
}

const regionBuilder = (lat, lng, northeastLat, southwestLat) => {
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;

  const latDelta = northeastLat - southwestLat;
  const lngDelta = latDelta * ASPECT_RATIO;

  const region = {
    latitude: lat,
    longitude: lng,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta
  }

  return region;
}

const colorSelector = (count,promoted) =>{
  // if(promoted==null)
  //   return 'rgba(95, 106, 106,0.6)'
  if(count==null)
    return 'rgba(95, 106, 106,0.6)'
  else if(count<100000) return 'rgba(52, 152, 219,0.6)'
  else if(count>=100000 && count<=500000) return 'rgba(91, 44, 111,0.6)'
  else if(count>=500000 && count<=1000000) return 'rgba(204, 209, 209,0.6)'
  else if(count>=1000000 && count<=1500000) return 'rgba(211, 84, 0,0.6)'
  else if(count>=1500000 && count<=2000000) return 'rgba(230, 126, 34,0.6)'
  else if(count>=2000000 && count<=2500000) return 'rgba(46, 204, 113,0.6)'
  else if(count>=2500000 && count<=3000000) return 'rgba(118, 215, 196,0.6)'
  else if(count>=3000000 && count<=3500000) return 'rgba(249, 231, 159,0.6)'
  else if(count>=3500000 && count<=4000000) return 'rgba(26, 188, 156,0.6)'
  else if(count>=4000000 && count<=4500000) return 'rgba(155, 89, 182,0.6)'
  else if(count>=4500000 && count<=5000000) return 'rgba(241, 148, 138,0.6)'
  else return 'rgba(192, 57, 43,0.6)'
}

export { generateRandomPoints, getDistanceFromLatLonInKm, regionBuilder, colorSelector }

  // Generates 100 points that is in a 1km radius from the given lat and lng point.
