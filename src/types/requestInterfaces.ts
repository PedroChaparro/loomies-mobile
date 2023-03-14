export interface iRequestGym {
  _id: number;
  latitude: number;
  longitude: number;
  name: string;
}

export interface iRequestNearGyms {
  error: boolean;
  message: string;
  nearGyms: iRequestGym[];
}

//const a = {
  //error: false,
  //message: 'Gyms have been found in near areas',
  //nearGyms: [
    //{
      //_id: '63ffb0bd765929d2bde31c5d',
      //latitude: 7.040319,
      //longitude: -73.0748599,
      //name: 'El Cacareo'
    //},
    //{
      //_id: '63ffb0bd765929d2bde31ba1',
      //latitude: 7.0380166079819615,
      //longitude: -73.06972931870942,
      //name: 'Nico Curve'
    //},
    //{
      //_id: '63ffb0bd765929d2bde31c61',
      //latitude: 7.042461670870239,
      //longitude: -73.0705312743386,
      //name: 'Lynch Fords'
    //},
    //{
      //_id: '63ffb0bd765929d2bde31ae5',
      //latitude: 7.034060286699647,
      //longitude: -73.06727428651733,
      //name: 'Dee Summit'
    //},
    //{
      //_id: '63ffb0bd765929d2bde31b9d',
      //latitude: 7.0383999,
      //longitude: -73.0738678,
      //name: 'Estación Palmichal'
    //},
    //{
      //_id: '63ffb0bd765929d2bde31c65',
      //latitude: 7.040620106036859,
      //longitude: -73.06503839033853,
      //name: 'Bradley Vista'
    //},
    //{
      //_id: '63ffb0bd765929d2bde31ba5',
      //latitude: 7.038145228676082,
      //longitude: -73.06629378213921,
      //name: 'Nitzsche Point'
    //},
    //{
      //_id: '63ffb0bd765929d2bde31ae1',
      //latitude: 7.0350447,
      //longitude: -73.0694514,
      //name: 'Centro Internacional de Especialistas CIE - Complejo HIC'
    //},
    //{
      //_id: '63ffb0bd765929d2bde31add',
      //latitude: 7.033573499233191,
      //longitude: -73.07391092608465,
      //name: 'Predovic Landing'
    //}
  //]
//};
