import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , FlatList , Button , Modal , TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useRef} from 'react';
import ComunicationController from './ComunicationController';
import SingleUserRowContent from './Components/SingleUserRowContent';
import HeadComponent from './Components/HeadComponent';
import AnagComponent from './Components/AnagComonent';
import AnagArtefattoComponent from './Components/AnagArtefattoCmponent';
import SwitchPositionComponent from './Components/SwitchPositionComponent';
import UpdateComponent from './Components/UpdateComponent';
import UserDetailComponent from './Components/UserDetailComponent';
import ObjectDetailComponent from './Components/ObjectDetailComponent';
import SingleObjectRowContent from './Components/SingleObjectRowContent';
import User from './Class/User';
import VirtualObject from './Class/VirtualObject';
import Repository from './Repository';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import MapView, {Circle, Marker} from 'react-native-maps';
import MarkerComponent from './Components/MarkerComponent';

export default function App() {

  const [page, setPage] = useState(0);
  const [precedente, setPrecedente] = useState(0);
  const [userSelected, setUserSelected] = useState(null);
  const [objectSelected, setObjectSelected] = useState(null);
  const [data, setData] = useState([]);
  const [sid, setSid] = useState("");
  const [uid, setUid] = useState("");
  const [artefatti, setArtefatti] = useState({armor: null, weapon: null, amulet: null});
  const [armor, setArmor] = useState(null);
  const [weapon, setWeapon] = useState(null);
  const [amulet, setAmulet] = useState(null);
  const [user, setUser] = useState(null);
  const [positionshare, setPositionshare] = useState(false);
  const [nears, setNears] = useState([]);
  const [playerState, setPlayerState] = useState({activated: false, died: false});
  const [location, setLocation] = useState({lat: 0, lon: 0});
  const [regionStart, setRegionStart] = useState({latitude: 0, longitude: 0, latitudeDelta: 0.008, longitudeDelta: 0.008});
  const [repository, setRepository] = useState(null);

  const [popupData, setPopupData] = useState({
    isVisible: false,
    shouldClose: false,
  });

  const manageClose = () => {
    setPopupData({
      isVisible: false,
      shouldClose: true,
    });
  };

  useEffect(() => {
    // Inizializza il repository solo una volta
    if (!repository) {
      setRepository(new Repository());
    }
  }, [repository]);
  
  //const repository = useRef(new Repository());


  const register = async () => {
    //una volta chiamata verifica sid e uid in storage altrimenti li chiede al server
    try {
      const sid = await AsyncStorage.getItem('sid');
      const uidString = await AsyncStorage.getItem('uid');
      console.log("uidString", uidString);
      const uid = parseInt(uidString, 10);
      console.log("uid", uid);
  
      if (sid !== null && !isNaN(uid)) {
        setSid(sid);
        setUid(uid);
      } else {
        const response = await ComunicationController.register();
        
        if (response.sid && response.uid) {
          setSid(response.sid);
          setUid(response.uid);
  
          await AsyncStorage.setItem('sid', response.sid);
          const uidString = response.uid.toString();
          await AsyncStorage.setItem('uid', uidString);
        } else {
          console.error("Errore dal server.");
        }
      }
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
    }
  };
  
  const getUser = async (sid, uid) => {
    //prende il player sempre dal server (per tenere sempre aggiornato)
    try {
      console.log("sid:", sid, "uid:", uid);
      const response = await ComunicationController.getUser(sid, uid);
      console.log("getUser r90");
      setUser(response);
      setPositionshare(response.positionshare);
    } catch (error) {
      console.error("Error while getting user:", error);
    }
  };

  const getObject = async (sid, id) => {
    //ottiene i dettagli degli oggetti equipaggiati dal player (da server o db)
    try {
      //const response = await ComunicationController.getObject(sid, id);
      const response = await repository.getObject(id, sid);
      console.log("getObject r103");
      if(response.type == "armor") {
        setArmor(response);
      } else if(response.type == "weapon") {
        setWeapon(response);
      } else if(response.type == "amulet") {
        setAmulet(response);
        console.log(amulet.level);
      }
      console.log("artefatti r 111");
    } catch (error) {
      console.error("Error while getting object:", error);
    }
  };

  const getRanking = async () => {
    //ottiene la classifica dal server
    try {
      const response = await ComunicationController.getRanking(sid);
      console.log("ranking r121");
      setData(response);
    } catch (error) {
      console.error("Error while getting ranking:", error);
    }
  };

  const fetchUsers = async () => {
    //ottiene i dettagli degli utenti in classifica (da rete o db)
    //sostituisce le informazioni ottenute da ranking con i dettagli (diverso da getUserDetail)
    try {
      for(let i = 0; i < data.length; i++) {
        console.log("RANKING");
        //const response = await ComunicationController.getUser(sid, data[i].uid);
        const user = await repository.getUser(data[i].uid, data[i].profileversion, sid)
        console.log("user rank:", user.uid);
        data[i] = user;
      }
    } catch (error) {
      console.error("Error while getting user:", error);
    }
  };

  const getUsersDetail = async (uid, profileversion, lat, lon) => {
    //ottiene i dettagli degli utenti in generale (da server o db)
    //P. manda anche lat e lon (opzionale) in modo tale da verli aggirnati anche se prende da db
    console.log("-1) user uid: ", uid);
    try {
      const user = await repository.getUser(uid, profileversion, sid, lat, lon);
      //const response = await ComunicationController.getUser(sid, uid);
      console.log("0) user:", user.uid);
      return user;
      //return new User(response.uid, response.name, response.weapon, response.armor, response.amulet, response.picture, response.life, response.experience, response.positionshare, response.profileversion, response.lat, response.lon);
    } catch (error) {
      console.error("2) Error while getting user:", error);
    }
  }
  
  const getObjectsDetail = async (id, lat, lon) => {
    //ottiene i dettagli degli oggetti in generle (da rete o db)
    //P. manda anche lat e lon (opzionale) in modo tale da verli aggirnati anche se prende da db
    console.log("-1) object id: ", id);
    try {
      const object = await repository.getObject(id, sid, lat, lon);
      //const response = await ComunicationController.getObject(sid, id);
      console.log("0) object:", object.id);
      return object;
      //return new VirtualObject(response.id, response.type, response.level, response.name, response.image);
    } catch (error) {
      console.error("2) Error while getting object:", error);
    }
  }

  const loadList = async () => {
    //posizione hardcoded
    //ottiene utenti e oggetti vicini, inserendo i dati in due array
    //in base ai dati negli array vengono ottenuti i dettagli chiamando le fun. sopra (da db o rete)
    //tutti i dettagli li mette in un unico array di stato da mostrare
    //la posizione è hardcoded per simulare la resenza in dipartimento
    //sostituire 45 con location.lan e 9 con location.lon
    console.log("loadList called");
    try {
      const users = await ComunicationController.getNearUsers(sid, location.lat, location.lon);
      console.log("posizione per loadlist: ", location.lat, location.lon);
      //console.log("near users:", users);

      const userDetail = [];
      for (const user of users) {
        const userDetails = await getUsersDetail(user.uid, user.profileversion, user.lat, user.lon);
        userDetail.push(userDetails);
      }

      const objects = await ComunicationController.getNearObjects(sid, location.lat, location.lon);
      //console.log("near objects:", objects);

      const objectDetail = [];
      for (const object of objects) {
        const objectDetails = await getObjectsDetail(object.id, object.lat, object.lon);
        console.log("object details r197");
        objectDetail.push(objectDetails);
      }

      const combinedList = [ ...objectDetail, ...userDetail];
      console.log("combined list r202, lunghezzza", combinedList);
      setNears(combinedList);
      console.log("nears r204,lunghezza", nears.length);
    } catch (error) {
      console.error("Error while getting near users and objects:", error);
    }
  }

  const getPosition = async () => {
    if (Platform.OS === 'android') {
      Location.watchPositionAsync(
        {
          timeInterval: 1000, // Aggiornamento ogni secondo solo su Android
          accuracy: Location.Accuracy.Highest,
          distanceInterval: 0,
        },
        (location) => {
          const timestamp = new Date().toLocaleString(); // Ottieni un timestamp
          console.log('posizione aggiornata: ${location.coords.latitude} - ${location.coords.longitude}');
          console.log(
            `${timestamp} - Posizione aggiornata: ${location.coords.latitude} - ${location.coords.longitude}`
          );
          setLocation({lat: location.coords.latitude, lon: location.coords.longitude});
          //setRegionStart({latitude: location.coords.lat, longitude: location.coords.lon, latitudeDelta: 0.2, longitudeDelta: 0.2});
        }
      );
    } else {
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 0,
        },
        (location) => {
          const timestamp = new Date().toLocaleString(); // Ottieni un timestamp
          console.log(
            `${timestamp} - Posizione aggiornata: ${location.coords.latitude} - ${location.coords.longitude}`
          );
          setLocation({lat: location.coords.latitude, lon: location.coords.longitude});
        }
      );
    }
  }

  const locationPermissionAsync = async () => {
    console.log("VERIFICO POSIZIONE CONCESSA");
    let canUseLocation = false;
    const grantedPermission = await Location.getForegroundPermissionsAsync()
    if (grantedPermission.status === "granted") {
      canUseLocation = true;
    } else {
      const permissionResponse = await Location.requestForegroundPermissionsAsync()
      if (permissionResponse.status === "granted") {
        canUseLocation = true;
      }
    }
    if (canUseLocation) {
      console.log("Posizione autorizzata?", canUseLocation);
    }
  }

  useEffect(() => {
    getPosition();
  }, []);

  useEffect(() => {
    //avviene la registrazione
    const fetchData = async () => {
      await register();
      await locationPermissionAsync();
      console.log("sid", sid);
    };

    fetchData();
  }, []);

  useEffect(() => {
    //si ottengono i dati del player
    const fetchData = async () => {
      await getUser(sid, uid);
    }
    
    fetchData();
  }, [sid, uid, page, positionshare, playerState]);

  useEffect(() => {
    //ogni volta che si cambia 'dipendenze' si verificano gli oggetti equipaggiati, si richiedono i dettagli
    const fetchData = async () => {
      if(user.armor != null) {
        await getObject(sid, user.armor);
      } else {
        setArmor(null);
      }
      if(user.weapon != null) {
        await getObject(sid, user.weapon);
      } else {
        setWeapon(null);
      }
      if(user.amulet != null) {
        await getObject(sid, user.amulet);
      } else {
        setAmulet(null);
      }
    }

    fetchData();
  }, [sid, user, page, playerState]);

  useEffect(() => {
    //viene ottenuta la classifica e fetchati i dettagli degli utennti in essa quando sid cambia
    const fetchData = async () => {
      await getRanking();
      await fetchUsers();
    }

    fetchData();
  }, [sid]);

  useEffect(() => {
    //deprecato?
    //si fetchano gli utenti dopo che si è richiesto ranking
    const fetchData = async () => {
      await fetchUsers();
    }

    fetchData();
  }, [data]);

  useEffect(() => {
    //viene caricata la lista di oggetti e utenti vicini
    const fetchData = async () => {
      await loadList();
    }

    fetchData();
  }, [sid, page]); //lat, lon

  const handleUserDetail = (user) => {
    //gestisce evento 'quando il player clicca su un utente per vederne i dettagli'
    //una variabile di stato viene aggiornata all'utente selezionato e viene cambiata la pagina
    console.log("Button clicked", user.uid);
    setRegionStart({latitude: user.lat, longitude: user.lon, latitudeDelta: 0.008, longitudeDelta: 0.008});
    setUserSelected(user);
    toUtente();
  }

  const handleObjectDetail = (object) => {
    //gestisce evento 'quando il player clicca su un oggetto per vederne i dettagli'
    //una variabile di stato viene aggiornata all'oggetto selezionato e viene cambiata la pagina
    setPlayerState({activated: false, died: false});
    console.log("Button clicked", object.id);
    console.log("activate", playerState.activated);
    console.log("pagina di provenienza", page);
    setRegionStart({latitude: object.lat, longitude: object.lon, latitudeDelta: 0.008, longitudeDelta: 0.008});
    setObjectSelected(object);
    toOggetto();
  }

  const handleSwitch = () => {
    //gestisce l'evento 'attivo o disattivo la posizione'
    //aggiorna il server sulla positionshare
    //setta una variabile di stato al contrario rispetto all'attuale valore new = !att
    console.log("switch clicked act value", positionshare);
    const update = async () => {
      try {
        const response = await ComunicationController.updateUser(sid, uid, user.name, user.picture, !positionshare);
        setPositionshare(!positionshare);
        console.log("after value", positionshare);
        console.log("update:", response);
      } catch (error) {
        console.error("Error while updating user:", error);
      }
    }

    update();
  }

  const handleActivate = (id) => {
    //gestisce l'evento 'attivo un oggetto'. Distingue tra:
    //Morto: gli equipaggiamenti vengono settati a null
    //Vivo: nulla
    //Sempre: viene aggiornata una variabile di stato che verifica se l'oggetto è attivato e se l'utente morto
    console.log("activate clicked");
    const activate = async () => {
      try {
        const response = await ComunicationController.activateObject(sid, id);
        console.log("activate r386");
        let died = response.died;
        console.log("activate r388");
        setPlayerState({activated: true, died: died});
        if(response.died) {
          setWeapon(null);
          setAmulet(null);
          setArmor(null);
        }
      } catch (error) {
        console.error("Error while activating object:", error);
      }
    }

    activate();
  }

  const fetchType = (obj) => {
    //Utilizzato da LISTA
    //distingue tra VirtualObject e User per distinguere la componente da visualizzare
    if(obj instanceof VirtualObject) {
      return (<SingleObjectRowContent data={obj} onPress={() => handleObjectDetail(obj)}/>);
    } else if(obj instanceof User) {
      return (<SingleUserRowContent data={[obj]} onPress={() => handleUserDetail(obj)}/>);
    } else {
      console.log("Error: object is not an instance of Object or User");
    }
  }

  const fetchKey = (obj) => {
    //Utilizzato da lista 
    //distingue tra VirtualObject e User per prendere come key uid o id
    if(obj instanceof VirtualObject) {
      return obj.id.toString();
    } else if(obj instanceof User) {
      return obj.uid.toString() + "?";
    } else {
      console.log("Error: object is not an instance of Object or User");
    }
  }

  const fetchActivate = (obj) => {
    //Gestisce la visualizzazione dell'oggetto in base alla sua attivazione e conseguenze
    //Usa una variabile di stato aggiornata da handleActivate. Distingue tra
    //Oggetto non attivato -> mostro un pulsante per attivarlo
    //Oggetto attivato, player vivo -> com. oggetto attivato
    //Oggetto attivato, player morto -> com. player morto
    //Se non provengo da 4 o 5 (lista o mappa) non mostro niente
    if(precedente != 4 && precedente != 5) {
      return;
    }
    if(!playerState.activated) {
      if(obj.type == 'monster') {
        return (
          <View style={styles.container}>
            <Text style={{fontSize: 23, alignSelf: 'center'}}>Attenzione</Text>
            <View style={{alignItems: 'center', marginBottom: 15}}>
              <Text style={{fontSize: 16}}>Combattendo questo mostro potresti perdere</Text>
              <Text style={{fontSize: 16}}>Da {obj.level} a {obj.level*2} punti vita</Text>
              <Text style={{fontSize: 16}}>Ora ne hai {user.life}</Text>
            </View>
            <Button title={"Attiva"} onPress={() => handleActivate(obj.id)}/>
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            <Button title={"Attiva"} onPress={() => handleActivate(obj.id)}/>
          </View>
        );
      }
    } else if(playerState.activated && playerState.died) {
      return (
        <View style={styles.container}>
          <Text style={styles.textEsito}>Sei morto!</Text>
        </View>
      );
    } else if(playerState.activated && !playerState.died) {
      return (
        <View style={styles.container}>
          {fetchEsito(obj)}
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text>Errore</Text>
        </View>
      );
    }
  }

  const fetchEsito = (obj) => {
    if(obj.type == 'monster') {
      return (
        <Text style={styles.textEsito}>Hai combattuto e sei sopravvissuto!</Text>
      )
    } else if(obj.type == 'weapon') {
      return (
        <Text style={styles.textEsito}>Hai equipaggiato l'arma!</Text>
      )
    } else if(obj.type == 'armor') {
      return (
        <Text style={styles.textEsito}>Hai equipaggiato l'armatura!</Text>
      )
    } else if(obj.type == 'candy') {
      return (
        <Text style={styles.textEsito}>Hai mangiato la caramella!</Text>
      )
    } else if(obj.type == 'amulet') {
      return (
        <View>
          <Text style={styles.textEsito}>Hai attivato l'aura!</Text>
          <Text style={styles.textEsito}>Ora puoi raggiungere oggetti più lontani</Text>
        </View>
      )
    }
  }

  const fetchMap = (usr) => {
    if(usr.positionshare) {
      return(
        <View style={styles.mapContainer}>
          <MapView style={styles.map} 
            initialRegion={{latitude: usr.lat, longitude: usr.lon, latitudeDelta: 0.02, longitudeDelta: 0.02}}
            
          >
            <Circle
              center={{ latitude: location.lat, longitude: location.lon }}
              radius={100}
              fillColor='rgba(23,85,255,0.19)'
              strokeColor='rgba(23,85,255,1)'
            />
            <MarkerComponent data={[usr, 0]} onPress={() => {}}/>
            <MarkerComponent data={[{name: "Me", lat: location.lat, lon: location.lon}, 0]} onPress={() => {}}/>
          </MapView>
        </View>
        
      )
    }
  }

  const fetchMarker = (near, index) =>{
    if(near instanceof VirtualObject) {
      return (<MarkerComponent data={[{name: near.name, lat: near.lat, lon: near.lon}, index]} onPress={() => handleObjectDetail(near)} image={near.image} type={"Object"}/>)
    } else if(near instanceof User) {
      return (<MarkerComponent data={[{name: near.name, lat: near.lat, lon: near.lon}, index]} onPress={() => handleUserDetail(near)} image={near.picture} type={"User"}/>)
    }
  }

  const visualization = () => {
    //Gestisce cosa visualizzare in base al numero della pagina
    /*Profilo ----> 0
      Classifica -> 1
      Oggetto ----> 2
      Utente -----> 3
      Mappa ------> 4
      Lista ------> 5
      Modifica ---> 6*/
    if(page == 1) { //Classifica
      return (
      <View style={styles.container}>
                <HeadComponent data={{left: "Profilo", title: "Classifica", right: ""}} onLeftPress={toProfilo} onRightPress={() => {}}/>
                <FlatList
                  style={styles.list}
                  data={data}
                  renderItem={({ item , index }) => (
                    <SingleUserRowContent data={[item, index+1]} onPress={() => handleUserDetail(item)}/>
                  )}
                  keyExtractor={(item) => item.uid.toString()}
                />
                <StatusBar style="auto" />
              </View>);
    } else if(page == 3) { //Utente
      return (<View style={styles.container}>
                {console.log("userSelected", userSelected.uid)}
                {fetchHead("Utente")}
                <UserDetailComponent data={userSelected == null ? {image: "", name: "", life: "", experience : ""} : userSelected}/>
                {fetchMap(userSelected)}
              </View>);
    } else if(page == 0) { //Profilo
      return(
        <View style={styles.container}>
          <HeadComponent data={{left: "Mappa", title: "Profilo", right: "Classifica"}} onLeftPress={toMappa} onRightPress={toClassifica}/>
          <AnagComponent data={user == null ? {image: "", name: "", life: "", experience : ""} : user}/>
          <Text style={styles.textTitle}>Artefatti</Text>
          <View style={styles.objectContainer}>
            <AnagArtefattoComponent data={[weapon, "Arma"]} onPress={() => handleObjectDetail(weapon)}/>
            <AnagArtefattoComponent data={[armor, "Armatura"]} onPress={() => handleObjectDetail(armor)}/>
            <AnagArtefattoComponent data={[amulet, "Aura"]} onPress={() => handleObjectDetail(amulet)}/>
          </View>
          <Button title={"Modifica"} onPress={toModifica}/>
          <SwitchPositionComponent data={positionshare} onValueChange={() => handleSwitch()}/>
        </View>
      );
    } else if(page == 4) { //Mappa
      if (!positionshare && !popupData.shouldClose) {
        if (!popupData.isVisible) {
          setPopupData({
            isVisible: true,
            shouldClose: false,
          });
        }
      } else {
        if (popupData.isVisible) {
          setPopupData({
            isVisible: false,
            shouldClose: false,
          });
        }
      }
      return(
        <View style={styles.container}>
          <HeadComponent data={{left: "Lista", title: "Mappa", right: "Profilo"}} onLeftPress={toLista} onRightPress={toProfilo}/>

          <View>
            <Modal
              transparent={true}
              animationType="slide"
              visible={popupData.isVisible}
              onRequestClose={() => {
                // Handle closing the modal (Android back button)
                setPopupData({
                  isVisible: false,
                  shouldClose: false,
                });
              }}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text>Puoi interagire con giocatori e oggetti</Text>
                    <Text>ma la tua posizione non sarà visibile agli altri</Text>
                  </View>
                  <TouchableOpacity onPress={manageClose} style={{alignItems: 'center',  marginTop: 10}}>
                    <Text style={{ color: 'rgb(82, 150, 213)', textAlign: 'center' }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          <MapView style={styles.mainMap}
            initialRegion={regionStart.latitude == 0 && regionStart.longitude == 0 ? {latitude: location.lat, longitude: location.lon, latitudeDelta: 0.008, longitudeDelta: 0.008} : regionStart}
            region={{
              latitude: location.lat,
              longitude: location.lon,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
          >
            <MarkerComponent data={[{name: "Me", lat: location.lat, lon: location.lon}, 0]} onPress={() => {}}/>
            {console.log(nears.length)}
            {nears.map((near, index) => fetchMarker(near, index))}
            <Circle
              center={{ latitude: location.lat, longitude: location.lon }}
              radius={amulet == null ? 100 : 100 + amulet.level} //se si ha un amuleto il raggio aumenta
              fillColor='rgba(23,85,255,0.19)'
              strokeColor='rgba(23,85,255,1)'
            />
          </MapView>
          <Button title={"Aggiorna"} onPress={aggiorna}></Button>
        </View>
      );
    } else if(page == 5) { //Lista
      return(
        <View style={styles.container}> 
          <HeadComponent data={{left: "", title: "Lista", right: "Mappa"}} onLeftPress={() => {}} onRightPress={toMappa}/>
          <FlatList
            style={styles.list}
            data={nears}
            renderItem={({ item }) => (
              fetchType(item)
            )}
            keyExtractor={(item) => fetchKey(item)}
          />
        </View>
      );
    } else if(page == 2) { //Oggetto
      return(
        <View style={styles.container}>
          {fetchHead("Oggetto")}
          <ObjectDetailComponent data={objectSelected == null ? {image: "", name: "", level: "", type: ""} : objectSelected}/>
          {fetchActivate(objectSelected)}
        </View>
      );
    } else if(page == 6) { //Modifica
      return (<View style={styles.container}> 
        <HeadComponent data={{left: "Profilo", title: "Modifica", right: ""}} onLeftPress={toProfilo} onRightPress={() => {}}/>
        <UpdateComponent  data={[user, sid]}/>
      </View>);
    } else {
      return(
        <View style={styles.container}>
        </View>
      );
    }
  }

  const aggiorna = () => {
    loadList();
  }

  const fetchHead = (title) => {
    //Gestisce gli header quando questi sono condizionati dalla pagina di provenienza
    //utile perchè utente e oggetto sono paggine raggiungibili da altre pagine e bisogna condizionare indietro
    //precedente = 1 -> prov. classifica -> ind. classifica, att. utente        , av. null
    //precedente = 5 -> prov. lista      -> ind. lista     , att. utente/oggetto, av. null
    //precedente = 4 -> prov. mappa      -> ind. mappa     , att. utente/oggetto, av. null
    //precedente = 0 -> prov. profilo    -> ind. profilo   , att. oggetto       , av, null
    if(precedente == 1) {
      return ( <HeadComponent data={{left: "Classifica", title: "Utente", right: ""}} onLeftPress={toClassifica} onRightPress={() => {}}/>);
    } else if(precedente == 5) {
      return ( <HeadComponent data={{left: "Lista", title: title, right: ""}} onLeftPress={toLista} onRightPress={() => {}}/>);
    } else if(precedente == 4) {
      return ( <HeadComponent data={{left: "Mappa", title: title, right: ""}} onLeftPress={toMappa} onRightPress={() => {}}/>);
    } else if(precedente == 0) {
      return ( <HeadComponent data={{left: "Profilo", title: "Oggetto", right: ""}} onLeftPress={toProfilo} onRightPress={() => {}}/>);
    }
  }

  const toClassifica = () => {
    //combia la pagina a classifica (1)
    setPage(1);
  }

  const toProfilo = () => {
    //combia la pagina a profilo (0)
    setPage(0);
  }

  const toMappa = () => {
    //combia la pagina a mappa (4)
    setPage(4);
  }

  const toLista = () => {
    //combia la pagina a lista (5)
    setPage(5);
  }

  const toOggetto = () => {
    //combia la pagina a oggetto (2)
    //setta preceddente alla pagina attuale (quella di provenienza)
    setPrecedente(page);
    setPage(2);
  }

  const toUtente = () => {
    //combia la pagina a utente (3)
    //setta preceddente alla pagina attuale (quella di provenienza)
    setPrecedente(page);
    setPage(3);
  }

  const toModifica = () => {
    //combia la pagina a modifica (6)
    setPage(6);
  }

  return (
    //chiama la funzione che restituirà la viosualizzazione corretta in base ai parametri
    visualization()
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 60
  },
  mapContainer: {
    flex: 1,
    alignSelf: 'center',
    marginTop: 20,
    width: '90%',
    height: '100%',
  },
  map: {
    flex: 1,
    borderRadius: 20
  },
  mainMap: {
    flex: 1
  },
  objectContainer: {
    marginTop: 5,
    borderColor: '#87ceeb',
    borderWidth: 1,
    borderRadius: 45,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 15,
  },
  list: {
    paddingTop: 20,
  },
  textTitle: {
    marginTop: 19,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 27,
  },
  textEsito: {
    paddingTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  borderBot: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
