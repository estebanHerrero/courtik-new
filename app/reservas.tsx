import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import AppText from "../components/AppText";

export default function ReservasScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [comentario, setComentario] = useState("");

  const handleOpenCamera = async () => {
    if (!permission || !permission.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        alert("Necesitamos acceso a la cámara para sacar la foto.");
        return;
      }
    }
    setShowCamera(true);
  };

  const handleTakePhoto = async (camera: any) => {
    try {
      const photo = await camera.takePictureAsync();
      setPhotoUri(photo.uri);
      setShowCamera(false);
    } catch (error) {
      console.log("Error tomando foto:", error);
    }
  };

  if (showCamera) {
    let cameraRef: any;

    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          ref={(ref) => {
            cameraRef = ref;
          }}
        >
          <View style={styles.cameraButtons}>
            <TouchableOpacity
              style={styles.shutterButton}
              onPress={() => handleTakePhoto(cameraRef)}
            >
              <AppText style={{ color: "#fff" }}>Sacar foto</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.shutterButton, { backgroundColor: "#999" }]}
              onPress={() => setShowCamera(false)}
            >
              <AppText style={{ color: "#fff" }}>Cancelar</AppText>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
       {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerRight}>
          <Ionicons
            name="person-circle-outline"
            size={30}
            color="#0B0F14"
            style={{ marginRight: 12 }}
          />
          <Ionicons name="menu" size={28} color="#0B0F14" />
        </View>
      </View>
      <AppText variant="semibold" style={styles.title}>
        Reserva 1
      </AppText>

      <AppText style={styles.label}>Qué opinas del complejo?</AppText>
      <TextInput
        style={styles.input}
        placeholder="Ej: las canchas son muy buenas, los servivios..."
        value={comentario}
        onChangeText={setComentario}
        multiline
      />

      <AppText style={styles.label}>Foto (opcional)</AppText>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.photo} />
      ) : (
        <View style={styles.photoPlaceholder}>
          <AppText style={{ color: "#999" }}>Todavía no sacaste una foto</AppText>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleOpenCamera}>
        <AppText variant="semibold" style={styles.buttonText}>
          Sacar foto
        </AppText>
      </TouchableOpacity>
    </View>
  );

  {/* BOTTOM NAV */}
  };




const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: { width: 120, height: 60, marginBottom: 8 },
  headerRight: { flexDirection: "row", alignItems: "center" },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    minHeight: 70,
    textAlignVertical: "top",
  },
  photo: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  photoPlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#00AEEF",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  cameraButtons: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  shutterButton: {
    backgroundColor: "#00AEEF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    marginTop: "auto",
  }
});