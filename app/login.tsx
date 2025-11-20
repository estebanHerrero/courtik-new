import AppText from "@/components/AppText";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor completá todos los campos");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      // El listener en AuthContext redirige automáticamente a /home
    } catch (error) {
      console.log("❌ Error en signIn:", error);
      Alert.alert("Error", "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (field: string) => [
    styles.input,
    { borderColor: focusedInput === field ? "#00AEEF" : "#7B94A4" },
  ];

  return (
    <LinearGradient colors={["#f7f9fc", "#e8f5ff"]} style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <AppText variant="medium" style={styles.title}>
        Hola, bienvenido
      </AppText>

      <TextInput
        style={getInputStyle("email")}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        onFocus={() => setFocusedInput("email")}
        onBlur={() => setFocusedInput("")}
        editable={!loading}
      />

      <View
        style={[
          getInputStyle("password"),
          { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
        ]}
      >
        <TextInput
          style={{ flex: 1, fontSize: 16, paddingVertical: 0 }}
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
          onFocus={() => setFocusedInput("password")}
          onBlur={() => setFocusedInput("")}
          editable={!loading}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#00AEEF"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <AppText variant="semibold" style={styles.buttonText}>
            Ingresar
          </AppText>
        )}
      </TouchableOpacity>

      {/* Botón de Google */}
      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => Alert.alert("Google Auth", "No implementado aún 😅")}
        disabled={loading}
      >
        <Image
          source={require("../assets/google.png")}
          style={styles.googleIcon}
        />
        <AppText variant="medium" style={styles.googleText}>
          Ingresar con Google
        </AppText>
      </TouchableOpacity>

      {/* Link “No tenés cuenta?” */}
      <TouchableOpacity
        style={styles.registerLink}
        onPress={() => router.push("/register")}
      >
        <AppText style={styles.registerText}>¿No tenés cuenta?</AppText>
        <Ionicons name="arrow-forward-circle-outline" size={22} color="#00AEEF" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    width: 150,
    height: 70,
  },
  title: {
    fontSize: 24,
    color: "#333",
    textAlign: "center",
    marginBottom: 28,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#00AEEF",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    letterSpacing: 1,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  googleText: {
    color: "#333",
    fontSize: 16,
  },
  registerLink: {
    marginTop: 25,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  registerText: {
    color: "#00AEEF",
    fontSize: 15,
  },
});