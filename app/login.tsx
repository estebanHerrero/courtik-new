import AppText from "@/components/AppText";
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) return null;

  const goToHome = () => {
    router.push("/home");
  };

  return (
    <>
      <Image
        source={require("../assets/paleta.png")}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "100%",
          height: "100%",
          resizeMode: "contain",
          opacity: 0.08,
        }}
      />

      <View style={styles.container}>
        {/* 1. Header arriba */}
        <View style={styles.headerContainer}>
          <AppText variant="regular" style={styles.title}>
            Hola,{"\n"}bienvenido
          </AppText>
        </View>

        {/* 2. Formulario con inputs */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.ingresarContainer}>  
          <TouchableOpacity style={styles.ingresarBtn}>
            <AppText variant="semibold" style={styles.ingresarBtnText}>
              Ingresar
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.separatorContainer}>
          <View style={styles.line} />
            <AppText style={styles.separatorText}>o</AppText>
          <View style={styles.line} />
        </View>

        {/* 3. Botones sociales y registro */}
        <View style={styles.buttonsContainer}>
          {Platform.OS === "android" && (
            <TouchableOpacity style={styles.button} onPress={goToHome}>
              <AppText variant="regular" style={styles.buttonText}>
                Ingresar con 
              </AppText>
              <Image
                source={require("../assets/google.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
          )}

          {Platform.OS === "ios" && (
            <TouchableOpacity style={styles.button} onPress={goToHome}>
              <AppText style={styles.buttonText}>Ingresar con </AppText>
              <AntDesign
                name="apple1"
                size={26}
                color="black"
                style={styles.iconApple}
              />
            </TouchableOpacity>
          )}

          <View style={styles.registerContainer}>
            <AppText style={styles.registerText}>¿No tenés cuenta?</AppText>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => router.push("/register")}
            >
              <AntDesign name="right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

// ... (importaciones y componente igual)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "ffffff",
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: "space-between",
  },
  headerContainer: {
    marginBottom: 10, 
  },
  title: {
    fontSize: 40,
    paddingHorizontal: 16,
    marginTop: 200,
    fontFamily: "Montserrat_400Regular",
    color: "#222222",
  },
  formContainer: {
    marginBottom: 2, 
    paddingHorizontal: 20,
  },
  input: {
    height: 48,
    borderColor: "#7B94A4",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12, 
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
    color: "#222",
    backgroundColor: "#fff",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  separatorText: {
    marginHorizontal: 12,
    fontSize: 16,
    color: "#666",
    fontFamily: "Montserrat_400Regular",
  },
  ingresarContainer: {
    paddingHorizontal: 16,
  },
  ingresarBtn: {
    backgroundColor: "#00AEEF",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 28, 
    elevation: 3,
  },
  ingresarBtnText: {
    color: "#fff",
    fontSize: 18,
    letterSpacing: 1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7B94A4",
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    elevation: 3,
    marginBottom: 260,
    width: "36%",
    height: 48,
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 8,
    resizeMode: "contain",
  },
  iconApple: {
    marginLeft: 20,
  },
  buttonText: {
    fontSize: 14,
    color: "#444",
  },
  buttonsContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 0,
  },
  registerText: {
    fontSize: 14,
    color: "#444",
    marginRight: 12,
    fontFamily: "Montserrat_400Regular",
  },
  circleButton: {
    backgroundColor: "#00BFFF",
    borderTopRightRadius: 28,
    borderTopLeftRadius: 28,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  // Estilos para foco (outline) en botones
  searchBtnFocus: {
    borderColor: "#00AEEF",
    borderWidth: 2,
  },
  buttonFocus: {
    borderColor: "#00AEEF",
    borderWidth: 2,
  },
  circleButtonFocus: {
    borderColor: "#00AEEF",
    borderWidth: 2,
  },
});