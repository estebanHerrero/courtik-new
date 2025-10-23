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
import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  // cargar fuente
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) return null;

  const goToHome = () => {
    // Navegación básica sin OAuth por ahora
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
        <AppText variant="regular" style={styles.title}>
          Hola,{"\n"}bienvenido
        </AppText>

        {/* Android: botón principal */}
        {Platform.OS === "android" && (
          <TouchableOpacity style={styles.button} onPress={goToHome}>
            <AppText variant="regular" style={styles.buttonText}>
              Ingresar con Google
            </AppText>
            <Image source={require("../assets/google.png")} style={styles.icon} />
          </TouchableOpacity>
        )}

        {/* iOS: placeholder (puede usar el mismo goToHome si querés) */}
        {Platform.OS === "ios" && (
          <TouchableOpacity style={styles.button} onPress={goToHome}>
            <AppText style={styles.buttonText}>Ingresar con Apple</AppText>
            <AntDesign name="apple1" size={26} color="black" style={styles.iconApple} />
          </TouchableOpacity>
        )}

        {/* Link temporal para probar /test-supabase (si lo querés ocultar, borrá este bloque) 
        <View style={{ marginTop: 12, paddingHorizontal: 20 }}>
          <Link href="/test-supabase">
            <AppText style={{ color: "#00BFFF" }}>Ir a test-supabase</AppText>
          </Link>
        </View>
        */}

        <View style={styles.registerContainer}>
          <AppText style={styles.registerText}>¿No tenés cuenta?</AppText>
          <TouchableOpacity style={styles.circleButton} onPress={() => router.push("/register")}>
            <AntDesign name="arrowright" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "FFFFFF",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "ffffff",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  title: {
    fontSize: 40,
    fontFamily: "Montserrat_400Regular",
    color: "#222222",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7B94A4",
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: "#fff",
    elevation: 3,
    width: "54%",
    height: 48,
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 12,
    resizeMode: "contain",
  },
  iconApple: {
    marginLeft: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "#444",
  },
  registerContainer: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    paddingBottom: 14,
    color: "#444",
    marginRight: 12,
    fontFamily: "Montserrat_400Regular",
  },
  circleButton: {
    backgroundColor: "#00BFFF",
    width: 48,
    paddingBottom: 14,
    height: 68,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    elevation: 3,
  },
});