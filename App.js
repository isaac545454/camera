import { 
  StyleSheet, 
  Text,
  View, 
  SafeAreaView, 
  TouchableOpacity,
  Modal,
  Image,
  Alert
 } from 'react-native';
import {Camera} from 'expo-camera'
import {useState, useEffect, useRef } from 'react'
import { FontAwesome } from "@expo/vector-icons";
import  * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [camera, setCamera] = useState(Camera.Constants.Type.back)
  const [hasPermission, setHasPermission] = useState(null)
  const [photoCapture, setPhotoCapture] = useState(null)
  const [open, setOpen] = useState(false)
  const cameraRef = useRef(null)

  useEffect(()=>{
   (async()=>{
     const {status} = await Camera.requestCameraPermissionsAsync()
     setHasPermission(status === 'granted')
   })()
   
  

  }, [])

  if(hasPermission === null){
     return <View /> 
  }
  if(hasPermission === false){
    return <Text>acesso negado</Text>
  }

  const flip = ()=>{
    camera === Camera.Constants.Type.back ? 
    setCamera(Camera.Constants.Type.front) : 
    setCamera(Camera.Constants.Type.back)
  }




  const photo = async ()=>{
    if(cameraRef){
      const data = await cameraRef.current.takePictureAsync()
      setPhotoCapture(data.uri)
      setOpen(true)
      console.log(data)
    }
  }

  const savePhoto = async () =>{
   const asset = await MediaLibrary.createAssetAsync(photoCapture)
   .then(()=>{
     Alert.alert("salva", "foto salvada com sucesso")
   })
   .catch(err=>{console.log(erro)}) 
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <Camera
       style={styles.camera}
       type={camera}
       ref={cameraRef}
      >
      <View style={styles.flip}>
         <TouchableOpacity 
         onPress={flip}
         style={styles.btnArea}
         >
          <Text style={styles.btnText}>TROCAR</Text>
         </TouchableOpacity>
         <TouchableOpacity 
         style={styles.cameraArea}
         onPress={photo}
         >
          <FontAwesome 
          name="camera" 
          size={30} 
          color="#fff"
          style={styles.icons}
          />
          </TouchableOpacity>
          {photoCapture &&  
          <Modal
          animationType="slide"
          transparent={true}
          visible={open}
          statusBarTranslucent
          >
            <View style={{backgroundColor: 'rgba(0,0,0,0.9)', flex: 1}}>
            <View style={styles.modal}>

              <View style={styles.grid}>

              <TouchableOpacity style={{margin: 15}} onPress={()=>setOpen(false)}>
              <FontAwesome name="window-close" size={45} color="red" />
              </TouchableOpacity>
        
              <TouchableOpacity style={{margin: 15}} onPress={savePhoto}>
                    <FontAwesome name="upload" size={40} color="#fff" />
              </TouchableOpacity>

              </View>
              <Image 
               style={styles.img}
               source={{uri: photoCapture}}
              />

            </View>
            </View>
          </Modal>}
      </View>
      </Camera>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera:{
    flex: 1
  }, 
  flip: {
    flex: 1, 
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  btnArea: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  btnText: {
    fontSize: 20,
    marginBottom: 14,
    color: "#fff"
  },
  cameraArea: {
    position: "absolute",
    bottom: 20,
    right: 30
  },
  icons:{
    marginBottom: 14,
  },
  modal:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    
  },
  grid:{
    flexDirection: 'row',
  },
  img: {
    width: "100%",
    height: 450,
    borderRadius: 20
  }
});
